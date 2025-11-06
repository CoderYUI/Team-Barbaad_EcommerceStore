import { useState, useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';
import '../styles/Chatbot.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: '👋 Hi! I\'m your shopping assistant.\n\n✨ I can help you with:\n• Product information\n• Order tracking (just provide your phone number)\n• Shopping recommendations\n• General queries\n\nHow can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'Show me all products',
    'Track my order',
    'What\'s on sale?',
    'Product recommendations'
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (messageText = input) => {
    const userMessage = messageText.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);
    setSuggestions([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            products,
            previousMessages: messages.slice(-5)
          }
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        timestamp: new Date().toISOString()
      }]);

      // Generate contextual suggestions based on response
      const responseText = data.response.toLowerCase();
      if (responseText.includes('order') || responseText.includes('track')) {
        setSuggestions(['Track another order', 'View products', 'Need help']);
      } else if (responseText.includes('product')) {
        setSuggestions(['Show details', 'Compare prices', 'Track order']);
      } else {
        setSuggestions(['Show products', 'Track order', 'Help me choose']);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again or contact support.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="chatbot-trigger"
          aria-label="Open chat"
        >
          <ChatBubbleLeftIcon width={24} height={24} />
          <span>Need Help?</span>
          <span className="pulse-dot"></span>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-content">
              <ChatBubbleLeftIcon width={20} height={20} />
              <div>
                <h3>Customer Support</h3>
                <span className="online-status">● Online</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="close-button"
              aria-label="Close chat"
            >
              <XMarkIcon width={20} height={20} />
            </button>
          </div>

          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {formatMessage(msg.content)}
                </div>
                {msg.timestamp && (
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {suggestions.length > 0 && !loading && (
              <div className="suggestions">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-chip"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <form className="input-form" onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              maxLength={500}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <PaperAirplaneIcon width={20} height={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

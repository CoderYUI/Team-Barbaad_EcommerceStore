import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Order from '../models/Order.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Gemini 2.0 Flash model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;
    const lowerMessage = message.toLowerCase();

    // Enhanced phone number detection - matches 10 digit numbers
    const phoneMatch = message.match(/\b\d{10}\b/);
    
    // Check if message is ONLY a 10-digit number or contains order-related keywords
    const isOnlyPhoneNumber = /^\d{10}$/.test(message.trim());
    const isOrderQuery = lowerMessage.includes('order') || 
                        lowerMessage.includes('track') || 
                        lowerMessage.includes('status') ||
                        lowerMessage.includes('fetch');

    // If user provides phone number (either alone or with order query)
    if (phoneMatch && (isOnlyPhoneNumber || isOrderQuery)) {
      const phone = phoneMatch[0];
      try {
        const orders = await Order.find({ 'orderDetails.phone': phone })
          .sort({ date: -1 })
          .limit(5);

        if (orders?.length > 0) {
          const orderSummary = orders.map(order => {
            const itemsList = order.items.map(item => 
              `  • ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`
            ).join('\n');
            
            const statusEmoji = {
              'confirmed': '✅',
              'shipped': '🚚',
              'delivered': '📦'
            }[order.status] || '📋';
            
            return `${statusEmoji} Order #${order.orderId}
━━━━━━━━━━━━━━━━━━━━
Status: ${order.status.toUpperCase()}
Date: ${new Date(order.date).toLocaleDateString('en-IN', { 
  day: '2-digit', 
  month: 'short', 
  year: 'numeric' 
})}
Total: ₹${order.total.toLocaleString()}

Items:
${itemsList}`;
          }).join('\n\n' + '═'.repeat(40) + '\n\n');

          return res.json({
            response: `📱 Found ${orders.length} order(s) for ${phone}:\n\n${orderSummary}\n\n💬 Need help with anything else?`
          });
        } else {
          return res.json({
            response: `❌ No orders found for phone number ${phone}.\n\n📝 Please verify:\n• Phone number is correct (10 digits)\n• You've placed an order with us\n\n💬 Can I help you with something else?`
          });
        }
      } catch (err) {
        console.error('Order lookup error:', err);
        return res.json({
          response: "⚠️ Unable to fetch order details right now. Please try again in a moment."
        });
      }
    }

    // If user asks about orders without phone number
    if (isOrderQuery && !phoneMatch) {
      return res.json({
        response: "📱 To track your order, please provide your 10-digit phone number.\n\nYou can just type your number like:\n• 1234567890\n\nOr type:\n• Track my order 1234567890\n• Order status for 1234567890"
      });
    }

    // For product and general queries, use Gemini AI
    try {
      const result = await model.generateContent({
        contents: [{
          parts: [{
            text: `You are a helpful e-commerce customer service AI assistant. Be concise, friendly, and professional.
            
Available Products:
${JSON.stringify(context.products, null, 2)}

Previous Conversation:
${JSON.stringify(context.previousMessages.slice(-2), null, 2)}

Customer Query: ${message}

Provide a helpful response in under 50 words. Focus on:
- Product information and pricing in Indian Rupees (₹)
- Shopping assistance
- General support queries
- Remind them they can track orders by providing their 10-digit phone number`
          }]
        }]
      });

      const response = await result.response;
      res.json({ response: response.text() });
    } catch (aiError) {
      console.error('AI Error:', aiError);
      res.json({ 
        response: "I'm here to help! 😊\n\n• Ask about products and prices\n• Track orders (just type your 10-digit phone number)\n• Get shopping recommendations\n\nWhat can I help you with?" 
      });
    }
  } catch (error) {
    console.error('Route Error:', error);
    res.status(500).json({ 
      response: "Sorry, I'm having trouble processing your request. Please try again." 
    });
  }
});

export default router;

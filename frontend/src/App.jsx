import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Cart from './pages/Cart'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import TrackOrder from './pages/TrackOrder'
import Chatbot from './components/Chatbot';

function App() {
  const [cart, setCart] = useState(() => {
    // Use localStorage instead of sessionStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    // Store in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Add storage event listener to sync cart across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        setCart(JSON.parse(e.newValue) || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    // Update localStorage after removal
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total items including quantities
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar cartCount={totalItems} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home onAddToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
            <Route path="/cart" element={<Cart cart={cart} onRemoveFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<Checkout cart={cart} />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/track-order" element={<TrackOrder />} />
          </Routes>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;

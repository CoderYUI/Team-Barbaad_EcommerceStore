import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, TruckIcon } from '@heroicons/react/24/outline';
import '../styles/Navbar.css';

export default function Navbar({ cartCount }) {
  const [showTracker, setShowTracker] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const totalItems = cartCount > 0 ? cartCount.toString() : '';

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/orders/track?${
        trackingInput.includes('@') || trackingInput.includes('+') 
          ? `phone=${trackingInput}` 
          : `orderId=${trackingInput}`
      }`);
      
      if (response.ok) {
        const data = await response.json();
        setTrackingResult(data);
      } else {
        setTrackingResult({ error: 'Order not found' });
      }
    } catch (error) {
      setTrackingResult({ error: 'Failed to track order' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <h1>👾Barbadiyon ki Dukkan</h1>
        </Link>
        <div className="nav-items">
          <Link to="/track-order" className="track-link">
            <div className="track-icon-container">
              <TruckIcon width={24} height={24} className="track-icon" />
              <span>Track Order</span>
            </div>
          </Link>
          <Link to="/cart" className="cart-link">
            <div className="cart-icon-container">
              <ShoppingCartIcon width={24} height={24} className="cart-icon" />
              {totalItems && <span className="cart-badge">{totalItems}</span>}
            </div>
          </Link>
        </div>
      </div>

      {showTracker && (
        <div className="track-overlay">
          <div className="track-modal">
            <button className="close-btn" onClick={() => {
              setShowTracker(false);
              setTrackingResult(null);
            }}>×</button>
            <h2>Track Your Order</h2>
            <form onSubmit={handleTrackOrder}>
              <input
                type="text"
                placeholder="Enter Order ID or Phone Number"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
              />
              <button type="submit">Track</button>
            </form>

            {trackingResult && (
              <div className="tracking-result">
                {trackingResult.error ? (
                  <p className="error">{trackingResult.error}</p>
                ) : (
                  <div className="order-info">
                    <p>Order ID: {trackingResult._id}</p>
                    <p>Status: {trackingResult.status}</p>
                    <p>Date: {new Date(trackingResult.date).toLocaleString()}</p>
                    <p>Total: ₹{trackingResult.total}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

export default function Checkout({ cart }) {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleInputChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: total * 100,
      currency: "INR",
      name: "E-Shop",
      description: "Purchase Payment",
      handler: async function(response) {
        try {
          const orderData = {
            orderId: orderId, // Add orderId here
            paymentId: response.razorpay_payment_id,
            orderDetails: orderDetails,
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity || 1
            })),
            total: total,
            status: 'confirmed',
            date: new Date()
          };

          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to save order');
          }

          const savedOrder = await res.json();
          localStorage.removeItem('cart');
          
          navigate('/order-success', { 
            state: { orderDetails: savedOrder }
          });
        } catch (error) {
          console.error('Error saving order:', error);
          alert('Error processing order: ' + error.message);
        }
      },
      prefill: {
        name: orderDetails.name,
        email: orderDetails.email,
        contact: orderDetails.phone
      },
      theme: {
        color: "#007bff"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-message">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <span>{item.name} × {item.quantity || 1}</span>
            <span>₹{(item.price * (item.quantity || 1)).toLocaleString()}</span>
          </div>
        ))}
        <div className="total">
          <strong>Total Amount:</strong>
          <strong>₹{total.toLocaleString()}</strong>
        </div>
      </div>

      <div className="checkout-form">
        <h2>Shipping Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={orderDetails.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={orderDetails.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={orderDetails.phone}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={orderDetails.address}
          onChange={handleInputChange}
          required
        />
        <button 
          onClick={handlePayment}
          className="payment-btn"
          disabled={!orderDetails.name || !orderDetails.email || !orderDetails.phone || !orderDetails.address}
        >
          Proceed to Payment (₹{total.toLocaleString()})
        </button>
      </div>
    </div>
  );
}

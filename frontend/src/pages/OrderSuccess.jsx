import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/OrderSuccess.css';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return <div className="order-success">Redirecting...</div>;
  }

  const formattedDate = new Date(orderDetails.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="order-success">
      <div className="success-card">
        <div className="success-header">
          <h1>Order Placed Successfully! 🎉</h1>
          <div className="order-id">Order ID: {orderDetails._id}</div>
        </div>
        
        <div className="order-details">
          <h2>Order Details</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span>Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="detail-item">
              <span>Total Amount:</span>
              <span>₹{orderDetails.total?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span>Payment ID:</span>
              <span>{orderDetails.paymentId}</span>
            </div>
          </div>
        </div>

        <div className="shipping-details">
          <h2>Shipping Details</h2>
          <p>{orderDetails.orderDetails?.name}</p>
          <p>{orderDetails.orderDetails?.address}</p>
          <p>{orderDetails.orderDetails?.email}</p>
          <p>{orderDetails.orderDetails?.phone}</p>
        </div>

        <div className="order-items">
          <h2>Items Ordered</h2>
          {orderDetails.items?.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="continue-shopping">
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import '../styles/TrackOrder.css';

export default function TrackOrder() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrders([]);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/search?phone=${phone}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to find orders');
      }

      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Error tracking order:', err);
      setError(err.message || 'Could not find any orders with this phone number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-order">
      <h1>Track Your Orders</h1>
      <div className="track-form">
        <form onSubmit={handleTrack}>
          <div className="input-group">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            <button type="submit" disabled={loading || phone.length !== 10}>
              {loading ? 'Searching...' : 'Track Orders'}
            </button>
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

      {orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order.orderId}</h3>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              
              <div className="order-info">
                <p className="date">Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                <p className="total">Total: ₹{order.total.toLocaleString()}</p>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="delivery-info">
                <h4>Delivery Details</h4>
                <p>{order.orderDetails.name}</p>
                <p>{order.orderDetails.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

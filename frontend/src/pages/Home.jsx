import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import '../styles/Home.css';

export default function Home({ onAddToCart }) {
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    // Add item to cart and redirect to checkout
    onAddToCart(product);
    navigate('/checkout');
  };

  return (
    <div className="home">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">₹{product.price.toLocaleString()}</p>
            </Link>
            <button 
              onClick={() => handleBuyNow(product)}
              className="buy-now-btn"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

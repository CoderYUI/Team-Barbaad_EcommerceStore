import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
      </Link>
      <button 
        onClick={handleAddToCart}
        className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
        disabled={isAdded}
      >
        {isAdded ? 'Added!' : 'Add to Cart'}
      </button>
    </div>
  );
}

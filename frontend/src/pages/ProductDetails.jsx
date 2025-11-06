import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import '../styles/ProductDetails.css';

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-details">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">₹{product.price.toLocaleString()}</p>
        <p className="description">{product.description}</p>
        <button onClick={() => onAddToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}

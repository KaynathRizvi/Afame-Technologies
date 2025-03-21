import { useParams } from "react-router-dom";
import './ProductView.css';
import { handleAddFavorite, handleAddToCart } from '../ProductCatalog/ProductCatalog';

const ProductView = ({ products = [] }) => {  
  const { productId } = useParams();

  if (!products || products.length === 0) {
    return <h2>Loading products...</h2>;
  }

  const product = products.find((item) => item.product_id === parseInt(productId));

  if (!product) {
    return <h2>Product not found</h2>;
  }

  return (
    <div className="product-view">
        <div className="view-img-container">
            <img src={product.product_image} alt={product.product_title} className="product-view-image" />
        </div>
      <h2 className="product-view-title">{product.product_title}</h2>
      <p className="product-view-detail">{product.product_detail}</p>
      <p className="product-view-price">Price: ₹{product.product_price}</p>
      <div className="view-button">
        <button className="view-fav-button"  onClick={() => handleAddFavorite(product)}>Wishlist</button>
        <button className="view-cart-button"  onClick={() => handleAddToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductView;

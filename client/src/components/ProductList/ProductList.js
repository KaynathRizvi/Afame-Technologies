import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import { handleAddFavorite, handleAddToCart } from '../ProductCatalog/ProductCatalog';

const ProductList = ( ) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerRow, setProductsPerRow] = useState(4);

  const containerRef = useRef(null);

  const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [SERVER_URL]);

  useEffect(() => {
    const updateProductsPerRow = () => {
      if (window.innerWidth >= 1200) {
        setProductsPerRow(4);
      } else if (window.innerWidth >= 680) {
        setProductsPerRow(3);
      } else if (window.innerWidth >= 340) {
        setProductsPerRow(2);
      } else {
        setProductsPerRow(1);
      }
    };
  
    updateProductsPerRow(); 
    window.addEventListener('resize', updateProductsPerRow);
    return () => window.removeEventListener('resize', updateProductsPerRow);
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  const nextSlide = () => {
    if (currentIndex + productsPerRow < products.length) {
      setCurrentIndex((prevIndex) => prevIndex + productsPerRow);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - productsPerRow);
    }
  };

  return (
    <div className="product-container">
      <div className="product-listing" ref={containerRef}>
        {products.slice(currentIndex, currentIndex + productsPerRow).map((product) => (
          <div className="product-card" key={product['product_id']}>
            <Link to={`/view/${product.product_id}`}>
            <img 
              src={product.product_image} 
              alt={product.product_title} 
              className="product-image" 
            />
          </Link>
            <h3 className="product-title">{product.product_title}</h3>
            <p className="product-detail">{product.product_detail}</p>
            <p className="product-price">Price: ₹{product.product_price}</p>
            <div className="product-button">
              <button className="see-more-button"  onClick={() => handleAddFavorite(product)}>Wishlist</button>
              <button className="cart-button" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="img-slide">
        <button className="slide-button" onClick={prevSlide} disabled={currentIndex === 0}>
          ❮
        </button>
        <button
          className="slide-button"
          onClick={nextSlide}
          disabled={currentIndex + productsPerRow >= products.length}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default ProductList;

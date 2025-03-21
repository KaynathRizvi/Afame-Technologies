import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    //To add products in cart
    const fetchCart = async () => {
      try {
        if (!userId) {
          console.error("User ID not found in local storage.");
          return;
        }
  
        const response = await fetch(`${SERVER_URL}/api/cart?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Cart Data:", data);
        setCartItems(data);
  
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
  
    fetchCart();
  }, [userId]);
  
  //Removing product from cart
  const removeCartProduct = async (productId) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/cart/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the product from the cart after deleting it from the server
      setCartItems((prevCart) => prevCart.filter((product) => product.product_id !== productId));
      
      console.log(`Product ${productId} removed from cart`);
    } catch (error) {
      console.error("Error removing cart:", error);
    }
  };

  if (!userId) {
    return <div>Please <Link to="/login">login</Link> to view favorites.</div>;
}


  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map(product => (
            <li key={product.id} className="cart-item">
              <img src={product.product_image} alt={product.product_title} className='cart-img'/>
              <div className='cart-list-partition'>
              <h3>{product.product_title}</h3>
              <p>Price: ₹{product.product_price}</p>
              <p>Quantity: {product.quantity}</p>
              <button onClick={() => removeCartProduct(product.product_id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartPage;

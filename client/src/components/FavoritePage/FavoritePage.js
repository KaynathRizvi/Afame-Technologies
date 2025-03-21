import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './FavoritePage.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    //To add products in favorite
    const fetchFavorites = async () => {
      try {
        if (!userId) {
          console.error("User ID not found in local storage.");
          return;
        }

        const response = await fetch(`${SERVER_URL}/api/favorites?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Favorites Data:", data);

        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  //Removing product from favorite
  const removeFavorite = async (productId) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/favorites/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      //Remove the product from the favorite after deleting it from the server
      setFavorites((prevFavorites) => prevFavorites.filter((product) => product.product_id !== productId));
      
      console.log(`Product ${productId} removed from favorites`);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!userId) {
    return <div>Please <Link to="/login">login</Link> to view favorites.</div>;
  }

  return (
    <div className="favorites-container">
      <h2>Your Favorite Products</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((product) => (
            <div className="favorite-card" key={product.product_id}>
              <img src={product.product_image} alt={product.product_title} />
              <h3>{product.product_title}</h3>
              <p>Price: ₹{product.product_price}</p>
              <button onClick={() => removeFavorite(product.product_id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePage;

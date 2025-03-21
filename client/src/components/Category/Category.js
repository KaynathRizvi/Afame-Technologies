import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

  useEffect(() => {
    fetch(`${SERVER_URL}/api/categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, [SERVER_URL]);

  const handleChange = (event) => {
    const selectedCategory = event.target.value;
    if(selectedCategory) {
      navigate(`/catalog?category=${encodeURIComponent(selectedCategory)}`);
    }
  };

  return (
    <div className="category-container">
        <h1 className='category-title'>Filter by Category</h1>
      <select className="category-dropdown" onChange={handleChange} defaultValue="">
        <option value="" disabled>Select a category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Category;

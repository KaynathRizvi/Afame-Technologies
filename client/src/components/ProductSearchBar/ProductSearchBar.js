import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductSearchBar.css';
import search_button from '../../assests/search.png';

const ProductSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Open Catalog Page when someone search for products
    navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="filter-type">
          <label>Search for Products</label>
          <input
            type="text"
            placeholder="Eg: Table"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          <img src={search_button} alt="Search" className="search-icon" />
        </button>
      </div>
    </div>
  );
};

export default ProductSearchBar;

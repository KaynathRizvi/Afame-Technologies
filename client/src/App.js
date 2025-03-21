import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import ProductList from './components/ProductList/ProductList';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import Login from './components/Login/Login'
import SignUp from './components/SignUp/SignUp'
import Footer from './components/Footer/Footer';
import About from './components/About/About';
import CartPage from './components/CartPage/CartPage';
import Contact from './components/Contact/Contact';
import ProductView from './components/ProductView/ProductView';
import FavoritesPage from './components/FavoritePage/FavoritePage';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

const App = () => {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(localStorage.getItem('user') || null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    fetch(SERVER_URL + '/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header user={user} />
        <Routes>
          <Route path="/" element={
              <div>
                <Home />
                <ProductList />
                <About />
              </div>
            } 
          />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/view/:productId" element={<ProductView products={products} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

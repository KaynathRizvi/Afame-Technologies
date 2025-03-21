import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Header.css';

const Header = ({ user = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className='title-link'><h1 className='navbar-title'>Crafted Comfort</h1></Link>
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-links ${isOpen ? 'show' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/catalog" onClick={closeMenu}>Products</Link></li>
        <li><Link to="/cartpage" onClick={closeMenu}>Cart</Link></li>
        <li><Link to="/favorites" onClick={closeMenu}>Wishlist</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        {user ? (
          <li className='profile-container'>
            <span className='profile-name'>Welcome, {user}!</span>
            <button className='logout-button' onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li><Link to="/login" onClick={closeMenu}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Header;

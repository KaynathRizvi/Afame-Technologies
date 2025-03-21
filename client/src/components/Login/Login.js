import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || process.env.REACT_APP_DEBUG_SERVER_URL;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(SERVER_URL + '/api/login', {
        user_email: email,
        user_pass: password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.user_name);
      localStorage.setItem('user_id', response.data.user_id);

      console.log("Stored Token:", localStorage.getItem('token'));
      console.log("Stored User Name:", localStorage.getItem('user'));
      console.log("Stored User ID:", localStorage.getItem('user_id'));

      setUser(response.data.user_name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className='login-header'>Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form className='login-form' onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='login-input'
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='login-input'
        />
        <button type="submit" className='login-button'>Login</button>
      </form>
      <p className="register-link">
        Don't have an account? <span onClick={() => navigate('/signup')}>Register</span>
      </p>
    </div>
  );
};

export default Login;
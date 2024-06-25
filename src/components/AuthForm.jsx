import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../css/AuthForm.css';

const AuthForm = ({ isLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isLogin) {
      navigate('/profile');
    }
  }, [user, isLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signIn(identifier, password);
      } else {
        await signUp(identifier, password, confirmPassword, username);
        navigate('/login'); // Redirect to login on signup
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label>Username:</label>
              <input
                className="input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </>
          )}
          <label>{isLogin ? 'Username or Email:' : 'Email:'}</label>
          <input
            className="input"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={isLogin ? 'Username or Email' : 'Email'}
            required
          />
          <label>Password:</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {!isLogin && (
            <>
              <label>Confirm Password:</label>
              <input
                className="input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </>
          )}
          <button className="button" type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  isLogin: PropTypes.bool.isRequired,
};

export default AuthForm;

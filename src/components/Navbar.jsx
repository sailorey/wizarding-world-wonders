import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 
import '../css/Navbar.css';

const Navbar = () => {
  const { user, logOut } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Wizarding World Wonders</Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <Link to="/issues" className="nav-link">Issues</Link>
              <Link to="/profile" className="nav-link">Profile</Link>
              <button className="button" onClick={logOut}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link">Sign Up</Link>
              <Link to="/login" className="nav-link">Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

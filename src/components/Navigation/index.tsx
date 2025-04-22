import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <Logo />
        </Link>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="menu-icon"></span>
        </button>

        {/* Navigation links - desktop and mobile versions */}
        <div className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/lists" onClick={() => setMobileMenuOpen(false)}>Discover</Link>
          
          {user ? (
            <>
              <Link to="/create" onClick={() => setMobileMenuOpen(false)}>Create List</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
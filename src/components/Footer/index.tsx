import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <Logo />
          <p>Share your opinions through top 5 lists on any topic you're passionate about.</p>
        </div>
        
        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/discover">Discover</Link></li>
            <li><Link to="/create">Create List</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Account</h3>
          <ul>
            <li><Link to="/auth">Sign In</Link></li>
            <li><Link to="/auth?signup=true">Sign Up</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Fivhter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
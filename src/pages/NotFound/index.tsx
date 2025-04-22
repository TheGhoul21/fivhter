import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <p className="not-found-code">404</p>
        <div className="not-found-message">
          <h1>Page not found</h1>
          <p>Sorry, we couldn't find the page you're looking for.</p>
          <div className="not-found-actions">
            <Link to="/" className="button button-primary">Go back home</Link>
            <Link to="/create" className="button button-secondary">Create a list</Link>
          </div>
        </div>
      </div>
      <div className="not-found-logo">
        <Link to="/">
          <Logo size="lg" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
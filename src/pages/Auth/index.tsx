import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Logo';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check URL query params for signup=true
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsSignUp(params.get('signup') === 'true');
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    // Reset previous errors
    setError(null);
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    // Additional validation for sign up
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        // Handle sign up
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        setSuccess('Account created! You can now sign in.');
        // Clear form fields
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Switch to sign in mode after successful signup
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      } else {
        // Handle sign in
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        // On successful sign in, user will be redirected via the useEffect
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await signInWithGoogle();
      // Redirect will happen via useEffect
    } catch (error: any) {
      console.error('Google authentication error:', error);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-logo">
          <Logo size="lg" />
        </div>
        
        <h1 className="auth-title">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h1>
        
        <p className="auth-subtitle">
          {isSignUp 
            ? 'Already have an account? ' 
            : 'Don\'t have an account? '}
          <button 
            onClick={toggleAuthMode}
            className="auth-toggle-button"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
        
        {error && (
          <div className="auth-error-message">
            {error}
          </div>
        )}
        
        {success && (
          <div className="auth-success-message">
            {success}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                required
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="button auth-submit-button"
            disabled={loading}
          >
            {loading ? 
              (isSignUp ? 'Creating account...' : 'Signing in...') : 
              (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
          
          {!isSignUp && (
            <>
              <div className="auth-separator">
                <span>OR</span>
              </div>
              
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="button google-sign-in-button"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
                  <g transform="translate(1184.583 765.171)">
                    <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                    <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                    <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                    <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.693 24.592c7.533-22.514 28.575-39.226 53.339-39.226z" fill="#ea4335"/>
                  </g>
                </svg>
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
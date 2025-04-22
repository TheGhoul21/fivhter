import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  // Define size classes based on the size prop
  const sizeClasses = {
    sm: { width: '1.5rem', height: '1.5rem', fontSize: '0.875rem' },
    md: { width: '2rem', height: '2rem', fontSize: '1rem' },
    lg: { width: '2.5rem', height: '2.5rem', fontSize: '1.25rem' }
  };
  
  const style = sizeClasses[size];

  return (
    <Link to="/" className="logo">
      <div 
        className="logo-icon" 
        style={{ 
          width: style.width, 
          height: style.height, 
          fontSize: style.fontSize 
        }}
      >
        5
      </div>
      {withText && (
        <span>Fivhter</span>
      )}
    </Link>
  );
};

export default Logo;
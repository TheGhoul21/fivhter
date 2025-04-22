import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../components/Logo';

describe('Logo Component', () => {
  it('renders with default props', () => {
    render(<Logo />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Fivhter')).toBeInTheDocument();
  });

  it('renders without text when withText is false', () => {
    render(<Logo withText={false} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('Fivhter')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Logo size="sm" />);
    
    // Small size
    let logoElement = screen.getByText('5').closest('div');
    expect(logoElement).toHaveClass('h-6 w-6');
    
    // Medium size (default)
    rerender(<Logo size="md" />);
    logoElement = screen.getByText('5').closest('div');
    expect(logoElement).toHaveClass('h-8 w-8');
    
    // Large size
    rerender(<Logo size="lg" />);
    logoElement = screen.getByText('5').closest('div');
    expect(logoElement).toHaveClass('h-10 w-10');
  });
});
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../components/Avatar';

describe('Avatar Component', () => {
  it('renders with default size', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<Avatar name="John Doe" size="sm" />);
    const avatar = screen.getByText('J').parentElement;
    expect(avatar.classList.contains('w-8')).toBe(true);
  });

  it('renders with large size', () => {
    render(<Avatar name="John Doe" size="lg" />);
    const avatar = screen.getByText('J').parentElement;
    expect(avatar.classList.contains('w-16')).toBe(true);
  });
}); 
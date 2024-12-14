import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../components/Avatar';

describe('Avatar Component', () => {
  it('renders with default size', () => {
    render(<Avatar name="Theja" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<Avatar name="Theja" size="sm" />);
    const avatar = screen.getByText('T').parentElement;
    expect(avatar.classList.contains('w-8')).toBe(true);
  });

  it('renders with large size', () => {
    render(<Avatar name="Theja" size="lg" />);
    const avatar = screen.getByText('T').parentElement;
    expect(avatar.classList.contains('w-16')).toBe(true);
  });
}); 
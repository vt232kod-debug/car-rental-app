import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Hero from '../app/components/Hero';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe('Hero', () => {
  it('renders main heading', () => {
    render(<Hero />);
    expect(screen.getByText(/Find the Perfect Car/)).toBeInTheDocument();
  });

  it('renders Browse Cars link', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /Browse Cars/ })).toHaveAttribute(
      'href',
      '/cars'
    );
  });

  it('renders How It Works link', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: 'How It Works' })).toHaveAttribute(
      'href',
      '/about'
    );
  });
});

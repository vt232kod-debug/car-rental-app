import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Footer from '../app/components/Footer';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe('Footer', () => {
  it('renders Rentola brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Rentola')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders About and Contact links', () => {
    render(<Footer />);
    // "About" / "Contact" appear in both the link columns and the bottom bar.
    const aboutLinks = screen.getAllByRole('link', { name: 'About' });
    expect(aboutLinks.some(l => l.getAttribute('href') === '/about')).toBe(true);
    const contactLinks = screen.getAllByRole('link', { name: 'Contact' });
    expect(contactLinks.some(l => l.getAttribute('href') === '/contact')).toBe(
      true
    );
  });
});

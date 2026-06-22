import { render, screen } from '@testing-library/react';
import ComfortSection from '../app/components/ComfortSection';

describe('ComfortSection', () => {
  it('renders the section eyebrow and heading', () => {
    render(<ComfortSection />);
    expect(screen.getByText('Why Rentola')).toBeInTheDocument();
    expect(
      screen.getByText(/Ride to Your Destination With Maximum Comfort/)
    ).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<ComfortSection />);
    expect(screen.getByText('Unbeatable Prices')).toBeInTheDocument();
    expect(screen.getByText('Unlimited Miles')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });
});

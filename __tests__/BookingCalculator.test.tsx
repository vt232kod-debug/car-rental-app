import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import BookingCalculator from '../app/components/BookingCalculator';

vi.mock('../app/lib/actions', () => ({
  createBooking: vi.fn(),
}));

const props = {
  pricePerDay: 80,
  carId: 'car-1',
  carBrand: 'Toyota',
  carModel: 'Camry',
  carImage: '/car.jpg',
};

describe('BookingCalculator', () => {
  it('renders the "Book This Car" heading', () => {
    render(<BookingCalculator {...props} />);
    expect(screen.getByText('Book This Car')).toBeInTheDocument();
  });

  it('renders the price per day', () => {
    render(<BookingCalculator {...props} />);
    expect(screen.getByText('/ day')).toBeInTheDocument();
  });

  it('renders the "Select Dates & Book" button', () => {
    render(<BookingCalculator {...props} />);
    expect(
      screen.getByRole('button', { name: /select dates & book/i })
    ).toBeInTheDocument();
  });

  it('does not render the booking modal until the button is clicked', () => {
    render(<BookingCalculator {...props} />);
    expect(screen.queryByText('Your ride')).not.toBeInTheDocument();
    expect(screen.queryByText('Book Now')).not.toBeInTheDocument();
  });

  it('opens the booking modal when the button is clicked', () => {
    render(<BookingCalculator {...props} />);
    fireEvent.click(
      screen.getByRole('button', { name: /select dates & book/i })
    );
    expect(screen.getByText('Your ride')).toBeInTheDocument();
    expect(screen.getByText('Book Now')).toBeInTheDocument();
  });

  it('shows the selected car details inside the modal', () => {
    render(<BookingCalculator {...props} />);
    fireEvent.click(
      screen.getByRole('button', { name: /select dates & book/i })
    );
    expect(
      screen.getByRole('heading', { name: 'Toyota Camry' })
    ).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CatalogClient from '../app/components/CatalogClient';
import type { Car } from '../app/lib/types';

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

const base = {
  year: 2023,
  image: '/car.jpg',
  description: 'desc',
  available: true,
  createdAt: new Date('2024-01-01'),
};

const cars: Car[] = [
  { ...base, id: '1', brand: 'Audi', model: 'A4', category: 'SEDAN', pricePerDay: 90 },
  { ...base, id: '2', brand: 'BMW', model: 'X5', category: 'SUV', pricePerDay: 120 },
  { ...base, id: '3', brand: 'Tesla', model: 'Model 3', category: 'ELECTRIC', pricePerDay: 60 },
];

const names = () =>
  screen
    .getAllByText(/^(Audi A4|BMW X5|Tesla Model 3)$/)
    .map(n => n.textContent);

describe('CatalogClient', () => {
  it('renders all cars by default', () => {
    render(<CatalogClient cars={cars} />);
    expect(screen.getByText('Audi A4')).toBeInTheDocument();
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
  });

  it('filters cars by search query (brand or model)', () => {
    render(<CatalogClient cars={cars} />);
    fireEvent.change(screen.getByPlaceholderText(/search by brand or model/i), {
      target: { value: 'bmw' },
    });
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();
    expect(screen.queryByText('Tesla Model 3')).not.toBeInTheDocument();
  });

  it('filters cars by category pill', () => {
    render(<CatalogClient cars={cars} />);
    fireEvent.click(screen.getByRole('button', { name: 'Suv' }));
    expect(screen.getByText('BMW X5')).toBeInTheDocument();
    expect(screen.queryByText('Audi A4')).not.toBeInTheDocument();
  });

  it('sorts cars by price low to high', () => {
    render(<CatalogClient cars={cars} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'price-low' },
    });
    expect(names()).toEqual(['Tesla Model 3', 'Audi A4', 'BMW X5']);
  });

  it('sorts cars by price high to low', () => {
    render(<CatalogClient cars={cars} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'price-high' },
    });
    expect(names()).toEqual(['BMW X5', 'Audi A4', 'Tesla Model 3']);
  });

  it('shows an empty state when nothing matches', () => {
    render(<CatalogClient cars={cars} />);
    fireEvent.change(screen.getByPlaceholderText(/search by brand or model/i), {
      target: { value: 'nonexistent' },
    });
    expect(screen.getByText('No cars found')).toBeInTheDocument();
  });
});

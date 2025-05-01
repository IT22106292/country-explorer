import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Home from '../Home';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockCountries = [
  {
    name: { common: 'India', official: 'Republic of India' },
    cca3: 'IND',
    flags: { svg: 'india-flag.svg' },
    population: 1380004385,
    region: 'Asia',
    capital: ['New Delhi'],
  },
  {
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    cca3: 'BRA',
    flags: { svg: 'brazil-flag.svg' },
    population: 212559417,
    region: 'Americas',
    capital: ['Brasília'],
  },
];

const renderHome = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders loading state initially', () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    renderHome();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders countries after loading', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
    });
  });

  test('filters countries by search query', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'bra' } });

    expect(screen.queryByText('India')).not.toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
  });

  test('filters countries by region', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    const regionSelect = screen.getByRole('combobox', { name: /filter by region/i });
    fireEvent.change(regionSelect, { target: { value: 'Asia' } });

    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
  });

  test('navigates to country detail page when clicking a country card', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('India').closest('div[role="button"]'));
    expect(mockNavigate).toHaveBeenCalledWith('/country/IND');
  });

  test('navigates to table view when clicking table view button', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Table View')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Table View'));
    expect(mockNavigate).toHaveBeenCalledWith('/countries-table');
  });

  test('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch countries')).toBeInTheDocument();
    });
  });

  test('displays no results message when search finds no matches', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    renderHome();

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'xyz' } });

    expect(screen.queryByText('India')).not.toBeInTheDocument();
    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
    expect(screen.getByText('No countries found')).toBeInTheDocument();
  });
}); 
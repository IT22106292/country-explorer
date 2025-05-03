import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react'; // Import act from react
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
    flags: { png: 'india-flag.png' }, // Use png instead of svg to match Home.js
    population: 1380004385,
    region: 'Asia',
    capital: ['New Delhi'],
    languages: { hin: 'Hindi', eng: 'English' }, // Added languages for filtering
  },
  {
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    cca3: 'BRA',
    flags: { png: 'brazil-flag.png' }, // Use png instead of svg
    population: 212559417,
    region: 'Americas',
    capital: ['Brasília'],
    languages: { por: 'Portuguese' }, // Added languages for filtering
  },
];

const renderHome = () => {
  return render(
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
    // Clear localStorage to reset searchQuery
    localStorage.clear();
  });

  test('renders loading state initially', async () => {
    axios.get.mockImplementationOnce(() => new Promise(() => {}));
    await act(async () => {
      renderHome();
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders countries after loading', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
    });
  });

  test('filters countries by search query', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(searchInput, { target: { value: 'bra' } });

    expect(screen.queryByText('India')).not.toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
  });

  test('filters countries by region', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
    });

    const regionSelect = screen.getByRole('combobox', { name: /filter by region/i });
    fireEvent.change(regionSelect, { target: { value: 'Asia' } });

    expect(screen.getByText('India')).toBeInTheDocument();
    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
  });

  test('navigates to country detail page when clicking a country card', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCountries });
    await act(async () => {
      renderHome();
    });

    await waitFor(() => {
      expect(screen.getByText('India')).toBeInTheDocument();
    });

    const indiaCard = screen.getByText('India').closest('div[role="button"]');
    fireEvent.click(indiaCard);
    expect(mockNavigate).toHaveBeenCalledWith('/country/IND');
  });
  
});
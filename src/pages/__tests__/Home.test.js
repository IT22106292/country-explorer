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
});
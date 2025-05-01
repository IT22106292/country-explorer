import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import CountryDetail from '../CountryDetail';

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

global.fetch = jest.fn();

const mockCountry = {
  name: {
    common: 'India',
    official: 'Republic of India',
  },
  cca3: 'IND',
  flags: {
    svg: 'india-flag.svg',
    alt: 'Flag of India',
  },
  population: 1380004385,
  region: 'Asia',
  subregion: 'Southern Asia',
  capital: ['New Delhi'],
  languages: {
    eng: 'English',
    hin: 'Hindi',
    tam: 'Tamil',
  },
  currencies: {
    INR: {
      name: 'Indian rupee',
      symbol: '₹',
    },
  },
  borders: ['BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
  latlng: [20, 77],
  area: 3287263,
  timezones: ['UTC+05:30'],
  coatOfArms: {
    svg: 'india-coat.svg',
  },
};

const mockBorders = [
  { name: { common: 'Bangladesh' }, cca3: 'BGD' },
  { name: { common: 'Bhutan' }, cca3: 'BTN' },
  { name: { common: 'Myanmar' }, cca3: 'MMR' },
  { name: { common: 'China' }, cca3: 'CHN' },
  { name: { common: 'Nepal' }, cca3: 'NPL' },
  { name: { common: 'Pakistan' }, cca3: 'PAK' },
];

const renderCountryDetail = () => {
  useNavigate.mockReturnValue(mockNavigate);
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CountryDetail />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CountryDetail Component', () => {
  beforeEach(() => {
    useParams.mockReturnValue({ countryCode: 'IND' });
    global.fetch.mockReset();
    mockNavigate.mockReset();
  });

  test('renders loading state initially', async () => {
    global.fetch.mockImplementation(() =>
      new Promise(() => {})
    );

    renderCountryDetail();

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders country details after loading', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      expect(screen.getByTestId('country-name')).toBeInTheDocument();
    });

    expect(screen.getByTestId('country-name')).toHaveTextContent('India');
    expect(screen.getByTestId('region')).toHaveTextContent('Asia');
    expect(screen.getByTestId('capital')).toHaveTextContent('New Delhi');
    expect(screen.getByTestId('population')).toHaveTextContent('1,380,004,385');
  });

  test('displays languages correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      const languagesSection = screen.getByTestId('languages');
      expect(languagesSection).toBeInTheDocument();
      expect(languagesSection).toHaveTextContent(/english/i);
      expect(languagesSection).toHaveTextContent(/hindi/i);
      expect(languagesSection).toHaveTextContent(/tamil/i);
    });
  });

  test('displays currency information', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      const currenciesSection = screen.getByTestId('currencies');
      expect(currenciesSection).toBeInTheDocument();
      expect(currenciesSection).toHaveTextContent(/indian rupee/i);
      expect(currenciesSection).toHaveTextContent(/₹/);
    });
  });

 

  test('displays border countries', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      expect(screen.getByTestId('country-name')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('borders-tab'));

    await waitFor(() => {
      const bordersContent = screen.getByTestId('borders-content');
      expect(bordersContent).toBeInTheDocument();
      mockCountry.borders.forEach(border => {
        expect(screen.getByTestId(`border-link-${border}`)).toBeInTheDocument();
      });
    });
  });

  test('switches between tabs correctly', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      expect(screen.getByTestId('country-name')).toBeInTheDocument();
    });

    expect(screen.getByTestId('overview-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('details-tab'));
    expect(screen.getByTestId('details-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('borders-tab'));
    expect(screen.getByTestId('borders-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('overview-tab'));
    expect(screen.getByTestId('overview-content')).toBeInTheDocument();
  });

  test('navigates back when clicking back button', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      expect(screen.getByTestId('country-name')).toBeInTheDocument();
    });

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('opens map in new tab when clicking map link', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([mockCountry]),
    });

    renderCountryDetail();

    await waitFor(() => {
      const mapLink = screen.getByTestId('map-link');
      expect(mapLink).toHaveAttribute('target', '_blank');
      expect(mapLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(mapLink.href).toContain('openstreetmap.org');
      expect(mapLink.href).toContain('mlat=20');
      expect(mapLink.href).toContain('mlon=77');
    });
  });
});

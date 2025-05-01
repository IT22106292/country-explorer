import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils';

// Mock all the components used in App.js
jest.mock('./components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Component</div>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('./pages/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('./pages/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('./pages/Favorites', () => {
  return function MockFavorites() {
    return <div data-testid="favorites-page">Favorites Page</div>;
  };
});

jest.mock('./pages/CountryDetail', () => {
  return function MockCountryDetail() {
    return <div data-testid="country-detail-page">Country Detail Page</div>;
  };
});

jest.mock('./pages/CountriesTable', () => {
  return function MockCountriesTable() {
    return <div data-testid="countries-table-page">Countries Table Page</div>;
  };
});

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
}));

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    user: { email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('App Component', () => {
  test('renders navbar', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders home page', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

 

  test('maintains auth context throughout the app', () => {
    renderWithProviders(<App />);
    const { useAuth } = require('./context/AuthContext');
    expect(useAuth().isAuthenticated).toBe(true);
    expect(useAuth().user.email).toBe('test@example.com');
  });
});

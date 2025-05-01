import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import CountryDetail from './pages/CountryDetail';
import CountriesTable from './pages/CountriesTable';
import Landing from './pages/LandingPage';

// Wrapper component to handle navbar visibility
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/', '/countries-table' ];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {shouldShowNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/country/:countryCode" element={<CountryDetail />} />
          <Route path="/countries-table" element={<CountriesTable />} />
        </Routes>
      </main>
      <Footer /> 
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 
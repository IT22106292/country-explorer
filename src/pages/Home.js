import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Home() {
  // Initialize state from localStorage with fallback
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      return localStorage.getItem('searchQuery') || '';
    } catch {
      return '';
    }
  });
  const [selectedRegion, setSelectedRegion] = useState(() => {
    try {
      return localStorage.getItem('selectedRegion') || '';
    } catch {
      return '';
    }
  });
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem('selectedLanguage') || '';
    } catch {
      return '';
    }
  });

  const auth = useAuth();
  const { user, addToFavorites, removeFromFavorites, isFavorite } = auth || {};
  const navigate = useNavigate();

  // Utility to clear filters and localStorage
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedLanguage('');
    try {
      localStorage.removeItem('searchQuery');
      localStorage.removeItem('selectedRegion');
      localStorage.removeItem('selectedLanguage');
    } catch {
      console.warn('Failed to clear localStorage');
    }
  }, []);

  // Reset filters when user logs out or a new user logs in
  useEffect(() => {
    // Store previous user ID to detect changes
    let prevUserId = null;
    try {
      prevUserId = localStorage.getItem('lastUserId') || null;
    } catch {
      console.warn('Failed to access lastUserId from localStorage');
    }

    const currentUserId = user ? user.id : null;

    // Reset if user logs out (user is null) or a different user logs in
    if (!user || (prevUserId !== null && currentUserId !== prevUserId)) {
      resetFilters();
    }

    // Update lastUserId in localStorage
    try {
      if (currentUserId) {
        localStorage.setItem('lastUserId', currentUserId);
      } else {
        localStorage.removeItem('lastUserId');
      }
    } catch {
      console.warn('Failed to update lastUserId in localStorage');
    }
  }, [user, resetFilters]);

  // Save state to localStorage (combined for performance)
  useEffect(() => {
    try {
      localStorage.setItem('searchQuery', searchQuery);
      localStorage.setItem('selectedRegion', selectedRegion);
      localStorage.setItem('selectedLanguage', selectedLanguage);
    } catch {
      console.warn('Failed to save filters to localStorage');
    }
  }, [searchQuery, selectedRegion, selectedLanguage]);

  // Fetch countries (unchanged)
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = response.data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch countries. Please try again later.');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Rest of the code (unchanged)
  const handleFavoriteClick = (country, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (typeof isFavorite === 'function' && isFavorite(country.cca3)) {
      typeof removeFromFavorites === 'function' && removeFromFavorites(country.cca3);
    } else {
      typeof addToFavorites === 'function' && addToFavorites(country);
    }
  };

  const handleCountryClick = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion = !selectedRegion || country.region === selectedRegion;
    const matchesLanguage =
      !selectedLanguage ||
      (country.languages &&
        Object.values(country.languages).some((language) =>
          language.toLowerCase().trim() === selectedLanguage.toLowerCase().trim()
        ));
    return matchesSearch && matchesRegion && matchesLanguage;
  });

  const regions = [...new Set(countries.map((country) => country.region))].filter(Boolean);

  const languages = [
    ...new Set(
      countries.flatMap((country) =>
        country.languages ? Object.values(country.languages) : []
      )
    ),
  ]
    .map((name) => ({ name: name.trim() }))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-grow max-w-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-blue-500/30"></div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-blue-200/50 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-purple-500/30  bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500/70 dark:placeholder-gray-400/70 transition-all duration-300"
                  />
                  <svg
                    className="absolute left-4 w-5 h-5 text-blue-500/70 dark:text-purple-400/70 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="relative min-w-[200px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-blue-500/30"></div>
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-blue-200/50 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-purple-500/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white appearance-none transition-all duration-300"
                    aria-label="filter by region"
                  >
                    <option value="">All Regions</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-blue-500/70 dark:text-purple-400/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="relative min-w-[200px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-lg backdrop-blur-sm transition-all duration-300 group-hover:from-blue-500/30 group-hover:via-purple-500/30 group-hover:to-blue-500/30"></div>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 pr-10 rounded-lg border border-blue-200/50 dark:border-purple-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-purple-500/30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white appearance-none transition-all duration-300"
                  >
                    <option value="">All Languages</option>
                    {languages.map((language) => (
                      <option key={language.name} value={language.name}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-blue-500/70 dark:text-purple-400/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.length === 0 ? (
            <div className="col-span-full text-center text-gray-600 dark:text-gray-400 py-8">
              No countries found
            </div>
          ) : (
            filteredCountries.map((country) => (
              <div
                key={country.cca3}
                role="button"
                onClick={() => handleCountryClick(country.cca3)}
                className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-white/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={country.flags.png}
                    alt={`${country.name.common} flag`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-900/95 via-purple-900/80 to-transparent backdrop-blur-md text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-3">{country.name.common}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>Capital: {country.capital?.[0] || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-purple-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>Population: {country.population.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-blue-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Region: {country.region}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleFavoriteClick(country, e)}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
                    isFavorite && isFavorite(country.cca3)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/90 text-gray-800 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:shadow-lg'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isFavorite && isFavorite(country.cca3) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
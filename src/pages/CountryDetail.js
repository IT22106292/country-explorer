import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CountryDetail() {
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, addToFavorites, removeFromFavorites, isFavorite } = useAuth();
  const [coatOfArmsLoading, setCoatOfArmsLoading] = useState(true);

  const fetchCountry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Country not found' : 'Failed to load country details');
      }
      const data = await response.json();
      if (!data || data.length === 0) {
        throw new Error('Country not found');
      }
      setCountry(data[0]);
    } catch (err) {
      setError(err.message || 'Failed to load country details');
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    fetchCountry();
  }, [fetchCountry]);

  const handleFavoriteClick = () => {
    if (!user) return;
    
    if (isFavorite(country.cca3)) {
      removeFromFavorites(country.cca3);
    } else {
      addToFavorites({
        cca3: country.cca3,
        name: country.name,
        flags: country.flags,
        capital: country.capital,
        region: country.region,
        population: country.population
      });
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" role="status" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4" data-testid="error-message">
        <div className="text-red-600 text-xl mb-4">{error || 'Country not found'}</div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Banner Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={country.flags.svg}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40">
          <div className="container mx-auto h-full px-4 flex flex-col justify-end pb-8">
            <h1 className="text-5xl font-bold text-white mb-4" data-testid="country-name">{country.name.common}</h1>
            <h2 className="text-2xl text-white/90" data-testid="country-official-name">{country.name.official}</h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation and Favorites */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackClick}
            className="group relative inline-flex items-center justify-center w-12 h-12 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300"
            data-testid="back-button"
          >
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            <svg 
              className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M11 17l-5-5m0 0l5-5m-5 5h12" 
                className="transform origin-center group-hover:scale-110 transition-transform duration-300"
              />
            </svg>
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 dark:border-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-110 group-hover:scale-125"></div>
          </button>
          {user && (
            <button
              onClick={handleFavoriteClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 dark:from-blue-500/80 dark:to-purple-500/80 dark:hover:from-blue-600/80 dark:hover:to-purple-600/80"
              data-testid="favorite-button"
            >
              <svg
                className={`w-5 h-5 mr-2 ${isFavorite(country.cca3) ? 'fill-current' : ''}`}
                fill="none"
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
              {isFavorite(country.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden dark:bg-gray-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Flag */}
            <div className="flex items-center justify-center">
              <img
                src={country.flags.svg}
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                className="w-full max-w-md rounded-xl"
                data-testid="country-flag"
              />
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white" data-testid="country-heading"> 
                {Object.values(country.name.nativeName || {})[0]?.common || 'N/A'}
              </h1>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100/80 dark:bg-blue-900/80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Population</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white" data-testid="population">
                      {country.population.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100/80 dark:bg-purple-900/80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Region</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white" data-testid="region">
                      {country.region}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100/80 dark:bg-blue-900/80 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Capital</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white" data-testid="capital">
                      {country.capital?.[0] || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="px-8">
              <nav className="flex space-x-8" data-testid="tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  data-testid="overview-tab"
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  data-testid="details-tab"
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('borders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'borders'
                      ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  data-testid="borders-tab"
                >
                  Borders
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="overview-content">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Languages</h3>
                    <div className="flex flex-wrap gap-2" data-testid="languages">
                      {Object.values(country.languages || {}).map((language) => (
                        <span
                          key={language}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100/80 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Currencies</h3>
                    <div className="flex flex-wrap gap-2" data-testid="currencies">
                      {Object.values(country.currencies || {}).map((currency) => (
                        <span
                          key={currency.name}
                          className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-purple-100/80 text-purple-800 dark:bg-purple-900/80 dark:text-purple-200"
                        >
                          {currency.name} ({currency.symbol})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" data-testid="details-content">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">Additional Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Official Name</h4>
                            <p className="text-base text-gray-800 dark:text-gray-200">{country.name.official}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 p-5 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Subregion</h4>
                            <p className="text-base text-gray-800 dark:text-gray-200">{country.subregion || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">Area</h4>
                            <p className="text-base text-gray-800 dark:text-gray-200">{country.area.toLocaleString()} km²</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 p-5 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-purple-600 dark:text-purple-400">Timezone(s)</h4>
                            <p className="text-base text-gray-800 dark:text-gray-200">{country.timezones.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">Coat of Arms</h3>
                    {country.coatOfArms?.svg ? (
                      <div className="flex justify-center items-center">
                        {coatOfArmsLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                          </div>
                        )}
                        <img
                          src={country.coatOfArms.svg}
                          alt={`Coat of arms of ${country.name.common}`}
                          className="max-w-[200px] mx-auto"
                          onLoad={() => setCoatOfArmsLoading(false)}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <p className="text-base text-blue-600 dark:text-blue-400 text-center">No coat of arms available</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'borders' && (
                <div data-testid="borders-content">
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-6">Bordering Countries</h3>
                  {country.borders && country.borders.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {country.borders.map((border) => (
                        <Link
                          key={border}
                          to={`/country/${border}`}
                          className="group bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-300"
                          data-testid={`border-link-${border}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-base font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {border}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm">
                      <p className="text-base text-blue-600 dark:text-blue-400 text-center">No bordering countries</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Link */}
        <div className="mt-8 text-center">
          <a
            href={`https://www.openstreetmap.org/?mlat=${country.latlng[0]}&mlon=${country.latlng[1]}&zoom=5&layers=M&marker=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-700/80 hover:to-purple-700/80 dark:from-blue-500/80 dark:to-purple-500/80 dark:hover:from-blue-600/80 dark:hover:to-purple-600/80"
            data-testid="map-link"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            View on Map
          </a>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;
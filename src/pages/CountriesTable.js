import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CountriesTable = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRegionFilter = (region) => {
    setSelectedRegion(region === selectedRegion ? '' : region);
  };

  const sortedCountries = [...countries]
    .filter(country => !selectedRegion || country.region === selectedRegion)
    .sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'name') {
        aValue = a.name.common;
        bValue = b.name.common;
      } else if (sortField === 'population') {
        aValue = a.population;
        bValue = b.population;
      } else if (sortField === 'region') {
        aValue = a.region;
        bValue = b.region;
      } else if (sortField === 'capital') {
        aValue = a.capital?.[0] || '';
        bValue = b.capital?.[0] || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const regions = [...new Set(countries.map(country => country.region))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
        <img 
          src="https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2Rlc2lnbndpdGhtZTA5X2FfaWxsdXN0cmF0aW9uX29mX2Ffd29ybGRfbWFwX3ZlY3Rvcl9hcnRfX3Bhc3RlbF9jNDAyOWM1Mi0zZjBiLTQyZGQtYmI0Yi1jMDJjYTJkZjRjMmEuanBn.jpg" 
          alt="World map background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white transform -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Countries Explorer
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate-fade-in">
            Explore Countries
          </h1>
          <p className="text-gray-600 text-lg mb-8 animate-fade-in-delayed">
            Discover and learn about countries around the world
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {regions.map(region => (
            <button
              key={region}
              onClick={() => handleRegionFilter(region)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedRegion === region
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-xl bg-white/20 backdrop-blur-lg border border-white/5 shadow-2xl">
          <table className="min-w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  <button 
                    className="flex items-center hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSort('flag')}
                  >
                    Flag
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  <button 
                    className="flex items-center hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    Name
                    {sortField === 'name' && (
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  <button 
                    className="flex items-center hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSort('population')}
                  >
                    Population
                    {sortField === 'population' && (
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  <button 
                    className="flex items-center hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSort('region')}
                  >
                    Region
                    {sortField === 'region' && (
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </button>
                </th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">
                  <button 
                    className="flex items-center hover:text-blue-600 transition-colors duration-200"
                    onClick={() => handleSort('capital')}
                  >
                    Capital
                    {sortField === 'capital' && (
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map(country => (
                <tr 
                  key={country.cca3} 
                  className="border-b border-white/5 hover:bg-white/10 transition-colors duration-200"
                >
                  <td className="py-4 px-6">
                    <img 
                      src={country.flags.png} 
                      alt={`${country.name.common} flag`}
                      className="w-16 h-10 object-cover rounded shadow-lg transform hover:scale-110 transition-transform duration-200"
                    />
                  </td>
                  <td className="py-4 px-6 text-gray-900">
                    <Link 
                      to={`/login`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {country.name.common}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {country.population.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {country.region}
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {country.capital?.[0] || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-delayed {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CountriesTable;
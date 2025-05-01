import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="relative min-h-screen flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
          <img 
            src="https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2Rlc2lnbndpdGhtZTA5X2FfaWxsdXN0cmF0aW9uX29mX2Ffd29ybGRfbWFwX3ZlY3Rvcl9hcnRfX3Bhc3RlbF9jNDAyOWM1Mi0zZjBiLTQyZGQtYmI0Yi1jMDJjYTJkZjRjMmEuanBn.jpg" 
            alt="World map background"
            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`flex flex-col md:flex-row items-center justify-between transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center md:text-left space-y-6 md:max-w-2xl">
              <h2 className="text-5xl sm:text-7xl font-bold tracking-tight">
                <span className="block text-gray-900 animate-fade-in">Countries Explorer</span>
                <span className="block mt-2 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Discover the world
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-delay">
              Welcome to our website, The ultimate destination for anyone fascinated by the diverse nations that make up our world.
              </p>
            </div>

            <div className="mt-12 md:mt-0 space-y-8 animate-fade-in-delay-2">
              <Link 
                to="/login" 
                className="group flex items-center space-x-6 p-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/80 hover:from-white hover:to-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl w-96"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl flex-shrink-0 transform group-hover:rotate-6">
                  <svg className="w-8 h-8 text-white transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">Start Exploring</h3>
                  <p className="text-gray-600 text-base mt-1">Begin your journey</p>
                </div>
              </Link>

              <Link 
                to="/countries-table" 
                className="group flex items-center space-x-6 p-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/80 hover:from-white hover:to-white/90 backdrop-blur-sm border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl w-96"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl flex-shrink-0 transform group-hover:rotate-6">
                  <svg className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">View Table</h3>
                  <p className="text-gray-600 text-base mt-1">Browse country database</p>
                </div>
              </Link>

              <a 
                href="https://www.openstreetmap.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-6 p-8 rounded-3xl bg-gradient-to-br from-white/90 to-white/80 hover:from-white hover:to-white/90 backdrop-blur-sm border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl w-96"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl flex-shrink-0 transform group-hover:rotate-6">
                  <svg className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">Open Map</h3>
                  <p className="text-gray-600 text-base mt-1">Explore OpenStreetMap</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default LandingPage;
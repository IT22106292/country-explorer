import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user and favorites from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Load user-specific favorites
      const userFavorites = localStorage.getItem(`favorites_${parsedUser.username}`);
      if (userFavorites) {
        setFavorites(JSON.parse(userFavorites));
      } else {
        setFavorites([]);
      }
    }
    
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      // Don't clear favorites here, as we want to keep them for next login
    }
  }, [user]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const register = async (username, email, password) => {
    // In a real app, you would make an API call here
    // For now, we'll just create a user object
    const newUser = {
      id: Date.now().toString(),
      username,
      email
    };
    
    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Store the password securely (in a real app, this would be hashed)
    localStorage.setItem(`password_${username}`, password);
    
    // Initialize empty favorites for new user if they don't exist
    if (!localStorage.getItem(`favorites_${username}`)) {
      localStorage.setItem(`favorites_${username}`, JSON.stringify([]));
    }
    
    // Update the user state
    setUser(newUser);
    
    // Load any existing favorites for this user
    const existingFavorites = localStorage.getItem(`favorites_${username}`);
    if (existingFavorites) {
      setFavorites(JSON.parse(existingFavorites));
    } else {
      setFavorites([]);
    }
    
    return newUser;
  };

  const login = (username, password) => {
    // Check if the user exists and password matches
    const storedPassword = localStorage.getItem(`password_${username}`);
    
    if (!storedPassword || storedPassword !== password) {
      return { success: false, message: 'Invalid username or password' };
    }
    
    // If credentials are valid, create user object and log in
    const userData = {
      id: Date.now().toString(),
      username
    };
    
    setUser(userData);
    
    // Load user-specific favorites
    const userFavorites = localStorage.getItem(`favorites_${username}`);
    if (userFavorites) {
      setFavorites(JSON.parse(userFavorites));
    } else {
      // Initialize empty favorites array if none exists
      localStorage.setItem(`favorites_${username}`, JSON.stringify([]));
      setFavorites([]);
    }
    
    return { success: true, user: userData };
  };

  const logout = () => {
    if (user) {
      // Save current favorites before logging out
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(favorites));
    }
    setUser(null);
    setFavorites([]); // Clear favorites from state but not from localStorage
  };

  const addToFavorites = (country) => {
    if (!user) return;
    
    if (!favorites.some(fav => fav.cca3 === country.cca3)) {
      const newFavorites = [...favorites, country];
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (countryCode) => {
    if (user) {
      const newFavorites = favorites.filter(country => country.cca3 !== countryCode);
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (countryCode) => {
    if (!user) return false;
    return favorites.some(country => country.cca3 === countryCode);
  };

  const value = {
    user,
    favorites,
    loading,
    register,
    login,
    logout,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 
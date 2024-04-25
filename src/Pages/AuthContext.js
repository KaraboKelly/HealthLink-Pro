import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    // Check session storage for saved user data when component mounts
    const storedUser = sessionStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    console.log('User:', user);
  }, [user]);

  const login = (userData) => {
    // Set the user state to the logged-in user data
    setUser(userData);
    // Save user data to session storage
    sessionStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    // Clear the user state (log out the user)
    setUser(null);
    // Remove user data from session storage
    sessionStorage.removeItem('userData');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
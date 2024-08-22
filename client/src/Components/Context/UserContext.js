// src/Context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context for the user
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ email: '' });

  // Function to update user email
  const updateEmail = (email) => setUser({ email });

  return (
    <UserContext.Provider value={{ user, updateEmail }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the User Context
export const useUser = () => useContext(UserContext);

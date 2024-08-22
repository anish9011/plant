import React, { createContext, useContext, useState } from 'react';

// Create a Context for the price
const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [price, setPrice] = useState(0); // Initialize price as a number

  // Function to update the price
  const updatePrice = (newPrice) => setPrice(newPrice);

  return (
    <PriceContext.Provider value={{ price, updatePrice }}>
      {children}
    </PriceContext.Provider>
  );
};

// Custom hook to use the Price Context
export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};

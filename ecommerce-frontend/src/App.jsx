import React from 'react';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { BrowserRouter } from 'react-router-dom';
import AppContent from './AppContent';
const App = () => {
  return (
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  );
};

export default App;
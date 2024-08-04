import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './Components/Signin/Signin';
import ProductList from './Components/Home/ProductList';
import Signup from './Components/Signup1/Signup';
import { ProductsProvider } from './Components/Context/ProductsContext';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Bag from './Components/Bag/Bag';
import Header from './Components/Home/Header';

const App = () => {
  return (
    <Router>
      <ProductsProvider>
        <Routes>
          <Route exact path="/" element={<><Header/><Signin/></>} />
          <Route path="/signup" element={<><Header/><Signup /></>} />
          <Route path="/productlist" element={<><Header/><ProductList /></>} />
          <Route path="/productdetail/:id" element={<><Header/><ProductDetail /></>} />
          <Route path="/bag/:id" element={<><Header/><Bag /></>} />
          <Route path="/bag" element={<><Header/><Bag /></>} />
        </Routes>
      </ProductsProvider>
    </Router>
  );
};

export default App;

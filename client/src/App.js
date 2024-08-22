import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './Components/Signin/Signin';
import ProductList from './Components/Home/ProductList';
import Signup from './Components/Signup1/Signup';
import { ProductsProvider } from './Components/Context/ProductsContext';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Bag from './Components/Bag/Bag';
import Header from './Components/Home/Header';
import { UserProvider } from './Components/Context/UserContext';
import CheckOut from './Components/CheckOut/CheckOut';
import {PriceProvider} from './Components/Context/PriceContext';

const App = () => {
  return (
    <Router>
      <ProductsProvider>
        <UserProvider>
          <PriceProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/productdetail/:id" element={<ProductDetail />} />
            <Route path="/bag/:id" element={<><ProductDetail /><Bag /></>} />
            <Route path="/bag" element={<><Bag /><ProductList /></>} />
            <Route path="/checkout" element={<><CheckOut/></>} />
          </Routes>
          </PriceProvider>
        </UserProvider>
      </ProductsProvider>
    </Router>
  );
};

export default App;

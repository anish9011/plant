import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation(); // Hook to access the current location

  useEffect(() => {
    // Smoothly scroll to the top of the page on component mount or route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]); // Dependency on location to trigger scroll on route change

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getproduct');
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>No products found</p>;

  return (
    <div className="max-w-8xl mx-0 sm:mx-10 bg-white rounded-lg shadow-md mt-6 p-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-1xl">
        {products.map((product) => (
          <Link key={product.id} to={`/getproductdetail/${product.id}`} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="mb-2"><strong className="text-gray-700">Price:</strong> <b>&#8377;{product.price}</b></p>
            <div>
              <img
                src={`data:${product.image.contentType};base64,${product.image.data}`}
                alt={product.name}
                  className="w-80 h-80 object-cover rounded-md cursor-pointer"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

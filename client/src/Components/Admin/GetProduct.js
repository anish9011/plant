import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/getproduct');
        setProducts(response.data);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>No products found</p>;

  return (
    <div className="max-w-8xl mx-auto bg-white mr-36 ml-36 rounded-lg shadow-md mt-12 p-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="mb-2"><strong>Price:</strong> ${product.price}</p>
            <div>
              <img
                src={`data:${product.image.contentType};base64,${product.image.data}`}
                alt={product.name}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

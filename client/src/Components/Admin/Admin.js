import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Admin = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin'); // Full URL with port
        setCheckouts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <button 
          type="button" 
          className="rounded-md bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-half"
          onClick={() => navigate('/admin/addproduct')} // Navigate to /addproduct on click
        >
          Add Product
        </button>
        <button 
          type="button" 
          className="rounded-md ml-4 bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-half"
          onClick={() => navigate('/admin/getproduct')} // Navigate to /addproduct on click
        >
          Product List
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {checkouts.map((checkout) => (
          <div key={checkout._id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{checkout.fullName}</h2>
            <p><span className="font-semibold">Address:</span> {checkout.addressLine1}, {checkout.addressLine2 || ''}, {checkout.city}, {checkout.state}, {checkout.postalCode}, {checkout.country}</p>
            <p><span className="font-semibold">Phone:</span> {checkout.phoneNumber}</p>
            <p><span className="font-semibold">Payment Method:</span> {checkout.paymentMethod}</p>
            <p><span className="font-semibold">Delivery Instructions:</span> {checkout.deliveryInstructions || 'None'}</p>
            <p><span className="font-semibold">Expected Delivery Date:</span> {new Date(checkout.expectedDeliveryDate).toLocaleDateString()}</p>
            <p><span className="font-semibold">Price:</span> &#8377;{checkout.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

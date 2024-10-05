import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrice } from '../Context/PriceContext';

const Admin = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { price } = usePrice();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setCheckouts(data);
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
          className="rounded-md bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate('/admin/addproduct')}
        >
          Add Product
        </button>
        <button
          type="button"
          className="rounded-md ml-4 bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigate('/getproduct')}
        >
          Product List
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>
      <div className="space-y-4">
        {checkouts.map((checkout) => (
          <div key={checkout.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{checkout.fullName}</h2>
            <p>
              <span className="font-semibold">Address:</span> {checkout.addressLine1}, {checkout.addressLine2 || ''},{' '}
              {checkout.city}, {checkout.state}, {checkout.postalCode}, {checkout.country}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {checkout.phoneNumber}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {checkout.email}
            </p>
             <p>
              <span className="font-semibold">Payment Method:</span> {checkout.paymentMethod}
            </p>
            <p>
              <span className="font-semibold">Total Amount:</span> &#x20B9;{checkout.totalAmount}
            </p>
            <p>
              <span className="font-semibold">Delivery Instructions:</span>{' '}
              {checkout.deliveryInstructions || 'None'}
            </p>
            <p>
              <span className="font-semibold">Expected Delivery Date:</span>{' '}
              {new Date(checkout.expectedDeliveryDate).toLocaleDateString()}
            </p>

            {/* Horizontal layout for products */}
            {checkout.productName && checkout.productName.length > 0 ? (
              <div className="overflow-auto">
                <div className="flex space-x-4 mt-4">
                  {checkout.productName.map((name, index) => (
                    <div key={index} className="flex-shrink-0 w-80 p-2 border rounded-lg bg-gray-50">
                      <div className="flex items-center">
                        {checkout.image && checkout.image[index] ? (
                          <img
                            src={checkout.image[index]} // Base64 image
                            alt={name}
                            className="h-16 w-16 object-cover rounded-md mr-4"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-300 rounded-md mr-4"></div> // Placeholder if no image
                        )}
                        <div>
                          <p className="text-lg font-medium text-gray-800">{name}</p>
                          <p className="text-sm text-gray-600">Quantity: {checkout.quantity[index]}</p>
                          <p className="text-lg font-semibold text-gray-900">
                            &#x20B9;{checkout.price[index]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No products found.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;

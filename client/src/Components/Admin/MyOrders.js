import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrice } from '../Context/PriceContext';
import { useUser } from '../Context/UserContext';

const MyOrders = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {user} = useUser();

  console.log("User Object:", user); // Log the complete user object

  useEffect(() => {
    const fetchCheckouts = async () => {
      const userEmail = user.email; // Adjust this line to access the email correctly

      if (!userEmail) {
        console.error('User email is not available');
        return; // Exit if email is not available
      }

      try {
        const response = await fetch(`http://localhost:5000/myorders?email=${encodeURIComponent(userEmail)}`, {
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, [user]); // Ensure to keep user in the dependency array

  if (loading) return <p className="text-center text-gray-500 text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-xl">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
  

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Orders</h1>
      <div className="space-y-6">
        {checkouts.map((checkout) => (
          <div key={checkout.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="mb-4 border-b pb-4">
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Delivery Address:</span> {checkout.addressLine1}, {checkout.addressLine2 || ''},{' '}
                {checkout.city}, {checkout.state}, {checkout.postalCode}, {checkout.country}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Phone:</span> {checkout.phoneNumber}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Email:</span> {checkout.email}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Payment Method:</span> {checkout.paymentMethod}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Total Amount:</span> &#x20B9;{checkout.totalAmount}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Delivery Instructions:</span> {checkout.deliveryInstructions || 'None'}
              </p>
              <p className="text-base text-gray-700">
                <span className="font-semibold text-lg">Expected Delivery Date:</span> {new Date(checkout.expectedDeliveryDate).toLocaleDateString()}
              </p>
            </div>

            {/* Product Grid Layout */}
            {checkout.name && checkout.name.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {checkout.name.map((name, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-150 shadow-md hover:shadow-lg">
                    <div className="flex items-center">
                      {checkout.image[index] ? (
                        <img
                          src={checkout.image[index]}
                          alt={name}
                          className="h-32 w-32 object-cover rounded-md mr-4"
                        />
                      ) : (
                        <div className="h-32 w-32 bg-gray-300 rounded-md mr-4"></div>
                      )}
                      <div className="flex-grow">
                        <p className="text-xl font-semibold text-gray-800">{name}</p>
                        <p className="text-base text-gray-600">Quantity: {checkout.quantity[index]}</p>
                        <p className="text-lg font-semibold text-gray-900">&#x20B9;{checkout.price[index]}</p>
                      </div>
                    </div>
                  </div>
                ))}
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

export default MyOrders;

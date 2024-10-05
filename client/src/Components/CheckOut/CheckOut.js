import React, { useState, useEffect } from 'react';
import { usePrice } from '../Context/PriceContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import './CheckOut.css';

const CheckOut = () => {
  const { user } = useUser();
  const { price } = usePrice();
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    paymentMethod: 'COD',
    deliveryInstructions: '',
    expectedDeliveryDate: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const getRandomFutureDate = () => {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const futureDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
      return futureDate.toISOString().split('T')[0];
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      expectedDeliveryDate: getRandomFutureDate(),
    }));
  }, []);

  const handleChange = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/admin/addtobag?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrderItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error.message || error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("email", user.email);
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("addressLine1", formData.addressLine1);
    formDataToSend.append("addressLine2", formData.addressLine2);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("postalCode", formData.postalCode);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("paymentMethod", formData.paymentMethod);
    formDataToSend.append("deliveryInstructions", formData.deliveryInstructions);
    formDataToSend.append("expectedDeliveryDate", formData.expectedDeliveryDate);
    formDataToSend.append("totalAmount", price);
    for (const item of orderItems) {
      formDataToSend.append("name", item.name);
      formDataToSend.append("price", item.price);
      formDataToSend.append("quantity", item.quantity);
      
      if (typeof item.image === 'string') {
        try {
          const response = await fetch(item.image);
          if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
          const blob = await response.blob();
          const file = new File([blob], 'product-image.jpg', { type: blob.type });
          formDataToSend.append("image", file);
        } catch (error) {
          console.error('Error fetching image:', error.message || error);
          setModalMessage('Failed to fetch product images. Please try again later.');
          setIsModalOpen(true);
          return; // Exit the function if there's an error
        }
      } else {
        formDataToSend.append("image", item.image);
      }
    }

    // Log the FormData contents
    console.log("FormData contents:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit data');
      }

      setModalMessage('Order Confirmed! Thank you for your purchase.');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('An error occurred while submitting the form. Please try again.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/getproduct');
  };

  return (
    <div className="checkout-container max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['fullName', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country', 'phoneNumber'].map(
            (field, index) => (
              <div key={index}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field.split(/(?=[A-Z])/).join(' ')}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field !== 'addressLine2'}
                />
              </div>
            )
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Order Summary</h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md max-h-64 overflow-y-auto relative scrollable-order-summary">
            {orderItems.length > 0 ? (
              orderItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md mr-4" />
                    <div>
                      <p className="text-lg font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">&#x20B9;{item.price}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Your cart is empty.</p>
            )}

            <div className="sticky bottom-0 bg-gray-100 pt-4 mt-4 border-t border-gray-300">
              <div className="flex justify-between">
                <p className="text-lg font-medium">Total Price:</p>
                <p className="text-lg font-semibold text-red-600">&#x20B9;{price || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-medium text-gray-800 mb-4">Payment & Delivery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>

            <div>
              <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700">
                Delivery Instructions
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full p-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
          Confirm Order
        </button>
      </form>

      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content bg-white p-6 rounded-lg z-10 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{modalMessage}</h2>
            <button onClick={closeModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOut;

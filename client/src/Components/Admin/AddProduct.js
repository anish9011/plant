import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const AddProductForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    desc: '',
    detail: '',
    highlights: '',
    image: null,
  });

  const [success, setSuccess] = useState(false);

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('id', formData.id);
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('desc', formData.desc);
    data.append('detail', formData.detail);
    data.append('highlights', formData.highlights);
    data.append('image', formData.image); // Append the image

    try {
      const response = await axios.post('http://localhost:5000/admin/addproduct', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product added successfully:', response.data);
      setFormData({
        id: '',
        name: '',
        price: '',
        desc: '',
        detail: '',
        highlights: '',
        image: null,
      });
      document.getElementById('image').value = null;
      setSuccess(true);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
      <form onSubmit={handleSubmit}>
        {/* ID Field */}
        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-black rounded-md"
          />
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-black rounded-md"
          />
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label htmlFor="desc" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="desc"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 p-4 w-full border border-black rounded-md"
          />
        </div>

        {/* Details Field */}
        <div className="mb-4">
          <label htmlFor="detail" className="block text-sm font-medium text-gray-700">
            Details
          </label>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 p-4 w-full border border-black rounded-md"
          />
        </div>

        {/* Highlights Field */}
        <div className="mb-4">
          <label htmlFor="highlights" className="block text-sm font-medium text-gray-700">
            Highlights
          </label>
          <textarea
            id="highlights"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            required
            rows="4"
            className="mt-1 p-4 w-full border border-black rounded-md"
          />
        </div>

        {/* Image Upload Field */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            required
            className="mt-1 p-2 w-full border border-black rounded-md"
          />
        </div>

        {/* Price Field */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border border-black rounded-md"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-around">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Product
          </button>
          <button 
            type="button" 
            className="rounded-md bg-indigo-600 px-4 py-2 text-md font-bold leading-8 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-half"
            onClick={() => navigate('/getproduct')} // Navigate to product list
          >
            Product List
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0  flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900">Product added successfully!</h3>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;

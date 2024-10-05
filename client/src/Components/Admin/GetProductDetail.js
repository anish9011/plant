import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GetProduct from './GetProduct';
import { useUser } from '../Context/UserContext';

export default function GetProductDetail() {
  const { id } = useParams(); // Get product ID from URL params
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingQuantity, setExistingQuantity] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getproductdetail/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Loading...</p>;
  }

  const handleAddToBag = async () => {
    const itemDetails = {
      email: user.email,
      id: product.id.trim(),
      imageSrc: product.image,
      name: product.name,
      price: product.price,
      quantity: quantity,
    };

  console.log(`[${id}]`);
    const formData = new FormData();
  
    try {
      if (typeof product.image === 'string') {
        const response = await fetch(product.image);
        const blob = await response.blob();
        const file = new File([blob], 'product-image.jpg', { type: blob.type });
        formData.append("image", file);
      } else {
        formData.append("image", product.image);
      }
  
      formData.append("email", itemDetails.email);
      formData.append("id", itemDetails.id);
      formData.append("name", itemDetails.name);
      formData.append("price", itemDetails.price);
      formData.append("quantity", itemDetails.quantity);
      console.log(`[${itemDetails.id}]`);
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      const response = await axios.post("http://localhost:5000/admin/addtobag", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) { // 201 indicates creation success
        console.log("Product added successfully");
        
        alert("Product added to bag successfully");
        navigate(`/addtobag`);
      } else if (response.status === 200) {
        const result = response.data;
        if (result.message === "Item already in cart") {
          setExistingQuantity(result.currentQuantity);
          setIsModalOpen(true);
        } else {
          console.log("Unexpected response:", result.message);
          alert("Unexpected response: " + result.message);
        }
      } else {
        console.error("Failed to add item to bag:", response.data.message);
        alert("Failed to add item to bag: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding item to bag:", error);
      alert("An error occurred while handling the item: " + (error.response?.data.message || error.message));
    }
  };
  

  const handleConfirmIncrease = async () => {
    const updatedItemDetails = {
        email: user.email,
        quantity: existingQuantity + quantity,
    };

    try {
        const updateResponse = await fetch(`http://localhost:5000/admin/updatequantity/${product.id.trim()}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedItemDetails),
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json(); // Parse the error response
            throw new Error(errorData.message || "Failed to update item quantity");
        }

        const updateResult = await updateResponse.json();
        console.log(updateResult.message);
        navigate(`/addtobag`);
    } catch (error) {
        console.error("Error updating item quantity:", error.message); // Correctly log the error message
        alert("An error occurred while updating the item quantity: " + error.message);
    } finally {
        setIsModalOpen(false);
    }
};



  return (
    <>
      <div className="bg-whitesmoke">
        <div className="pt-2 sm:pt-8 lg:pt-2 mt-3 md:mt-7">
          <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative w-full sm:w-3/4 lg:w-1/2 mx-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-md cursor-pointer"
              />
            </div>
          </div>
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:py-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
              <p className="text-2xl font-medium text-gray-900 mt-4">₹{product.price}</p>
            </div>
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="mt-10">
                <h3 className="text-xl font-medium text-gray-900">Highlights</h3>
                <div className="mt-4">
                  <ul role="list" className="list-disc text-lg space-y-2 pl-4 text-gray-900">
                    {product.highlights}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-xl font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6 text-lg text-gray-600">
                  {product.detail || <p>No details available</p>}
                </div>
              </div>
              <div className="mt-10 flex items-center space-x-4">
                <button
                  onClick={handleAddToBag}
                  className="flex-1 rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add to bag
                </button>
                <div className="flex h-12 items-center border border-transparent text-white bg-indigo-600 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-white hover:text-black hover:bg-white font-bold"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 text-center border-0 focus:ring-0 bg-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-white hover:text-black hover:bg-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2 lg:w-1/3">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product already in cart</h2>
            <p className="mb-6">Do you want to increase the quantity of this product?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmIncrease}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <GetProduct/>
    </>
  );
}

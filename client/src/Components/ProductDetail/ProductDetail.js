import React, { useState,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../Context/ProductsContext';
import ProductList from '../Home/ProductList';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useProducts();
  const product = products.find((p) => p.id === parseInt(id, 10));
  const [quantity, setQuantity] = useState(1); // State for quantity

  if (!product) {
    return <ProductList/>;
  }



  const handleAddToBag = async () => {
    const itemDetails = {
      id: product.id,
      imageSrc: product.imageSrc,
      name: product.name,
      price: product.price,
      quantity: quantity
    };
  
    try {
      const response = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(itemDetails)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log(result.message);
        navigate(`/bag/${product.id}`);
      } else {
        console.error(result.message);
        alert("Failed to add item to bag: " + result.message);
      }
    } catch (error) {
      console.error("Error adding item to bag:", error);
      alert("An error occurred while adding the item to the bag.");
    }
  };

  return (
    <>
      <div className="bg-white">
        <div className="pt-2 sm:pt-8 lg:pt-2">
          {/* Image gallery */}
          <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative w-full sm:w-3/4 lg:w-1/2 mx-auto">
              <img
                alt={product.alt}
                src={product.imageSrc}
                className="object-cover object-center w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:py-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
              <p className="text-2xl font-medium text-gray-900 mt-4">{product.price}</p>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">Highlights</h3>
                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm text-gray-900">
                    {product.highlights && product.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6 text-sm text-gray-600">
                  {product.details}
                </div>
              </div>
              <div className="mt-10 flex items-center space-x-4">
                {/* Quantity Selector */}
                <button
                  onClick={handleAddToBag}
                  className="flex-1 rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Add to bag
                </button>
                <div className="flex items-center border text-white bg-indigo-600 rounded-md">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} // Decrease quantity
                    className="px-3 py-1 text-white hover:text-black hover:bg-white font-bold"

                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} // Handle input change
                    className="w-16 text-center border-0 focus:ring-0 bg-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} // Increase quantity
                    className="px-3 py-1 text-white hover:text-black hover:bg-white font-bold"

                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-4 text-base text-gray-900">{product.description}</p>
              </div>

              <div className="mt-10">
                <h2 className="text-lg font-medium text-gray-900">Details</h2>
                <div className="mt-4 space-y-6 text-sm text-gray-600">
                  {product.details}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductList />
    </>
  );
}

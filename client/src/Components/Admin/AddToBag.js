import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { usePrice } from '../Context/PriceContext';

export default function Bag() {
  const [open, setOpen] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();
  const { updatePrice } = usePrice();
  const navigate = useNavigate();

  // Fetch cart items when the component mounts
  useEffect(() => {
    if (user && user.email) {
      fetchCartItems();
    }
  }, [user]);

  // Calculate subtotal and update context price
  useEffect(() => {
    const subtotal = calculateSubtotal();
    updatePrice(subtotal);
  }, [cartItems, updatePrice]);

  const fetchCartItems = async () => {
    if (!user || !user.email) {
      console.error('User email is not available');
      return; // Exit if email is not available
    }

    try {
      const response = await fetch(`http://localhost:5000/admin/addtobag?email=${encodeURIComponent(user.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.message}`);
      }

      const data = await response.json();
      console.log('Fetched Cart Items:', data);
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error.message || error);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      if (!user || !user.email) {
        console.error('User email is not available');
        return;
      }

      console.log('Removing item with ID:', itemId, 'for user:', user.email);

      const response = await fetch(`http://localhost:5000/admin/deletecartitem/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }) // Ensure email is included
      });

      if (response.ok) {
        console.log('Item removed from cart successfully');
        fetchCartItems(); 
      } else {
        const errorData = await response.json();
        console.error('Failed to remove item from cart:', errorData.message);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping Cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={item.name}
                                src={item.image}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4 flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <a href="#">{item.name}</a>
                                </h3>
                                <p className="ml-4">&#x20B9;{item.price}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.desc || item.description}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <p className="text-gray-500">Qty {item.quantity || 0}</p>
                              <div className="flex">
                                <button
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={() => removeItemFromCart(item.id)} // Ensure item.id is correct
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>&#x20B9;{calculateSubtotal()}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <a
                      href="#"
                      className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={handleClose}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

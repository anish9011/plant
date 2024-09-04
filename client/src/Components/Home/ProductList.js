import React, { useEffect } from 'react';
import { useProducts } from '../Context/ProductsContext';
import { Link, useLocation } from 'react-router-dom';

export default function ProductList() {
  const products = useProducts();
  const location = useLocation(); // Get the current location



  useEffect(() => {
    // Smoothly scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location]); // Dependency array includes `location` to trigger the effect on route change

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto pt-2 sm:pt-8 lg:pt-2 max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <Link key={product.id} to={`/productdetail/${product.id}`} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">&#8377;{product.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

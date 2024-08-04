import React, { createContext, useContext } from 'react';


    const products = [
      {
        id: 1,
        name: 'Earthen Bottle',
        href: '#',
        price: '48',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        description: 'A handcrafted bottle with a unique earthy texture, ideal for both display and use.',
        highlights: [
          'Porcelain material with a natural clay texture',
          'Cork stopper for easy pouring',
          'Unique handcrafted design'
        ],
        details: 'This tall bottle features a natural clay texture, with a sleek cork stopper that makes it perfect for both decorative and practical use. Ideal for enhancing any room with a touch of elegance and natural beauty.'
      },
      {
        id: 2,
        name: 'Nomad Tumbler',
        href: '#',
        price: '350',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        description: 'A rugged and durable tumbler designed for on-the-go hydration.',
        highlights: [
          'Insulated to keep drinks hot or cold',
          'Flared screw lid for easy access',
          'Olive drab green color with a sleek finish'
        ],
        details: 'This tumbler is perfect for those who need a reliable drinkware solution on the go. Its insulation keeps beverages at the desired temperature, while the flared screw lid provides easy access. The olive drab green color adds a touch of rugged style.'
      },
      {
        id: 3,
        name: 'Focus Paper Refill',
        href: '#',
        price: '89',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        description: 'Refill pack for productivity paper cards, designed to keep you on track with your goals.',
        highlights: [
          'Includes multiple paper refills',
          'Perfect for productivity and organization',
          'High-quality paper for smooth writing'
        ],
        details: 'These paper refills are designed to fit perfectly into your productivity cards. They are made from high-quality paper to ensure smooth writing and durability. Keep your tasks organized and your goals on track with this essential refill pack.'
      },
      {
        id: 4,
        name: 'Machined Mechanical Pencil',
        href: '#',
        price: '35',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        description: 'A precision-engineered mechanical pencil with a sleek machined steel body.',
        highlights: [
          'Machined steel construction for durability',
          'Brass tip and top for a refined look',
          'Precision engineering for a smooth writing experience'
        ],
        details: 'This mechanical pencil is crafted from machined steel, providing durability and a refined appearance. The brass tip and top add a touch of elegance. Ideal for those who appreciate a high-quality writing instrument.'
      },
      {
        id: 5,
        name: 'Minimalist Backpack',
        href: '#',
        price: '120',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-05.jpg',
        imageAlt: 'Minimalist backpack in black with multiple compartments and a sleek design.',
        description: 'A sleek and stylish backpack designed for minimalist living.',
        highlights: [
          'Multiple compartments for organization',
          'Sleek and minimalist design',
          'Durable construction for everyday use'
        ],
        details: 'This minimalist backpack is perfect for those who value style and functionality. With multiple compartments, it offers ample organization options. The sleek design and durable construction make it a versatile choice for daily use.'
      },
      {
        id: 6,
        name: 'Leather Journal',
        href: '#',
        price: '45',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-06.jpg',
        imageAlt: 'Handcrafted leather journal with a rugged look.',
        description: 'A beautifully handcrafted leather journal perfect for note-taking and journaling.',
        highlights: [
          'Handcrafted leather for a rugged look',
          'Perfect for note-taking and journaling',
          'High-quality paper for smooth writing'
        ],
        details: 'This leather journal combines functionality with elegance. Handcrafted from high-quality leather, it offers a rugged yet sophisticated look. Ideal for journaling or note-taking, its smooth paper enhances the writing experience.'
      },
      {
        id: 7,
        name: 'Vintage Camera',
        href: '#',
        price: '150',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-07.jpg',
        imageAlt: 'Classic vintage camera with a leather strap.',
        description: 'A classic vintage camera that combines old-world charm with modern functionality.',
        highlights: [
          'Classic design with a leather strap',
          'High-quality optics for clear photos',
          'A timeless addition to any photography collection'
        ],
        details: 'This vintage camera offers a blend of classic design and modern functionality. The leather strap adds a touch of old-world charm, while the high-quality optics ensure clear and vivid photographs. A must-have for photography enthusiasts.'
      },
      {
        id: 8,
        name: 'Travel Mug',
        href: '#',
        price: '25',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-08.jpg',
        imageAlt: 'Stainless steel travel mug with a lid.',
        description: 'A durable stainless steel travel mug designed to keep your beverages hot or cold.',
        highlights: [
          'Stainless steel construction for durability',
          'Keeps beverages hot or cold',
          'Lid for spill-proof travel'
        ],
        details: 'This travel mug is made from durable stainless steel, making it perfect for keeping your drinks at the right temperature. The lid ensures a spill-proof experience, making it an ideal choice for busy commutes or outdoor adventures.'
      },
    
    ];
    
  
  // More products...

// Create the context
const ProductsContext = createContext([]);

// Create a provider component
export const ProductsProvider = ({ children }) => {
  return (
    <ProductsContext.Provider value={products}>
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to use the ProductsContext
export const useProducts = () => {
  return useContext(ProductsContext);
};

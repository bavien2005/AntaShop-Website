import React from 'react';
import { useCart } from '../contexts';

// Component để test cart functionality
const TestCart = () => {
  const { addToCart, totalItems } = useCart();

  const testProducts = [
    { id: 1, name: 'ANTA KT8', price: 2490000, image: 'https://via.placeholder.com/200x200?text=ANTA+KT8' },
    { id: 2, name: 'ANTA KT7', price: 1990000, image: 'https://via.placeholder.com/200x200?text=ANTA+KT7' },
    { id: 3, name: 'ANTA GH4', price: 1490000, image: 'https://via.placeholder.com/200x200?text=ANTA+GH4' },
  ];

  return (
    <div style={{ padding: '20px', background: '#f8f8f8', margin: '20px', borderRadius: '8px' }}>
      <h3>Test Cart Functionality</h3>
      <p>Cart items: {totalItems}</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {testProducts.map(product => (
          <button
            key={product.id}
            onClick={() => addToCart(product)}
            style={{
              padding: '10px 15px',
              background: '#E53935',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add {product.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestCart;

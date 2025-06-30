import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Checkout from './components/Checkout';

function TestCheckout() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleOrderSuccess = (order) => {
    console.log('Order success:', order);
    setIsCheckoutOpen(false);
  };

  return (
    <CartProvider>
      <div className="test-page">
        <h1>Test Checkout Component</h1>
        <button 
          onClick={() => setIsCheckoutOpen(true)}
          style={{ padding: '10px 20px', fontSize: '16px', margin: '20px' }}
        >
          Open Checkout
        </button>

        <Checkout 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      </div>
    </CartProvider>
  );
}

export default TestCheckout;
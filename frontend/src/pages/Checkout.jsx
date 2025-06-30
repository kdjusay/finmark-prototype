import React, { useState } from 'react';
import '../styles/Checkout.css';

const initialProducts = [
  { id: 1, name: 'Product 1', price: 5, quantity: 1 },
  { id: 2, name: 'Product 2', price: 5, quantity: 1 },
  { id: 3, name: 'Product 3', price: 5, quantity: 1 },
];

const Checkout = () => {
  const [products, setProducts] = useState(initialProducts);

  const handleQuantityChange = (id, delta) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleCheckout = () => {
    alert('Checkout completed!');
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h2>🧾 Order Summary</h2>
        <button className="logout-btn">Logout</button>
      </div>

      <div className="order-summary">
        <div className="product-list">
          {products.map(product => (
            <div className="product-item" key={product.id}>
              <span>{product.name}</span>
              <span>₱{product.price.toFixed(2)}</span>
              <div className="quantity-control">
                <button onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                <span>{product.quantity}</span>
                <button onClick={() => handleQuantityChange(product.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="total">Total: ₱{total.toFixed(2)}</div>
        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Checkout;

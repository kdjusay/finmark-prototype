import React, { useState } from 'react';
import '../styles/ViewProducts.css'; // Styling
import thermalPrinterImg from '../assets/thermalprinter.jpg';
import posPaperRollImg from '../assets/pospaperroll.jpg';
import barcodeScannerImg from '../assets/barcodescanner.jpg';

const mockProducts = [
  { id: 1, name: 'Thermal Printer', price: 2499, image: thermalPrinterImg },
  { id: 2, name: 'POS Paper Roll', price: 199, image: posPaperRollImg },
  { id: 3, name: 'Barcode Scanner', price: 1499, image: barcodeScannerImg },
];

const ViewProducts = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderList, setOrderList] = useState([]);

  const handleAddToOrder = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setOrderList([...orderList, product]);
  };

  const handleCancelOrder = () => {
    setOrderList(orderList.filter(p => p.id !== selectedProduct.id));
    setShowModal(false);
    setSelectedProduct(null);
  };

  const filtered = mockProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="products-page">
      <div className="header">
        <div className="header-title">🔍 View / Search Products</div>
        <button className="logout-btn">Logout</button>
      </div>

      <input
        className="search-bar"
        type="text"
        placeholder="Search for a product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="product-grid">
        {filtered.length > 0 ? filtered.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-img" />
            <div className="product-name">{product.name}</div>
            <div className="product-price">₱{product.price.toLocaleString()}</div>
            <button className="add-btn" onClick={() => handleAddToOrder(product)}>Add to Order</button>
          </div>
        )) : <p className="no-results">No matching products found.</p>}
      </div>

      {showModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p><strong>{selectedProduct.name}</strong> has been added to your order.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancelOrder}>Cancel Order</button>
              <button className="ok-btn" onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;

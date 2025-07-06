import React, { useState } from 'react';
import '../styles/Feedback.css';

const Feedback = () => {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback!');
    setType('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h2>💬 Submit Feedback</h2>
      </div>

      <div className="feedback-container">
        <form onSubmit={handleSubmit} className="feedback-form">
          <label>Feedback Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Select Type</option>
            <option value="Product">Product</option>
            <option value="Service">Service</option>
            <option value="Delivery">Delivery</option>
            <option value="Other">Other</option>
          </select>

          <label>Brief Summary:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Detailed description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            placeholder="Enter more details..."
            required
          ></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

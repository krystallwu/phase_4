import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function AddAirport() {
  const [formData, setFormData] = useState({
    airport_id: '',
    name: '',
    city: '',
    state: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5173/add-airport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message || 'Airport added successfully!');
    } catch (error) {
      alert('Failed to add airport.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Airport</h2>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/_/g, ' ')}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        ))}
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import '../Style/FormStyle.css'; 

export default function AddAirplane() {
  const [formData, setFormData] = useState({
    tail_num: '',
    airline_id: '',
    plane_type: '',
    seat_capacity: '',
    speed: '',
    model: '',
    maintained: '',
    neo: '',
    location_id: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5173/add_airplane', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Airplane added successfully!');
    } catch (error) {
      alert('Failed to add airplane. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Airplane</h2>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="form-input"
              placeholder={key.replace(/_/g, ' ')}
            />
          </div>
        ))}
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

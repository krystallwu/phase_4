import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function FlightLanding() {
  const [formData, setFormData] = useState({
    flight_id: '',
    airport_id: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/land_flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Flight landed!');
    } catch (err) {
      alert('Failed to land flight.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Land Flight</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="flight_id">Flight ID</label>
          <input
            type="text"
            name="flight_id"
            id="flight_id"
            value={formData.flight_id}
            onChange={handleChange}
            className="form-input"
            placeholder="Flight ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="airport_id">Airport ID</label>
          <input
            type="text"
            name="airport_id"
            id="airport_id"
            value={formData.airport_id}
            onChange={handleChange}
            className="form-input"
            placeholder="Airport ID"
          />
        </div>
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

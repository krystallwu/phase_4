import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function OfferFlight() {
  const [formData, setFormData] = useState({
    flight_id: '',
    airline_id: '',
    airplane_id: '',
    from_airport_id: '',
    to_airport_id: '',
    departure_time: '',
    arrival_time: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/offer_flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Flight offered!');
    } catch (err) {
      alert('Failed to offer flight.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Offer Flight</h2>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/_/g, ' ')}</label>
            <input
              type="text"
              name={key}
              id={key}
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

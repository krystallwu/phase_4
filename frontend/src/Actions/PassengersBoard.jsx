import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function PassengersBoard() {
  const [formData, setFormData] = useState({
    ssn: '',
    flight_id: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/board_passenger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Passenger boarded!');
    } catch (err) {
      alert('Failed to board passenger.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Board Passenger</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="ssn">Passenger SSN</label>
          <input
            type="text"
            name="ssn"
            id="ssn"
            value={formData.ssn}
            onChange={handleChange}
            className="form-input"
            placeholder="SSN"
          />
        </div>
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
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

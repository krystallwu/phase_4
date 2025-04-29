import React, { useState } from 'react';
import '../src/Style/FormStyle.css';

export default function RetireFlight() {
  const [flightID, setFlightID] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/retire_flight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip_flightID: flightID })
    });
    const { success, message } = await res.json();
    alert(message || (success ? '✅ Flight retired' : '❌ Operation failed'));
    setFlightID('');
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Retire Flight</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="ip_flightID">ip_flightID</label>
          <input
            id="ip_flightID"
            value={flightID}
            onChange={e => setFlightID(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

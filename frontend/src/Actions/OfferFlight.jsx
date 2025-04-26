import React, { useState, useEffect } from 'react';
import '../Style/FormStyle.css';

export default function OfferFlight() {
  const [formData, setFormData] = useState({
    ip_flightID: '',
    ip_routeID: '',
    ip_support_airline: '',
    ip_support_tail: '',
    ip_progress: 0,
    ip_next_time: '',
    ip_cost: 0
  });
  const [flights, setFlights] = useState([]);

  // after any change, refresh the flight list
  const fetchFlights = () => {
    fetch('http://localhost:5000/api/flights')   // you’ll need to add this endpoint in Flask
      .then(r => r.json())
      .then(setFlights)
      .catch(console.error);
  };

  useEffect(fetchFlights, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({
      ...fd,
      [name]: name === 'ip_progress' || name === 'ip_cost'
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/offer_flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      alert('Offer flight called!');
      fetchFlights();
    } catch (err) {
      alert('Error offering flight');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Offer Flight</h2>

      <form onSubmit={handleSubmit} className="form">
        {Object.entries(formData).map(([key, val]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{key.replace(/^ip_/, '').replace(/_/g,' ')}</label>
            <input
              id={key}
              name={key}
              value={val}
              onChange={handleChange}
              className="form-input"
              placeholder={key}
            />
          </div>
        ))}
        <button type="submit" className="form-submit">Submit</button>
      </form>

      <h3>All Flights</h3>
      <table className="form-table">
        <thead>
          <tr>
            {['flightID','routeID','support_airline','support_tail','progress','next_time','cost']
              .map(col => <th key={col}>{col.replace(/_/g,' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {flights.map((f,i) => (
            <tr key={i}>
              {['flightID','routeID','support_airline','support_tail','progress','next_time','cost']
                .map(col => <td key={col}>{f[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import '../Style/FormStyle.css';

export default function AddAirplane() {
  const [formData, setFormData] = useState({
    airline_id:    '',
    tail_num:      '',
    seat_capacity: '',
    speed:         '',
    location_id:   '',
    plane_type:    '',
    maintained:    'false',
    model:         '',
    neo:           'false',
  });

  const [airplanes, setAirplanes] = useState([]);

  // load all airplanes on mount (and after each add)
  const fetchAirplanes = () => {
    fetch('http://127.0.0.1:5000/api/airplanes')
      .then(res => res.json())
      .then(setAirplanes)
      .catch(console.error);
  };

  useEffect(fetchAirplanes, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      ip_airlineID:     formData.airline_id,
      ip_tail_num:      formData.tail_num,
      ip_seat_capacity: Number(formData.seat_capacity),
      ip_speed:         Number(formData.speed),
      ip_locationID:    formData.location_id,
      ip_plane_type:    formData.plane_type || null,
      ip_maintenanced:  formData.maintained === 'true',
      ip_model:         formData.model || null,
      ip_neo:           formData.neo === 'true'
    };

    try {
      const res = await fetch('http://localhost:5000/api/add_airplane', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const { success, message } = await res.json();
      alert(message || (success ? '✅ Added' : '❌ No change'));
      fetchAirplanes();
    } catch (err) {
      console.error(err);
      alert('Failed to add airplane.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Airplane</h2>
      <form onSubmit={handleSubmit} className="form">
        {[
          ['airline_id',    'Airline ID'],
          ['tail_num',      'Tail Number'],
          ['seat_capacity','Seat Capacity'],
          ['speed',        'Speed'],
          ['location_id',  'Location ID'],
          ['plane_type',   'Plane Type (Boeing/Airbus?)'],
        ].map(([name,label]) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="form-group">
          <label>Maintenanced?</label>
          <select
            name="maintained"
            value={formData.maintained}
            onChange={handleChange}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="form-group">
          <label>Model (Boeing only)</label>
          <input
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>NEO? (Airbus only)</label>
          <select
            name="neo"
            value={formData.neo}
            onChange={handleChange}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <button type="submit" className="form-submit">
          Submit
        </button>
      </form>

      <h3>All Airplanes</h3>
      <table className="form-table">
        <thead>
          <tr>
            {[
              'airlineID','tail_num','seat_capacity','speed',
              'locationID','plane_type','maintenanced','model','neo'
            ].map(col => (
              <th key={col}>{col.replace(/_/g,' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {airplanes.map((ap, i) => (
            <tr key={i}>
              {[
                'airlineID','tail_num','seat_capacity','speed',
                'locationID','plane_type','maintenanced','model','neo'
              ].map(col => (
                <td key={col}>{String(ap[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

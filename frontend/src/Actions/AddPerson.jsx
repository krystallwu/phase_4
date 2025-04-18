import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function AddPerson() {
  const [formData, setFormData] = useState({
    ssn: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/add_person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'Person added!');
    } catch (err) {
      alert('Failed to add person.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Person</h2>
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

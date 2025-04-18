import React, { useState } from 'react';
import '../Style/FormStyle.css';

export default function LicenseUpdate() {
  const [formData, setFormData] = useState({
    ssn: '',
    license: '',
    action: '' // "grant" or "revoke"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/grant_or_revoke_license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      alert(result.message || 'License updated!');
    } catch (err) {
      alert('Failed to update license.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Grant or Revoke License</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="ssn">Pilot SSN</label>
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
          <label htmlFor="license">License</label>
          <input
            type="text"
            name="license"
            id="license"
            value={formData.license}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., A320, B737"
          />
        </div>
        <div className="form-group">
          <label htmlFor="action">Action</label>
          <select
            name="action"
            id="action"
            value={formData.action}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">-- Choose --</option>
            <option value="grant">Grant</option>
            <option value="revoke">Revoke</option>
          </select>
        </div>
        <button type="submit" className="form-submit">Submit</button>
      </form>
    </div>
  );
}

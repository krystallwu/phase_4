import React, { useState, useEffect } from 'react';
import '../Style/FormStyle.css';

export default function AddPerson() {
  console.log("🔎 AddPerson mounted");         // ← sanity check

  const [formData, setFormData] = useState({
    ip_personID:   '',
    ip_first_name: '',
    ip_last_name:  '',
    ip_locationID: '',
    ip_taxID:      '',
    ip_experience: '',
    ip_miles:      '',
    ip_funds:      ''
  });
  const [people, setPeople] = useState([]);

  const fetchPeople = () => {
    console.log("🔎 fetching people…");
    fetch('http://localhost:5000/api/people')
      .then(r => r.json())
      .then(data => {
        console.log("🔎 people data:", data);
        setPeople(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(fetchPeople, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => {
        if (v === '') return [k, null];
        if (['ip_experience','ip_miles','ip_funds'].includes(k))
          return [k, Number(v)];
        return [k, v];
      })
    );
    console.log("🔎 sending payload:", payload);
    const res = await fetch('http://localhost:5000/api/add_person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    console.log("🔎 response:", body);
    alert(body.message || (body.success ? '✅ Person added' : '❌ No change'));
    setFormData({
      ip_personID:   '',
      ip_first_name: '',
      ip_last_name:  '',
      ip_locationID: '',
      ip_taxID:      '',
      ip_experience: '',
      ip_miles:      '',
      ip_funds:      ''
    });
    fetchPeople();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Person</h2>
      <form onSubmit={handleSubmit} className="form">
        {[
          ['ip_personID',   'Person ID'],
          ['ip_first_name', 'First Name'],
          ['ip_last_name',  'Last Name'],
          ['ip_locationID', 'Location ID'],
          ['ip_taxID',      'Tax ID (pilot only)'],
          ['ip_experience', 'Experience (pilot only)'],
          ['ip_miles',      'Miles (passenger only)'],
          ['ip_funds',      'Funds (passenger only)']
        ].map(([key, label]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              value={formData[key] || ''}
              onChange={handleChange}
              className="form-input"
              placeholder={label}
            />
          </div>
        ))}
        <button type="submit" className="form-submit">Submit</button>
      </form>

      <h3>All People</h3>
      <table className="form-table">
        <thead>
          <tr>
            {['personID','first_name','last_name','locationID','role_data']
              .map(c => <th key={c}>{c.replace(/_/g, ' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map((p, i) => (
            <tr key={i}>
              {['personID','first_name','last_name','locationID','role_data']
                .map(c => <td key={c}>{p[c]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

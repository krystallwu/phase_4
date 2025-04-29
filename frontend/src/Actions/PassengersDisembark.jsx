import React, { useState, useEffect } from 'react';
import '../Style/FormStyle.css';

export default function PassengersDisembark() {
  const [flightID, setFlightID] = useState('');
  const [people, setPeople] = useState([]);

  // load people on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/people')
      .then(r => r.json())
      .then(setPeople)
      .catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // send ip_flightID to match your Flask validation
    const res = await fetch('http://localhost:5000/api/passengers_disembark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip_flightID: flightID })
    });
    const { success, message } = await res.json();
    alert(message || (success ? '✅ Disembark attempted' : '❌ No change'));

    // clear & reload
    setFlightID('');
    fetch('http://localhost:5000/api/people')
      .then(r => r.json())
      .then(setPeople)
      .catch(console.error);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Passengers Disembark</h2>
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

      <h3>All People</h3>
      <table className="form-table">
        <thead>
          <tr>
            {['personID','first_name','last_name','locationID','role_data']
              .map(c => <th key={c}>{c.replace(/_/g,' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {people.map((p,i)=>(
            <tr key={i}>
              {['personID','first_name','last_name','locationID','role_data']
                .map(c=> <td key={c}>{p[c]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

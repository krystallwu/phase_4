import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function FlightsOnGround() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/flights_on_the_ground')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(() => alert('Failed to load data.'));
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-title">Flights On The Ground</h2>
      {data.length === 0 ? <p>No flights currently on the ground.</p> : (
        <table className="form-table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key.replace(/_/g, ' ')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

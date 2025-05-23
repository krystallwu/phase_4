import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function RouteSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/route_summary')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);  // ← see it in the browser console
        setData(data);
      })
      .catch(() => alert('Failed to load data.'));
  }, []);

  const columnOrder = [
    'airport_sequence',
    'flight_list',
    'leg_sequence',
    'num_flights',
    'num_legs',
    'route',
    'route_length'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Route Summary</h2>
      {data.length === 0 ? <p>No flights currently in the air.</p> : (
        <table className="form-table">
        <thead>
          <tr>
            {columnOrder.map(key => (
              <th key={key}>{key.replace(/_/g, ' ')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columnOrder.map((key, j) => (
                <td key={j}>{row[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
  );
}

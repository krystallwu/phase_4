import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function FlightsOnGround() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/flights_on_the_ground')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);  // ← see it in the browser console
        setData(data);
      })
      .catch(() => alert('Failed to load data.'));
  }, []);

  const columnOrder = [
    'airplane_list',
    'departing_from',
    'earliest_arrival',
    'flight_list',
    'latest_arrival',
    'num_flights'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Flights On The Ground</h2>
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

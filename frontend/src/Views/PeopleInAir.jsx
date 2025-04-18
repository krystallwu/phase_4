import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function PeopleInAir() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/people_in_the_air')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(() => alert('Failed to load data.'));
  }, []);

  return (
    <div className="form-container">
      <h2 className="form-title">People In The Air</h2>
      {data.length === 0 ? <p>No people currently in the air.</p> : (
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

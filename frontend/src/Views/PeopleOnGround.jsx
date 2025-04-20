import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function PeopleOnGround() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/people_on_the_ground')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);  // ← see it in the browser console
        setData(data);
      })
      .catch(() => alert('Failed to load data.'));
  }, []);
  
  
  {
  const columnOrder = [
    'airport',
    'airport_name',
    'city',
    'country',
    'departing_from',
    'joint_pilots_passengers',
    'num_passengers',
    'num_pilots',
    'person_list',
    'state'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">People On the Ground</h2>
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
}

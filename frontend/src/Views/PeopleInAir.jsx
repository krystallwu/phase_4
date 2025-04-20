import React, { useEffect, useState } from 'react';
import '../Style/FormStyle.css';

export default function PeopleInAir() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/people_in_the_air')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);  // ← see it in the browser console
        setData(data);
      })
      .catch(() => alert('Failed to load data.'));
  }, []);
  

  const columnOrder = [
    'airplane_list',
    'arriving_at',
    'departing_from',
    'earliest_arrival',
    'flight_list',
    'joint_pilots_passengers',
    'latest_arrival',
    'num_airplanes',
    'num_passengers',
    'num_pilots',
    'person_list'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">People In The Air</h2>
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

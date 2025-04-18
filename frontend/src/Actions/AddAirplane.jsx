import React, { useState } from 'react';

export default function AddAirplaneForm() {
  const [formData, setFormData] = useState({
    tail_num: '',
    airline_id: '',
    plane_type: '',
    seat_capacity: '',
    speed: '',
    model: '',
    maintained: '',
    neo: '',
    location_id: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/add-airplane', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    alert(result.status);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="tail_num" placeholder="Tail Num" onChange={handleChange} />
      <input name="airline_id" placeholder="Airline ID" onChange={handleChange} />
      <input name="plane_type" placeholder="Plane Type" onChange={handleChange} />
      <input name="seat_capacity" placeholder="Seat Capacity" onChange={handleChange} />
      <input name="speed" placeholder="Speed" onChange={handleChange} />
      <input name="model" placeholder="Model" onChange={handleChange} />
      <input name="maintained" placeholder="Maintained" onChange={handleChange} />
      <input name="neo" placeholder="Neo" onChange={handleChange} />
      <input name="location_id" placeholder="Location ID" onChange={handleChange} />
      <button type="submit">Add Airplane</button>
    </form>
  );
}

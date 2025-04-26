import React, { useState, useEffect } from 'react'
import '../Style/FormStyle.css'

export default function FlightTakeoff() {
  const [flightID, setFlightID] = useState('')
  const [flights, setFlights] = useState([])

  // 1) fetch all flights
  const fetchFlights = () => {
    fetch('http://localhost:5000/api/flights')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setFlights)
      .catch(console.error)
  }

  useEffect(fetchFlights, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!flightID.trim()) {
      alert('Flight ID is required')
      return
    }

    // 2) call the takeoff endpoint
    const res = await fetch('http://localhost:5000/api/flight_takeoff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flight_id: flightID })
    })
    const data = await res.json()
    const msg = data.error || data.message || (data.success 
      ? '✅ Flight took off' 
      : '❌ Could not take off')
    alert(msg)

    // 3) clear + refresh
    setFlightID('')
    fetchFlights()
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Take Off Flight</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="flight_id">Flight ID</label>
          <input
            id="flight_id"
            name="flight_id"
            value={flightID}
            onChange={e => setFlightID(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-submit">
          Submit
        </button>
      </form>

      <h3>All Flights</h3>
      {flights.length === 0 ? (
        <p>No flights available.</p>
      ) : (
        <table className="form-table">
          <thead>
            <tr>
              {[
                'flightID',
                'routeID',
                'support_airline',
                'support_tail',
                'progress',
                'next_time',
                'cost'
              ].map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flights.map((f, i) => (
              <tr key={i}>
                {[
                  'flightID',
                  'routeID',
                  'support_airline',
                  'support_tail',
                  'progress',
                  'next_time',
                  'cost'
                ].map(col => (
                  <td key={col}>{f[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

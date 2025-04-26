import React, { useState, useEffect } from 'react'
import '../Style/FormStyle.css'

export default function AddAirport() {
  // 1) keep state in the same names as your DB columns
  const [formData, setFormData] = useState({
    airportID:   '',
    airport_name:'',
    city:        '',
    state:       '',
    country:     '',
    locationID:  ''
  })
  const [airports, setAirports] = useState([])

  // 2) load the existing airports once on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/airports')
      .then(r => r.json())
      .then(setAirports)
      .catch(console.error)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // 3) build the payload your SP needs
    const payload = {
      ip_airportID:   formData.airportID,
      ip_airport_name:formData.airport_name,
      ip_city:        formData.city,
      ip_state:       formData.state,
      ip_country:     formData.country,
      ip_locationID:  formData.locationID
    }

    // 4) POST to your Flask endpoint
    const res = await fetch('http://localhost:5000/api/add_airport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const { success, message } = await res.json()
    alert(message || (success ? '✅ Airport added' : '❌ No change'))

    // 5) clear the form & re-load the table
    setFormData({
      airportID:   '',
      airport_name:'',
      city:        '',
      state:       '',
      country:     '',
      locationID:  ''
    })
    const newList = await fetch('http://localhost:5000/api/airports').then(r=>r.json())
    setAirports(newList)
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add Airport</h2>

      <form onSubmit={handleSubmit} className="form">
        {[
          ['airportID',    'Airport Code (3 chars)'],
          ['airport_name','Airport Name'],
          ['city',        'City'],
          ['state',       'State'],
          ['country',     'Country (3 chars)'],
          ['locationID',  'Location ID']
        ].map(([key,label])=>(
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        ))}

        <button type="submit" className="form-submit">
          Submit
        </button>
      </form>

      <h3>All Airports</h3>
      <table className="form-table">
        <thead>
          <tr>
            {['airportID','airport_name','city','state','country','locationID']
              .map(col => <th key={col}>{col.replace(/_/g,' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {airports.map((a,i) => (
            <tr key={i}>
              {['airportID','airport_name','city','state','country','locationID']
                .map(col => <td key={col}>{a[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import '../Style/FormStyle.css'

export default function AssignPilot() {
  const [formData, setFormData] = useState({
    ip_flightID: '',
    ip_personID: ''
  })
  const [assigns, setAssigns] = useState([])

  // Fetch the list of pilot assignments
  const fetchAssigns = () => {
    fetch('http://localhost:5000/api/pilot_assignments')
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(setAssigns)
      .catch(console.error)
  }

  useEffect(() => {
    fetchAssigns()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // Simple client-side check
    if (!formData.ip_flightID || !formData.ip_personID) {
      alert('Both Flight ID and Person ID are required')
      return
    }

    const res = await fetch('http://localhost:5000/api/assign_pilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const { success, message } = await res.json()
    alert(message || (success ? '✅ Pilot assigned' : '❌ Assignment failed'))

    // Clear + refresh
    setFormData({ ip_flightID: '', ip_personID: '' })
    fetchAssigns()
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Assign Pilot</h2>
      <form onSubmit={handleSubmit} className="form">
        {[
          ['ip_flightID', 'Flight ID'],
          ['ip_personID', 'Person ID']
        ].map(([key, label]) => (
          <div className="form-group" key={key}>
            <label htmlFor={key}>{label}</label>
            <input
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="form-input"
              placeholder={label}
            />
          </div>
        ))}
        <button type="submit" className="form-submit">Assign</button>
      </form>

      <h3>Pilot Assignments</h3>
      {assigns.length === 0 ? (
        <p>No pilot assignments yet.</p>
      ) : (
        <table className="form-table">
          <thead>
            <tr>
              <th>flightID</th>
              <th>personID</th>
            </tr>
          </thead>
          <tbody>
            {assigns.map((a, i) => (
              <tr key={i}>
                <td>{a.commanding_flight || '—'}</td>
                <td>{a.personID}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

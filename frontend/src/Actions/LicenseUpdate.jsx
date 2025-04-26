import React, { useState, useEffect } from 'react'
import '../Style/FormStyle.css'

export default function LicenseUpdate() {
  const [formData, setFormData] = useState({
    ip_personID: '',
    ip_license: ''
  })
  const [licenses, setLicenses] = useState([])

  const fetchLicenses = () => {
    fetch('http://localhost:5000/api/pilot_licenses')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(setLicenses)
      .catch(console.error)
  }

  useEffect(() => {
    fetchLicenses()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(fd => ({ ...fd, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // map empty strings to null for the SP
    const payload = {
      ip_personID: formData.ip_personID.trim() || null,
      ip_license: formData.ip_license.trim() || null
    }
    try {
      const res = await fetch(
        'http://localhost:5000/api/grant_or_revoke_pilot_license',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )
      const data = await res.json()
      alert(
        data.message ||
          (data.success ? '✅ License toggled' : '❌ No change')
      )
      // clear form + reload
      setFormData({ ip_personID: '', ip_license: '' })
      fetchLicenses()
    } catch (err) {
      console.error(err)
      alert('Error updating license')
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Grant / Revoke Pilot License</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="ip_personID">Person ID</label>
          <input
            id="ip_personID"
            name="ip_personID"
            value={formData.ip_personID}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ip_license">License</label>
          <input
            id="ip_license"
            name="ip_license"
            value={formData.ip_license}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button type="submit" className="form-submit">
          Update
        </button>
      </form>

      <h3>Current Pilot Licenses</h3>
      {licenses.length === 0 ? (
        <p>No licenses found.</p>
      ) : (
        <table className="form-table">
          <thead>
            <tr>
              <th>Person ID</th>
              <th>License</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((row, idx) => (
              <tr key={idx}>
                <td>{row.personID}</td>
                <td>{row.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

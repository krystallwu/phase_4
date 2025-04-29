import React from 'react';
import '../src/Style/FormStyle.css';

export default function SimulationCycle() {
  const handleClick = async () => {
    const res = await fetch('http://localhost:5000/api/simulation_cycle', {
      method: 'POST'
    });
    const { success, message } = await res.json();
    alert(message || (success ? '✅ Simulation cycle complete' : '❌ Operation failed'));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Simulation Cycle</h2>
      <button onClick={handleClick} className="form-submit">Run Cycle</button>
    </div>
  );
}

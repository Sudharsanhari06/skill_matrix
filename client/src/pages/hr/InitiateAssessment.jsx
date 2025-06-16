import React, { useState } from 'react';
import '../../styles/initiateassessment.css';

const quarters = ['1', '2', '3', '4'];
const currentYear = new Date().getFullYear();
const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

const InitiateAssessment = () => {
  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInitiate = async () => {
    if (!quarter) {
      setMessage('Please select a quarter.');
      return;
    }
  
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3008/assessments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ year, quarter })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(' Assessment cycle initiated successfully!');
      } else {
        setMessage(` ${data.message || 'Failed to initiate assessment.'}`);
      }
    } catch (error) {
      setMessage('Server error while initiating assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="initiate-container">
      <h2 className="initiate-title">Initiate Assessment</h2>
      <p className="initiate-description">Start a new skill assessment</p>

      <div className="form-group">
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {yearOptions.map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Quarter</label>
        <select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
          <option value="">Select Quarter</option>
          {quarters.map((q) => (
            <option key={q} value={q}>{`Q ${q}`}</option>
          ))}
        </select>
      </div>

      <button className="initiate-btn" onClick={handleInitiate} disabled={loading}>
        {loading ? 'Initiating...' : 'Start Assessment Cycle'}
      </button>

      {message && <p className="status-message">{message}</p>}
    </div>
  );
};

export default InitiateAssessment;

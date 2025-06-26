import React, { useState } from 'react';
import '../../styles/initiateassessment.css';
import Swal from 'sweetalert2';
import { initiateAssessment } from '../../services/adminService';
const quarters = ['1', '2', '3', '4'];
const currentYear = new Date().getFullYear();
const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

const InitiateAssessment = () => {
  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState('');
  const [message, setMessage] = useState('');

  const handleInitiate = async () => {
    if (!quarter) {
      setMessage('Please select a quarter.');
      return;
    }
    setMessage('');

    try {
      const payload = {
        year,
        quarter
      }
      const data = await initiateAssessment(payload);
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
          confirmButtonColor: '#3085d6'
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message || 'Internal Server Error',
          confirmButtonColor: '#d33'
        });
      }
    } catch (error) {
      setMessage('Server error while initiating assessment.');
    }
  };

  return (

    <div className="initiate-container">
      <div className='initiate-header'>
        <h2 className="initiate-title">Initiate Assessment</h2>
        <p className="initiate-description">Start a new skill assessment</p>
      </div>

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
            <option key={q} value={q}>{`Q${q}`}</option>
          ))}
        </select>
        {message && <p className="status-message">{message}</p>}

      </div>

      <button className="initiate-btn" onClick={handleInitiate}>
        Initiate
      </button>
    </div>

  );
};

export default InitiateAssessment;

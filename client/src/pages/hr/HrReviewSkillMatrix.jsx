import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/hrreview.css';

const HrReviewSkillMatrix = () => {

  const { assessmentId } = useParams();

  const [assessment, setAssessment] = useState(null);
  const [status, setStatus] = useState('');
  const [hrComments, setHrComments] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3008/hr/skill-matrix-view/${assessmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const da = await res.json();
        setAssessment(da.data);
      } catch (error) {
        setMsg('Failed to load assessment.');
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  const handleSubmit = async () => {
    if (!status || !hrComments) {
      setMsg('Please select a decision and enter comments.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3008/hr/skill-matrix-view/${assessmentId}/decision`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: parseInt(status),
          hr_comments: hrComments
        })
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.message || 'Submission failed');
      setMsg('✔ Successfully submitted');
      setTimeout(() => navigate('/teams'), 1000);
    } catch (err) {
      setMsg('❌' + err.message);
    }
  };

  if (!assessment) return <p>Loading...</p>;

  return (
    <div className="hr-review-container">
      <h2>Review for {assessment.employee.name}</h2>
      {assessment.skills.map(skill => (
        <div key={skill.skill_id} className="skill-box">
          <strong>{skill.skill_name}</strong>
          <p>Employee Rating: <b>{skill.employee_rating}</b></p>
          <p>Lead Rating: <b>{skill.lead_rating}</b></p>
        </div>
      ))}

      <div className="decision-box">
        <label>Decision:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">-- Select --</option>
          <option value="3">Approve</option>
          <option value="4">Reject</option>
        </select>

        <textarea
          placeholder="HR Comments"
          value={hrComments}
          onChange={(e) => setHrComments(e.target.value)}
          rows={4}
        />
        <button onClick={handleSubmit}>Submit</button>
        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
};

export default HrReviewSkillMatrix;

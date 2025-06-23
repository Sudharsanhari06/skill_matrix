import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/hrreview.css';
import Swal from 'sweetalert2';
import StarRating from '../../components/StarRating';
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
      // setMsg('Please select a decision and enter comments.');
      Swal.fire({
        icon: 'error',
        text: 'Please select a decision and enter comments.',
        confirmButtonColor: '#d33'
      });
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

      setMsg('Successfully submitted');
      Swal.fire({
        icon: 'success',
        title:'Success',
        text: 'Successfully submitted.',
        confirmButtonColor: '#3085d6'
      });
      setTimeout(() => navigate('/teams'), 1000);
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (!assessment) return <p>Loading...</p>;

  return (
    <div className="hr-review-container">
      <div className="header-section">
        <h2>Performance Review</h2>
        <div className="employee-info">
          <span className="employee-name">{assessment.employee.name}</span>
        </div>
      </div>

      <div className="skills-section">
        <h3>Skills Assessment</h3>
        <div className="skills-grid">
          {assessment.skills.map(skill => (
            <div key={skill.skill_id} className="skill-box">
              <div className="skill-header">
                <strong className="skill-name">{skill.skill_name}</strong>
              </div>
              <div className="ratings-container">
                <div className="rating-item">
                  <span className="rating-label">Employee Rating:</span>
                  <StarRating rating={skill.employee_rating} />
                  <span className="rating-number">({skill.employee_rating}/5)</span>

                </div>
                <div className="rating-item">
                  <span className="rating-label">Lead Rating:</span>
                  <StarRating rating={skill.lead_rating} />
                  <span className="rating-number">({skill.lead_rating}/5)</span>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="decision-section">
        <h3>HR Decision</h3>
        <div className="decision-box">
          <div className="form-group">
            <label>Final Decision:</label>
            <div className="decision-buttons">
              <button
                type="button"
                className={`decision-btn approve-btn ${status === "3" ? "active" : ""}`}
                onClick={() => setStatus("3")}
              >
                Approve
              </button>
              <button
                type="button"
                className={`decision-btn reject-btn ${status === "4" ? "active" : ""}`}
                onClick={() => setStatus("4")}
              >
                Reject
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="hr-comments">HR Comments:</label>
            <textarea
              id="hr-comments"
              placeholder="Please provide detailed comments about your decision..."
              value={hrComments}
              onChange={(e) => setHrComments(e.target.value)}
              rows={4}
              className="hr-textarea"
            />
          </div>

          <button onClick={handleSubmit} className="submit-button">
            Submit Review
          </button>

          {msg && <div className={`message ${msg.includes("successfully") ? "success" : "error"}`}>{msg}</div>}
        </div>
      </div>
    </div>

  );
};

export default HrReviewSkillMatrix;

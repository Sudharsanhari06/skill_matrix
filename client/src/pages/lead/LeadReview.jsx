import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/leadreview.css';



const LeadReview = () => {
    const { employeeId } = useParams(); 
    console.log("user id",employeeId)
    const [assessment, setAssessment] = useState(null);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchAssessment = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3008/lead/skill-matrix-view/employee-update`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const da = await res.json();
            const result = da.data.find(a => a.employee.id === parseInt(employeeId));
            console.log("result ", result)
            setAssessment(result);
        };
        fetchAssessment();
    }, [employeeId]);

    const handleRatingChange = (skillId, val) => {
        setRatings({ ...ratings, [skillId]: parseInt(val) });
    };

    const handleSubmit = async () => {
        const payload = {
            assessment_id: assessment.assessment_id,
            lead_comments: comments,
            ratings: Object.entries(ratings).map(([skill_id, lead_rating]) => ({
                skill_id: parseInt(skill_id),
                lead_rating
            }))
        };

        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3008/lead/submit-skill-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setMsg('Review submitted.');
        } else {
            setMsg('Failed to submit.');
        }
    };

    if (!assessment) return <p>Loading...</p>;

    return (
        <div className="review-container">
        <div className="review-header">
          <h2 className="review-title">Review for {assessment.employee.name}</h2>
        </div>
  
        <div className="skills-section">
          {assessment.skills.map(skill => (
            <div key={skill.skill_id} className="skill-item">
              <div className="skill-header">
                <p className="skill-name">{skill.skill_name}</p>
              </div>
  
              <div className="rating-row">
                <div className="employee-rating">
                  <span className="rating-label">Employee Rating:</span>
                  <span className="rating-value">{skill.employee_rating}</span>
                </div>
  
                <div className="lead-rating">
                  <span className="rating-label">Your Rating:</span>
                  <select
                    className="rating-select"
                    value={ratings[skill.skill_id] || skill.lead_rating || ''}
                    onChange={(e) => handleRatingChange(skill.skill_id, e.target.value)}
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="comments-section">
          <label className="comments-label">Lead Comments</label>
          <textarea
            className="comments-textarea"
            placeholder="Write your feedback here..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
  
        <div className="submit-section">
          <button onClick={handleSubmit} className="submit-button">Submit</button>
        </div>
  
        {msg && (
          <div className={`message ${msg.includes('Success') ? 'success-message' : ''}`}>
            {msg}
          </div>
        )}
      </div>
    );
};

export default LeadReview;

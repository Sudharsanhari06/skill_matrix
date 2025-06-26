import React, { useEffect, useState } from 'react';
import '../styles/assessment.css';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { leadReviewSkillMatrix } from '../services/leadService';
import { useNavigate } from 'react-router-dom';
const Assessment = () => {
    const [skills, setSkills] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [assessmentDone, setAssessmentDone] = useState(false);
    const [empdata, setEmpData] = useState([]);
    const navigate=useNavigate();

    const user = useSelector((state) => state.auth.user);
    const role = user?.role?.role_name;

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3008/employee/skills/view', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!res.ok) throw new Error('Skill matrix fetch failed');
                const data = await res.json();
                console.log("data skills: ", data.skills);

                const result = await leadReviewSkillMatrix()
                setEmpData(result.data);
                const allRated = data.skills.status >= 1;
                console.log("allRated", allRated)
                setAssessmentDone(allRated);
                setSkills(data.skills.skills);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const handleRatingChange = (skillId, value) => {
        setRatings({ ...ratings, [skillId]: parseInt(value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = Object.entries(ratings).map(([skill_id, rating]) => ({
            skill_id: parseInt(skill_id),
            employee_rating: rating,
        }));
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3008/employee/skills/rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ratings: payload }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Rating submission failed');
            setMessage('Ratings submitted successfully');
            setAssessmentDone(true);
            setShowForm(false);
        } catch (err) {
            setMessage(err.message);
        }
    };


    const handleReviewClick = (employeeId) => {
        navigate(`/review/${employeeId}`);
    };

    if (loading) return <p className="loading">Loading skill matrix...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="assessment-container">

            <div className="header-section">
                <h2>Quarterly Skill Assessment</h2>
                <p className="subtitle">Rate your proficiency in each skill area</p>
            </div>
            {assessmentDone ? (
                <div className="done-message">
                    <div className="success-icon">✓</div>
                    <h3>Assessment Complete!</h3>
                    <p>Your quarterly skill assessment has been submitted successfully.</p>
                </div>
            ) : (
                <>
                    {!showForm && (
                        <div className='start-section'>
                            <button className="start-btn" onClick={() => setShowForm(true)}>
                                Start Self Assessment
                            </button>
                        </div>

                    )}
                    {showForm && (
                        <form className="assessment-form" onSubmit={handleSubmit}>
                            {skills.map((item) => {
                                const skillId = item.skill.skill_id;
                                const selectedRating = ratings[skillId];
                                const levelDetails = item.skill.level_details.find(
                                    (lvl) => lvl.level_number === selectedRating
                                );

                                return (
                                    <div key={skillId} className="form-group">
                                        <label className="skill-label">{item.skill.skill_name}</label>
                                        <div className="star-rating">
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <FaStar
                                                    key={val}
                                                    size={24}
                                                    className={`star-icon ${val <= selectedRating ? "filled" : ""}`}
                                                    onClick={() => handleRatingChange(skillId, val)}
                                                />
                                            ))}
                                        </div>
                                        {selectedRating && (
                                            <p className="level-description">
                                                {levelDetails?.description}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                            <button type="submit" className="submit-btn">
                                Submit Ratings
                            </button>
                        </form>
                    )}
                </>
            )}

            {role == 'lead' && (
                <>
                <h2>Review Team Members</h2>
                <div className="card-container">
                    {empdata.map((item) => (
                        <div className="card" key={item.assessment_id}>
                            <h3 className="employee-name">{item.employee.name}</h3>
                            <p className="assessment-id">Assessment ID: {item.assessment_id}</p>
                            <button
                                className="review-button"
                                onClick={() => handleReviewClick(item.employee.id)}
                            >
                                Review Assessment
                            </button>
                        </div>
                    ))}
                </div>
                </>
            )}

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Assessment;

import React, { useEffect, useState } from 'react';
import '../styles/assessment.css';

const Assessment = () => {
    const [skills, setSkills] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [assessmentDone, setAssessmentDone] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3008/employee/skills/view', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error('Skill matrix fetch failed');
                const data = await res.json();

                const allRated = data.skills.every(item => item.employee_rating !== null);
                setAssessmentDone(allRated);
                setSkills(data.skills);
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
            setMessage('✔ Ratings submitted successfully');
            setAssessmentDone(true);
            setShowForm(false);
        } catch (err) {
            setMessage('❌ ' + err.message);
        }
    };

    if (loading) return <p className="loading">Loading skill matrix...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="assessment-container">
            <h2>Quarterly Skill Assessment</h2>

            {assessmentDone ? (
                <div className="done-message">✅ Assessment already submitted.</div>
            ) : (
                <>
                    {!showForm && (
                        <button className="start-btn" onClick={() => setShowForm(true)}>
                            Start Assessment
                        </button>
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
                                        <select
                                            required
                                            className="rating-select"
                                            value={selectedRating || ''}
                                            onChange={(e) => handleRatingChange(skillId, e.target.value)}
                                        >
                                            <option value="">Select Rating</option>
                                            {[1, 2, 3, 4, 5].map((val) => (
                                                <option key={val} value={val}>
                                                    {val}
                                                </option>
                                            ))}
                                        </select>
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

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Assessment;

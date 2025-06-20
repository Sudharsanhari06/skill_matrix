import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/hrassessmentlist.css';

const HrAssessmentList = () => {
    const [assessments, setAssessments] = useState([]);

    useEffect(() => {
      
        const fetchAssessments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:3008/hr/skill-matrix-view/employee-lead-update', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const da = await res.json();
                setAssessments(da.data);
            } catch (err) {
                console.error('Failed to fetch assessments:', err);
            }
        };

        fetchAssessments();
    }, []);

    return (
        <div className="hr-list-container">
            <h2>Pending Skill Reviews</h2>
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Lead Comments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map(item => (
                        <tr key={item.assessment_id}>
                            <td>{item.employee.name}</td>
                            <td>{item.lead_comments}</td>
                            <td>
                                <Link to={`/hr/review/${item.assessment_id}`} className="review-btn">Review</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HrAssessmentList;

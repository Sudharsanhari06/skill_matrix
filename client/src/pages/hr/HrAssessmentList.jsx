import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/hrassessmentlist.css';
import { employeeLeadUpdate } from '../../services/adminService';

const HrAssessmentList = () => {
    const [assessments, setAssessments] = useState([]);
    useEffect(() => {
        const fetchAssessments = async () => {
            try {
            const data=await employeeLeadUpdate()
                setAssessments(data.result);
            } catch (err) {
                console.error('Failed to fetch assessments:', err);
            }
        };
        fetchAssessments();
    }, []);

    return (
        <div className="hr-list-container">
            <h2>Pending Skill Reviews</h2>
            {
                assessments.length > 0 ? (
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
                                        <Link to={`/hr/review/${item.assessment_id}`} className="review-btn">
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='pending-assessment'>No Pending Assessments</p>
                )
            }


        </div>
    );
};

export default HrAssessmentList;

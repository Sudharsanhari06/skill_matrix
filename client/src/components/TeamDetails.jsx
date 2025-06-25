import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import '../styles/teamdetails.css';

const TeamDetails = () => {
    const { teamId } = useParams();
    const [teamInfo, setTeamInfo] = useState(null);

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchTeamDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3008/teams/${teamId}/employees`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.result && data.result.length > 0) {
                        setEmployees(data.result);
                        setTeamInfo(data.result[0].team);
                    } else {
                        setEmployees([]);
                        setTeamInfo(null);
                        throw new Error('No employees found for this team.');
                    }
                    console.log("teams members:", data.result);
                } else {
                    const foundEmployees = sampleEmployeesForTeam[teamId];
                    if (foundEmployees && foundEmployees.length > 0) {
                        setEmployees(foundEmployees);
                        setTeamInfo(foundEmployees[0].team);
                    } else {
                        setEmployees([]);
                        setTeamInfo(null);
                        throw new Error('Team not found from API or sample data.');
                    }
                }
            } catch (err) {
                setError(err.message);

                const foundEmployees = sampleEmployeesForTeam[teamId];
                if (foundEmployees && foundEmployees.length > 0) {
                    setEmployees(foundEmployees);
                    setTeamInfo(foundEmployees[0].team);
                } else {
                    setError(err.message || 'Failed to fetch team details and no sample data available.');
                    setEmployees([]);
                    setTeamInfo(null);
                }
            } finally {
                setLoading(false);
            }
        };

        if (teamId) {
            fetchTeamDetails();
        }
    }, [teamId]);

    return (
        <div className="team-details">
            <div className="page-header">
                <Link to="/teams" className="back-link">← Back to Teams</Link>
                <h1>{teamInfo?.team_name || 'N/A Team Name'}</h1>
                <p className="lead-info">Lead: <strong>{teamInfo?.lead?.employee_name || 'N/A'}</strong></p>
            </div>

            <div className="employees-section">
                <h2>Team Members ({employees.length})</h2>
                <div className="employees-grid">
                    {employees.map((employee) => (
                        <div className="employee-card__team">
                            <div className="employee-avatar">

                                {employee.employee_name ? employee.employee_name.split(' ').map(n => n[0]).join('') : 'N/A'}
                            </div>
                            <div className="employee-info">
                                <h3>{employee.employee_name}</h3>
                                <p className="employee-role">{employee.role?.role_name || 'Role N/A'}</p>
                                <p className="employee-email">{employee.email || 'Email N/A'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;

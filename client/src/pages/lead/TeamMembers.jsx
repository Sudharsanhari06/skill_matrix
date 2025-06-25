import React, { useEffect, useState } from 'react';
// import '../../styles/teammembers.css';
import '../../styles/teamdetails.css';

const TeamMembers = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {

        const fetchTeamMembers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3008/employees/lead', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch team members');
                }

                const data = await response.json();
                console.log("team members:", data);
                console.log(" team members ", data.result[0].members);
                setMembers(data.result[0].members);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchTeamMembers();
    }, []);
    return (
        <div className="employees-section">
        <div className="employees-grid">
            {members.map((employee) => (
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
    );
};

export default TeamMembers;

import React, { useEffect, useState } from 'react';
import '../../styles/teammembers.css';

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
                console.log(" team members only", data.result)
                console.log(" team members ", data.result[0].members);
                setMembers(data.result[0].members);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTeamMembers();
    }, []);

    return (
        <div className="team-container">
            <h2>My Team Members</h2>
            <div className="team">
                {members.map(member => (
                    <div className="team-card" key={member.employee_id}>
                        <p className="team-avatar">{member.employee_name.charAt(0)}</p>
                        <div className="team-info">
                            <h3>{member.employee_name}</h3>
                            <p>{member.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMembers;

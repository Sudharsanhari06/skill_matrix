import React, { useEffect, useState } from 'react';

const TeamSkillMatrix = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        employee: '',
        designation: '',
        category: '',
        skill: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3008/lead/team-skill-matrix', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const da = await response.json();
            console.log("Team skill matrix data", da.result);
            setData(da.result);
        } catch (error) {
            console.error('Error fetching skill matrix:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = data.filter(entry =>
        entry.employee_name.toLowerCase().includes(filters.employee.toLowerCase()) &&
        entry.designation.toLowerCase().includes(filters.designation.toLowerCase()) &&
        entry.category.toLowerCase().includes(filters.category.toLowerCase()) &&
        entry.skill_name.toLowerCase().includes(filters.skill.toLowerCase())
    );

    return (
        <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
            <h2>Team Skill Matrix</h2>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Filter by Employee"
                    value={filters.employee}
                    onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by Designation"
                    value={filters.designation}
                    onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by Category"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by Skill"
                    value={filters.skill}
                    onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th style={th}>Employee</th>
                        <th style={th}>Designation</th>
                        <th style={th}>Category</th>
                        <th style={th}>Skill</th>
                        <th style={th}>Employee Rating</th>
                        <th style={th}>Lead Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length === 0 ? (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No data found</td>
                        </tr>
                    ) : (
                        filteredData.map((entry, index) => (
                            <tr key={index}>
                                <td style={td}>{entry.employee_name}</td>
                                <td style={td}>{entry.designation}</td>
                                <td style={td}>{entry.category}</td>
                                <td style={td}>{entry.skill_name}</td>
                                <td style={td}>{entry.employee_rating ?? 'N/A'}</td>
                                <td style={td}>{entry.lead_rating ?? 'N/A'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const th = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'center'
};

const td = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'center'
};
export default TeamSkillMatrix;

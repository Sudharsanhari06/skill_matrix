import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EmployeeSkillChart = () => {

  const [matrix, setMatrix] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3008/employee/skill-matrix/view', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch skill matrix');
        const data = await res.json();


        const formatted = data.skills.map((skill) => ({
          skill: skill.skill_name,
          employee: skill.employee_rating ?? 0,
          lead: skill.lead_rating ?? 0,
        }));

        setMatrix(formatted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMatrix();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!matrix) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem',overflowX: 'scroll'}}>
      <h2 style={{ textAlign: 'center' }}>My Skill Ratings</h2>
      <ResponsiveContainer height={400} style={{ overflowX: 'scroll', width: '100%' }}>
        <BarChart data={matrix} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="skill" />
          <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="employee" fill="#4ade80" name="Employee Rating" />
          <Bar dataKey="lead" fill="#60a5fa" name="Lead Rating" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmployeeSkillChart;
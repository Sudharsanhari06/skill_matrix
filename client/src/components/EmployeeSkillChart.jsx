import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { employeeSkillMatrixView } from '../services/employeeService';

const EmployeeSkillChart = ({ onSelectSkill }) => {
  const [matrix, setMatrix] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const data = await employeeSkillMatrixView();
        if (!data.success) throw new Error('Failed to fetch skill matrix');
        const formatted = data.data.skills.map((skill) => ({
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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={matrix} >
        <XAxis dataKey="skill" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="employee" fill="#8884d8" onClick={(data) => onSelectSkill && onSelectSkill(data)} />
        <Bar dataKey="lead" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmployeeSkillChart;

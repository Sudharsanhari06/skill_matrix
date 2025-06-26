import React, { useEffect, useState } from 'react';
import '../../styles/skillmatrix.css';
import EmployeeSkillChart from '../../components/EmployeeSkillChart';
import GapAnalysis from '../../components/GapAnalysis';
import SkillDetailsPanel from '../../components/SkillDetailsPanel';
import { employeeSkillMatrixView } from '../../services/employeeService';

const SkillMatrix = () => {
    const [matrix, setMatrix] = useState([]);
    const [error, setError] = useState('');
    const [selectedSkill, setSelectedSkill] = useState([]);

    useEffect(() => {
        const fetchMatrix = async () => {
            try {
                const result = await employeeSkillMatrixView();
                if (!result.success) throw new Error('The User Did not have the Skill Matrix');
                setMatrix(result.data);
                console.log("Matrix Result", result.data)
            } catch (err) {
                setError(err.message);
            }
        };
        fetchMatrix();
    }, []);

    if (error) return <p className="error">{error}</p>;
    if (!matrix||!Array.isArray(matrix.skills)) return <p>Loading...</p>;

    return (
        <div className="matrix-container">
            <h2>My Skill Matrix</h2>
            <table className="skill-table">
                <thead>
                    <tr>
                        <th>Skill</th>
                        <th>Employee Rating</th>
                        <th>Lead Rating</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    matrix.skills.map((skill) => (
                        <tr key={skill.skill_id}>
                            <td>{skill.skill_name}</td>
                            <td>{skill.employee_rating ?? 'N/A'}</td>
                            <td>{skill.lead_rating ?? 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 2 }}>
                    <EmployeeSkillChart onSelectSkill={()=>setSelectedSkill} />
                </div>
                <div style={{ flex: 1 }}>
                    {selectedSkill ? (
                        <SkillDetailsPanel skill={selectedSkill} />
                    ) : (
                        <p>Select a skill to see guidance</p>
                    )}
                </div>
            </div>
            <GapAnalysis />
            <div className="comments-box">
                <p><strong>Lead Comments:</strong> {matrix.lead_comments || 'N/A'}</p>
                <p><strong>HR Comments:</strong> {matrix.hr_comments || 'N/A'}</p>
            </div>
        </div>
    );
};
export default SkillMatrix;

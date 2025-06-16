import React, { useEffect, useState } from 'react';
import '../../styles/teamlist.css';

const TeamEmployeeList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3008/teams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }

        const data = await response.json();
        setTeams(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const toggleTeam = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  if (loading) return <div className="team-loader">Loading teams...</div>;
  if (error) return <div className="team-error">{error}</div>;

  return (
    <div className="team-flex-wrapper">
      {teams.map((team) => (
        <div
          key={team.team_id}
          className="team-flex-card"
          onClick={() => toggleTeam(team.team_id)}
        >
          <div className="team-header">
            <div className="team-name">{team.team_name}</div>
            <div className="lead-name">
              Lead: {team.lead?.employee_name || 'Not Assigned'}
            </div>
          </div>

          {expandedTeamId === team.team_id && (
            <div className="team-members">
              {team.members.map((member) => (
                <div key={member.employee_id} className="member">
                  <span>{member.employee_name}</span>
                  <span className="role">({member.role?.role_name})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamEmployeeList;

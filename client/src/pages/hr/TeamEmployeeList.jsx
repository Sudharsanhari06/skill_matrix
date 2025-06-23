import React, { useEffect, useState } from 'react';
import '../../styles/teamlist.css';
import { Link } from 'react-router-dom';


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
    <div className="teams-page">
    <div className="page-header">
      <h1>Teams</h1>
      <p>Manage all teams and their members</p>
    </div>

    <div className="teams-grid">
      {teams.map((team) => (
        <Link key={team.team_id} to={`/teams/${team.team_id}`} className="team-card-link">
          <div className="team-card">
            <div className="team-header">
              <h3>{team.team_name}</h3>
             
              <span className="member-count">{team.members ? team.members.length : 0} members</span>
            </div>
            <div className="team-content">
              <p className="team-lead">
                <strong>Lead:</strong> {team.lead?.employee_name || 'N/A'}
              </p>
              <p className="team-description">{team.description}</p>
            </div>
            <div className="team-footer">
              <span className="view-link">View Team →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
  );
};

export default TeamEmployeeList;

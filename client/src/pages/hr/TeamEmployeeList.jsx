import React, { useEffect, useState } from 'react';
import '../../styles/teamlist.css';
import { Link } from 'react-router-dom';
import { getAllTeams } from '../../services/adminService';

const TeamEmployeeList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getAllTeams();
        setTeams(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);
  if (error) return <div className="team-error">{error}</div>;
  return (
    <div className="teams-page">
      {loading && <div className="loading"></div>}
      <div className="page-header">
        <h1>Teams</h1>
        <p>Manage all teams and their members</p>
      </div>
      <div className="teams-grid">
        {teams.map((team) => (

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
              <Link key={team.team_id} to={`/teams/${team.team_id}`} className="team-card-link"><span className="view-link">View Team →</span> </Link>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default TeamEmployeeList;

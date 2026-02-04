import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams - Processed data:', teamsData);
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading teams...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Error Loading Teams</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="page-header">
        <h2>🏆 Teams</h2>
        <p>Join a team and compete together</p>
      </div>
      
      {teams.length === 0 ? (
        <div className="empty-state">
          <h4>No Teams Yet</h4>
          <p className="text-muted">Create or join a team to get started!</p>
        </div>
      ) : (
        <div className="row">
          {teams.map(team => (
            <div key={team.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <h2>🏆</h2>
                  </div>
                  <h5 className="card-title text-center mb-3">{team.name}</h5>
                  <p className="card-text flex-grow-1">{team.description}</p>
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-info">
                      👥 {team.member_count || 0} {team.member_count === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Created: {new Date(team.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <button className="btn btn-primary btn-sm w-100">View Team</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;

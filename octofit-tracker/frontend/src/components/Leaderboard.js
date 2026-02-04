import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard - Processed data:', leaderboardData);
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading leaderboard...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Error Loading Leaderboard</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="container mt-5">
      <div className="page-header">
        <h2>🥇 Leaderboard</h2>
        <p>See who's leading the fitness challenge</p>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <h4>No Rankings Yet</h4>
          <p className="text-muted">Complete activities to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Total Points</th>
                  <th>Total Activities</th>
                  <th>Total Calories</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id} className={index < 3 ? 'table-warning' : ''}>
                    <td><h5 className="mb-0">{getRankBadge(entry.rank || index + 1)}</h5></td>
                    <td><strong>{entry.user_name || entry.user_id}</strong></td>
                    <td><span className="badge bg-primary">{entry.team_name || 'N/A'}</span></td>
                    <td><span className="badge bg-success fs-6">{entry.total_points} pts</span></td>
                    <td>{entry.total_activities}</td>
                    <td><span className="badge bg-warning text-dark">{entry.total_calories || 0} cal</span></td>
                    <td>{new Date(entry.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;

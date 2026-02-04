import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities - Processed data:', activitiesData);
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading activities...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Error Loading Activities</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="page-header">
        <h2>📊 Activity Log</h2>
        <p>Track all fitness activities and performance metrics</p>
      </div>
      
      {activities.length === 0 ? (
        <div className="empty-state">
          <h4>No Activities Yet</h4>
          <p className="text-muted">Start logging your fitness activities to see them here!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Activity Type</th>
                  <th>Duration (min)</th>
                  <th>Distance (km)</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(activity => (
                  <tr key={activity.id}>
                    <td><span className="badge bg-secondary">{activity.id}</span></td>
                    <td><strong>{activity.user_id}</strong></td>
                    <td><span className="badge bg-info">{activity.activity_type}</span></td>
                    <td>{activity.duration}</td>
                    <td>{activity.distance || 'N/A'}</td>
                    <td><span className="badge bg-warning text-dark">{activity.calories}</span></td>
                    <td>{new Date(activity.date).toLocaleDateString()}</td>
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

export default Activities;

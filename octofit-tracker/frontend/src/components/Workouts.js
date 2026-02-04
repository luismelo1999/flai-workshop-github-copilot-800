import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Fetching from API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts - Fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts - Processed data:', workoutsData);
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading workouts...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Error Loading Workouts</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  const getIntensityBadge = (difficulty) => {
    const badges = {
      'easy': 'success',
      'Easy': 'success',
      'medium': 'warning',
      'Medium': 'warning',
      'hard': 'danger',
      'Hard': 'danger'
    };
    return badges[difficulty] || 'secondary';
  };

  return (
    <div className="container mt-5">
      <div className="page-header">
        <h2>💪 Personalized Workouts</h2>
        <p>Customized workout suggestions based on your fitness level</p>
      </div>
      
      {workouts.length === 0 ? (
        <div className="empty-state">
          <h4>No Workouts Yet</h4>
          <p className="text-muted">Get personalized workout suggestions to start your fitness journey!</p>
        </div>
      ) : (
        <div className="row">
          {workouts.map(workout => (
            <div key={workout.id} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">💪 {workout.name}</h5>
                    <span className={`badge bg-${getIntensityBadge(workout.difficulty)} text-white`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-2">
                      <strong>🏃 Type:</strong> {workout.exercise_type}
                    </p>
                    <p className="mb-2">
                      <strong>⏱️ Duration:</strong> {workout.duration} minutes
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="mb-1"><strong>📝 Description:</strong></p>
                    <p className="card-text">{workout.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <hr />
                    <small className="text-muted">
                      Created: {new Date(workout.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <button className="btn btn-success w-100">Start Workout</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;

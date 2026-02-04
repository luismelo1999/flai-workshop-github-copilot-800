import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <span className="text-white">🏋️ OctoFit Tracker</span>
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">👥 Users</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">🏆 Teams</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">📊 Activities</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">💪 Workouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">🥇 Leaderboard</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="App-content">
          <Routes>
            <Route path="/" element={
              <div className="container mt-5">
                <div className="welcome-section">
                  <h1 className="display-4 mb-4">Welcome to OctoFit Tracker</h1>
                  <p className="lead mb-4">Track your fitness activities, compete with your team, and achieve your goals!</p>
                  <div className="row mt-5">
                    <div className="col-md-4 mb-3">
                      <Link to="/activities" style={{ textDecoration: 'none' }}>
                        <div className="card text-center" style={{ cursor: 'pointer' }}>
                          <div className="card-body">
                            <h3 className="text-primary">📊</h3>
                            <h5 className="card-title">Track Activities</h5>
                            <p className="card-text">Log your workouts and monitor progress</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-4 mb-3">
                      <Link to="/teams" style={{ textDecoration: 'none' }}>
                        <div className="card text-center" style={{ cursor: 'pointer' }}>
                          <div className="card-body">
                            <h3 className="text-primary">🏆</h3>
                            <h5 className="card-title">Join Teams</h5>
                            <p className="card-text">Collaborate and compete together</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="col-md-4 mb-3">
                      <Link to="/workouts" style={{ textDecoration: 'none' }}>
                        <div className="card text-center" style={{ cursor: 'pointer' }}>
                          <div className="card-body">
                            <h3 className="text-primary">💪</h3>
                            <h5 className="card-title">Get Workouts</h5>
                            <p className="card-text">Personalized exercise suggestions</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', team_id: '' });
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    const teamsUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    
    console.log('Fetching from API endpoint:', apiUrl);

    // Fetch both users and teams
    Promise.all([
      fetch(apiUrl).then(res => res.json()),
      fetch(teamsUrl).then(res => res.json())
    ])
      .then(([usersData, teamsData]) => {
        console.log('Users - Fetched data:', usersData);
        console.log('Teams - Fetched data:', teamsData);
        
        const processedUsers = usersData.results || usersData;
        const processedTeams = teamsData.results || teamsData;
        
        console.log('Users - Processed data:', processedUsers);
        setUsers(Array.isArray(processedUsers) ? processedUsers : []);
        setTeams(Array.isArray(processedTeams) ? processedTeams : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team_id: user.team_id || ''
    });
    setSaveError(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '' });
    setSaveError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editingUser) return;

    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${editingUser.id}/`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          team_id: formData.team_id || null
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('User updated:', updatedUser);

      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));

      handleClose();
    } catch (error) {
      console.error('Error saving user:', error);
      setSaveError(error.message);
    }
  };

  if (loading) return (
    <div className="container mt-5">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="text-muted">Loading users...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="container mt-5">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h4>Error Loading Users</h4>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="page-header">
        <h2>👥 Users</h2>
        <p>Manage and view all registered users</p>
      </div>
      
      {users.length === 0 ? (
        <div className="empty-state">
          <h4>No Users Yet</h4>
          <p className="text-muted">No registered users found!</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Total Users: <span className="badge bg-primary">{users.length}</span></h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team ID</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td><span className="badge bg-secondary">{user.id}</span></td>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      {user.team_id ? (
                        <span className="badge bg-primary">{user.team_id}</span>
                      ) : (
                        <span className="badge bg-secondary">No Team</span>
                      )}
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(user)}
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleClose}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User Details</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger" role="alert">
                    Error saving user: {saveError}
                  </div>
                )}
                <form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                    >
                      <option value="">No Team</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

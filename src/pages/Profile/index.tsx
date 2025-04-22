import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ListCard from '../../components/ListCard';

// Mock user lists data
const userListsData = [
  {
    id: '101',
    title: 'My Top 5 Programming Languages',
    description: 'Languages I love working with in 2025',
    username: 'demo_user',
    vote_count: 12,
    comment_count: 3,
    created_at: new Date().toISOString()
  },
  {
    id: '102',
    title: 'Top 5 Books Everyone Should Read',
    description: 'Essential reads that changed my perspective',
    username: 'demo_user',
    vote_count: 25,
    comment_count: 8,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth');
      return;
    }

    // Set username from auth context
    setUsername(user.username);
    
    // Fetch user lists (mock data for now)
    const fetchUserLists = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setUserLists(userListsData);
      } catch (error) {
        console.error('Error fetching user lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLists();
  }, [user, navigate]);

  const handleUpdateUsername = (e) => {
    e.preventDefault();
    
    if (!newUsername.trim()) {
      setUpdateError('Username cannot be empty');
      return;
    }
    
    setUpdateLoading(true);
    setUpdateError(null);
    
    // Simulate API call with delay
    setTimeout(() => {
      setUsername(newUsername.trim());
      setIsEditing(false);
      setUpdateSuccess('Username updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
      
      setUpdateLoading(false);
    }, 800);
  };

  const handleDeleteList = (listId) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }
    
    // Remove the list from state
    setUserLists(userLists.filter(list => list.id !== listId));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        
        {!isEditing ? (
          <div className="profile-info">
            <div className="profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <p className="profile-username">{username}</p>
              <p className="profile-email">{user.email}</p>
            </div>
            <button
              onClick={() => {
                setNewUsername(username);
                setIsEditing(true);
              }}
              className="button button-secondary profile-edit-button"
            >
              Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateUsername} className="profile-edit-form">
            <div className="profile-avatar">
              {newUsername.charAt(0).toUpperCase() || username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-input-group">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="form-input"
                placeholder="Username"
              />
              {updateError && (
                <p className="form-error">{updateError}</p>
              )}
            </div>
            <div className="profile-edit-buttons">
              <button
                type="submit"
                disabled={updateLoading}
                className="button button-primary"
              >
                {updateLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="button button-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {updateSuccess && (
          <div className="profile-success-message">
            {updateSuccess}
          </div>
        )}
        
        <div className="profile-actions">
          <Link
            to="/create"
            className="button button-primary"
          >
            Create New List
          </Link>
          <button
            onClick={handleSignOut}
            className="button button-secondary"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="profile-section">
        <h2>Your Lists</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your lists...</p>
          </div>
        ) : userLists.length === 0 ? (
          <div className="empty-lists">
            <p>You haven't created any lists yet.</p>
            <Link
              to="/create"
              className="button button-primary"
            >
              Create Your First List
            </Link>
          </div>
        ) : (
          <div className="user-lists">
            {userLists.map(list => (
              <div key={list.id} className="user-list-item">
                <ListCard
                  id={list.id}
                  title={list.title}
                  description={list.description}
                  username={list.username}
                  vote_count={list.vote_count}
                  comment_count={list.comment_count}
                  created_at={list.created_at}
                />
                <div className="user-list-actions">
                  <Link to={`/edit/${list.id}`} className="list-action-edit">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteList(list.id)}
                    className="list-action-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
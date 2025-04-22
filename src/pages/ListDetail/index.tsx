import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Mock data for a single list
const mockListData = {
  id: '1',
  title: 'Top 5 Sci-Fi Movies of All Time',
  description: 'The greatest science fiction films according to a sci-fi enthusiast',
  username: 'moviefan42',
  vote_count: 128,
  comment_count: 24,
  created_at: '2025-03-15T10:30:00Z',
  updated_at: '2025-03-15T10:30:00Z',
  user_id: 'user123',
  items: [
    { id: 1, title: 'Blade Runner 2049', description: 'A stunning visual masterpiece with deep philosophical themes', rank: 1 },
    { id: 2, title: 'Interstellar', description: 'Christopher Nolan\'s space epic about love and time', rank: 2 },
    { id: 3, title: 'The Matrix', description: 'A groundbreaking film that changed sci-fi forever', rank: 3 },
    { id: 4, title: 'Arrival', description: 'A linguist learns to communicate with aliens in this thought-provoking film', rank: 4 },
    { id: 5, title: '2001: A Space Odyssey', description: 'Stanley Kubrick\'s masterpiece about evolution and AI', rank: 5 }
  ]
};

const ListDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from your API/Supabase
        // For example:
        // const { data, error } = await supabase
        //   .from('top_five_lists')
        //   .select('*, list_items(*)')
        //   .eq('id', id)
        //   .single();
        
        // If error, throw to catch
        // if (error) throw error;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data for demo
        setList(mockListData);
        setVoteCount(mockListData.vote_count);
        
        // Check if the current user has voted on this list
        // In a real app, this would be a separate query to the votes table
        setIsVoted(false);
      } catch (error) {
        console.error('Error fetching list:', error);
        setError('Unable to load the list. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchList();
    }
  }, [id]);

  const handleVote = async () => {
    if (!user) {
      // Redirect to auth page if not logged in
      navigate('/auth', { state: { from: `/list/${id}` } });
      return;
    }
    
    // Toggle vote state
    setIsVoted(!isVoted);
    
    // Update vote count
    setVoteCount(prevCount => isVoted ? prevCount - 1 : prevCount + 1);
    
    // In a real app, this would make an API call to update the vote in the database
    // For example:
    // if (!isVoted) {
    //   await supabase.from('votes').insert({ list_id: id, user_id: user.id });
    // } else {
    //   await supabase.from('votes').delete().match({ list_id: id, user_id: user.id });
    // }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading list...</p>
      </div>
    );
  }

  if (error || !list) {
    return (
      <div className="list-error-container">
        <h2>Oops! Something went wrong</h2>
        <p>{error || 'The list could not be found.'}</p>
        <Link to="/" className="button button-primary">Go back to home</Link>
      </div>
    );
  }

  return (
    <div className="list-detail-container">
      <div className="list-detail-header">
        <h1 className="list-title">{list.title}</h1>
        
        {list.description && (
          <p className="list-description">{list.description}</p>
        )}
        
        <div className="list-meta">
          <div className="list-creator">
            <span>By</span>
            <Link to={`/profile/${list.user_id}`} className="list-author">
              @{list.username}
            </Link>
            <span className="list-date">• {formatDate(list.created_at)}</span>
          </div>
          <div className="list-actions">
            <button 
              onClick={handleVote} 
              className={`vote-button ${isVoted ? 'voted' : ''}`}
              aria-label={isVoted ? 'Remove vote' : 'Vote for this list'}
            >
              {isVoted ? '★' : '☆'} <span>{voteCount}</span>
            </button>
            <span className="comment-count">💬 {list.comment_count}</span>
          </div>
        </div>
      </div>
      
      <ol className="list-items-container">
        {list.items.map((item) => (
          <li 
            key={item.id} 
            className="list-item-card"
          >
            <div className="list-item-content">
              <div className="list-item-rank-container">
                <span className="list-item-rank">{item.rank}</span>
              </div>
              <div className="list-item-details">
                <h3 className="list-item-title">{item.title}</h3>
                {item.description && (
                  <p className="list-item-description">{item.description}</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
      
      <div className="list-footer">
        <Link to="/" className="back-link">
          ← Back
        </Link>
        
        {user && user.id === list.user_id && (
          <Link to={`/edit/${list.id}`} className="edit-link">
            Edit List
          </Link>
        )}
      </div>
    </div>
  );
};

export default ListDetailPage;
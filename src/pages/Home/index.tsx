import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ListCard from '../../components/ListCard';

// Mock data for lists
const featuredListsData = [
  {
    id: '1',
    title: 'Top 5 Sci-Fi Movies of All Time',
    description: 'The greatest science fiction films according to a sci-fi enthusiast',
    username: 'moviefan42',
    vote_count: 128,
    comment_count: 24,
    created_at: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Top 5 Programming Languages for 2025',
    description: 'The most in-demand programming languages for this year',
    username: 'techguru',
    vote_count: 97,
    comment_count: 31,
    created_at: '2025-04-01T14:45:00Z'
  },
  {
    id: '3',
    title: 'Top 5 Places to Visit in Europe',
    description: 'Must-see destinations for your European adventure',
    username: 'wanderlust',
    vote_count: 85,
    comment_count: 18,
    created_at: '2025-04-10T09:15:00Z'
  }
];

const recentListsData = [
  {
    id: '3',
    title: 'Top 5 Places to Visit in Europe',
    description: 'Must-see destinations for your European adventure',
    username: 'wanderlust',
    vote_count: 85,
    comment_count: 18,
    created_at: '2025-04-10T09:15:00Z'
  },
  {
    id: '4',
    title: 'Top 5 Fantasy Novel Series',
    description: 'Epic fantasy series that will transport you to another world',
    username: 'bookworm99',
    vote_count: 76,
    comment_count: 22,
    created_at: '2025-04-05T16:20:00Z'
  },
  {
    id: '5',
    title: 'Top 5 Productivity Apps',
    description: 'Apps that will help you get more done in less time',
    username: 'efficiency_expert',
    vote_count: 64,
    comment_count: 15,
    created_at: '2025-04-18T11:10:00Z'
  },
  {
    id: '6',
    title: 'Top 5 Video Games of 2024',
    description: 'The best gaming experiences from last year',
    username: 'gamer_elite',
    vote_count: 42,
    comment_count: 19,
    created_at: '2025-04-20T08:30:00Z'
  }
];

const HomePage = () => {
  const { user } = useAuth();
  const [featuredLists, setFeaturedLists] = useState([]);
  const [recentLists, setRecentLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setFeaturedLists(featuredListsData);
        setRecentLists(recentListsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="hero">
        <h1>Share Your Top 5 with the World</h1>
        <p>Create, discover, and vote on Top 5 lists about anything and everything. What's your Top 5?</p>
        <div>
          {user ? (
            <Link to="/create" className="button button-primary">Create a List</Link>
          ) : (
            <Link to="/auth" className="button button-primary">Sign Up & Create</Link>
          )}
          <Link to="/lists" className="button button-secondary">Browse Lists</Link>
        </div>
      </section>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading lists...</p>
        </div>
      ) : (
        <>
          <section>
            <div className="section-header">
              <h2 className="section-title">Featured Lists</h2>
              <Link to="/lists" className="view-all">View all lists →</Link>
            </div>
            
            <div className="card-grid featured-lists">
              {featuredLists.map(list => (
                <ListCard
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  description={list.description}
                  username={list.username}
                  vote_count={list.vote_count}
                  comment_count={list.comment_count}
                  created_at={list.created_at}
                  featured={true}
                />
              ))}
            </div>
          </section>
      
          <section>
            <div className="section-header">
              <h2 className="section-title">Recent Lists</h2>
              <Link to="/lists" className="view-all">See more →</Link>
            </div>
            
            <div>
              {recentLists.map(list => (
                <ListCard
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  description={list.description}
                  username={list.username}
                  vote_count={list.vote_count}
                  comment_count={list.comment_count}
                  created_at={list.created_at}
                  compact={true}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default HomePage;
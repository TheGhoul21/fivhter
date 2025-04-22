import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListCard from '../../components/ListCard';

// Mock data for lists
const allListsData = [
  {
    id: '1',
    title: 'Top 5 Sci-Fi Movies of All Time',
    description: 'The greatest science fiction films according to a sci-fi enthusiast',
    username: 'moviefan42',
    vote_count: 128,
    comment_count: 24,
    created_at: '2025-03-15T10:30:00Z',
    category: 'entertainment'
  },
  {
    id: '2',
    title: 'Top 5 Programming Languages for 2025',
    description: 'The most in-demand programming languages for this year',
    username: 'techguru',
    vote_count: 97,
    comment_count: 31,
    created_at: '2025-04-01T14:45:00Z',
    category: 'technology'
  },
  {
    id: '3',
    title: 'Top 5 Places to Visit in Europe',
    description: 'Must-see destinations for your European adventure',
    username: 'wanderlust',
    vote_count: 85,
    comment_count: 18,
    created_at: '2025-04-10T09:15:00Z',
    category: 'travel'
  },
  {
    id: '4',
    title: 'Top 5 Fantasy Novel Series',
    description: 'Epic fantasy series that will transport you to another world',
    username: 'bookworm99',
    vote_count: 76,
    comment_count: 22,
    created_at: '2025-04-05T16:20:00Z',
    category: 'entertainment'
  },
  {
    id: '5',
    title: 'Top 5 Productivity Apps',
    description: 'Apps that will help you get more done in less time',
    username: 'efficiency_expert',
    vote_count: 64,
    comment_count: 15,
    created_at: '2025-04-18T11:10:00Z',
    category: 'technology'
  },
  {
    id: '6',
    title: 'Top 5 Video Games of 2024',
    description: 'The best gaming experiences from last year',
    username: 'gamer_elite',
    vote_count: 42,
    comment_count: 19,
    created_at: '2025-04-20T08:30:00Z',
    category: 'entertainment'
  },
  {
    id: '7',
    title: 'Top 5 Italian Dishes You Must Try',
    description: 'Classic Italian recipes that will make your mouth water',
    username: 'foodlover',
    vote_count: 53,
    comment_count: 12,
    created_at: '2025-04-12T13:45:00Z',
    category: 'food'
  },
  {
    id: '8',
    title: 'Top 5 Machine Learning Frameworks',
    description: 'The best tools for building AI applications in 2025',
    username: 'ai_enthusiast',
    vote_count: 67,
    comment_count: 28,
    created_at: '2025-04-15T11:20:00Z',
    category: 'technology'
  },
  {
    id: '9',
    title: 'Top 5 Hiking Trails in North America',
    description: 'Amazing wilderness adventures for nature lovers',
    username: 'trailblazer',
    vote_count: 39,
    comment_count: 14,
    created_at: '2025-04-09T16:55:00Z',
    category: 'travel'
  }
];

// Available categories
const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'technology', name: 'Technology' },
  { id: 'travel', name: 'Travel' },
  { id: 'food', name: 'Food & Cooking' }
];

// Sort options
const sortOptions = [
  { id: 'recent', name: 'Most Recent' },
  { id: 'popular', name: 'Most Popular' }
];

const DiscoverPage = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filteredLists = [...allListsData];
        
        // Filter by category
        if (selectedCategory !== 'all') {
          filteredLists = filteredLists.filter(list => list.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm.trim()) {
          const lowercaseSearchTerm = searchTerm.toLowerCase();
          filteredLists = filteredLists.filter(list =>
            list.title.toLowerCase().includes(lowercaseSearchTerm) || 
            list.description.toLowerCase().includes(lowercaseSearchTerm)
          );
        }
        
        // Sort the lists
        if (sortBy === 'recent') {
          filteredLists.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortBy === 'popular') {
          filteredLists.sort((a, b) => b.vote_count - a.vote_count);
        }
        
        setLists(filteredLists);
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, sortBy, searchTerm]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortChange = (sortId) => {
    setSortBy(sortId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1>Discover Lists</h1>
        <p>Browse and find top 5 lists created by the community</p>
        
        <div className="discover-search">
          <input
            type="text"
            placeholder="Search for lists..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="discover-filters">
          <div className="filter-section">
            <span className="filter-label">Category:</span>
            <div className="filter-options">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`filter-option ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-section">
            <span className="filter-label">Sort by:</span>
            <div className="filter-options">
              {sortOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                  className={`filter-option ${sortBy === option.id ? 'active' : ''}`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading lists...</p>
        </div>
      ) : lists.length === 0 ? (
        <div className="no-results">
          <h2>No lists found</h2>
          <p>Try adjusting your filters or search criteria</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSortBy('recent');
              setSearchTerm('');
            }}
            className="button button-primary reset-button"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="discover-results">
          <div className="results-count">
            Found {lists.length} list{lists.length !== 1 ? 's' : ''}
          </div>
          
          <div className="discover-grid">
            {lists.map(list => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                description={list.description}
                username={list.username}
                vote_count={list.vote_count}
                comment_count={list.comment_count}
                created_at={list.created_at}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;
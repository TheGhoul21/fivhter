import { useState, useEffect, useCallback, useRef } from 'react';
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
    created_at: '2025-03-15T10:30:00Z',
    items: [
      { id: 1, title: 'Blade Runner 2049', description: 'A stunning visual masterpiece', rank: 1 },
      { id: 2, title: 'Interstellar', description: 'Space epic about love and time', rank: 2 },
      { id: 3, title: 'The Matrix', description: 'Changed sci-fi forever', rank: 3 },
      { id: 4, title: 'Arrival', description: 'Thought-provoking alien contact', rank: 4 },
      { id: 5, title: '2001: A Space Odyssey', description: 'Kubrick\'s masterpiece', rank: 5 }
    ]
  },
  {
    id: '2',
    title: 'Top 5 Programming Languages for 2025',
    description: 'The most in-demand programming languages for this year',
    username: 'techguru',
    vote_count: 97,
    comment_count: 31,
    created_at: '2025-04-01T14:45:00Z',
    items: [
      { id: 1, title: 'TypeScript', description: 'JavaScript with static typing', rank: 1 },
      { id: 2, title: 'Rust', description: 'Memory safety without garbage collection', rank: 2 },
      { id: 3, title: 'Python', description: 'Versatile and beginner-friendly', rank: 3 },
      { id: 4, title: 'Go', description: 'Fast compilation and concurrent', rank: 4 },
      { id: 5, title: 'Kotlin', description: 'Modern Java alternative', rank: 5 }
    ]
  },
  {
    id: '3',
    title: 'Top 5 Places to Visit in Europe',
    description: 'Must-see destinations for your European adventure',
    username: 'wanderlust',
    vote_count: 85,
    comment_count: 18,
    created_at: '2025-04-10T09:15:00Z',
    items: [
      { id: 1, title: 'Barcelona, Spain', description: 'Gaudi architecture and beaches', rank: 1 },
      { id: 2, title: 'Santorini, Greece', description: 'Stunning island views', rank: 2 },
      { id: 3, title: 'Rome, Italy', description: 'Ancient history everywhere', rank: 3 },
      { id: 4, title: 'Amsterdam, Netherlands', description: 'Canals and culture', rank: 4 },
      { id: 5, title: 'Prague, Czech Republic', description: 'Fairytale architecture', rank: 5 }
    ]
  },
  {
    id: '4',
    title: 'Top 5 Fantasy Novel Series',
    description: 'Epic fantasy series that will transport you to another world',
    username: 'bookworm99',
    vote_count: 76,
    comment_count: 22,
    created_at: '2025-04-05T16:20:00Z',
    items: [
      { id: 1, title: 'The Lord of the Rings', description: 'Tolkien\'s masterpiece', rank: 1 },
      { id: 2, title: 'A Song of Ice and Fire', description: 'Politics and dragons', rank: 2 },
      { id: 3, title: 'The Wheel of Time', description: 'Epic 14-book journey', rank: 3 },
      { id: 4, title: 'The Stormlight Archive', description: 'Brandon Sanderson\'s magnum opus', rank: 4 },
      { id: 5, title: 'Harry Potter', description: 'The boy who lived', rank: 5 }
    ]
  },
  {
    id: '5',
    title: 'Top 5 Productivity Apps',
    description: 'Apps that will help you get more done in less time',
    username: 'efficiency_expert',
    vote_count: 64,
    comment_count: 15,
    created_at: '2025-04-18T11:10:00Z',
    items: [
      { id: 1, title: 'Notion', description: 'All-in-one workspace', rank: 1 },
      { id: 2, title: 'Todoist', description: 'Task management made simple', rank: 2 },
      { id: 3, title: 'Forest', description: 'Stay focused with virtual trees', rank: 3 },
      { id: 4, title: 'Trello', description: 'Visual project management', rank: 4 },
      { id: 5, title: 'Obsidian', description: 'Your second brain', rank: 5 }
    ]
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

const STORY_VIEW_TIME = 5000; // 30 seconds per story

const HomePage = () => {
  const { user } = useAuth();
  const [featuredLists, setFeaturedLists] = useState([]);
  const [recentLists, setRecentLists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Story viewing state
  const [storyViewActive, setStoryViewActive] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [userVotes, setUserVotes] = useState({});
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // For animation when transitioning between stories
  const [isExiting, setIsExiting] = useState(false);
  
  // For comment functionality
  const [comment, setComment] = useState('');

  // Load lists on component mount
  useEffect(() => {
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

  // Handler for voting on a story
  const handleVote = (listId, isUpvote) => {
    if (!user) return; // Could redirect to auth page here
    
    // Pause the auto-advance when interacting
    pauseStory();

    setFeaturedLists(prevLists => 
      prevLists.map(list => {
        if (list.id === listId) {
          // Determine vote change
          const currentVote = userVotes[listId] || 0;
          let voteChange = 0;
          
          if (isUpvote) {
            if (currentVote === 1) voteChange = -1; // Remove upvote
            else if (currentVote === -1) voteChange = 2; // Change downvote to upvote
            else voteChange = 1; // Add upvote
          } else {
            if (currentVote === -1) voteChange = 1; // Remove downvote
            else if (currentVote === 1) voteChange = -2; // Change upvote to downvote
            else voteChange = -1; // Add downvote
          }
          
          // Update vote count
          return {
            ...list,
            vote_count: list.vote_count + voteChange
          };
        }
        return list;
      })
    );
    
    // Track user's votes
    setUserVotes(prev => {
      const currentVote = prev[listId] || 0;
      let newVote;
      
      if (isUpvote) {
        newVote = currentVote === 1 ? 0 : 1;
      } else {
        newVote = currentVote === -1 ? 0 : -1;
      }
      
      return { ...prev, [listId]: newVote };
    });
  };

  // Start viewing stories
  const startStoryView = (index) => {
    setActiveStoryIndex(index);
    setStoryViewActive(true);
    setProgress(0);
    startTimer();
  };

  // Close story view
  const closeStoryView = () => {
    setStoryViewActive(false);
    stopTimer();
  };

  // Start the timer for auto-advancing
  const startTimer = useCallback(() => {
    // Clear any existing timers
    stopTimer();
    
    // Start progress bar
    let currentProgress = 0;
    progressIntervalRef.current = setInterval(() => {
      currentProgress += 150 / (STORY_VIEW_TIME/100); // Increment progress
      setProgress(Math.min(currentProgress, 100));
    }, 150); // Update progress every 150ms for smooth animation
    
    // Set main timer for advancing to next story
    timerRef.current = setTimeout(() => {
      goToNextStory();
    }, STORY_VIEW_TIME);
  }, []);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Pause story advancement
  const pauseStory = () => {
    if (!paused) {
      setPaused(true);
      stopTimer();
    }
  };

  // Resume story advancement
  const resumeStory = () => {
    if (paused) {
      setPaused(false);
      // Calculate remaining time based on progress
      const remainingTime = (STORY_VIEW_TIME * (100 - progress)) / 100;
      
      // Clear any existing timers
      stopTimer();
      
      // Continue progress bar from current position
      let currentProgress = progress;
      progressIntervalRef.current = setInterval(() => {
        currentProgress += 0.5;
        setProgress(Math.min(currentProgress, 100));
      }, 150);
      
      // Set timer for remaining time
      timerRef.current = setTimeout(() => {
        goToNextStory();
      }, remainingTime);
    }
  };

  // Go to next story with animation
  const goToNextStory = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveStoryIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < featuredLists.length) {
          setProgress(0);
          setIsExiting(false);
          startTimer();
          return nextIndex;
        } else {
          // End of stories, close the view
          setStoryViewActive(false);
          return prevIndex;
        }
      });
    }, 300); // Match the animation duration
  }, [featuredLists.length, startTimer]);

  // Go to previous story with animation
  const goToPrevStory = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveStoryIndex(prevIndex => {
        const nextIndex = prevIndex - 1;
        if (nextIndex >= 0) {
          setProgress(0);
          setIsExiting(false);
          startTimer();
          return nextIndex;
        }
        setIsExiting(false);
        return prevIndex;
      });
    }, 300); // Match the animation duration
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    
    // In a real app, you would save this comment to your database
    console.log('Comment submitted:', comment);
    
    // Clear the comment field after submission
    setComment('');
    
    // You could show a temporary success message
    // or update the UI to show the new comment
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Reset and start timer when active story changes
  useEffect(() => {
    if (storyViewActive) {
      setProgress(0);
      startTimer();
    }
  }, [activeStoryIndex, storyViewActive, startTimer]);

  // Render story viewer
  const renderStoryViewer = () => {
    if (!storyViewActive || featuredLists.length === 0) return null;
    
    const story = featuredLists[activeStoryIndex];
    
    return (
      <div 
        className="story-viewer-overlay" 
        onClick={closeStoryView}
        onMouseDown={pauseStory}
        onMouseUp={resumeStory}
        onTouchStart={pauseStory}
        onTouchEnd={resumeStory}
      >
        <div className="story-viewer" onClick={(e) => e.stopPropagation()}>
          <div className="story-progress-container">
            {featuredLists.map((_, index) => (
              <div 
                key={index} 
                className={`story-progress ${index === activeStoryIndex ? 'active' : ''} ${index < activeStoryIndex ? 'completed' : ''}`}
              >
                <div 
                  className="story-progress-bar" 
                  style={index === activeStoryIndex ? { width: `${progress}%` } : {}}
                ></div>
              </div>
            ))}
          </div>
          
          <div className="story-header">
            <div className="story-user-info">
              <div className="story-avatar">{story.username.charAt(0).toUpperCase()}</div>
              <span className="story-username">@{story.username}</span>
            </div>
            <div className="story-actions-top">
              <button className="story-close-button" onClick={closeStoryView}>×</button>
            </div>
          </div>
          
          <div className="story-navigation">
            <div className="story-nav-prev" onClick={(e) => { e.stopPropagation(); goToPrevStory(); }}></div>
            <div className="story-nav-next" onClick={(e) => { e.stopPropagation(); goToNextStory(); }}></div>
          </div>
          
          <div className={`story-content ${isExiting ? 'exiting' : ''}`}>
            <h2 className="story-title">{story.title}</h2>
            <p className="story-description">{story.description}</p>
            
            <div className="story-items">
              {story.items.map((item) => (
                <div key={item.id} className="story-item">
                  <span className="story-item-rank">{item.rank}</span>
                  <div className="story-item-content">
                    <h3 className="story-item-title">{item.title}</h3>
                    <p className="story-item-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="story-footer">
            <button 
              className={`story-vote-button ${userVotes[story.id] === -1 ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleVote(story.id, false); }}
              aria-label="Downvote"
            >
              <span className="vote-down-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 10l5 5 5-5"></path>
                </svg>
              </span>
            </button>
            
            <form 
              className="story-comment-form" 
              onSubmit={handleCommentSubmit}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                className="story-comment-input"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onClick={(e) => {
                  e.stopPropagation();
                  pauseStory();
                }}
              />
              <button 
                type="submit" 
                className="story-comment-submit"
                onClick={(e) => e.stopPropagation()}
              >
                Post
              </button>
            </form>
            
            <button 
              className={`story-vote-button ${userVotes[story.id] === 1 ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleVote(story.id, true); }}
              aria-label="Upvote"
            >
              <span className="vote-up-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 14l5-5 5 5"></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderStoryViewer()}
      
      <section className="stories-section">
        <div className="section-header">
          <h2 className="section-title">Trending Top 5's</h2>
          {user ? (
            <Link to="/create" className="button button-primary create-button">Create a List</Link>
          ) : (
            <Link to="/auth" className="button button-primary">Sign Up</Link>
          )}
        </div>
        
        <div className="stories-container">
          {loading ? (
            <div className="stories-loading">
              <div className="loading-spinner"></div>
              <p>Loading trending lists...</p>
            </div>
          ) : (
            <div className="stories-circles">
              {featuredLists.map((list, index) => (
                <div 
                  key={list.id} 
                  className="story-circle-wrapper"
                  onClick={() => startStoryView(index)}
                >
                  <div className="story-circle">
                    <span className="story-circle-number">5</span>
                  </div>
                  <span className="story-circle-username">{list.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {loading ? null : (
        <>
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
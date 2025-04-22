import React from 'react';
import { Link } from 'react-router-dom';

interface ListProps {
  id: string;
  title: string;
  description?: string;
  username: string;
  vote_count: number;
  comment_count: number;
  created_at: string;
  compact?: boolean;
  featured?: boolean;
}

const ListCard: React.FC<ListProps> = ({
  id,
  title,
  description,
  username,
  vote_count,
  comment_count,
  created_at,
  compact = false,
  featured = false
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (compact) {
    return (
      <Link to={`/list/${id}`} className="recent-list">
        <div>
          <h3 className="recent-list-title">{title}</h3>
          <p className="recent-list-meta">@{username} • {formatDate(created_at)}</p>
        </div>
        <div className="recent-list-stats">
          {vote_count} votes • {comment_count} comments
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/list/${id}`} className={`card ${featured ? 'featured-card' : ''}`}>
      <h3 className="card-title">{title}</h3>
      {description && <p className="card-description">{description}</p>}
      <div className="card-footer">
        <span>@{username}</span>
        <span>{vote_count} votes • {comment_count} comments</span>
      </div>
    </Link>
  );
};

export default ListCard;
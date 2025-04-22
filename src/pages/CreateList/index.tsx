import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createList } from '../../lib/supabase';
import { ListItem, TopFiveListFormState } from '../../types';

const CreateListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, title: '', description: '', rank: 1, list_id: '', created_at: '' },
    { id: 2, title: '', description: '', rank: 2, list_id: '', created_at: '' },
    { id: 3, title: '', description: '', rank: 3, list_id: '', created_at: '' },
    { id: 4, title: '', description: '', rank: 4, list_id: '', created_at: '' },
    { id: 5, title: '', description: '', rank: 5, list_id: '', created_at: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth', { state: { from: '/create' } });
    }
  }, [user, navigate]);

  const updateItem = (id: number, field: 'title' | 'description', value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const validateForm = () => {
    // Reset previous error
    setError(null);
    
    // Validate title
    if (!title.trim()) {
      setError('Please provide a title for your list');
      return false;
    }
    
    // Check if all items have titles
    const emptyItems = items.filter(item => !item.title.trim());
    if (emptyItems.length > 0) {
      setError(`Please provide a title for item #${emptyItems[0].rank}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    setLoading(true);
    
    try {
      // Prepare the list data
      const listData: TopFiveListFormState = {
        title,
        description,
        items: items.map(item => ({
          title: item.title,
          description: item.description || '',
          rank: item.rank
        }))
      };
      
      // Call our mock createList function
      const { data, error: apiError } = await createList({
        list: {
          title,
          description,
          user_id: user.id,
          category: 'other',
          visibility: 'public'
        },
        items: listData.items
      });
      
      if (apiError) throw new Error(apiError.message);
      
      // Navigate to the list detail page or profile page
      navigate('/profile', { state: { message: 'List created successfully!' } });
    } catch (error: any) {
      console.error('Error creating list:', error);
      setError(error.message || 'An error occurred while creating the list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-list-container">
      <div className="create-list-header">
        <h1>Create a New Top 5 List</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="create-list-form">
        {error && (
          <div className="form-error-message">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="title">List Title <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="e.g., My Top 5 Favorite Movies"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="form-textarea"
            placeholder="A brief description of your list"
          />
        </div>
        
        <div className="form-section">
          <h2>Your Top 5 Items</h2>
          
          <div className="items-list">
            {items.map((item) => (
              <div key={item.id} className="list-item">
                <div className="item-rank">{item.rank}</div>
                
                <div className="item-fields">
                  <div className="form-group">
                    <label htmlFor={`item-${item.id}-title`}>
                      Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id={`item-${item.id}-title`}
                      value={item.title}
                      onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                      className="form-input"
                      placeholder={`Your #${item.rank} pick`}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor={`item-${item.id}-description`}>
                      Explanation (optional)
                    </label>
                    <textarea
                      id={`item-${item.id}-description`}
                      value={item.description || ''}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      rows={2}
                      className="form-textarea"
                      placeholder="Why did you pick this?"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="button button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="button button-primary create-button"
          >
            {loading ? 'Creating...' : 'Create List'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateListPage;
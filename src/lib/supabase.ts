import { createClient } from '@supabase/supabase-js';
import { Database, List, ListItem, Profile } from '../types/supabase';

// This is just a placeholder for now.
// In a real app, you'd use your actual Supabase URL and anon key from environment variables
const supabaseUrl = 'https://example.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

interface CreateListParams {
  list: {
    title: string;
    description?: string | null;
    user_id: string;
    category?: string;
    visibility?: 'public' | 'private';
  };
  items: Array<{
    title: string;
    description?: string | null;
    rank: number;
  }>;
}

interface UpdateListParams {
  title?: string;
  description?: string | null;
  visibility?: 'public' | 'private';
  items?: Array<{
    id?: string;
    title?: string;
    description?: string | null;
    rank?: number;
  }>;
}

// For development/demo purposes, we'll use mock functions
// These would be replaced with actual Supabase calls in production
export const mockSignIn = async (email: string, password: string) => {
  // In a real app, this would use supabase.auth.signInWithPassword
  console.log('Mock sign in with:', email);
  
  if (!email.includes('@') || password.length < 6) {
    return {
      data: null,
      error: { message: 'Invalid email or password' },
    };
  }
  
  const mockUser = {
    id: 'mock-user-id',
    email,
    username: email.split('@')[0],
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('fivhter_user', JSON.stringify(mockUser));
  
  return {
    data: {
      user: mockUser,
      session: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
      },
    },
    error: null,
  };
};

export const mockSignUp = async (email: string, password: string) => {
  // In a real app, this would use supabase.auth.signUp
  console.log('Mock sign up with:', email);
  
  if (!email.includes('@')) {
    return {
      data: null,
      error: { message: 'Invalid email address' },
    };
  }
  
  if (password.length < 6) {
    return {
      data: null,
      error: { message: 'Password must be at least 6 characters' },
    };
  }
  
  return {
    data: {
      user: {
        id: 'new-user-id',
        email,
        username: email.split('@')[0],
      },
      session: null,
    },
    error: null,
  };
};

export const mockSignOut = async () => {
  // In a real app, this would use supabase.auth.signOut
  console.log('Mock sign out');
  localStorage.removeItem('fivhter_user');
  return {
    error: null,
  };
};

export const getUser = async () => {
  // In a real app, this would use supabase.auth.getUser()
  const storedUser = localStorage.getItem('fivhter_user');
  if (storedUser) {
    return {
      data: { user: JSON.parse(storedUser) },
      error: null,
    };
  }
  
  return {
    data: { user: null },
    error: null,
  };
};

export const mockSignInWithGoogle = async () => {
  // In a real app, this would use supabase.auth.signInWithOAuth({ provider: 'google' })
  console.log('Mock sign in with Google');
  
  // Generate a mock Google user
  const mockGoogleUser = {
    id: 'google-user-id',
    email: 'google-user@example.com',
    username: 'google_user',
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('fivhter_user', JSON.stringify(mockGoogleUser));
  
  // Make sure we have a profile for this user
  if (!mockProfiles[mockGoogleUser.id]) {
    mockProfiles[mockGoogleUser.id] = {
      id: mockGoogleUser.id,
      username: mockGoogleUser.username,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: null,
    };
  }
  
  return {
    data: {
      user: mockGoogleUser,
      session: {
        access_token: 'mock-google-token',
        refresh_token: 'mock-google-refresh-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
      },
    },
    error: null,
  };
};

// Mock database
const mockLists: Record<string, List> = {};
const mockListItems: Record<string, ListItem[]> = {};
const mockProfiles: Record<string, Profile> = {
  'mock-user-id': {
    id: 'mock-user-id',
    username: 'demo_user',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: null,
  },
  'new-user-id': {
    id: 'new-user-id',
    username: 'new_user',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: null,
  }
};

export const createList = async ({ list, items }: CreateListParams) => {
  // In a real app, this would insert into your Supabase tables
  console.log('Creating list with data:', { list, items });
  
  try {
    // Generate a mock list ID
    const listId = `list-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    // Create the list
    const newList: List = {
      id: listId,
      title: list.title,
      description: list.description || null,
      user_id: list.user_id,
      created_at: timestamp,
      updated_at: null,
    };
    
    // Store in our mock database
    mockLists[listId] = newList;
    
    // Create the list items
    const newItems: ListItem[] = items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      list_id: listId,
      title: item.title,
      description: item.description || null,
      rank: item.rank,
      created_at: timestamp,
    }));
    
    // Store in our mock database
    mockListItems[listId] = newItems;
    
    return {
      data: { id: listId, ...newList, items: newItems },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'An error occurred while creating the list' },
    };
  }
};

export const fetchLists = async (options: { userId?: string; limit?: number; page?: number } = {}) => {
  // In a real app, this would query your Supabase tables
  console.log('Fetching lists with options:', options);
  
  try {
    // Get all lists
    let results = Object.values(mockLists);
    
    // Filter by user ID if provided
    if (options.userId) {
      results = results.filter(list => list.user_id === options.userId);
    }
    
    // Sort by created_at (newest first)
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Apply pagination if requested
    if (options.limit) {
      const page = options.page || 0;
      const start = page * options.limit;
      results = results.slice(start, start + options.limit);
    }
    
    // Add items to each list
    const listsWithItems = results.map(list => ({
      ...list,
      items: (mockListItems[list.id] || []).sort((a, b) => a.rank - b.rank),
      user: mockProfiles[list.user_id],
    }));
    
    return {
      data: listsWithItems,
      error: null,
    };
  } catch (error: any) {
    return {
      data: [],
      error: { message: error.message || 'An error occurred while fetching lists' },
    };
  }
};

export const fetchListById = async (id: string) => {
  // In a real app, this would query a specific list from Supabase
  console.log('Fetching list with ID:', id);
  
  try {
    const list = mockLists[id];
    
    if (!list) {
      return {
        data: null,
        error: { message: 'List not found' },
      };
    }
    
    // Get the items for this list
    const items = mockListItems[id] || [];
    
    // Get the user who created this list
    const user = mockProfiles[list.user_id];
    
    return {
      data: {
        ...list,
        items: items.sort((a, b) => a.rank - b.rank),
        user,
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'An error occurred while fetching the list' },
    };
  }
};

export const updateList = async (id: string, updates: UpdateListParams) => {
  // In a real app, this would update a list in Supabase
  console.log('Updating list:', id, updates);
  
  try {
    const list = mockLists[id];
    
    if (!list) {
      return {
        data: null,
        error: { message: 'List not found' },
      };
    }
    
    // Update the list
    if (updates.title) list.title = updates.title;
    if (updates.description !== undefined) list.description = updates.description;
    list.updated_at = new Date().toISOString();
    
    // Update items if provided
    if (updates.items) {
      const existingItems = mockListItems[id] || [];
      
      updates.items.forEach(itemUpdate => {
        if (!itemUpdate.id) {
          // This is a new item
          const newItem: ListItem = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            list_id: id,
            title: itemUpdate.title || '',
            description: itemUpdate.description || null,
            rank: itemUpdate.rank || existingItems.length + 1,
            created_at: new Date().toISOString(),
          };
          existingItems.push(newItem);
        } else {
          // Update existing item
          const existingItem = existingItems.find(item => item.id === itemUpdate.id);
          if (existingItem) {
            if (itemUpdate.title) existingItem.title = itemUpdate.title;
            if (itemUpdate.description !== undefined) existingItem.description = itemUpdate.description;
            if (itemUpdate.rank) existingItem.rank = itemUpdate.rank;
          }
        }
      });
      
      mockListItems[id] = existingItems;
    }
    
    return {
      data: { 
        ...list, 
        items: (mockListItems[id] || []).sort((a, b) => a.rank - b.rank),
        user: mockProfiles[list.user_id],
      },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'An error occurred while updating the list' },
    };
  }
};

export const deleteList = async (id: string) => {
  // In a real app, this would delete a list from Supabase
  console.log('Deleting list:', id);
  
  try {
    if (!mockLists[id]) {
      return {
        data: null,
        error: { message: 'List not found' },
      };
    }
    
    // Delete the list and its items
    delete mockLists[id];
    delete mockListItems[id];
    
    return {
      data: { success: true },
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'An error occurred while deleting the list' },
    };
  }
};
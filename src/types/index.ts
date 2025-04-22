import { List, ListItem, Profile, Comment, Database, Json } from './supabase';

export type { List, ListItem, Profile, Comment, Database, Json };

// Basic types for the application
export interface User {
  id: string;
  email?: string;
  username: string;
  avatar_url?: string | null;
}

export interface ListItem {
  id: number;
  title: string;
  description?: string;
  rank: number;
  list_id: string;
}

export interface TopFiveList {
  id: string;
  title: string;
  description: string | null;
  items: ListItem[];
  user_id: string;
  user?: Profile;
  created_at: string;
  updated_at: string | null;
  vote_count?: number;
  comment_count?: number;
  visibility?: 'public' | 'private';
  category?: string | null;
}

export interface Comment {
  id: string;
  list_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export interface Vote {
  id: string;
  list_id: string;
  user_id: string;
  created_at: string;
}

// Form state types
export interface TopFiveListFormState {
  title: string;
  description: string | null;
  items: Array<{
    title: string;
    description: string | null;
    rank: number;
  }>;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}

export interface CreateListRequest {
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

export interface UpdateListRequest {
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
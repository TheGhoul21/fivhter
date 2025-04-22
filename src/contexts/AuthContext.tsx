import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockSignIn, mockSignUp, mockSignOut, getUser, mockSignInWithGoogle } from '../lib/supabase';
import { User, AuthContextType } from '../types';

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await getUser();
        
        if (error) {
          console.error('Error checking auth state', error);
          return;
        }
        
        if (data.user) {
          setUser(data.user as User);
        }
      } catch (error) {
        console.error('Error checking auth state', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await mockSignIn(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user as User);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google function
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await mockSignInWithGoogle();
      
      if (error) {
        console.error('Error signing in with Google', error);
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user as User);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await mockSignUp(email, password);
      
      if (error) {
        return { error };
      }
      
      // Note: In a real app with email verification, the user wouldn't be
      // automatically signed in after registration
      
      return { error: null };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    const { error } = await mockSignOut();
    
    if (error) {
      console.error('Error signing out', error);
    }
    
    setUser(null);
    setLoading(false);
  };

  // Create the context value object
  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
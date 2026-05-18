import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session status on mount
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // 2. Listen for auth changes (e.g., login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription when the hook unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 3. Trigger GitHub Login Flow
  const loginWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // Tells Supabase where to redirect back after a successful login
          redirectTo: window.location.origin, 
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Authentication Error:", error);
      alert("Failed to log in with GitHub.");
    }
  };

  // 4. Trigger Log Out Flow
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return { user, loading, loginWithGitHub, logout };
};
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { UserStats } from '../types';

export interface LeaderboardGroup {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export const useLeetCode = (userId: string | undefined) => {
  const [leaderboards, setLeaderboards] = useState<LeaderboardGroup[]>([]);
  const [activeLeague, setActiveLeague] = useState<LeaderboardGroup | null>(null);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all leaderboards owned by this user
  const fetchLeaderboards = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      setLeaderboards(data || []);
      // Auto-select the first leaderboard if one exists and none is active
      if (data && data.length > 0 && !activeLeague) {
        setActiveLeague(data[0]);
      }
    } catch (err) {
      console.error('Error fetching leaderboards:', err);
    }
  }, [userId, activeLeague]);

  // Helper: Fetch individual user stats from LeetCode API
  const fetchLeetCodeStats = async (username: string): Promise<UserStats | null> => {
    try {
      const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
      if (!response.ok) return null;
      const data = await response.json();
      return {
        id: username,
        username,
        rank: 0,
        totalSolved: data.solvedProblem || 0,
        easy: data.easySolved || 0,
        medium: data.mediumSolved || 0,
        hard: data.hardSolved || 0,
      };
    } catch (e) {
      return null;
    }
  };

  // 2. Fetch all members belonging to the active league
  const fetchLeagueMembers = useCallback(async () => {
    if (!activeLeague) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data: members, error } = await supabase
        .from('leaderboard_members')
        .select('leetcode_username')
        .eq('leaderboard_id', activeLeague.id);

      if (error) throw error;

      if (!members || members.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Concurrently query the LeetCode API for every username saved in this league
      const results = await Promise.all(
        members.map(m => fetchLeetCodeStats(m.leetcode_username))
      );
      
      const validUsers = results.filter((u): u is UserStats => u !== null);
      setUsers(validUsers.sort((a, b) => b.totalSolved - a.totalSolved));
    } catch (err) {
      console.error('Error loading league members:', err);
    } finally {
      setLoading(false);
    }
  }, [activeLeague]);

  // Trigger loading leaderboards on mount/auth change
  useEffect(() => {
    fetchLeaderboards();
  }, [userId, fetchLeaderboards]);

  // Trigger loading league data whenever the selected league changes
  useEffect(() => {
    fetchLeagueMembers();
  }, [activeLeague, fetchLeagueMembers]);

  // 3. Create a brand new leaderboard group
  const createLeaderboard = async (name: string) => {
    if (!name.trim() || !userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboards')
        .insert([{ name, owner_id: userId }])
        .select()
        .single();

      if (error) throw error;

      setLeaderboards(prev => [...prev, data]);
      setActiveLeague(data); // Switch view directly to the new league
    } catch (err) {
      console.error('Error creating leaderboard:', err);
      alert('Could not create leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Add a LeetCode user handle to the current active league
  const addUser = async (username: string) => {
    if (!activeLeague) {
      alert('Please select or create a leaderboard first!');
      return;
    }
    
    const formattedUsername = username.trim();
    if (users.some(u => u.username.toLowerCase() === formattedUsername.toLowerCase())) {
      alert('User already exists in this leaderboard!');
      return;
    }

    setLoading(true);
    const newUser = await fetchLeetCodeStats(formattedUsername);
    
    if (newUser) {
      try {
        const { error } = await supabase
          .from('leaderboard_members')
          .insert([{ leaderboard_id: activeLeague.id, leetcode_username: formattedUsername }]);

        if (error) throw error;

        setUsers(prev => [...prev, newUser].sort((a, b) => b.totalSolved - a.totalSolved));
      } catch (err) {
        console.error('Error saving member to database:', err);
      }
    } else {
      alert('User not found on LeetCode!');
    }
    setLoading(false);
  };

  return {
    users,
    loading,
    leaderboards,
    activeLeague,
    setActiveLeague,
    createLeaderboard,
    addUser,
    refreshAll: fetchLeagueMembers
  };
};
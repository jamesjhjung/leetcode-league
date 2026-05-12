import { useState } from 'react';
import type { UserStats } from '../types';

export const useLeetCode = () => {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (username: string): Promise<UserStats | null> => {
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

  const refreshAll = async () => {
    if (users.length === 0) return;
    setLoading(true);
    const results = await Promise.all(users.map(u => fetchUser(u.username)));
    const validUsers = results.filter((u): u is UserStats => u !== null);
    setUsers(validUsers.sort((a, b) => b.totalSolved - a.totalSolved));
    setLoading(false);
  };

  const addUser = async (username: string) => {
    setLoading(true);
    const newUser = await fetchUser(username);
    if (newUser) {
      setUsers(prev => [...prev, newUser].sort((a, b) => b.totalSolved - a.totalSolved));
    } else {
      alert("User not found!");
    }
    setLoading(false);
  };

  return { users, loading, addUser, refreshAll };
};
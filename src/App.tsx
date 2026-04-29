import { useState, useEffect } from 'react';

// Data Contract (TypeScript Interface)
interface UserStats {
  id: string;
  username: string;
  rank: number;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}

function App() {
  // 1. State: Where we store the data once it arrives
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. The Fetch Function: This talks to the LeetCode API
  const fetchGroupStats = async () => {
    setLoading(true);
    // Ensure these handles exist and are public!
    const usernames = ["jamesjhjung", "tourist", "neal_wu"]; 

    try {
      const results = await Promise.all(
        usernames.map(async (username) => {
          try {
            // NEW API URL
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
            
            if (!response.ok) throw new Error("Fetch failed");
            
            const data = await response.json();

            // This API has a slightly different data structure:
            // totalSolved, easySolved, mediumSolved, hardSolved
            return {
              id: username,
              username: username,
              rank: 0, 
              totalSolved: data.solvedProblem || 0,
              easy: data.easySolved || 0,
              medium: data.mediumSolved || 0,
              hard: data.hardSolved || 0,
            };
          } catch (e) {
            console.error(`Error for ${username}:`, e);
            return null;
          }
        })
      );

      const validUsers = results.filter((u): u is UserStats => u !== null);
      
      if (validUsers.length === 0) {
        setUsers([{ id: 'err', username: "Check handles/Network", rank: 0, totalSolved: 0, easy: 0, medium: 0, hard: 0 }]);
      } else {
        setUsers(validUsers.sort((a, b) => b.totalSolved - a.totalSolved));
      }
    } catch (error) {
      console.error("Critical Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. The Trigger: Run fetchGroupStats once when the component mounts
  useEffect(() => {
    fetchGroupStats();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500/30 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
              LeetCode League
            </h1>
            <p className="text-neutral-500 mt-3 text-lg">Live Classmate Leaderboard</p>
          </div>
          <button 
            onClick={fetchGroupStats}
            className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-sm font-mono text-neutral-400 hover:text-white transition-colors"
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </header>

        {loading ? (
          /* Loading State: A simple placeholder */
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          /* The Leaderboard Table */
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                  <th className="p-5 text-neutral-400 font-medium text-sm">Rank</th>
                  <th className="p-5 text-neutral-400 font-medium text-sm">Developer</th>
                  <th className="p-5 text-neutral-400 font-medium text-sm text-center">Solved</th>
                  <th className="p-5 text-neutral-400 font-medium text-sm text-center text-green-500/80">Easy</th>
                  <th className="p-5 text-neutral-400 font-medium text-sm text-center text-yellow-500/80">Med</th>
                  <th className="p-5 text-neutral-400 font-medium text-sm text-center text-red-500/80">Hard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {users.map((user, index) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-5 font-mono text-neutral-500">#{index + 1}</td>
                    <td className="p-5 font-semibold text-neutral-200">{user.username}</td>
                    <td className="p-5 text-center font-bold text-white">{user.totalSolved}</td>
                    <td className="p-5 text-center text-neutral-400">{user.easy}</td>
                    <td className="p-5 text-center text-neutral-400">{user.medium}</td>
                    <td className="p-5 text-center text-neutral-400">{user.hard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
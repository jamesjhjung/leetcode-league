import { useState } from 'react';
import { useLeetCode } from './hooks/useLeetCode';
import { useAuth } from './hooks/useAuth';
import { LeaderboardTable } from './components/LeaderboardTable';

export default function App() {
  const { user, loading: authLoading, loginWithGitHub, logout } = useAuth();
  const { 
    users, 
    loading: apiLoading, 
    leaderboards,
    activeLeague,
    setActiveLeague,
    createLeaderboard,
    addUser, 
    refreshAll 
  } = useLeetCode(user?.id);

  const [newHandle, setNewHandle] = useState("");

  const handleAddUser = () => {
    if (newHandle.trim()) {
      addUser(newHandle);
      setNewHandle("");
    }
  };

  const handleCreateLeague = () => {
    const leagueName = prompt("Enter a name for your new LeetCode League:");
    if (leagueName && leagueName.trim()) {
      createLeaderboard(leagueName);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400 font-mono animate-pulse">Syncing session...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="text-center max-w-md z-10">
          <h1 className="text-6xl font-black bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent tracking-tight">
            LeetCode League
          </h1>
          <p className="text-neutral-500 mt-4 text-lg">
            Track coding stats, rank classmates, and level up together.
          </p>
          <button 
            onClick={loginWithGitHub}
            className="mt-8 w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-98 shadow-xl"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Sign In with GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 md:p-16 relative">
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto">
        {/* User Profile Bar */}
        <div className="flex justify-end items-center gap-4 mb-6">
          <span className="text-xs font-mono text-neutral-500">
            Logged in as <span className="text-neutral-300 font-semibold">{user.user_metadata.user_name || user.email}</span>
          </span>
          <button 
            onClick={logout}
            className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 px-3 py-1.5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>

        <header className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tight">LeetCode League</h1>
            <p className="text-neutral-500 mt-2">Live Classmate Leaderboard</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2 w-full">
              <input 
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                placeholder="LeetCode Handle"
                className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors w-full sm:w-48"
              />
              <button 
                onClick={handleAddUser} 
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
              >
                Add User
              </button>
            </div>
            <button 
              onClick={refreshAll} 
              disabled={apiLoading}
              className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg text-sm font-mono text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {apiLoading ? "Updating..." : "Refresh All"}
            </button>
          </div>
        </header>

        {/* --- LEAGUE CONFIGURATION ACTION PANEL --- */}
        <div className="mb-6 p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Select League:</label>
            {leaderboards.length > 0 ? (
              <select
                value={activeLeague?.id || ""}
                onChange={(e) => {
                  const selected = leaderboards.find(l => l.id === e.target.value);
                  if (selected) setActiveLeague(selected);
                }}
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-200 focus:outline-none focus:border-orange-500"
              >
                {leaderboards.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-neutral-500 italic">No leagues created yet.</span>
            )}
          </div>
          
          <button
            onClick={handleCreateLeague}
            className="text-xs bg-neutral-950 border border-neutral-800 text-orange-500 hover:bg-neutral-900 font-semibold px-4 py-2 rounded-lg transition-colors active:scale-98 text-center"
          >
            + Create New League
          </button>
        </div>

        {apiLoading && users.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <LeaderboardTable users={users} />
        )}
      </div>
    </div>
  );
}
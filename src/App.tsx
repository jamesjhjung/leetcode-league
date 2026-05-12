import { useState } from 'react';
import { useLeetCode } from './hooks/useLeetCode';
import { LeaderboardTable } from './components/LeaderboardTable';

export default function App() {
  const { users, loading, addUser, refreshAll } = useLeetCode();
  const [newHandle, setNewHandle] = useState("");

  const handleAdd = () => {
    if (newHandle.trim()) {
      addUser(newHandle);
      setNewHandle("");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 md:p-16">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black text-white">LeetCode League</h1>
            <p className="text-neutral-500 mt-2">UBC Classmate Leaderboard</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
              placeholder="LeetCode Handle"
              className="bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-lg"
            />
            <button onClick={handleAdd} className="bg-orange-600 px-4 py-2 rounded-lg font-bold">Add</button>
            <button onClick={refreshAll} className="border border-neutral-800 px-4 py-2 rounded-lg text-neutral-400">Refresh</button>
          </div>
        </header>

        {loading ? <p className="text-center py-20 animate-pulse">Fetching Stats...</p> : <LeaderboardTable users={users} />}
      </div>
    </div>
  );
}
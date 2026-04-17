// 1. Data Contract (TypeScript Interface)
interface UserStats {
  id: string;
  username: string;
  rank: number;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
}

// 2. Sample Data
const MOCK_DATA: UserStats[] = [
  { id: '1', username: "vancouver_dev", rank: 1, totalSolved: 452, easy: 200, medium: 200, hard: 52 },
  { id: '2', username: "coffee_coder", rank: 2, totalSolved: 310, easy: 150, medium: 130, hard: 30 },
  { id: '3', username: "ubc_swe_2026", rank: 3, totalSolved: 125, easy: 80, medium: 40, hard: 5 },
];

function App() {
  return (
    // We use a dark background (neutral-950) for that pro developer look
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-orange-500/30 font-sans">
      
      {/* Visual background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white to-neutral-500 bg-clip-text text-transparent">
              LeetCode League
            </h1>
            <p className="text-neutral-500 mt-3 text-lg">
              Tracking the grind. One medium at a time.
            </p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 px-4 py-2 rounded-lg text-sm font-mono text-neutral-400">
            v1.0.0-beta
          </div>
        </header>

        {/* The Leaderboard Table */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="p-5 text-neutral-400 font-medium text-sm">#</th>
                <th className="p-5 text-neutral-400 font-medium text-sm">Developer</th>
                <th className="p-5 text-neutral-400 font-medium text-sm text-center">Solved</th>
                <th className="p-5 text-neutral-400 font-medium text-sm text-center">Easy</th>
                <th className="p-5 text-neutral-400 font-medium text-sm text-center text-yellow-500/80">Med</th>
                <th className="p-5 text-neutral-400 font-medium text-sm text-center text-red-500/80">Hard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {MOCK_DATA.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 font-mono text-neutral-500">0{user.rank}</td>
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

        {/* Action Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-all active:scale-95 cursor-pointer">
            Add Your Handle
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
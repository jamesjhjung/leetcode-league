import type { UserStats } from '../types';

interface Props {
  users: UserStats[];
}

export const LeaderboardTable = ({ users }: Props) => (
  <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl backdrop-blur-md overflow-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-neutral-800 bg-neutral-900/50 text-neutral-400 text-sm">
          <th className="p-5 font-medium">Rank</th>
          <th className="p-5 font-medium">Developer</th>
          <th className="p-5 font-medium text-center">Solved</th>
          <th className="p-5 font-medium text-center text-green-500/80">Easy</th>
          <th className="p-5 font-medium text-center text-yellow-500/80">Med</th>
          <th className="p-5 font-medium text-center text-red-500/80">Hard</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-800/50">
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
              <td className="p-5 font-mono text-neutral-500">#{index + 1}</td>
              <td className="p-5 font-semibold text-neutral-200">{user.username}</td>
              <td className="p-5 text-center font-bold text-white">{user.totalSolved}</td>
              <td className="p-5 text-center text-neutral-400">{user.easy}</td>
              <td className="p-5 text-center text-neutral-400">{user.medium}</td>
              <td className="p-5 text-center text-neutral-400">{user.hard}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="p-20 text-center text-neutral-500 italic">
              No classmates added yet. Use the search bar above!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
import type { SimilarityMatch } from '../../types';
import { similarityRisk } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface Props {
  matches: SimilarityMatch[];
  highestScore: number | null;
}

export default function SimilarityCard({ matches, highestScore }: Props) {
  if (!matches || matches.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-sm font-bold text-slate-700 mb-1">Similarity Analysis</p>
        <p className="text-xs text-slate-500">No similar proposals found in the database — this appears to be a unique submission.</p>
      </div>
    );
  }

  const chartData = matches.map((m) => ({
    name: m.title.length > 30 ? m.title.slice(0, 30) + '…' : m.title,
    score: m.similarity_score,
  }));

  const barColor = (score: number) =>
    score >= 80 ? '#f43f5e' : score >= 50 ? '#f59e0b' : '#6366f1';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Semantic similarity indicates potentially related content and should be reviewed by an expert.
          High similarity is <strong>not</strong> proof of plagiarism.
        </p>
      </div>

      {/* Top score */}
      {highestScore !== null && highestScore !== undefined && (
        <div className="card p-5">
          <p className="text-xs text-slate-500 mb-1">Highest Similarity Score</p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-slate-800">{highestScore}%</p>
            <div className="mb-1">
              {(() => {
                const risk = similarityRisk(highestScore);
                const cls = {
                  rose: 'badge-rose', amber: 'badge-amber',
                  emerald: 'badge-emerald', slate: 'badge-slate',
                }[risk.color] ?? 'badge-slate';
                return <span className={cls}>{risk.label}</span>;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="card p-5">
        <p className="text-sm font-bold text-slate-700 mb-4">Similarity by Proposal</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Similarity']}
              contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={barColor(d.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Proposal</th>
              <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Similarity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {matches.map((m, i) => {
              const risk = similarityRisk(m.similarity_score);
              const cls = { rose: 'text-rose-600', amber: 'text-amber-600', emerald: 'text-emerald-600', slate: 'text-slate-400' }[risk.color];
              return (
                <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-xs text-slate-400 mr-2">#{i + 1}</span>
                    <span className="text-sm text-slate-700">{m.title}</span>
                  </td>
                  <td className={`px-5 py-3 text-right font-bold ${cls}`}>
                    {m.similarity_score}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

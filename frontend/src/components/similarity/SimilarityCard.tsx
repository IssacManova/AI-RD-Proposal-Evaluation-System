import type { SimilarityMatch } from '../../types';
import { similarityRisk } from '../../utils/format';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Info, Search } from 'lucide-react';

interface Props {
  matches: SimilarityMatch[];
  highestScore: number | null;
}

export default function SimilarityCard({ matches, highestScore }: Props) {
  if (!matches || matches.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        {/* Methodology explanation */}
        <div className="card p-5 flex items-start gap-3 bg-primary-50/40 border-primary-100">
          <Search className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-primary-700 mb-1">Semantic Similarity Analysis</p>
            <p className="text-xs text-primary-600 leading-relaxed">
              This system uses <strong>Sentence-BERT embeddings</strong> and <strong>cosine similarity</strong> to detect
              semantically similar previously submitted proposals. High similarity does <strong>not</strong> imply plagiarism —
              it indicates related research topics and should be interpreted by a human expert.
            </p>
          </div>
        </div>
        <div className="card p-10 text-center">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">No Similar Proposals Found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            This appears to be a unique submission — no semantically similar proposals were found in the database.
          </p>
        </div>
      </div>
    );
  }

  const chartData = matches.map((m) => ({
    name: m.title.length > 28 ? m.title.slice(0, 28) + '…' : m.title,
    score: Number(m.similarity_score.toFixed(2)),
  }));

  const barColor = (score: number) =>
    score >= 80 ? '#f43f5e' : score >= 50 ? '#f59e0b' : score >= 25 ? '#6366f1' : '#94a3b8';

  const riskCls: Record<string, string> = {
    rose: 'badge-rose', amber: 'badge-amber', emerald: 'badge-emerald', slate: 'badge-slate',
  };

  const barBg = (score: number) =>
    score >= 80 ? 'bg-rose-500' : score >= 50 ? 'bg-amber-500' : score >= 25 ? 'bg-primary-500' : 'bg-slate-300';

  const scoreTxt = (score: number) =>
    score >= 80 ? 'text-rose-600' : score >= 50 ? 'text-amber-600' : score >= 25 ? 'text-primary-600' : 'text-slate-400';

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Methodology explanation */}
      <div className="card p-5 flex items-start gap-3 bg-primary-50/40 border-primary-100">
        <Search className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-primary-700 mb-1">Semantic Similarity Analysis</p>
          <p className="text-xs text-primary-600 leading-relaxed">
            Uses <strong>Sentence-BERT embeddings</strong> and <strong>cosine similarity</strong> to identify
            semantically similar previously submitted research proposals. This is <strong>not plagiarism detection</strong> —
            high similarity indicates related research areas and should be assessed by a human expert.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          Semantic similarity indicates potentially related content. High similarity is <strong>not</strong> proof of plagiarism
          and should be reviewed by an expert before any conclusion is drawn.
        </p>
      </div>

      {/* Top score highlight */}
      {highestScore !== null && highestScore !== undefined && (
        <div className="card p-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Highest Semantic Similarity
              </p>
              <div className="flex items-end gap-3">
                <p className="text-4xl font-extrabold text-slate-800">{highestScore}%</p>
                {(() => {
                  const risk = similarityRisk(highestScore);
                  return <span className={`mb-1 ${riskCls[risk.color] ?? 'badge-slate'}`}>{risk.label}</span>;
                })()}
              </div>
              <div className="mt-3 h-2.5 bg-slate-100 rounded-full overflow-hidden max-w-xs">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${barBg(highestScore)}`}
                  style={{ width: `${highestScore}%` }}
                />
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <p className="font-semibold text-slate-500">{matches.length} similar proposal{matches.length !== 1 ? 's' : ''}</p>
              <p>found in database</p>
            </div>
          </div>
        </div>
      )}

      {/* Bar chart */}
      <div className="card p-5">
        <p className="text-sm font-bold text-slate-700 mb-1">Similarity by Proposal</p>
        <p className="text-xs text-slate-400 mb-4">Cosine similarity score (%) using Sentence-BERT embeddings</p>
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

      {/* Ranked list with progress bars */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <p className="text-sm font-bold text-slate-700">Similar Proposals — Ranked by Similarity</p>
          <p className="text-xs text-slate-400 mt-0.5">Sorted by semantic similarity score (highest first)</p>
        </div>
        <div className="divide-y divide-slate-50">
          {[...matches]
            .sort((a, b) => b.similarity_score - a.similarity_score)
            .map((m, i) => {
              const risk = similarityRisk(m.similarity_score);
              const textCls = scoreTxt(m.similarity_score);
              const bgCls   = barBg(m.similarity_score);
              const badgeCls = riskCls[risk.color] ?? 'badge-slate';

              return (
                <div key={m._id} className="px-5 py-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-slate-700 font-medium break-words">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-extrabold ${textCls}`}>
                        {m.similarity_score.toFixed(2)}%
                      </span>
                      <span className={badgeCls}>{risk.label}</span>
                    </div>
                  </div>
                  {/* Per-match progress bar */}
                  <div className="ml-9 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${bgCls}`}
                      style={{ width: `${Math.min(m.similarity_score, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

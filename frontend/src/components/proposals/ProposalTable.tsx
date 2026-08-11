import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Proposal } from '../../types';
import { formatDate } from '../../utils/format';
import RecommendationBadge from '../ui/RecommendationBadge';
import { Eye, UserCheck, ChevronUp, ChevronDown, ChevronsUpDown, Brain, Clock, Trash2 } from 'lucide-react';

interface Props {
  proposals: Proposal[];
  role?: 'researcher' | 'reviewer' | 'admin';
  onDelete?: (proposal: Proposal) => void;
}

type SortKey = 'title' | 'domain' | 'uploaded_at' | 'score';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, current, dir }: { col: SortKey; current: SortKey; dir: SortDir }) {
  if (col !== current) return <ChevronsUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary-500 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-primary-500 ml-1 inline" />;
}

/** AI processing status badge */
function AIStatusBadge({ proposal }: { proposal: Proposal }) {
  if (proposal.evaluation?.error) {
    return <span className="badge-rose">Eval. Failed</span>;
  }
  if (proposal.evaluation?.overall_score !== undefined) {
    return <span className="badge-emerald inline-flex items-center gap-1"><Brain className="w-2.5 h-2.5" /> AI Evaluated</span>;
  }
  return <span className="badge-amber inline-flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> Awaiting AI</span>;
}

/** Human review status badge */
function HumanStatusBadge({ proposal }: { proposal: Proposal }) {
  // If not yet AI evaluated, human review is not applicable
  if (proposal.evaluation?.overall_score === undefined) {
    return <span className="text-slate-300 text-xs">—</span>;
  }
  if (proposal.human_review) {
    return (
      <span className="badge-sky inline-flex items-center gap-1">
        <UserCheck className="w-2.5 h-2.5" /> Reviewed
      </span>
    );
  }
  return <span className="badge-amber">Awaiting Review</span>;
}

export default function ProposalTable({ proposals, role = 'researcher', onDelete }: Props) {
  const navigate = useNavigate();
  const [sortKey, setSortKey]  = useState<SortKey>('uploaded_at');
  const [sortDir, setSortDir]  = useState<SortDir>('desc');

  const detailPath = (id: string) =>
    role === 'reviewer' ? `/reviewer/proposals/${id}` :
    role === 'admin'    ? `/admin/proposals/${id}` :
    `/researcher/proposals/${id}`;

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...proposals].sort((a, b) => {
    let av: string | number = '';
    let bv: string | number = '';
    if (sortKey === 'title')       { av = a.title; bv = b.title; }
    if (sortKey === 'domain')      { av = a.domain; bv = b.domain; }
    if (sortKey === 'uploaded_at') { av = a.uploaded_at; bv = b.uploaded_at; }
    if (sortKey === 'score')       { av = a.evaluation?.overall_score ?? -1; bv = b.evaluation?.overall_score ?? -1; }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1  : -1;
    return 0;
  });

  const Th = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 cursor-pointer select-none hover:text-primary-600 transition-colors whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      {label}
      <SortIcon col={col} current={sortKey} dir={sortDir} />
    </th>
  );

  const ThStatic = ({ label }: { label: string }) => (
    <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5 whitespace-nowrap">
      {label}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-card animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100">
            <Th label="Proposal"     col="title" />
            <Th label="Domain"       col="domain" />
            <Th label="Uploaded"     col="uploaded_at" />
            <ThStatic label="AI Status" />
            <Th label="AI Score"     col="score" />
            <ThStatic label="Human Review" />
            <ThStatic label="Final Decision" />
            <ThStatic label="Actions" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {sorted.map((p) => {
            const score = p.evaluation?.overall_score;
            const scoreColor =
              score === undefined ? 'text-slate-300' :
              score >= 7 ? 'text-emerald-600' :
              score >= 5 ? 'text-amber-600'   : 'text-rose-600';

            return (
              <tr key={p._id} className="hover:bg-slate-50/70 transition-colors group">
                {/* Proposal title */}
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-slate-800 max-w-[180px] truncate group-hover:text-primary-600 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{p.filename}</p>
                </td>

                {/* Domain */}
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 whitespace-nowrap">
                    {p.domain}
                  </span>
                </td>

                {/* Uploaded */}
                <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                  {formatDate(p.uploaded_at)}
                </td>

                {/* AI Status */}
                <td className="px-4 py-3.5">
                  <AIStatusBadge proposal={p} />
                </td>

                {/* AI Score */}
                <td className="px-4 py-3.5">
                  {score !== undefined ? (
                    <div>
                      <span className={`font-extrabold text-sm ${scoreColor}`}>
                        {score}<span className="text-slate-400 font-normal text-xs">/10</span>
                      </span>
                      {p.evaluation?.overall_recommendation && (
                        <div className="mt-0.5">
                          <RecommendationBadge recommendation={p.evaluation.overall_recommendation} size="sm" />
                        </div>
                      )}
                    </div>
                  ) : <span className="text-slate-300">—</span>}
                </td>

                {/* Human Review */}
                <td className="px-4 py-3.5">
                  <HumanStatusBadge proposal={p} />
                </td>

                {/* Final Decision */}
                <td className="px-4 py-3.5">
                  {p.human_review?.final_recommendation ? (
                    <DecisionBadge decision={p.human_review.final_recommendation} />
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(detailPath(p._id))}
                      className="btn-ghost text-xs py-1.5 px-3 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>

                    {role === 'admin' && onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p);
                        }}
                        className="btn-ghost text-xs py-1.5 px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        title="Delete proposal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DecisionBadge({ decision }: { decision: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    accept:                { label: '✓ Accepted',  cls: 'badge-emerald' },
    accept_with_revisions: { label: '✎ Revisions', cls: 'badge-sky'     },
    revise:                { label: '↺ Revise',    cls: 'badge-amber'   },
    reject:                { label: '✕ Rejected',  cls: 'badge-rose'    },
    pending:               { label: 'Pending',     cls: 'badge-slate'   },
  };
  const c = config[decision] ?? { label: decision, cls: 'badge-slate' };
  return <span className={c.cls}>{c.label}</span>;
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Proposal } from '../../types';
import { formatDate } from '../../utils/format';
import RecommendationBadge from '../ui/RecommendationBadge';
import StatusBadge from '../ui/StatusBadge';
import { Eye, UserCheck, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Props {
  proposals: Proposal[];
  role?: 'researcher' | 'reviewer' | 'admin';
}

type SortKey = 'title' | 'domain' | 'uploaded_at' | 'score';
type SortDir = 'asc' | 'desc';

function SortIcon({ col, current, dir }: { col: SortKey; current: SortKey; dir: SortDir }) {
  if (col !== current) return <ChevronsUpDown className="w-3 h-3 text-slate-300 ml-1 inline" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary-500 ml-1 inline" />
    : <ChevronDown className="w-3 h-3 text-primary-500 ml-1 inline" />;
}

export default function ProposalTable({ proposals, role = 'researcher' }: Props) {
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
      className="text-left text-xs font-semibold text-slate-500 px-5 py-3.5 cursor-pointer select-none hover:text-primary-600 transition-colors whitespace-nowrap"
      onClick={() => handleSort(col)}
    >
      {label}
      <SortIcon col={col} current={sortKey} dir={sortDir} />
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-card animate-fade-in">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-100">
            <Th label="Proposal" col="title" />
            <Th label="Domain"   col="domain" />
            <Th label="Uploaded" col="uploaded_at" />
            <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Status</th>
            <Th label="Score"    col="score" />
            <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Recommendation</th>
            <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Review</th>
            <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3.5">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-50">
          {sorted.map((p) => {
            const status = p.evaluation?.overall_score !== undefined ? 'evaluated' : 'pending';
            const score  = p.evaluation?.overall_score;
            const scoreColor =
              score === undefined ? 'text-slate-300' :
              score >= 7 ? 'text-emerald-600' :
              score >= 5 ? 'text-amber-600'   : 'text-rose-600';

            return (
              <tr key={p._id} className="hover:bg-slate-50/70 transition-colors group">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-slate-800 max-w-[200px] truncate group-hover:text-primary-600 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{p.filename}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                    {p.domain}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                  {formatDate(p.uploaded_at)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={status} />
                </td>
                <td className="px-4 py-3.5">
                  {score !== undefined ? (
                    <span className={`font-extrabold text-sm ${scoreColor}`}>
                      {score}<span className="text-slate-400 font-normal text-xs">/10</span>
                    </span>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  {p.evaluation?.overall_recommendation
                    ? <RecommendationBadge recommendation={p.evaluation.overall_recommendation} size="sm" />
                    : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3.5">
                  {p.human_review ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                      <UserCheck className="w-3 h-3" />
                      Reviewed
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => navigate(detailPath(p._id))}
                    className="btn-ghost text-xs py-1.5 px-3 text-primary-600 hover:bg-primary-50 hover:text-primary-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

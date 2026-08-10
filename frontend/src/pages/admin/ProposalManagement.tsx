import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProposalTable from '../../components/proposals/ProposalTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import {
  FileText, LayoutDashboard, Users, UserCog, Search,
  Brain, UserCheck, CheckCircle, Clock, X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',     href: '/admin/users',     icon: Users },
  { label: 'Proposals', href: '/admin/proposals', icon: FileText },
  { label: 'Profile',   href: '/admin/profile',   icon: UserCog },
];

type AIFilter    = 'all' | 'evaluated' | 'awaiting';
type HumanFilter = 'all' | 'reviewed' | 'awaiting';

export default function ProposalManagement() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [aiFilter, setAIFilter]         = useState<AIFilter>('all');
  const [humanFilter, setHumanFilter]   = useState<HumanFilter>('all');

  const load = () => {
    setLoading(true);
    setError(null);
    proposalsApi.getAllProposals()
      .then((data) => setProposals(data))
      .catch(() => setError('Failed to load proposals.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const domains = [...new Set(proposals.map((p) => p.domain))].sort();

  const filtered = proposals.filter((p) => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.researcher_email.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());

    const matchDomain = !domainFilter || p.domain === domainFilter;

    const matchAI =
      aiFilter === 'all'       ? true :
      aiFilter === 'evaluated' ? p.evaluation?.overall_score !== undefined && !p.evaluation?.error :
      /* awaiting */             p.evaluation?.overall_score === undefined && !p.evaluation?.error;

    const matchHuman =
      humanFilter === 'all'      ? true :
      humanFilter === 'reviewed' ? !!p.human_review :
      /* awaiting */               !p.human_review;

    return matchSearch && matchDomain && matchAI && matchHuman;
  });

  // Counts
  const aiEvaluated   = proposals.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error).length;
  const awaitingAI    = proposals.filter((p) => p.evaluation?.overall_score === undefined && !p.evaluation?.error).length;
  const humanReviewed = proposals.filter((p) => !!p.human_review).length;
  const awaitingHuman = proposals.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error && !p.human_review).length;

  const hasFilters = !!search || !!domainFilter || aiFilter !== 'all' || humanFilter !== 'all';

  const clearFilters = () => {
    setSearch('');
    setDomainFilter('');
    setAIFilter('all');
    setHumanFilter('all');
  };

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="Proposal Management">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Proposal Management</h1>
        <p className="text-sm text-slate-500 mt-1">Monitor and manage all research proposals in the system.</p>
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total',             value: proposals.length,  icon: FileText,    cls: 'text-primary-600 bg-primary-50  border-primary-100'  },
          { label: 'AI Evaluated',      value: aiEvaluated,       icon: Brain,       cls: 'text-emerald-600 bg-emerald-50 border-emerald-100'  },
          { label: 'Awaiting AI',       value: awaitingAI,        icon: Clock,       cls: 'text-amber-600   bg-amber-50   border-amber-100'    },
          { label: 'Awaiting Review',   value: awaitingHuman,     icon: UserCheck,   cls: 'text-sky-600     bg-sky-50     border-sky-100'      },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className={`rounded-xl border p-3 flex items-center gap-3 ${cls}`}>
            <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
            <div>
              <p className="text-xs opacity-70 font-medium">{label}</p>
              <p className="text-xl font-extrabold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, researcher, or domain…"
              className="input-field pl-9"
            />
          </div>
          {/* Domain filter */}
          <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)} className="input-field sm:w-48">
            <option value="">All Domains</option>
            {domains.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* AI Status filter */}
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">AI:</span>
            {(['all', 'evaluated', 'awaiting'] as AIFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setAIFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  aiFilter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'evaluated' ? 'Evaluated' : 'Awaiting'}
              </button>
            ))}
          </div>

          {/* Human Review filter */}
          <div className="flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Review:</span>
            {(['all', 'reviewed', 'awaiting'] as HumanFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setHumanFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  humanFilter === f
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'reviewed' ? 'Reviewed' : 'Awaiting'}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold ml-auto"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {proposals.length} proposals
            {humanReviewed > 0 && <span className="ml-2 text-sky-600">· {humanReviewed} reviewed</span>}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        proposals.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            description="No proposals have been submitted to the system yet."
          />
        ) : (
          <EmptyState
            title="No matching proposals"
            description="Try adjusting your search or filter criteria."
          />
        )
      ) : (
        <ProposalTable proposals={filtered} role="admin" />
      )}
    </DashboardLayout>
  );
}

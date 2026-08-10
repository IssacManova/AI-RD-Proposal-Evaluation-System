import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProposalTable from '../../components/proposals/ProposalTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import {
  FileText, LayoutDashboard, User, BookOpen, Search,
  Clock, CheckSquare, UserCheck,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',            href: '/reviewer',          icon: LayoutDashboard },
  { label: 'Proposals for Review', href: '/reviewer/proposals', icon: BookOpen },
  { label: 'Profile',              href: '/reviewer/profile',  icon: User },
];

type StatusFilter = 'all' | 'awaiting-review' | 'reviewed';

export default function AssignedProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [domainFilter, setDomainFilter] = useState('');

  const load = () => {
    setLoading(true);
    setError(null);
    proposalsApi.getAllProposals()
      .then((data) => {
        // Show all AI-evaluated proposals — those are the ones ready for human review
        const evaluated = data.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error);
        setProposals(evaluated);
      })
      .catch(() => setError('Failed to load proposals. Please check your connection.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Derived filters
  const domains = [...new Set(proposals.map((p) => p.domain))].sort();

  const filtered = proposals.filter((p) => {
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase());

    const matchDomain = !domainFilter || p.domain === domainFilter;

    const matchStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'awaiting-review' ? !p.human_review :
      statusFilter === 'reviewed' ? !!p.human_review : true;

    return matchSearch && matchDomain && matchStatus;
  });

  const awaitingCount = proposals.filter((p) => !p.human_review).length;
  const reviewedCount = proposals.filter((p) => !!p.human_review).length;

  return (
    <DashboardLayout items={navItems} role="reviewer" pageTitle="Proposals for Review">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Proposals for Review</h1>
          <p className="text-sm text-slate-500 mt-1">
            {proposals.length} AI-evaluated proposal{proposals.length !== 1 ? 's' : ''} available for expert review.
          </p>
        </div>
        <Link to="/reviewer" className="btn-secondary text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Status summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            statusFilter === 'all'
              ? 'bg-primary-600 text-white border-primary-600 shadow-glow'
              : 'bg-white text-slate-600 border-slate-200 hover:border-primary-200 hover:bg-primary-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          All ({proposals.length})
        </button>
        <button
          onClick={() => setStatusFilter('awaiting-review')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            statusFilter === 'awaiting-review'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-amber-200 hover:bg-amber-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Awaiting Review ({awaitingCount})
        </button>
        <button
          onClick={() => setStatusFilter('reviewed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
            statusFilter === 'reviewed'
              ? 'bg-sky-500 text-white border-sky-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:bg-sky-50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Reviewed ({reviewedCount})
        </button>
      </div>

      {/* Filters row */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals…"
            className="input-field pl-9"
          />
        </div>
        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="input-field sm:w-48"
        >
          <option value="">All Domains</option>
          {domains.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        proposals.length === 0 ? (
          <EmptyState
            title="No proposals to review"
            description="No AI-evaluated proposals are available yet. Check back soon after researchers upload and AI processes their proposals."
          />
        ) : (
          <EmptyState
            title="No matching proposals"
            description="Try adjusting your search or filters."
          />
        )
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-500">Showing {filtered.length} of {proposals.length} proposals</p>
          </div>
          <ProposalTable proposals={filtered} role="reviewer" />
        </>
      )}
    </DashboardLayout>
  );
}

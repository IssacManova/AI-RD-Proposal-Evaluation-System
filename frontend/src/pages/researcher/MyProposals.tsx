import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProposalTable from '../../components/proposals/ProposalTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { FileText, Upload, LayoutDashboard, User, Search, Filter } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',       href: '/researcher',          icon: LayoutDashboard },
  { label: 'Upload Proposal', href: '/researcher/upload',   icon: Upload },
  { label: 'My Proposals',    href: '/researcher/proposals', icon: FileText },
  { label: 'Profile',         href: '/researcher/profile',  icon: User },
];

export default function MyProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filtered, setFiltered]   = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [domain, setDomain]       = useState('');
  const [status, setStatus]       = useState('');

  const load = () => {
    setLoading(true);
    setError(null);
    proposalsApi.getMyProposals()
      .then((data) => { setProposals(data); setFiltered(data); })
      .catch(() => setError('Failed to load proposals.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    let list = proposals;
    if (search) list = list.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.domain.toLowerCase().includes(search.toLowerCase()));
    if (domain) list = list.filter((p) => p.domain === domain);
    if (status === 'evaluated') list = list.filter((p) => p.evaluation?.overall_score !== undefined);
    if (status === 'pending')   list = list.filter((p) => p.evaluation?.overall_score === undefined);
    setFiltered(list);
  }, [search, domain, status, proposals]);

  const domains = [...new Set(proposals.map((p) => p.domain))];

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="My Proposals">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">{proposals.length} proposal{proposals.length !== 1 ? 's' : ''} submitted</p>
        </div>
        <Link to="/researcher/upload" className="btn-primary">
          <Upload className="w-4 h-4" /> Upload New
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals…"
            className="input-field pl-9"
          />
        </div>
        <select value={domain} onChange={(e) => setDomain(e.target.value)} className="input-field sm:w-48">
          <option value="">All Domains</option>
          {domains.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field sm:w-48">
          <option value="">All Statuses</option>
          <option value="evaluated">AI Evaluated</option>
          <option value="pending">Awaiting AI Evaluation</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        proposals.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            description="Submit your first research proposal to get started."
            icon="file"
            action={<Link to="/researcher/upload" className="btn-primary">Upload Proposal</Link>}
          />
        ) : (
          <EmptyState title="No results found" description="Try adjusting your search or filters." />
        )
      ) : (
        <ProposalTable proposals={filtered} role="researcher" />
      )}
    </DashboardLayout>
  );
}

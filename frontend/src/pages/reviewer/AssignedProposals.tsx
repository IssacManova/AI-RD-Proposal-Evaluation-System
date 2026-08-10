import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProposalTable from '../../components/proposals/ProposalTable';
import EmptyState from '../../components/ui/EmptyState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { FileText, LayoutDashboard, User, BookOpen, Search } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',         href: '/reviewer',          icon: LayoutDashboard },
  { label: 'Assigned Proposals',href: '/reviewer/proposals',icon: BookOpen },
  { label: 'All Proposals',     href: '/reviewer/all',      icon: FileText },
  { label: 'Profile',           href: '/reviewer/profile',  icon: User },
];

export default function AssignedProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filtered, setFiltered]   = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    proposalsApi.getAllProposals().then((data) => {
      const evaluated = data.filter((p) => p.evaluation?.overall_score !== undefined);
      setProposals(evaluated);
      setFiltered(evaluated);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(proposals); return; }
    setFiltered(proposals.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, proposals]);

  return (
    <DashboardLayout items={navItems} role="reviewer" pageTitle="Assigned Proposals">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Proposals for Review</h1>
        <p className="text-sm text-slate-500 mt-1">
          {proposals.length} AI-evaluated proposal{proposals.length !== 1 ? 's' : ''} awaiting your expert review.
        </p>
      </div>

      <div className="card p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals…" className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No proposals assigned" description="No AI-evaluated proposals are available for review yet." />
      ) : (
        <ProposalTable proposals={filtered} role="reviewer" />
      )}
    </DashboardLayout>
  );
}

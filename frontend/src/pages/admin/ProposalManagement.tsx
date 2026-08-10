import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProposalTable from '../../components/proposals/ProposalTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { FileText, LayoutDashboard, Users, UserCog, Search } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',     icon: Users },
  { label: 'Proposals',  href: '/admin/proposals', icon: FileText },
  { label: 'Profile',    href: '/admin/profile',   icon: UserCog },
];

export default function ProposalManagement() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filtered, setFiltered]   = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    proposalsApi.getAllProposals().then((data) => { setProposals(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) { setFiltered(proposals); return; }
    setFiltered(proposals.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.researcher_email.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, proposals]);

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="Proposal Management">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Proposal Management</h1>
        <p className="text-sm text-slate-500 mt-1">{proposals.length} total proposals in the system.</p>
      </div>
      <div className="card p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or researcher email…" className="input-field pl-9" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No proposals" description="No proposals found in the system." />
      ) : (
        <ProposalTable proposals={filtered} role="admin" />
      )}
    </DashboardLayout>
  );
}

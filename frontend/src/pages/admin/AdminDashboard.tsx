import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProposalTable from '../../components/proposals/ProposalTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import {
  Users, FileText, CheckCircle, Clock, LayoutDashboard,
  UserCog, Shield, BarChart2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const navItems = [
  { label: 'Dashboard',     href: '/admin',            icon: LayoutDashboard },
  { label: 'Users',         href: '/admin/users',      icon: Users },
  { label: 'Proposals',     href: '/admin/proposals',  icon: FileText },
  { label: 'Profile',       href: '/admin/profile',    icon: UserCog },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export default function AdminDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    proposalsApi.getAllProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  const evaluated = proposals.filter((p) => p.evaluation?.overall_score !== undefined);
  const pending   = proposals.filter((p) => !p.evaluation?.overall_score);

  // Domain distribution
  const domainMap: Record<string, number> = {};
  proposals.forEach((p) => { domainMap[p.domain] = (domainMap[p.domain] || 0) + 1; });
  const domainData = Object.entries(domainMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

  // Score distribution
  const scoreRanges = [
    { name: '9–10', count: evaluated.filter(p => p.evaluation.overall_score >= 9).length },
    { name: '7–8',  count: evaluated.filter(p => p.evaluation.overall_score >= 7 && p.evaluation.overall_score < 9).length },
    { name: '5–6',  count: evaluated.filter(p => p.evaluation.overall_score >= 5 && p.evaluation.overall_score < 7).length },
    { name: '<5',   count: evaluated.filter(p => p.evaluation.overall_score < 5).length },
  ];

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="Admin Dashboard">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">System-wide overview of proposals and evaluations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Proposals"  value={proposals.length} icon={FileText}    color="indigo"  />
        <StatCard title="AI Evaluated"     value={evaluated.length} icon={CheckCircle} color="emerald" />
        <StatCard title="Pending"          value={pending.length}   icon={Clock}       color="amber"   />
        <StatCard title="Research Domains" value={Object.keys(domainMap).length} icon={BarChart2} color="sky" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Domain distribution */}
            <div className="card p-6">
              <h3 className="section-title mb-4">Proposals by Domain</h3>
              {domainData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={domainData} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-slate-400 text-center py-10">No data yet</p>}
            </div>

            {/* Score distribution */}
            <div className="card p-6">
              <h3 className="section-title mb-4">Evaluation Score Distribution</h3>
              {evaluated.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={scoreRanges} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={4}>
                      {scoreRanges.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-slate-400 text-center py-10">No evaluated proposals yet</p>}
            </div>
          </div>

          {/* Proposal table */}
          <div>
            <h2 className="section-title mb-4">All Proposals</h2>
            <ProposalTable proposals={proposals.slice(0, 10)} role="admin" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

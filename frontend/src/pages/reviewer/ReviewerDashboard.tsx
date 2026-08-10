import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProposalCard from '../../components/proposals/ProposalCard';
import EmptyState from '../../components/ui/EmptyState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import {
  CheckSquare, Clock, FileText, BarChart2,
  LayoutDashboard, User, BookOpen, UserCheck,
  Brain, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',          href: '/reviewer',           icon: LayoutDashboard },
  { label: 'Assigned Proposals', href: '/reviewer/proposals', icon: BookOpen },
  { label: 'All Proposals',      href: '/reviewer/all',       icon: FileText },
  { label: 'Profile',            href: '/reviewer/profile',   icon: User },
];

export default function ReviewerDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]    = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    proposalsApi.getAllProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  const evaluated      = proposals.filter((p) => p.evaluation?.overall_score !== undefined);
  const pending        = proposals.filter((p) => p.evaluation?.overall_score === undefined);
  const humanReviewed  = proposals.filter((p) => !!p.human_review);

  const avgScore = evaluated.length
    ? (evaluated.reduce((s, p) => s + (p.evaluation?.overall_score || 0), 0) / evaluated.length).toFixed(1)
    : '—';

  return (
    <DashboardLayout items={navItems} role="reviewer" pageTitle="Reviewer Dashboard">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Reviewer Dashboard</h1>
            <p className="text-sm text-slate-500">
              Welcome back, <span className="font-semibold text-slate-700">{user?.email}</span>
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-13 pl-13">
          Review AI-evaluated proposals and provide your expert assessment.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Proposals"  value={proposals.length}    icon={FileText}    color="indigo"  />
        <StatCard title="AI Evaluated"     value={evaluated.length}    icon={CheckSquare} color="emerald" />
        <StatCard title="Pending Review"   value={pending.length}      icon={Clock}       color="amber"   />
        <StatCard title="Human Reviewed"   value={humanReviewed.length} icon={UserCheck}  color="sky"     />
      </div>

      {/* Average score banner */}
      {evaluated.length > 0 && (
        <div className="card p-5 mb-8 flex items-center gap-4 bg-gradient-to-r from-primary-50 via-white to-violet-50 border-primary-100">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average AI Score</p>
            <p className="text-3xl font-extrabold text-primary-600">
              {avgScore}<span className="text-base text-slate-400 font-normal"> / 10</span>
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
            <BarChart2 className="w-4 h-4 text-slate-400" />
            Across {evaluated.length} evaluated proposal{evaluated.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Proposals for review */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Proposals for Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-evaluated proposals ready for your expert review</p>
          </div>
          <Link
            to="/reviewer/proposals"
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card p-5 h-24">
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : evaluated.length === 0 ? (
          <EmptyState
            title="No proposals to review"
            description="No AI-evaluated proposals are available yet. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evaluated.slice(0, 6).map((p) => (
              <ProposalCard key={p._id} proposal={p} role="reviewer" />
            ))}
          </div>
        )}
      </div>

      {/* Recently reviewed */}
      {humanReviewed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-sky-500" />
            <h2 className="section-title">Recently Reviewed</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {humanReviewed.slice(0, 4).map((p) => (
              <ProposalCard key={p._id} proposal={p} role="reviewer" />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

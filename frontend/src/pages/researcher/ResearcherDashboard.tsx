import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProposalCard from '../../components/proposals/ProposalCard';
import EmptyState from '../../components/ui/EmptyState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { FileText, CheckCircle, Clock, BarChart2, Upload, LayoutDashboard, User, BookOpen } from 'lucide-react';

const navItems = [
  { label: 'Dashboard',       href: '/researcher',          icon: LayoutDashboard },
  { label: 'Upload Proposal', href: '/researcher/upload',   icon: Upload },
  { label: 'My Proposals',    href: '/researcher/proposals',icon: FileText },
  { label: 'Profile',         href: '/researcher/profile',  icon: User },
];

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proposalsApi.getMyProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  const evaluated = proposals.filter((p) => p.evaluation?.overall_score !== undefined);
  const avgScore = evaluated.length
    ? (evaluated.reduce((s, p) => s + (p.evaluation?.overall_score || 0), 0) / evaluated.length).toFixed(1)
    : '—';

  const recent = proposals.slice(0, 4);

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="Dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Good {getGreeting()}, {user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's an overview of your research proposals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Proposals"    value={proposals.length} icon={FileText}    color="indigo"  />
        <StatCard title="Evaluated"          value={evaluated.length} icon={CheckCircle} color="emerald" />
        <StatCard title="Pending"            value={proposals.length - evaluated.length} icon={Clock}    color="amber"  />
        <StatCard title="Average Score"      value={avgScore}         icon={BarChart2}   color="sky"    subtitle="out of 10" />
      </div>

      {/* Recent proposals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Proposals</h2>
            <Link to="/researcher/proposals" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="card">
              <EmptyState
                title="No proposals yet"
                description="Upload your first research proposal to get started with AI evaluation."
                action={<Link to="/researcher/upload" className="btn-primary">Upload Proposal</Link>}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((p) => <ProposalCard key={p._id} proposal={p} />)}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/researcher/upload" className="card-hover p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Upload className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Upload Proposal</p>
                <p className="text-xs text-slate-500">Submit a new PDF for evaluation</p>
              </div>
            </Link>
            <Link to="/researcher/proposals" className="card-hover p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">View Proposals</p>
                <p className="text-xs text-slate-500">Browse all submitted proposals</p>
              </div>
            </Link>
          </div>

          {/* Tip box */}
          <div className="mt-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-xs font-bold text-primary-700 mb-1">💡 AI Evaluation Note</p>
            <p className="text-xs text-primary-600 leading-relaxed">
              AI-generated scores are advisory. A human reviewer will make the final decision on your proposal.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded w-3/4" />
          <div className="h-2 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

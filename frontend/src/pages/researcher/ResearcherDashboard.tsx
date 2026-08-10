import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProposalCard from '../../components/proposals/ProposalCard';
import EmptyState from '../../components/ui/EmptyState';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  FileText, CheckCircle, Clock, BarChart2, Upload,
  LayoutDashboard, User, BookOpen, UserCheck, Brain,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',       href: '/researcher',           icon: LayoutDashboard },
  { label: 'Upload Proposal', href: '/researcher/upload',    icon: Upload },
  { label: 'My Proposals',    href: '/researcher/proposals', icon: FileText },
  { label: 'Profile',         href: '/researcher/profile',   icon: User },
];

export default function ResearcherDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proposalsApi.getMyProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  // ── Computed stats ────────────────────────────────────────────────────────
  const aiEvaluated    = proposals.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error);
  const awaitingAI     = proposals.filter((p) => p.evaluation?.overall_score === undefined && !p.evaluation?.error);
  const humanReviewed  = proposals.filter((p) => !!p.human_review);
  const awaitingReview = aiEvaluated.filter((p) => !p.human_review);

  const avgScore = aiEvaluated.length
    ? (aiEvaluated.reduce((s, p) => s + (p.evaluation?.overall_score || 0), 0) / aiEvaluated.length).toFixed(1)
    : '—';

  const recent = proposals.slice(0, 4);

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="Dashboard">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Good {getGreeting()}, {user?.name || user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's an overview of your research proposals.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Proposals"       value={proposals.length}    icon={FileText}    color="indigo"  />
        <StatCard title="AI Evaluated"          value={aiEvaluated.length}  icon={CheckCircle} color="emerald" />
        <StatCard title="Awaiting AI Evaluation" value={awaitingAI.length}  icon={Clock}       color="amber"   />
        <StatCard title="Average AI Score"      value={avgScore}            icon={BarChart2}   color="sky"     subtitle="out of 10" />
      </div>

      {/* Human review progress strip — only show when there are AI-evaluated proposals */}
      {aiEvaluated.length > 0 && (
        <div className="card p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Human Review Progress</p>
              <p className="text-sm text-slate-700 mt-0.5">
                <span className="font-bold text-sky-600">{humanReviewed.length}</span> of{' '}
                <span className="font-bold">{aiEvaluated.length}</span> AI-evaluated proposals reviewed by experts
              </p>
            </div>
          </div>
          {awaitingReview.length > 0 && (
            <span className="badge-amber self-start sm:self-auto">
              <Clock className="w-3 h-3" /> {awaitingReview.length} Awaiting Expert Review
            </span>
          )}
          {awaitingReview.length === 0 && humanReviewed.length > 0 && (
            <span className="badge-emerald self-start sm:self-auto">
              <CheckCircle className="w-3 h-3" /> All reviewed!
            </span>
          )}
        </div>
      )}

      {/* AI disclaimer */}
      <div className="card p-4 mb-8 flex items-start gap-3 bg-primary-50/50 border-primary-100">
        <Brain className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-primary-700 leading-relaxed">
          <span className="font-bold">AI-generated scores are advisory.</span>{' '}
          A human expert reviewer makes the final decision on your proposal. AI scores reflect Gemini AI assessment using Sentence-BERT embeddings.
        </p>
      </div>

      {/* Recent proposals + Quick actions */}
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
                description="Upload your first research proposal to begin AI evaluation and similarity analysis."
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
                <p className="text-xs text-slate-500">Submit a new PDF for AI evaluation</p>
              </div>
            </Link>
            <Link to="/researcher/proposals" className="card-hover p-5 flex items-center gap-4 group">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">View My Proposals</p>
                <p className="text-xs text-slate-500">Browse AI scores and expert reviews</p>
              </div>
            </Link>
          </div>

          {/* Workflow explanation */}
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-700 mb-3">📋 Evaluation Workflow</p>
            <div className="space-y-2">
              {[
                { step: '1', label: 'Upload PDF', done: proposals.length > 0 },
                { step: '2', label: 'AI Evaluation (Gemini + SBERT)', done: aiEvaluated.length > 0 },
                { step: '3', label: 'Expert Human Review', done: humanReviewed.length > 0 },
                { step: '4', label: 'Final Decision', done: humanReviewed.length > 0 },
              ].map(({ step, label, done }) => (
                <div key={step} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {done ? '✓' : step}
                  </div>
                  <span className={`text-xs ${done ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{label}</span>
                </div>
              ))}
            </div>
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

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
  Brain, TrendingUp, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',            href: '/reviewer',           icon: LayoutDashboard },
  { label: 'Proposals for Review', href: '/reviewer/proposals', icon: BookOpen },
  { label: 'Profile',              href: '/reviewer/profile',   icon: User },
];

export default function ReviewerDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]    = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    proposalsApi.getAllProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  // ── Correct stat computations ─────────────────────────────────────────────
  // AI evaluated = proposals where the AI evaluation score exists (and no error)
  const aiEvaluated     = proposals.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error);

  // Awaiting AI = proposals not yet evaluated by AI
  const awaitingAI      = proposals.filter((p) => p.evaluation?.overall_score === undefined && !p.evaluation?.error);

  // Awaiting human review = AI-evaluated but NOT yet human-reviewed
  // (These are the proposals that need the reviewer's attention)
  const awaitingHuman   = aiEvaluated.filter((p) => !p.human_review);

  // Human reviewed = proposals with a submitted human review
  const humanReviewed   = proposals.filter((p) => !!p.human_review);

  const avgScore = aiEvaluated.length
    ? (aiEvaluated.reduce((s, p) => s + (p.evaluation?.overall_score || 0), 0) / aiEvaluated.length).toFixed(1)
    : '—';

  // Human review completion rate
  const completionPct = aiEvaluated.length > 0
    ? Math.round((humanReviewed.length / aiEvaluated.length) * 100)
    : 0;

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
              Welcome back, <span className="font-semibold text-slate-700">{user?.name || user?.email}</span>
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-13 pl-13">
          AI evaluates proposals first. Your expert review is the final step.
        </p>
      </div>

      {/* ── Stat cards — mathematically consistent ───────────────────────── */}
      {/*
          Total = AI Evaluated + Awaiting AI
          Awaiting Human Review ≤ AI Evaluated
          Human Reviewed ≤ AI Evaluated
          Awaiting Human Review + Human Reviewed = AI Evaluated
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Proposals"      value={proposals.length}     icon={FileText}    color="indigo"  />
        <StatCard title="AI Evaluated"         value={aiEvaluated.length}   icon={CheckSquare} color="emerald" />
        <StatCard title="Awaiting Your Review" value={awaitingHuman.length} icon={Clock}       color="amber"
          subtitle={aiEvaluated.length > 0 ? `of ${aiEvaluated.length} AI-evaluated` : undefined}
        />
        <StatCard title="Expert Reviewed"      value={humanReviewed.length} icon={UserCheck}   color="sky"     />
      </div>

      {/* Workflow explanation banner */}
      <div className="card p-4 mb-6 flex items-start gap-3 bg-primary-50/40 border-primary-100">
        <Brain className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-bold text-primary-700 mb-1">AI-Assisted Review Workflow</p>
          <p className="text-xs text-primary-600 leading-relaxed">
            AI evaluates proposals using Google Gemini and Sentence-BERT semantic similarity.
            <strong> Your expert review is the final authority.</strong> AI scores are advisory references only.
          </p>
        </div>
        {awaitingAI.length > 0 && (
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">{awaitingAI.length} awaiting AI</span>
          </div>
        )}
      </div>

      {/* Average score + completion rate */}
      {aiEvaluated.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average AI Score</p>
              <p className="text-3xl font-extrabold text-primary-600">
                {avgScore}<span className="text-base text-slate-400 font-normal"> / 10</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Across {aiEvaluated.length} AI-evaluated proposal{aiEvaluated.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="card p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-sky">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Completion</p>
              <p className="text-3xl font-extrabold text-sky-600">
                {completionPct}<span className="text-base text-slate-400 font-normal">%</span>
              </p>
              <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{humanReviewed.length} of {aiEvaluated.length} proposals reviewed</p>
            </div>
          </div>
        </div>
      )}

      {/* Proposals awaiting your review */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Awaiting Your Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-evaluated proposals that need expert human assessment</p>
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
              <div key={i} className="card p-5 h-24 animate-pulse">
                <div className="skeleton h-4 w-2/3 mb-2" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : awaitingHuman.length === 0 ? (
          <EmptyState
            title="All caught up!"
            description={
              aiEvaluated.length === 0
                ? "No AI-evaluated proposals available yet. Check back soon."
                : "All AI-evaluated proposals have been expert-reviewed. Great work!"
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {awaitingHuman.slice(0, 6).map((p) => (
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
            <h2 className="section-title">Recently Expert-Reviewed</h2>
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

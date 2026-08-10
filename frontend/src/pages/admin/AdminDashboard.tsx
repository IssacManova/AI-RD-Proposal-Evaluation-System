import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import ProposalTable from '../../components/proposals/ProposalTable';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import {
  Users, FileText, CheckCircle, Clock, LayoutDashboard,
  UserCog, BarChart2, UserCheck, Brain, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',     icon: Users },
  { label: 'Proposals',  href: '/admin/proposals', icon: FileText },
  { label: 'Profile',    href: '/admin/profile',   icon: UserCog },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4'];

export default function AdminDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    proposalsApi.getAllProposals().then(setProposals).finally(() => setLoading(false));
  }, []);

  // ── Mathematically consistent stats ──────────────────────────────────────
  const aiEvaluated     = proposals.filter((p) => p.evaluation?.overall_score !== undefined && !p.evaluation?.error);
  const awaitingAI      = proposals.filter((p) => p.evaluation?.overall_score === undefined && !p.evaluation?.error);
  const evalFailed      = proposals.filter((p) => !!p.evaluation?.error);
  const humanReviewed   = proposals.filter((p) => !!p.human_review);
  const awaitingHuman   = aiEvaluated.filter((p) => !p.human_review);

  // Completion rate
  const completionPct = aiEvaluated.length > 0
    ? Math.round((humanReviewed.length / aiEvaluated.length) * 100)
    : 0;

  // Average AI score
  const avgScore = aiEvaluated.length
    ? (aiEvaluated.reduce((s, p) => s + (p.evaluation?.overall_score || 0), 0) / aiEvaluated.length).toFixed(1)
    : '—';

  // Domain distribution
  const domainMap: Record<string, number> = {};
  proposals.forEach((p) => { domainMap[p.domain] = (domainMap[p.domain] || 0) + 1; });
  const domainData = Object.entries(domainMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Score distribution (from AI-evaluated only)
  const scoreRanges = [
    { name: '9–10', count: aiEvaluated.filter(p => p.evaluation.overall_score >= 9).length },
    { name: '7–8',  count: aiEvaluated.filter(p => p.evaluation.overall_score >= 7 && p.evaluation.overall_score < 9).length },
    { name: '5–6',  count: aiEvaluated.filter(p => p.evaluation.overall_score >= 5 && p.evaluation.overall_score < 7).length },
    { name: '<5',   count: aiEvaluated.filter(p => p.evaluation.overall_score < 5).length },
  ].filter(r => r.count > 0);

  // Final decision breakdown
  const decisions = humanReviewed.reduce<Record<string, number>>((acc, p) => {
    const d = p.human_review?.final_recommendation || 'pending';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="Admin Dashboard">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">System-wide overview of proposals and evaluations.</p>
        </div>
        <Link to="/admin/proposals" className="btn-secondary text-sm">
          <FileText className="w-4 h-4" /> View All Proposals
        </Link>
      </div>

      {/* ── Primary Stats — AI Processing ─────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <Brain className="w-3.5 h-3.5" /> AI Processing
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Proposals"       value={proposals.length}    icon={FileText}    color="indigo"  />
        <StatCard title="AI Evaluated"          value={aiEvaluated.length}  icon={CheckCircle} color="emerald" />
        <StatCard title="Awaiting AI Evaluation" value={awaitingAI.length}  icon={Clock}       color="amber"
          subtitle={evalFailed.length > 0 ? `${evalFailed.length} failed` : undefined}
        />
        <StatCard title="Research Domains"      value={Object.keys(domainMap).length} icon={BarChart2} color="sky" />
      </div>

      {/* ── Secondary Stats — Human Review ────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
        <UserCheck className="w-3.5 h-3.5" /> Human Review
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Awaiting Human Review" value={awaitingHuman.length}  icon={Clock}      color="amber"   />
        <StatCard title="Expert Reviewed"        value={humanReviewed.length}  icon={UserCheck}  color="sky"     />
        <div className="rounded-2xl border border-emerald-100 shadow-card bg-card-gradient-emerald p-6 animate-slide-up hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Review Completion</p>
              <p className="text-3xl font-extrabold mt-2 text-emerald-600">{completionPct}<span className="text-lg">%</span></p>
              <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-1">{humanReviewed.length} / {aiEvaluated.length} proposals</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 shadow-glow-emerald flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-sky-100 shadow-card bg-card-gradient-sky p-6 animate-slide-up hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average AI Score</p>
              <p className="text-3xl font-extrabold mt-2 text-sky-600">{avgScore}</p>
              <p className="text-xs text-slate-400 mt-1">out of 10</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500 shadow-glow-sky flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Domain distribution */}
            <div className="card p-6 lg:col-span-2">
              <h3 className="section-title mb-1">Proposals by Research Domain</h3>
              <p className="text-xs text-slate-400 mb-4">Distribution across all submitted proposals</p>
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
              ) : <p className="text-sm text-slate-400 text-center py-10">No proposals yet</p>}
            </div>

            {/* AI Score distribution */}
            <div className="card p-6">
              <h3 className="section-title mb-1">AI Score Distribution</h3>
              <p className="text-xs text-slate-400 mb-4">Score ranges across evaluated proposals</p>
              {scoreRanges.length > 0 ? (
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

          {/* Final decision breakdown (only show when there are reviewed proposals) */}
          {humanReviewed.length > 0 && (
            <div className="card p-6 mb-8">
              <h3 className="section-title mb-4">Final Decisions by Expert Reviewers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: 'accept',                label: 'Accepted',       cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', emoji: '✓' },
                  { key: 'accept_with_revisions', label: 'Revisions',      cls: 'bg-sky-50 text-sky-700 border-sky-200',             emoji: '✎' },
                  { key: 'revise',                label: 'Revise',         cls: 'bg-amber-50 text-amber-700 border-amber-200',       emoji: '↺' },
                  { key: 'reject',                label: 'Rejected',       cls: 'bg-rose-50 text-rose-700 border-rose-200',          emoji: '✕' },
                ].map(({ key, label, cls, emoji }) => (
                  <div key={key} className={`rounded-xl border p-4 ${cls}`}>
                    <p className="text-2xl font-extrabold">{emoji} {decisions[key] || 0}</p>
                    <p className="text-xs font-semibold mt-1 opacity-80">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proposal table — recent 10 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Recent Proposals</h2>
              <Link to="/admin/proposals" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                View all →
              </Link>
            </div>
            <ProposalTable proposals={proposals.slice(0, 10)} role="admin" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

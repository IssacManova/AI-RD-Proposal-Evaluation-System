import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EvaluationCard from '../../components/evaluation/EvaluationCard';
import SimilarityCard from '../../components/similarity/SimilarityCard';
import HumanReviewCard from '../../components/evaluation/HumanReviewCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import RecommendationBadge from '../../components/ui/RecommendationBadge';
import { proposalsApi } from '../../api/proposals';
import type { Proposal } from '../../types';
import { formatDate } from '../../utils/format';
import {
  FileText, LayoutDashboard, Users, UserCog,
  ChevronLeft, Calendar, Globe, Mail, Hash,
  Brain, Search, AlignLeft, UserCheck, CheckCircle2,
  ShieldCheck, Trash2, Loader2,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',  href: '/admin',           icon: LayoutDashboard },
  { label: 'Users',      href: '/admin/users',     icon: Users },
  { label: 'Proposals',  href: '/admin/proposals', icon: FileText },
  { label: 'Profile',    href: '/admin/profile',   icon: UserCog },
];

type Tab = 'overview' | 'evaluation' | 'similarity' | 'human-review' | 'text';

export default function AdminProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [tab, setTab]           = useState<Tab>('overview');

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting]               = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    proposalsApi.getProposalById(id)
      .then((p) => p ? setProposal(p) : setError('Proposal not found.'))
      .catch(() => setError('Failed to load proposal.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const confirmDelete = async () => {
    if (!proposal) return;
    setDeleting(true);
    try {
      await proposalsApi.deleteProposal(proposal._id);
      toast.success('Proposal deleted successfully');
      navigate('/admin/proposals');
    } catch {
      toast.error('Failed to delete proposal');
      setDeleting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Brain; dot?: boolean }[] = [
    { id: 'overview',     label: 'Overview',       icon: Hash },
    { id: 'evaluation',   label: 'AI Evaluation',  icon: Brain },
    { id: 'similarity',   label: 'Similarity',     icon: Search },
    { id: 'human-review', label: 'Human Review',   icon: UserCheck, dot: !!proposal?.human_review },
    { id: 'text',         label: 'Extracted Text', icon: AlignLeft },
  ];

  return (
    <DashboardLayout items={navItems} role="admin" pageTitle="Proposal Detail">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3 flex-wrap">
        <button onClick={() => navigate(-1)} className="btn-ghost mt-0.5">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {proposal && (
          <div className="flex-1 min-w-0 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-800 break-words">{proposal.title}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                  <ShieldCheck className="w-3 h-3" /> Admin View
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 font-medium">
                  {proposal.domain}
                </span>
                <span>{formatDate(proposal.uploaded_at)}</span>
                <span className="text-slate-300">·</span>
                <span>{proposal.researcher_email}</span>
                {proposal.human_review && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full ring-1 ring-sky-200 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Expert Reviewed
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" /> Delete Proposal
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-2">Delete Proposal</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-700">
                "{proposal.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 btn-ghost text-slate-600 py-2.5 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : proposal ? (
        <>
          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto scrollbar-hide w-fit max-w-full">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    tab === t.id
                      ? 'bg-white text-slate-800 shadow-card'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {t.dot && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ml-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === 'overview' && <AdminOverviewTab proposal={proposal} />}
          {tab === 'evaluation' && proposal.evaluation && (
            proposal.evaluation.error
              ? <ErrorState title="Evaluation Failed" message={proposal.evaluation.error} />
              : <EvaluationCard evaluation={proposal.evaluation} />
          )}
          {tab === 'similarity' && (
            <SimilarityCard matches={proposal.similarity} highestScore={proposal.similarity_score} />
          )}
          {tab === 'human-review' && (
            proposal.human_review
              ? <HumanReviewCard review={proposal.human_review} />
              : (
                <div className="card p-10 text-center">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">No Human Review Yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    A reviewer has not yet submitted an expert evaluation for this proposal.
                  </p>
                </div>
              )
          )}
          {tab === 'text' && (
            <div className="card p-6">
              <h3 className="section-title mb-4">Extracted &amp; Preprocessed Text</h3>
              <div className="bg-slate-50 rounded-xl p-4 max-h-[500px] overflow-y-auto scrollbar-hide">
                <p className="text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {proposal.extracted_text}
                </p>
              </div>
            </div>
          )}
        </>
      ) : null}
    </DashboardLayout>
  );
}

function AdminOverviewTab({ proposal }: { proposal: Proposal }) {
  const hr = proposal.human_review;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Info */}
        <div className="card p-6">
          <h3 className="section-title mb-4">Proposal Information</h3>
          <div className="space-y-3">
            <InfoRow icon={<Hash     className="w-4 h-4 text-slate-400" />} label="ID"         value={proposal._id} mono />
            <InfoRow icon={<Globe    className="w-4 h-4 text-slate-400" />} label="Domain"     value={proposal.domain} />
            <InfoRow icon={<Calendar className="w-4 h-4 text-slate-400" />} label="Uploaded"   value={formatDate(proposal.uploaded_at)} />
            <InfoRow icon={<Mail     className="w-4 h-4 text-slate-400" />} label="Researcher" value={proposal.researcher_email} />
            <InfoRow icon={<FileText className="w-4 h-4 text-slate-400" />} label="File"       value={proposal.filename} mono />
            {hr && (
              <InfoRow icon={<UserCheck className="w-4 h-4 text-sky-400" />} label="Reviewer" value={hr.reviewer_email} />
            )}
          </div>
        </div>

        {/* AI vs Human score comparison — shown when both exist */}
        {hr && proposal.evaluation && !proposal.evaluation.error && (
          <ScoreComparisonCard
            aiScore={proposal.evaluation.overall_score}
            humanScore={((hr.novelty_score + hr.methodology_score + hr.feasibility_score + hr.clarity_score) / 4)}
            finalDecision={hr.final_recommendation}
            reviewerEmail={hr.reviewer_email}
            reviewedAt={hr.reviewed_at}
          />
        )}

        {/* AI Summary */}
        {proposal.evaluation?.summary && (
          <div className="card p-6">
            <h3 className="section-title mb-3">AI Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{proposal.evaluation.summary}</p>
          </div>
        )}

        {/* Reviewer comments */}
        {hr?.comments && (
          <div className="card p-6 border-sky-100 bg-sky-50/30">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-sky-700">Reviewer Feedback</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{hr.comments}</p>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* AI scores */}
        {proposal.evaluation && !proposal.evaluation.error ? (
          <div className="card p-6">
            <h3 className="section-title mb-4">AI Scores</h3>
            <ScoreSection
              items={[
                { label: 'Novelty',     score: proposal.evaluation.novelty_score },
                { label: 'Methodology', score: proposal.evaluation.methodology_score },
                { label: 'Feasibility', score: proposal.evaluation.feasibility_score },
                { label: 'Clarity',     score: proposal.evaluation.clarity_score },
              ]}
              overall={proposal.evaluation.overall_score}
            />
            <div className="mt-3">
              <RecommendationBadge recommendation={proposal.evaluation.overall_recommendation} size="sm" />
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center text-slate-400 text-sm">No AI evaluation data</div>
        )}

        {/* Human review scores */}
        {hr && (
          <div className="card p-6 border-sky-100 bg-gradient-to-b from-sky-50/60 to-white">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-sky-700">Human Review Scores</h3>
            </div>
            <ScoreSection
              items={[
                { label: 'Novelty',     score: hr.novelty_score },
                { label: 'Methodology', score: hr.methodology_score },
                { label: 'Feasibility', score: hr.feasibility_score },
                { label: 'Clarity',     score: hr.clarity_score },
              ]}
              colorized
            />
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                hr.final_recommendation === 'accept'                ? 'bg-emerald-100 text-emerald-700' :
                hr.final_recommendation === 'accept_with_revisions' ? 'bg-sky-100 text-sky-700' :
                hr.final_recommendation === 'revise'                ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {hr.final_recommendation === 'accept'                && '✅ Accept'}
                {hr.final_recommendation === 'accept_with_revisions' && '📝 Accept with Revisions'}
                {hr.final_recommendation === 'revise'                && '🔄 Revise'}
                {hr.final_recommendation === 'reject'                && '❌ Reject'}
              </span>
            </div>
          </div>
        )}

        {/* Similarity */}
        {proposal.similarity_score !== null && (
          <div className="card p-5">
            <p className="text-xs text-slate-500 mb-1">Highest Similarity</p>
            <p className="text-2xl font-bold text-slate-800">{proposal.similarity_score}%</p>
            <p className="text-xs text-slate-400 mt-1">{proposal.similarity?.length || 0} similar proposals found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreSection({
  items,
  overall,
  colorized = false,
}: {
  items: { label: string; score: number }[];
  overall?: number;
  colorized?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map(({ label, score }) => {
        const barCls = colorized
          ? score >= 7 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
          : 'bg-primary-500';
        const textCls = colorized
          ? score >= 7 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-rose-600'
          : 'text-slate-700';
        return (
          <div key={label} className="flex items-center justify-between">
            <p className="text-xs text-slate-500">{label}</p>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${barCls}`} style={{ width: `${score * 10}%` }} />
              </div>
              <span className={`text-xs font-bold w-5 text-right ${textCls}`}>{score}</span>
            </div>
          </div>
        );
      })}
      {overall !== undefined && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">Overall</p>
          <p className="text-xl font-bold text-primary-600">
            {overall}<span className="text-xs text-slate-400 font-normal">/10</span>
          </p>
        </div>
      )}
    </div>
  );
}

function ScoreComparisonCard({
  aiScore,
  humanScore,
  finalDecision,
  reviewerEmail,
  reviewedAt,
}: {
  aiScore: number;
  humanScore: number;
  finalDecision: string;
  reviewerEmail: string;
  reviewedAt?: string;
}) {
  const diff = Math.abs(aiScore - humanScore).toFixed(2);
  const humanAvg = Number(humanScore.toFixed(1));

  const decisionConfig: Record<string, { label: string; cls: string }> = {
    accept:                { label: '✅ Accepted',              cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    accept_with_revisions: { label: '📝 Accepted with Revisions', cls: 'bg-sky-100 text-sky-700 border-sky-200'          },
    revise:                { label: '🔄 Revise',                cls: 'bg-amber-100 text-amber-700 border-amber-200'      },
    reject:                { label: '❌ Rejected',              cls: 'bg-rose-100 text-rose-700 border-rose-200'         },
  };
  const dc = decisionConfig[finalDecision] ?? { label: finalDecision, cls: 'bg-slate-100 text-slate-600 border-slate-200' };

  return (
    <div className="card p-6 border-violet-100 bg-gradient-to-br from-violet-50/40 via-white to-sky-50/30">
      <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center text-xs">⚖</span>
        AI vs Human Score Comparison
      </h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-1">AI Score</p>
          <p className="text-2xl font-extrabold text-primary-600">{aiScore}</p>
          <p className="text-[10px] text-slate-400">/ 10</p>
        </div>
        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Diff</p>
          <p className="text-xl font-extrabold text-slate-600">±{diff}</p>
          <p className="text-[10px] text-slate-400">pts</p>
        </div>
        <div className={`text-center p-3 rounded-xl border ${
          humanAvg >= 7 ? 'bg-emerald-50 border-emerald-100' :
          humanAvg >= 5 ? 'bg-amber-50 border-amber-100' : 'bg-rose-50 border-rose-100'
        }`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
            humanAvg >= 7 ? 'text-emerald-600' : humanAvg >= 5 ? 'text-amber-600' : 'text-rose-600'
          }`}>Human Score</p>
          <p className={`text-2xl font-extrabold ${
            humanAvg >= 7 ? 'text-emerald-600' : humanAvg >= 5 ? 'text-amber-600' : 'text-rose-600'
          }`}>{humanAvg}</p>
          <p className="text-[10px] text-slate-400">/ 10</p>
        </div>
      </div>
      <div className={`flex items-center justify-between p-3 rounded-xl border ${dc.cls}`}>
        <div>
          <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wider mb-0.5">Final Decision</p>
          <p className="text-sm font-bold">{dc.label}</p>
        </div>
        <div className="text-right text-[10px] opacity-60">
          <p>by {reviewerEmail}</p>
          {reviewedAt && <p>{new Date(reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-xs font-semibold text-slate-500 w-24 flex-shrink-0">{label}</span>
      <span className={`text-sm text-slate-800 truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

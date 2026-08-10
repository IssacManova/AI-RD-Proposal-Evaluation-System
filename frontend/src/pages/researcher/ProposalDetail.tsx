import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FileText, Upload, LayoutDashboard, User,
  ChevronLeft, Calendar, Globe, Mail, Hash,
  Brain, Search, AlignLeft, UserCheck, CheckCircle2,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',       href: '/researcher',           icon: LayoutDashboard },
  { label: 'Upload Proposal', href: '/researcher/upload',    icon: Upload },
  { label: 'My Proposals',    href: '/researcher/proposals', icon: FileText },
  { label: 'Profile',         href: '/researcher/profile',   icon: User },
];

type Tab = 'overview' | 'evaluation' | 'similarity' | 'human-review' | 'text';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [tab, setTab]           = useState<Tab>('overview');

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

  const tabs: { id: Tab; label: string; icon: typeof Brain; dot?: boolean }[] = [
    { id: 'overview',      label: 'Overview',        icon: Hash },
    { id: 'evaluation',    label: 'AI Evaluation',   icon: Brain },
    { id: 'similarity',    label: 'Similarity',      icon: Search },
    { id: 'human-review',  label: 'Human Review',    icon: UserCheck, dot: !!proposal?.human_review },
    { id: 'text',          label: 'Extracted Text',  icon: AlignLeft },
  ];

  const hasHumanReview = !!proposal?.human_review;

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="Proposal Detail">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3 flex-wrap">
        <button onClick={() => navigate(-1)} className="btn-ghost mt-0.5">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        {proposal && (
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800 break-words">{proposal.title}</h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 font-medium">
                {proposal.domain}
              </span>
              <span>{formatDate(proposal.uploaded_at)}</span>
              {hasHumanReview && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full ring-1 ring-sky-200 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Expert Reviewed
                </span>
              )}
            </p>
          </div>
        )}
      </div>

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
                  {t.dot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {tab === 'overview'     && <OverviewTab proposal={proposal} />}
          {tab === 'evaluation'   && proposal.evaluation && (
            proposal.evaluation.error
              ? <ErrorState title="Evaluation Failed" message={proposal.evaluation.error} />
              : <EvaluationCard evaluation={proposal.evaluation} />
          )}
          {tab === 'similarity'   && (
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
                  <p className="text-xs text-slate-400 mt-1">
                    A reviewer has not yet submitted an expert evaluation for this proposal.
                  </p>
                </div>
              )
          )}
          {tab === 'text'         && <TextTab text={proposal.extracted_text} />}
        </>
      ) : null}
    </DashboardLayout>
  );
}

function OverviewTab({ proposal }: { proposal: Proposal }) {
  const hasHumanReview = !!proposal.human_review;
  const hr = proposal.human_review;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Info card */}
        <div className="card p-6">
          <h3 className="section-title mb-4">Proposal Information</h3>
          <div className="space-y-3">
            <InfoRow icon={<Hash     className="w-4 h-4 text-slate-400" />} label="ID"         value={proposal._id} mono />
            <InfoRow icon={<Globe    className="w-4 h-4 text-slate-400" />} label="Domain"     value={proposal.domain} />
            <InfoRow icon={<Calendar className="w-4 h-4 text-slate-400" />} label="Uploaded"   value={formatDate(proposal.uploaded_at)} />
            <InfoRow icon={<Mail     className="w-4 h-4 text-slate-400" />} label="Researcher" value={proposal.researcher_email} />
            <InfoRow icon={<FileText className="w-4 h-4 text-slate-400" />} label="File"       value={proposal.filename} mono />
          </div>
        </div>

        {/* AI vs Human comparison — only show when both exist */}
        {hasHumanReview && hr && proposal.evaluation && !proposal.evaluation.error && (
          <ScoreComparisonCard
            aiScore={proposal.evaluation.overall_score}
            humanScore={((hr.novelty_score + hr.methodology_score + hr.feasibility_score + hr.clarity_score) / 4)}
            finalDecision={hr.final_recommendation}
            reviewerEmail={hr.reviewer_email}
            reviewedAt={hr.reviewed_at}
          />
        )}

        {/* Summary */}
        {proposal.evaluation?.summary && (
          <div className="card p-6">
            <h3 className="section-title mb-3">AI Summary</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{proposal.evaluation.summary}</p>
          </div>
        )}

        {/* Human review comments preview */}
        {hasHumanReview && hr?.comments && (
          <div className="card p-6 border-sky-100 bg-sky-50/30">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-sky-700">Reviewer Feedback</h3>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{hr.comments}</p>
          </div>
        )}
      </div>

      {/* Right column */}
      <div className="space-y-4">
        {/* AI scores */}
        {proposal.evaluation && !proposal.evaluation.error ? (
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-primary-500" />
              <h3 className="section-title">AI Scores</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Novelty',      score: proposal.evaluation.novelty_score },
                { label: 'Methodology',  score: proposal.evaluation.methodology_score },
                { label: 'Feasibility',  score: proposal.evaluation.feasibility_score },
                { label: 'Clarity',      score: proposal.evaluation.clarity_score },
              ].map(({ label, score }) => (
                <div key={label} className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">{label}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-700"
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-5 text-right">{score}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-slate-700">Overall AI Score</p>
                  <p className="text-xl font-bold text-primary-600">
                    {proposal.evaluation.overall_score}
                    <span className="text-xs text-slate-400 font-normal">/10</span>
                  </p>
                </div>
                <RecommendationBadge recommendation={proposal.evaluation.overall_recommendation} size="sm" />
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 text-center text-slate-400 text-sm">No AI evaluation data</div>
        )}

        {/* Human review scores quick view */}
        {hasHumanReview && hr && (
          <div className="card p-6 border-sky-100 bg-gradient-to-b from-sky-50/50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-sky-700">Human Review Scores</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Novelty',      score: hr.novelty_score },
                { label: 'Methodology',  score: hr.methodology_score },
                { label: 'Feasibility',  score: hr.feasibility_score },
                { label: 'Clarity',      score: hr.clarity_score },
              ].map(({ label, score }) => {
                const barCls = score >= 7 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500';
                const textCls = score >= 7 ? 'text-emerald-600' : score >= 5 ? 'text-amber-600' : 'text-rose-600';
                return (
                  <div key={label} className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">{label}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${barCls}`}
                          style={{ width: `${score * 10}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold w-5 text-right ${textCls}`}>{score}</span>
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-sky-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-sky-700">Final Decision</p>
                </div>
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
          </div>
        )}

        {/* Similarity score */}
        {proposal.similarity_score !== null && (
          <div className="card p-5">
            <p className="text-xs text-slate-500 mb-1">Highest Semantic Similarity</p>
            <p className="text-2xl font-bold text-slate-800">{proposal.similarity_score}%</p>
            <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  proposal.similarity_score >= 80 ? 'bg-rose-500' :
                  proposal.similarity_score >= 50 ? 'bg-amber-500' : 'bg-primary-500'
                }`}
                style={{ width: `${proposal.similarity_score}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{proposal.similarity?.length || 0} similar proposals found</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** AI vs Human score comparison — shown when both evaluations exist */
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
        {/* AI Score */}
        <div className="text-center p-3 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-[10px] font-semibold text-primary-600 uppercase tracking-wider mb-1">AI Score</p>
          <p className="text-2xl font-extrabold text-primary-600">{aiScore}</p>
          <p className="text-[10px] text-slate-400">/ 10</p>
        </div>

        {/* Difference */}
        <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Diff</p>
          <p className="text-xl font-extrabold text-slate-600">±{diff}</p>
          <p className="text-[10px] text-slate-400">pts</p>
        </div>

        {/* Human Score */}
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

      {/* Final decision */}
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

function TextTab({ text }: { text: string }) {
  return (
    <div className="card p-6">
      <h3 className="section-title mb-4">Extracted &amp; Preprocessed Text</h3>
      <div className="bg-slate-50 rounded-xl p-4 max-h-[500px] overflow-y-auto scrollbar-hide">
        <p className="text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

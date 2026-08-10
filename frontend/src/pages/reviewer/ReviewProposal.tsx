import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import EvaluationCard from '../../components/evaluation/EvaluationCard';
import SimilarityCard from '../../components/similarity/SimilarityCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import ScoreRing from '../../components/ui/ScoreRing';
import RecommendationBadge from '../../components/ui/RecommendationBadge';
import { proposalsApi } from '../../api/proposals';
import { evaluationsApi } from '../../api/evaluations';
import type { Proposal, HumanReview, RecommendationStatus } from '../../types';
import { formatDate } from '../../utils/format';
import {
  ChevronLeft, FileText, LayoutDashboard, User, BookOpen,
  Brain, UserCheck, Send, CheckCircle2, Calendar, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Dashboard',          href: '/reviewer',          icon: LayoutDashboard },
  { label: 'Assigned Proposals', href: '/reviewer/proposals', icon: BookOpen },
  { label: 'All Proposals',      href: '/reviewer/all',       icon: FileText },
  { label: 'Profile',            href: '/reviewer/profile',   icon: User },
];

type Tab = 'ai-evaluation' | 'similarity' | 'human-review';

const scoreColor = (v: number) =>
  v >= 7 ? 'text-emerald-600' : v >= 5 ? 'text-amber-600' : 'text-rose-600';

const scoreTrack = (v: number) =>
  v >= 7 ? '#10b981' : v >= 5 ? '#f59e0b' : '#f43f5e';

const scoreChipClass = (v: number) =>
  v >= 7 ? 'score-chip-high' : v >= 5 ? 'score-chip-mid' : 'score-chip-low';

const recConfig: Record<RecommendationStatus, { label: string; emoji: string; cls: string }> = {
  accept:                { label: 'Accept',               emoji: '✅', cls: 'bg-emerald-600 text-white ring-0' },
  accept_with_revisions: { label: 'Accept with Revisions', emoji: '📝', cls: 'bg-sky-600 text-white ring-0'     },
  revise:                { label: 'Revise',               emoji: '🔄', cls: 'bg-amber-500 text-white ring-0'   },
  reject:                { label: 'Reject',               emoji: '❌', cls: 'bg-rose-600 text-white ring-0'    },
  pending:               { label: 'Pending',              emoji: '⏳', cls: 'bg-slate-400 text-white ring-0'   },
};

interface ScoreSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

function ScoreSlider({ label, value, onChange }: ScoreSliderProps) {
  const pct = (value / 10) * 100;
  const track = scoreTrack(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreChipClass(value)}`}>
          {value} / 10
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="score-slider"
          style={{
            background: `linear-gradient(to right, ${track} 0%, ${track} ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`,
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 px-0.5">
        <span>0 — Poor</span>
        <span>5 — Average</span>
        <span>10 — Excellent</span>
      </div>
    </div>
  );
}

export default function ReviewProposal() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [tab, setTab]           = useState<Tab>('ai-evaluation');

  // Human review form state
  const [novelty,     setNovelty]     = useState(7);
  const [methodology, setMethodology] = useState(7);
  const [feasibility, setFeasibility] = useState(7);
  const [clarity,     setClarity]     = useState(7);
  const [comments,    setComments]    = useState('');
  const [finalRec,    setFinalRec]    = useState<RecommendationStatus>('accept');
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => {
    if (!id) return;
    proposalsApi.getProposalById(id)
      .then((p) => {
        if (p) {
          setProposal(p);
          // Pre-fill if already reviewed
          if (p.human_review) {
            setNovelty(p.human_review.novelty_score);
            setMethodology(p.human_review.methodology_score);
            setFeasibility(p.human_review.feasibility_score);
            setClarity(p.human_review.clarity_score);
            setComments(p.human_review.comments);
            setFinalRec(p.human_review.final_recommendation);
          }
        } else {
          setError('Proposal not found.');
        }
      })
      .catch(() => setError('Failed to load proposal.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmitReview = async () => {
    if (!id) return;
    setSubmitting(true);
    try {
      const review: HumanReview = {
        reviewer_email:    user?.email || '',
        novelty_score:     novelty,
        methodology_score: methodology,
        feasibility_score: feasibility,
        clarity_score:     clarity,
        comments,
        final_recommendation: finalRec,
        reviewed_at:       new Date().toISOString(),
      };
      await evaluationsApi.submitReview(id, review);

      // Update the local proposal state and localStorage cache immediately
      // so the UI reflects the submitted review without a page reload.
      setProposal((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, human_review: review };
        // Patch localStorage cache
        try {
          const cached = JSON.parse(localStorage.getItem('ai_rd_proposals') || '[]') as typeof prev[];
          const patched = cached.map((p) => p._id === id ? { ...p, human_review: review } : p);
          localStorage.setItem('ai_rd_proposals', JSON.stringify(patched));
        } catch { /* ignore */ }
        return updated;
      });

      toast.success('Review submitted successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(msg || 'Failed to submit review. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Brain }[] = [
    { id: 'ai-evaluation', label: 'AI Evaluation', icon: Brain },
    { id: 'similarity',    label: 'Similarity',    icon: FileText },
    { id: 'human-review',  label: 'Your Review',   icon: UserCheck },
  ];

  const avgScore = ((novelty + methodology + feasibility + clarity) / 4).toFixed(1);
  const alreadyReviewed = !!proposal?.human_review;

  return (
    <DashboardLayout items={navItems} role="reviewer" pageTitle="Review Proposal">
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
              <span className="text-slate-300">·</span>
              <span>{proposal.researcher_email}</span>
              {alreadyReviewed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full ring-1 ring-sky-200 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Reviewed
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <ErrorState message={error} />
      ) : proposal ? (
        <>
          {/* AI Banner */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 border border-primary-100 rounded-xl mb-6 w-fit">
            <Brain className="w-4 h-4 text-primary-500" />
            <p className="text-xs font-semibold text-primary-700">AI-Assisted Review Interface</p>
            <span className="text-xs text-primary-500">· AI data shown for reference only. Your judgment is final.</span>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 overflow-x-auto w-fit max-w-full scrollbar-hide">
            {tabs.map(({ id: tid, label, icon: Icon }) => (
              <button
                key={tid}
                onClick={() => setTab(tid)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  tab === tid
                    ? 'bg-white text-slate-800 shadow-card'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {tid === 'human-review' && alreadyReviewed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 ml-0.5" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'ai-evaluation' && proposal.evaluation && (
            <EvaluationCard evaluation={proposal.evaluation} />
          )}

          {tab === 'similarity' && (
            <SimilarityCard matches={proposal.similarity} highestScore={proposal.similarity_score} />
          )}

          {tab === 'human-review' && (
            <div className="max-w-2xl space-y-5 animate-fade-in">

              {/* Already reviewed banner */}
              {alreadyReviewed && (
                <div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-sky-700">Review Already Submitted</p>
                    <p className="text-xs text-sky-600 mt-0.5">
                      You submitted this review
                      {proposal.human_review?.reviewed_at && (
                        <span className="inline-flex items-center gap-1 ml-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(proposal.human_review.reviewed_at).toLocaleDateString()}
                        </span>
                      )}. You can update it below.
                    </p>
                  </div>
                </div>
              )}

              {/* Reviewer Input label */}
              {!alreadyReviewed && (
                <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-100 rounded-xl">
                  <UserCheck className="w-4 h-4 text-sky-500" />
                  <p className="text-xs font-semibold text-sky-700">
                    Human Reviewer Input — Your scores override AI suggestions in the final evaluation.
                  </p>
                </div>
              )}

              {/* AI reference scores */}
              {proposal.evaluation && !proposal.evaluation.error && (
                <div className="card p-5">
                  <p className="text-xs font-semibold text-slate-500 mb-4 uppercase tracking-wider">
                    AI Reference Scores
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <ScoreRing score={proposal.evaluation.novelty_score}     label="Novelty"     size={80} />
                    <ScoreRing score={proposal.evaluation.methodology_score}  label="Methodology" size={80} />
                    <ScoreRing score={proposal.evaluation.feasibility_score}  label="Feasibility" size={80} />
                    <ScoreRing score={proposal.evaluation.clarity_score}      label="Clarity"     size={80} />
                  </div>
                </div>
              )}

              {/* Your score sliders */}
              <div className="card p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Your Evaluation Scores</h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
                    <Star className="w-3.5 h-3.5 text-primary-500" />
                    <span className={`text-sm font-extrabold ${scoreColor(Number(avgScore))}`}>
                      {avgScore} avg
                    </span>
                  </div>
                </div>

                <ScoreSlider label="Novelty"      value={novelty}      onChange={setNovelty} />
                <ScoreSlider label="Methodology"  value={methodology}  onChange={setMethodology} />
                <ScoreSlider label="Feasibility"  value={feasibility}  onChange={setFeasibility} />
                <ScoreSlider label="Clarity"      value={clarity}      onChange={setClarity} />
              </div>

              {/* Final recommendation */}
              <div className="card p-6">
                <label className="label">Final Recommendation</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {(Object.keys(recConfig) as RecommendationStatus[])
                    .filter(r => r !== 'pending')
                    .map((r) => {
                      const conf = recConfig[r];
                      const selected = finalRec === r;
                      return (
                        <button
                          key={r}
                          onClick={() => setFinalRec(r)}
                          className={`
                            px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all duration-200 flex items-center gap-2
                            ${selected
                              ? `${conf.cls} border-transparent shadow-card scale-[1.02]`
                              : 'border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-slate-50 bg-white'
                            }
                          `}
                        >
                          <span className="text-base leading-none">{conf.emoji}</span>
                          {conf.label}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Comments */}
              <div className="card p-6">
                <label className="label">Reviewer Comments</label>
                <p className="text-xs text-slate-400 mb-2">Provide detailed feedback for the researcher.</p>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={5}
                  placeholder="Share your observations on the methodology, novelty, feasibility, and areas for improvement…"
                  className="input-field resize-none mt-1"
                />
                <p className="text-xs text-slate-400 mt-1.5 text-right">{comments.length} characters</p>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="btn-primary w-full py-3.5 justify-center text-base font-bold rounded-2xl hover:shadow-glow"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {alreadyReviewed ? 'Update Review' : 'Submit Review'}
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : null}
    </DashboardLayout>
  );
}

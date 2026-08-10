import type { HumanReview, RecommendationStatus } from '../../types';
import {
  UserCheck, Star, MessageSquare, Calendar,
  CheckCircle, XCircle, Edit, AlertCircle, Clock,
} from 'lucide-react';

interface Props {
  review: HumanReview;
}

const recMap: Record<RecommendationStatus, { label: string; emoji: string; cls: string; Icon: typeof CheckCircle }> = {
  accept:                { label: 'Accept',               emoji: '✅', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', Icon: CheckCircle },
  accept_with_revisions: { label: 'Accept with Revisions', emoji: '📝', cls: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',             Icon: Edit        },
  revise:                { label: 'Major Revision',        emoji: '🔄', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',        Icon: AlertCircle  },
  reject:                { label: 'Reject',               emoji: '❌', cls: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',           Icon: XCircle     },
  pending:               { label: 'Pending Review',       emoji: '⏳', cls: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',       Icon: Clock       },
};

function scoreColor(v: number) {
  return v >= 7 ? 'text-emerald-600' : v >= 5 ? 'text-amber-600' : 'text-rose-600';
}
function scoreBar(v: number) {
  return v >= 7 ? 'bg-emerald-500' : v >= 5 ? 'bg-amber-500' : 'bg-rose-500';
}
function scoreChip(v: number) {
  return v >= 7 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
       : v >= 5 ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
       : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200';
}

interface ScoreRowProps { label: string; value: number }
function ScoreRow({ label, value }: ScoreRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-500 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${scoreBar(value)}`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreChip(value)}`}>
        {value}<span className="opacity-50">/10</span>
      </span>
    </div>
  );
}

export default function HumanReviewCard({ review }: Props) {
  const recStatus = review.final_recommendation as RecommendationStatus;
  const rec       = recMap[recStatus] ?? recMap.pending;
  const RecIcon   = rec.Icon;
  const avgScore  = ((review.novelty_score + review.methodology_score + review.feasibility_score + review.clarity_score) / 4).toFixed(1);
  const avgNum    = Number(avgScore);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header banner */}
      <div className="flex items-center gap-3 p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-sky">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-sky-800">Human Expert Review</p>
          <p className="text-xs text-sky-600 flex items-center gap-2 mt-0.5 flex-wrap">
            <span>Reviewed by <strong>{review.reviewer_email}</strong></span>
            {review.reviewed_at && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(review.reviewed_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </span>
            )}
          </p>
        </div>
        {/* Average score pill */}
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-extrabold text-sm ${scoreChip(avgNum)}`}>
          <Star className="w-3.5 h-3.5" />
          {avgScore} avg
        </div>
      </div>

      {/* Scores */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          Evaluation Scores
          <span className="text-xs font-normal text-slate-400">by human reviewer</span>
        </h3>
        <ScoreRow label="Novelty"     value={review.novelty_score} />
        <ScoreRow label="Methodology" value={review.methodology_score} />
        <ScoreRow label="Feasibility" value={review.feasibility_score} />
        <ScoreRow label="Clarity"     value={review.clarity_score} />

        {/* Overall avg */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Average Human Score</p>
            <p className={`text-2xl font-extrabold mt-0.5 ${scoreColor(avgNum)}`}>
              {avgScore}<span className="text-sm text-slate-400 font-normal"> / 10</span>
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${rec.cls}`}>
            <RecIcon className="w-4 h-4" />
            {rec.label}
          </span>
        </div>
      </div>

      {/* Comments */}
      {review.comments && (
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">Reviewer Comments</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{review.comments}</p>
          </div>
        </div>
      )}
    </div>
  );
}

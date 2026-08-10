import { useNavigate } from 'react-router-dom';
import type { Proposal } from '../../types';
import { formatDate } from '../../utils/format';
import RecommendationBadge from '../ui/RecommendationBadge';
import { FileText, ArrowRight, UserCheck } from 'lucide-react';

interface Props {
  proposal: Proposal;
  role?: 'researcher' | 'reviewer' | 'admin';
}

export default function ProposalCard({ proposal, role = 'researcher' }: Props) {
  const navigate = useNavigate();
  const score = proposal.evaluation?.overall_score;
  const rec   = proposal.evaluation?.overall_recommendation;
  const humanReviewed = !!proposal.human_review;

  const detailPath =
    role === 'reviewer' ? `/reviewer/proposals/${proposal._id}` :
    role === 'admin'    ? `/admin/proposals/${proposal._id}` :
    `/researcher/proposals/${proposal._id}`;

  // Score color
  const scoreColor =
    score === undefined ? 'text-slate-400' :
    score >= 7 ? 'text-emerald-600' :
    score >= 5 ? 'text-amber-600' : 'text-rose-600';

  const scoreBg =
    score === undefined ? 'bg-slate-50' :
    score >= 7 ? 'bg-emerald-50' :
    score >= 5 ? 'bg-amber-50' : 'bg-rose-50';

  return (
    <div
      className="card-hover p-5 cursor-pointer group animate-slide-up"
      onClick={() => navigate(detailPath)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
          <FileText className="w-5 h-5 text-primary-500" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
              {proposal.title}
            </h3>
            {/* Score chip */}
            {score !== undefined && (
              <span className={`text-sm font-extrabold ${scoreColor} ${scoreBg} px-2 py-0.5 rounded-lg flex-shrink-0`}>
                {score}<span className="text-xs font-normal opacity-60">/10</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">{proposal.domain} · {formatDate(proposal.uploaded_at)}</p>

          {/* Score progress bar */}
          {score !== undefined && (
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  score >= 7 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${score * 10}%` }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {rec && <RecommendationBadge recommendation={rec} size="sm" />}
            {humanReviewed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                <UserCheck className="w-2.5 h-2.5" />
                Reviewed
              </span>
            )}
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-1" />
      </div>
    </div>
  );
}

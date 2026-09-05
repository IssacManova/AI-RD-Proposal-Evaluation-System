import type { FormatCheck } from '../../types';
import {
  CheckCircle2, XCircle, ShieldCheck, ShieldAlert, AlertTriangle,
} from 'lucide-react';

interface Props {
  formatCheck: FormatCheck;
  compact?: boolean;
}

export default function FormatCheckCard({ formatCheck, compact = false }: Props) {
  const { is_valid, score, found_count, total_sections, sections } = formatCheck;

  // Score-based colour system
  const scoreColor =
    score >= 80 ? 'text-emerald-600' :
    score >= 50 ? 'text-amber-600'   : 'text-rose-600';

  const scoreBg =
    score >= 80 ? 'bg-emerald-50 border-emerald-200' :
    score >= 50 ? 'bg-amber-50 border-amber-200'     : 'bg-rose-50 border-rose-200';

  const barColor =
    score >= 80 ? 'bg-emerald-500' :
    score >= 50 ? 'bg-amber-500'   : 'bg-rose-500';

  if (compact) {
    /* ── Compact inline badge used in upload pipeline sidebar ── */
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${scoreBg}`}>
        {is_valid
          ? <ShieldCheck className={`w-4 h-4 ${scoreColor}`} />
          : <ShieldAlert className={`w-4 h-4 ${scoreColor}`} />}
        <span className={scoreColor}>
          Format Check: {found_count}/{total_sections} sections &nbsp;·&nbsp; {score}%
        </span>
      </div>
    );
  }

  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            is_valid ? 'bg-emerald-100' : score >= 50 ? 'bg-amber-100' : 'bg-rose-100'
          }`}>
            {is_valid
              ? <ShieldCheck className="w-5 h-5 text-emerald-600" />
              : <ShieldAlert className={`w-5 h-5 ${score >= 50 ? 'text-amber-600' : 'text-rose-600'}`} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">IEEE Standard Format Check</h3>
              <span className="bg-primary-100 text-primary-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                IEEE Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {is_valid
                ? 'All required IEEE Standard sections & citations detected.'
                : `${formatCheck.missing_count} IEEE section${formatCheck.missing_count > 1 ? 's' : ''} missing from the proposal.`}
            </p>
          </div>
        </div>

        {/* Score pill */}
        <div className={`flex flex-col items-center px-4 py-2 rounded-xl border ${scoreBg} flex-shrink-0`}>
          <span className={`text-2xl font-extrabold ${scoreColor}`}>{score}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5">
            {found_count}/{total_sections} sections
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <p className="text-[10px] text-slate-400">0% — No sections</p>
          <p className="text-[10px] text-slate-400">100% — All sections present</p>
        </div>
      </div>

      {/* Section checklist */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Section Checklist
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sections.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium ${
                s.found
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}
            >
              {s.found
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                : <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
              <span className="text-xs font-semibold">{s.label}</span>
              {!s.found && s.required && (
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-rose-500">
                  Missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning note for invalid */}
      {!is_valid && (
        <div className="mt-4 flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Recommendation:</strong> Ensure your proposal contains all required sections before submission.
            Missing sections may affect your evaluation score and reviewer feedback.
          </p>
        </div>
      )}
    </div>
  );
}

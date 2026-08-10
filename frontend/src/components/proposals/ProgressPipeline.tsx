import { CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react';
import type { PipelineStage } from '../../types';

interface Props {
  stages: PipelineStage[];
}

const icons = {
  waiting:  <Circle className="w-5 h-5 text-slate-300" />,
  active:   <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />,
  complete: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error:    <AlertCircle className="w-5 h-5 text-rose-500" />,
};

const labelColors = {
  waiting:  'text-slate-400',
  active:   'text-primary-600 font-semibold',
  complete: 'text-emerald-600',
  error:    'text-rose-600',
};

export default function ProgressPipeline({ stages }: Props) {
  return (
    <div className="space-y-0">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 flex items-center justify-center">{icons[stage.status]}</div>
            {i < stages.length - 1 && (
              <div className={`w-0.5 h-6 mt-0.5 transition-colors duration-500 ${stage.status === 'complete' ? 'bg-emerald-200' : 'bg-slate-100'}`} />
            )}
          </div>
          <div className="pb-1 pt-1.5">
            <p className={`text-sm transition-colors duration-300 ${labelColors[stage.status]}`}>
              {stage.label}
            </p>
            {stage.status === 'active' && (
              <p className="text-xs text-primary-400 mt-0.5 animate-pulse">Processing…</p>
            )}
            {stage.status === 'complete' && (
              <p className="text-xs text-emerald-400 mt-0.5">Complete</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

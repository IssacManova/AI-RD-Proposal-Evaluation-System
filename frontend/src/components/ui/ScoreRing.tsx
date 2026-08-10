import { useEffect, useRef } from 'react';
import { scoreLabel } from '../../utils/format';

interface Props {
  score: number;   // 0–10
  label: string;
  size?: number;   // SVG diameter
}

export default function ScoreRing({ score, label, size = 100 }: Props) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(score / 10, 0), 1);
  const offset = circumference * (1 - pct);

  const color =
    score >= 8 ? '#10b981' :
    score >= 6 ? '#6366f1' :
    score >= 4 ? '#f59e0b' : '#f43f5e';

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
        el.style.strokeDashoffset = String(offset);
      });
    });
  }, [score, circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={10}
          />
          <circle
            ref={circleRef}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-800">{score}</span>
          <span className="text-[10px] text-slate-400 font-medium">/10</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400">{scoreLabel(score)}</p>
      </div>
    </div>
  );
}

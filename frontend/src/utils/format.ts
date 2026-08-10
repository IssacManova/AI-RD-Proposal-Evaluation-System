/** Format an ISO date string to "12 Aug 2026" */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

/** Format a score like 8.75 → "8.75 / 10" */
export function formatScore(score: number): string {
  return `${score.toFixed(2)} / 10`;
}

/** Interpret a 0–10 score as a label */
export function scoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Average';
  if (score >= 3) return 'Below Average';
  return 'Poor';
}

/** Convert snake_case recommendation string to human-readable title */
export function formatRecommendation(rec: string): string {
  return rec
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Truncate text to maxLen characters with ellipsis */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen)}…`;
}

/** Similarity score → risk label */
export function similarityRisk(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'High Similarity', color: 'rose' };
  if (score >= 50) return { label: 'Moderate Similarity', color: 'amber' };
  if (score >= 25) return { label: 'Low Similarity', color: 'emerald' };
  return { label: 'Minimal Similarity', color: 'slate' };
}

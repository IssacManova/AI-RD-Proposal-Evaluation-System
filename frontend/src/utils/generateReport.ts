import type { Proposal } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function fmtDateTime(): string {
  return new Date().toLocaleString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function scoreBar(score: number): string {
  const pct = Math.min(score * 10, 100);
  const color =
    score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#f43f5e';
  return `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="flex:1;height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:${color};border-radius:999px;"></div>
      </div>
      <span style="font-weight:700;font-size:13px;color:${color};min-width:28px;text-align:right;">${score}<span style="font-size:10px;color:#94a3b8;font-weight:400;">/10</span></span>
    </div>`;
}

function scoreLabel(score: number): string {
  if (score >= 7) return '#10b981';
  if (score >= 5) return '#f59e0b';
  return '#f43f5e';
}

function recLabel(rec: string): { text: string; bg: string; color: string } {
  const map: Record<string, { text: string; bg: string; color: string }> = {
    accept:                { text: '✅  Accepted',               bg: '#ecfdf5', color: '#065f46' },
    accept_with_revisions: { text: '📝  Accepted with Revisions', bg: '#eff6ff', color: '#1e40af' },
    revise:                { text: '🔄  Major Revision Required', bg: '#fffbeb', color: '#92400e' },
    reject:                { text: '❌  Rejected',               bg: '#fff1f2', color: '#9f1239' },
    pending:               { text: '⏳  Pending',                bg: '#f8fafc', color: '#475569' },
  };
  return map[rec] ?? { text: rec, bg: '#f8fafc', color: '#475569' };
}

function listItems(items: string[], bulletColor: string): string {
  if (!items || items.length === 0) return '<p style="color:#94a3b8;font-size:13px;">None recorded.</p>';
  return items
    .map(
      (item) =>
        `<li style="margin-bottom:6px;font-size:13px;color:#374151;line-height:1.6;">
           <span style="color:${bulletColor};font-weight:700;">•</span>&nbsp;${item}
         </li>`,
    )
    .join('');
}

// ─── Section builders ─────────────────────────────────────────────────────────

function buildHeader(proposal: Proposal): string {
  return `
    <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:40px 48px;border-radius:0;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <p style="color:#94a3b8;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">
            AI Research & Development Evaluation System
          </p>
          <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0 0 10px;line-height:1.3;max-width:560px;">
            ${proposal.title}
          </h1>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <span style="background:rgba(255,255,255,0.15);color:#e2e8f0;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;">
              ${proposal.domain}
            </span>
            <span style="background:rgba(255,255,255,0.10);color:#cbd5e1;font-size:11px;font-weight:500;padding:4px 10px;border-radius:999px;">
              📅 Uploaded: ${fmt(proposal.uploaded_at)}
            </span>
            ${proposal.human_review ? `<span style="background:rgba(16,185,129,0.25);color:#6ee7b7;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;">✓ Expert Reviewed</span>` : ''}
          </div>
        </div>
        <div style="text-align:right;">
          <p style="color:#64748b;font-size:10px;margin:0 0 4px;">Evaluation Report</p>
          <p style="color:#94a3b8;font-size:11px;font-weight:600;margin:0;">${fmtDateTime()}</p>
        </div>
      </div>
    </div>`;
}

function buildOverview(proposal: Proposal): string {
  const aiRec = proposal.evaluation && !proposal.evaluation.error
    ? recLabel(proposal.evaluation.overall_recommendation)
    : null;
  const hrRec = proposal.human_review
    ? recLabel(proposal.human_review.final_recommendation)
    : null;

  return `
    <div class="section">
      <h2 class="section-title"><span class="section-icon">📋</span>Overview</h2>
      <div class="card">
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${row('Proposal ID',      `<span style="font-family:monospace;font-size:12px;color:#475569;">${proposal._id}</span>`)}
            ${row('Title',            proposal.title)}
            ${row('Domain',           `<span style="background:#f1f5f9;color:#475569;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600;">${proposal.domain}</span>`)}
            ${row('Researcher',       proposal.researcher_email)}
            ${row('File',             `<span style="font-family:monospace;font-size:12px;color:#475569;">${proposal.filename}</span>`)}
            ${row('Upload Date',      fmt(proposal.uploaded_at))}
            ${row('AI Recommendation', aiRec
              ? `<span style="background:${aiRec.bg};color:${aiRec.color};font-weight:700;font-size:12px;padding:4px 12px;border-radius:8px;">${aiRec.text}</span>`
              : '<span style="color:#94a3b8;">No AI evaluation available</span>'
            )}
            ${row('Final Decision', hrRec
              ? `<span style="background:${hrRec.bg};color:${hrRec.color};font-weight:700;font-size:12px;padding:4px 12px;border-radius:8px;">${hrRec.text}</span>`
              : '<span style="color:#94a3b8;">Awaiting expert review</span>'
            )}
            ${proposal.human_review?.reviewer_email ? row('Reviewed By', proposal.human_review.reviewer_email) : ''}
            ${proposal.human_review?.reviewed_at ? row('Review Date', fmt(proposal.human_review.reviewed_at)) : ''}
          </tbody>
        </table>
      </div>

      ${/* AI vs Human comparison — only if both exist */
        proposal.evaluation && !proposal.evaluation.error && proposal.human_review
          ? buildScoreComparison(proposal)
          : ''
      }
    </div>`;
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;font-size:12px;font-weight:600;color:#64748b;width:160px;vertical-align:top;border-bottom:1px solid #f1f5f9;">
        ${label}
      </td>
      <td style="padding:10px 0 10px 16px;font-size:13px;color:#1e293b;border-bottom:1px solid #f1f5f9;vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

function buildScoreComparison(proposal: Proposal): string {
  const ev = proposal.evaluation!;
  const hr = proposal.human_review!;
  const aiScore = ev.overall_score;
  const humanScore = parseFloat(
    ((hr.novelty_score + hr.methodology_score + hr.feasibility_score + hr.clarity_score) / 4).toFixed(1),
  );
  const diff = Math.abs(aiScore - humanScore).toFixed(2);

  const scoreBox = (label: string, score: number, accent: string) => `
    <div style="flex:1;text-align:center;background:${accent}20;border:1px solid ${accent}40;border-radius:12px;padding:14px 10px;">
      <p style="font-size:10px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">${label}</p>
      <p style="font-size:28px;font-weight:800;color:${accent};margin:0;">${score}</p>
      <p style="font-size:10px;color:#94a3b8;margin:4px 0 0;">/&nbsp;10</p>
    </div>`;

  return `
    <div class="card" style="background:linear-gradient(135deg,#f5f3ff 0%,#eff6ff 100%);border:1px solid #e9d5ff;">
      <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 14px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">⚖️</span> AI vs Human Score Comparison
      </h3>
      <div style="display:flex;gap:12px;margin-bottom:14px;">
        ${scoreBox('AI Score', aiScore, '#6366f1')}
        <div style="flex:1;text-align:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 10px;display:flex;flex-direction:column;justify-content:center;">
          <p style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Difference</p>
          <p style="font-size:22px;font-weight:800;color:#475569;margin:0;">±${diff}</p>
          <p style="font-size:10px;color:#94a3b8;margin:4px 0 0;">points</p>
        </div>
        ${scoreBox('Human Score', humanScore, scoreLabel(humanScore))}
      </div>
    </div>`;
}

function buildAIEvaluation(proposal: Proposal): string {
  const ev = proposal.evaluation;
  if (!ev) {
    return `
      <div class="section">
        <h2 class="section-title"><span class="section-icon">🤖</span>AI Evaluation</h2>
        <div class="card empty-state">No AI evaluation data available for this proposal.</div>
      </div>`;
  }
  if (ev.error) {
    return `
      <div class="section">
        <h2 class="section-title"><span class="section-icon">🤖</span>AI Evaluation</h2>
        <div class="card" style="border-left:4px solid #f43f5e;">
          <p style="color:#f43f5e;font-weight:600;font-size:13px;">⚠️ Evaluation failed: ${ev.error}</p>
        </div>
      </div>`;
  }

  const aiRec = recLabel(ev.overall_recommendation);

  return `
    <div class="section">
      <h2 class="section-title"><span class="section-icon">🤖</span>AI Evaluation</h2>

      <div class="card" style="background:#f0f9ff;border:1px solid #bae6fd;margin-bottom:16px;">
        <p style="font-size:11px;font-weight:600;color:#0369a1;margin:0 0 2px;">AI-Assisted Evaluation — Powered by Google Gemini</p>
        <p style="font-size:11px;color:#0284c7;margin:0;">This evaluation is advisory only and should not replace expert human judgment.</p>
      </div>

      ${ev.summary ? `
      <div class="card" style="margin-bottom:16px;">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 10px;">Summary</h3>
        <p style="font-size:13px;color:#374151;line-height:1.7;margin:0;">${ev.summary}</p>
      </div>` : ''}

      <div class="card" style="margin-bottom:16px;">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 16px;">Evaluation Scores</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${scoreRowHtml('Novelty',      ev.novelty_score)}
            ${scoreRowHtml('Methodology',  ev.methodology_score)}
            ${scoreRowHtml('Feasibility',  ev.feasibility_score)}
            ${scoreRowHtml('Clarity',      ev.clarity_score)}
          </tbody>
        </table>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="font-size:11px;color:#64748b;margin:0 0 2px;">Overall Score</p>
            <p style="font-size:28px;font-weight:800;color:#6366f1;margin:0;">${ev.overall_score}<span style="font-size:14px;color:#94a3b8;font-weight:400;">/10</span></p>
            <p style="font-size:12px;color:#94a3b8;margin:2px 0 0;">${ev.overall_percentage}%</p>
          </div>
          <span style="background:${aiRec.bg};color:${aiRec.color};font-size:13px;font-weight:700;padding:8px 16px;border-radius:10px;">
            ${aiRec.text}
          </span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;">
          <h4 style="font-size:12px;font-weight:700;color:#166534;margin:0 0 10px;">✅ Strengths</h4>
          <ul style="margin:0;padding:0;list-style:none;">${listItems(ev.strengths, '#16a34a')}</ul>
        </div>
        <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:16px;">
          <h4 style="font-size:12px;font-weight:700;color:#9f1239;margin:0 0 10px;">❌ Weaknesses</h4>
          <ul style="margin:0;padding:0;list-style:none;">${listItems(ev.weaknesses, '#e11d48')}</ul>
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;">
          <h4 style="font-size:12px;font-weight:700;color:#92400e;margin:0 0 10px;">💡 Suggestions</h4>
          <ul style="margin:0;padding:0;list-style:none;">${listItems(ev.suggestions, '#d97706')}</ul>
        </div>
      </div>
    </div>`;
}

function scoreRowHtml(label: string, score: number): string {
  return `
    <tr>
      <td style="padding:8px 0;font-size:12px;font-weight:600;color:#64748b;width:120px;vertical-align:middle;">${label}</td>
      <td style="padding:8px 0 8px 12px;vertical-align:middle;">${scoreBar(score)}</td>
    </tr>`;
}

function buildHumanEvaluation(proposal: Proposal): string {
  const hr = proposal.human_review;
  if (!hr) {
    return `
      <div class="section">
        <h2 class="section-title"><span class="section-icon">👤</span>Human Evaluation</h2>
        <div class="card empty-state">
          <p style="font-size:14px;font-weight:600;color:#475569;margin:0 0 4px;">No Expert Review Yet</p>
          <p style="font-size:13px;color:#94a3b8;margin:0;">A reviewer has not yet submitted an expert evaluation for this proposal.</p>
        </div>
      </div>`;
  }

  const avgScore = parseFloat(
    ((hr.novelty_score + hr.methodology_score + hr.feasibility_score + hr.clarity_score) / 4).toFixed(1),
  );
  const hrRec = recLabel(hr.final_recommendation);

  return `
    <div class="section">
      <h2 class="section-title"><span class="section-icon">👤</span>Human Evaluation</h2>

      <div class="card" style="background:#f0f9ff;border:1px solid #bae6fd;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <p style="font-size:13px;font-weight:700;color:#0c4a6e;margin:0 0 2px;">Expert Reviewer</p>
            <p style="font-size:13px;color:#0369a1;margin:0;">${hr.reviewer_email}</p>
          </div>
          ${hr.reviewed_at ? `
          <div style="text-align:right;">
            <p style="font-size:11px;color:#64748b;margin:0 0 2px;">Reviewed On</p>
            <p style="font-size:12px;font-weight:600;color:#1e293b;margin:0;">${fmt(hr.reviewed_at)}</p>
          </div>` : ''}
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 16px;">Expert Evaluation Scores</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tbody>
            ${scoreRowHtml('Novelty',      hr.novelty_score)}
            ${scoreRowHtml('Methodology',  hr.methodology_score)}
            ${scoreRowHtml('Feasibility',  hr.feasibility_score)}
            ${scoreRowHtml('Clarity',      hr.clarity_score)}
          </tbody>
        </table>
        <div style="margin-top:14px;padding-top:14px;border-top:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="font-size:11px;color:#64748b;margin:0 0 2px;">Average Expert Score</p>
            <p style="font-size:28px;font-weight:800;margin:0;color:${scoreLabel(avgScore)};">
              ${avgScore}<span style="font-size:14px;color:#94a3b8;font-weight:400;">/10</span>
            </p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:11px;color:#64748b;margin:0 0 6px;">Final Decision</p>
            <span style="background:${hrRec.bg};color:${hrRec.color};font-size:13px;font-weight:700;padding:8px 16px;border-radius:10px;">
              ${hrRec.text}
            </span>
          </div>
        </div>
      </div>

      ${hr.comments ? `
      <div class="card">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 10px;">Reviewer Comments</h3>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">
          <p style="font-size:13px;color:#374151;line-height:1.7;margin:0;white-space:pre-wrap;">${hr.comments}</p>
        </div>
      </div>` : ''}
    </div>`;
}

function buildSimilarity(proposal: Proposal): string {
  const matches = proposal.similarity ?? [];
  const highest = proposal.similarity_score;

  const simColor = (s: number) =>
    s >= 80 ? '#f43f5e' : s >= 50 ? '#f59e0b' : '#10b981';

  return `
    <div class="section">
      <h2 class="section-title"><span class="section-icon">🔍</span>Similarity Detection</h2>

      ${highest !== null ? `
      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div>
            <p style="font-size:11px;color:#64748b;margin:0 0 2px;">Highest Semantic Similarity Score</p>
            <p style="font-size:32px;font-weight:800;color:${simColor(highest!)};margin:0;">${highest}%</p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:11px;color:#64748b;margin:0 0 2px;">Similar Proposals Found</p>
            <p style="font-size:24px;font-weight:700;color:#1e293b;margin:0;">${matches.length}</p>
          </div>
        </div>
        <div style="height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
          <div style="width:${highest}%;height:100%;background:${simColor(highest!)};border-radius:999px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px;">
          <p style="font-size:10px;color:#94a3b8;margin:0;">0% — Unique</p>
          <p style="font-size:10px;color:#94a3b8;margin:0;">
            ${highest! >= 80 ? '⚠️ High similarity — manual review recommended' :
              highest! >= 50 ? 'Moderate similarity — review suggested' :
              '✅ Low similarity — likely original'}
          </p>
          <p style="font-size:10px;color:#94a3b8;margin:0;">100% — Duplicate</p>
        </div>
      </div>` : `
      <div class="card empty-state" style="margin-bottom:16px;">Similarity check not yet performed.</div>`}

      ${matches.length > 0 ? `
      <div class="card">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 14px;">Similar Proposals</h3>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="text-align:left;padding:10px 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;">#</th>
              <th style="text-align:left;padding:10px 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;">Title</th>
              <th style="text-align:left;padding:10px 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;">Proposal ID</th>
              <th style="text-align:right;padding:10px 12px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #e2e8f0;">Similarity</th>
            </tr>
          </thead>
          <tbody>
            ${matches
              .slice()
              .sort((a, b) => b.similarity_score - a.similarity_score)
              .map(
                (m, i) => `
                <tr style="border-bottom:1px solid #f1f5f9;${i % 2 === 1 ? 'background:#fafafa;' : ''}">
                  <td style="padding:10px 12px;font-size:12px;color:#94a3b8;font-weight:600;">${i + 1}</td>
                  <td style="padding:10px 12px;font-size:13px;color:#1e293b;font-weight:500;">${m.title}</td>
                  <td style="padding:10px 12px;font-size:11px;color:#64748b;font-family:monospace;">${m._id}</td>
                  <td style="padding:10px 12px;text-align:right;">
                    <span style="background:${simColor(m.similarity_score)}20;color:${simColor(m.similarity_score)};font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;">
                      ${m.similarity_score.toFixed(1)}%
                    </span>
                  </td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>` : `
      <div class="card empty-state">No similar proposals detected in the database.</div>`}
    </div>`;
}

function buildFormatCheck(proposal: Proposal): string {
  const fc = proposal.format_check;
  if (!fc) return '';

  const scoreColor = fc.score >= 80 ? '#10b981' : fc.score >= 50 ? '#f59e0b' : '#f43f5e';
  const scoreBg    = fc.score >= 80 ? '#ecfdf5' : fc.score >= 50 ? '#fffbeb' : '#fff1f2';
  const barColor   = scoreColor;

  return `
    <div class="section">
      <h2 class="section-title"><span class="section-icon">🛡️</span>IEEE Standard Format Check</h2>

      <div class="card" style="background:${scoreBg};border:1px solid ${scoreColor}30;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <p style="font-size:14px;font-weight:700;color:#1e293b;margin:0 0 4px;">
              ${fc.is_valid ? '✅ IEEE Format Valid — All required sections & citations present' : `⚠️ IEEE Format Issues — ${fc.missing_count} section${fc.missing_count > 1 ? 's' : ''} missing`}
            </p>
            <p style="font-size:12px;color:#64748b;margin:0;">
              ${fc.found_count} of ${fc.total_sections} IEEE standard sections detected
            </p>
          </div>
          <div style="text-align:center;background:white;border:1px solid ${scoreColor}40;border-radius:12px;padding:10px 18px;">
            <p style="font-size:26px;font-weight:800;color:${scoreColor};margin:0;">${fc.score}%</p>
            <p style="font-size:10px;color:#94a3b8;margin:3px 0 0;">Format Score</p>
          </div>
        </div>
        <div style="margin-top:12px;height:8px;background:rgba(0,0,0,0.08);border-radius:999px;overflow:hidden;">
          <div style="width:${fc.score}%;height:100%;background:${barColor};border-radius:999px;"></div>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size:13px;font-weight:700;color:#1e293b;margin:0 0 14px;">Section Checklist</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${fc.sections.map(s => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid ${s.found ? '#bbf7d0' : '#fecdd3'};background:${s.found ? '#f0fdf4' : '#fff1f2'};">
              <span style="font-size:14px;">${s.found ? '✅' : '❌'}</span>
              <span style="font-size:12px;font-weight:600;color:${s.found ? '#166534' : '#9f1239'};">${s.label}</span>
              ${!s.found ? '<span style="margin-left:auto;font-size:10px;font-weight:700;color:#f43f5e;text-transform:uppercase;">Missing</span>' : ''}
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function buildFooter(): string {
  return `
    <div style="margin-top:48px;padding:24px 0 0;border-top:2px solid #e2e8f0;text-align:center;">
      <p style="font-size:11px;font-weight:600;color:#64748b;margin:0 0 4px;">AI Research & Development Evaluation System</p>
      <p style="font-size:11px;color:#94a3b8;margin:0 0 8px;">Report generated on ${fmtDateTime()}</p>
      <p style="font-size:10px;color:#cbd5e1;margin:0;">
        🔒 This report is confidential and intended solely for authorized personnel. Do not distribute without permission.
      </p>
    </div>`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateProposalReport(proposal: Proposal): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Evaluation Report — ${proposal.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
      background: #ffffff;
      color: #1e293b;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    .body-content {
      padding: 32px 48px;
    }

    .section {
      margin-bottom: 36px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 10px;
      border-bottom: 2px solid #f1f5f9;
    }

    .section-icon {
      font-size: 18px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 12px;
    }

    .empty-state {
      text-align: center;
      padding: 32px;
      color: #94a3b8;
      font-size: 13px;
      background: #f8fafc;
    }

    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
      .section { page-break-inside: avoid; }
      .card { page-break-inside: avoid; }
      @page {
        margin: 16mm 14mm;
        size: A4;
      }
    }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <!-- Download Button (hidden when printing) -->
    <div class="no-print" style="position:sticky;top:0;z-index:100;background:#ffffff;border-bottom:1px solid #e2e8f0;padding:12px 48px;display:flex;align-items:center;justify-content:space-between;">
      <p style="font-size:12px;color:#64748b;font-weight:500;">
        📄 Evaluation Report Preview — <strong style="color:#1e293b;">${proposal.title}</strong>
      </p>
      <button onclick="window.print()"
        style="background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;border:none;padding:10px 22px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(99,102,241,0.4);">
        ⬇️ Download as PDF
      </button>
    </div>

    <!-- Header -->
    ${buildHeader(proposal)}

    <!-- Body -->
    <div class="body-content">
      ${buildOverview(proposal)}
      ${buildAIEvaluation(proposal)}
      ${buildHumanEvaluation(proposal)}
      ${buildSimilarity(proposal)}
      ${buildFormatCheck(proposal)}
      ${buildFooter()}
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=1000,height=800');
  if (!win) {
    alert('Pop-up was blocked. Please allow pop-ups for this site and try again.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UploadDropzone from '../../components/proposals/UploadDropzone';
import ProgressPipeline from '../../components/proposals/ProgressPipeline';
import FormatCheckCard from '../../components/proposals/FormatCheckCard';
import { proposalsApi } from '../../api/proposals';
import type { PipelineStage, Proposal, FormatCheck } from '../../types';
import {
  FileText, CheckCircle, Upload, LayoutDashboard, User, ChevronRight,
  ShieldAlert, ShieldCheck, AlertTriangle, XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const navItems = [
  { label: 'Dashboard',       href: '/researcher',          icon: LayoutDashboard },
  { label: 'Upload Proposal', href: '/researcher/upload',   icon: Upload },
  { label: 'My Proposals',    href: '/researcher/proposals', icon: FileText },
  { label: 'Profile',         href: '/researcher/profile',  icon: User },
];

const DOMAINS = [
  'Computer Science', 'Artificial Intelligence', 'Data Science', 'Cybersecurity',
  'Biomedical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Electrical Engineering', 'Environmental Science', 'Business & Management',
  'Mathematics', 'Physics', 'Chemistry', 'Other',
];

const INITIAL_STAGES: PipelineStage[] = [
  { id: 'upload',       label: 'PDF Upload',           status: 'waiting' },
  { id: 'extract',      label: 'Text Extraction',       status: 'waiting' },
  { id: 'format',       label: 'Format Validation',     status: 'waiting' },
  { id: 'preprocess',   label: 'Text Preprocessing',    status: 'waiting' },
  { id: 'embedding',    label: 'Embedding Generation',  status: 'waiting' },
  { id: 'similarity',   label: 'Similarity Analysis',   status: 'waiting' },
  { id: 'gemini',       label: 'AI Evaluation',         status: 'waiting' },
  { id: 'store',        label: 'Storing Results',        status: 'waiting' },
];

type AppState = 'form' | 'processing' | 'format_warning' | 'success' | 'error';

export default function UploadProposal() {
  const navigate = useNavigate();

  const [title, setTitle]     = useState('');
  const [domain, setDomain]   = useState('');
  const [file, setFile]       = useState<File | null>(null);
  const [stages, setStages]   = useState<PipelineStage[]>(INITIAL_STAGES);
  const [appState, setAppState] = useState<AppState>('form');
  const [result, setResult]   = useState<Proposal | null>(null);
  const [errMsg, setErrMsg]   = useState('');

  // Format-check state — populated after upload when format is invalid
  const [formatWarning, setFormatWarning] = useState<FormatCheck | null>(null);

  const setStage = useCallback((id: string, status: PipelineStage['status']) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  const markAllComplete = () =>
    setStages((prev) => prev.map((s) => ({ ...s, status: 'complete' })));

  /** Core upload + pipeline animation */
  const runUpload = async () => {
    if (!file)   { toast.error('Please select a PDF file.'); return; }
    if (!domain) { toast.error('Please select a research domain.'); return; }

    setAppState('processing');
    setStages(INITIAL_STAGES);
    setFormatWarning(null);

    try {
      setStage('upload', 'active');
      await delay(400);
      setStage('upload', 'complete');

      setStage('extract', 'active');
      await delay(500);
      setStage('extract', 'complete');

      setStage('format', 'active');
      // Fire the real API call now — format check is inside
      const res = await proposalsApi.upload(title, domain, file);

      const fc = res.proposal.format_check;

      // Mark format stage based on result
      if (fc) {
        setStage('format', fc.is_valid ? 'complete' : 'complete');
      } else {
        setStage('format', 'complete');
      }

      setStage('preprocess', 'active');
      await delay(300);
      setStage('preprocess', 'complete');

      setStage('embedding', 'active');
      setStage('similarity', 'active');
      await delay(400);
      setStage('embedding', 'complete');
      setStage('similarity', 'complete');

      setStage('gemini', 'active');
      await delay(300);
      setStage('gemini', 'complete');

      setStage('store', 'active');
      await delay(300);
      setStage('store', 'complete');

      markAllComplete();
      setResult(res.proposal);

      // If format check failed show warning state, otherwise go straight to success
      if (fc && !fc.is_valid) {
        setFormatWarning(fc);
        setAppState('format_warning');
        toast('Format issues detected — see details below.', { icon: '⚠️' });
      } else {
        setAppState('success');
        toast.success('Proposal evaluated successfully!');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Upload failed. Please ensure the backend is running and you are logged in.';
      setErrMsg(msg);
      setStages((prev) =>
        prev.map((s) => (s.status === 'active' ? { ...s, status: 'error' } : s))
      );
      setAppState('error');
      toast.error(msg);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runUpload();
  };

  const handleReset = () => {
    setAppState('form');
    setFile(null);
    setTitle('');
    setDomain('');
    setStages(INITIAL_STAGES);
    setFormatWarning(null);
  };

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="Upload Proposal">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Upload Research Proposal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit a PDF for format validation, AI-powered evaluation, and similarity analysis.
          </p>
        </div>

        {/* ── Success state ── */}
        {appState === 'success' && result ? (
          <SuccessState
            proposal={result}
            onNew={handleReset}
            onView={() => navigate(`/researcher/proposals/${result._id}`)}
          />

        /* ── Format Warning state ── */
        ) : appState === 'format_warning' && result && formatWarning ? (
          <FormatWarningState
            proposal={result}
            formatCheck={formatWarning}
            onViewAnyway={() => navigate(`/researcher/proposals/${result._id}`)}
            onReUpload={handleReset}
          />

        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                <div>
                  <label className="label">Proposal Title *</label>
                  <input
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Learning for Medical Image Analysis"
                    required disabled={appState === 'processing'}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Research Domain *</label>
                  <select
                    value={domain} onChange={(e) => setDomain(e.target.value)}
                    required disabled={appState === 'processing'}
                    className="input-field"
                  >
                    <option value="">Select a domain…</option>
                    {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Proposal PDF *</label>
                  <UploadDropzone
                    onFileSelect={setFile}
                    selectedFile={file}
                    onClear={() => setFile(null)}
                    disabled={appState === 'processing'}
                  />
                </div>

                {/* Format guide hint */}
                {appState === 'form' && (
                  <div className="flex items-start gap-2.5 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      <strong>Format Check:</strong> Your PDF will be automatically validated for required
                      sections: Abstract, Introduction, Problem Statement, Objectives, Literature Review,
                      Methodology, Expected Outcomes, and References.
                    </p>
                  </div>
                )}

                {appState === 'error' && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600">
                    {errMsg}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={appState === 'processing' || !title || !domain || !file}
                    className="btn-primary flex-1 py-3 justify-center"
                  >
                    {appState === 'processing'
                      ? <><LoadingSpinner size="sm" /> Processing…</>
                      : <><Upload className="w-4 h-4" /> Submit Proposal</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Pipeline sidebar */}
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Processing Pipeline</h3>
                <ProgressPipeline stages={stages} />
              </div>
              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <p className="text-xs font-bold text-primary-700 mb-1">ℹ️ What happens next?</p>
                <p className="text-xs text-primary-600 leading-relaxed">
                  After upload, the system validates your document structure, extracts text,
                  generates AI scores via Gemini, computes semantic embeddings, and finds
                  similar proposals. This may take 10–30 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ─── Format Warning State ─────────────────────────────────────────────────────

function FormatWarningState({
  proposal,
  formatCheck,
  onViewAnyway,
  onReUpload,
}: {
  proposal: Proposal;
  formatCheck: FormatCheck;
  onViewAnyway: () => void;
  onReUpload: () => void;
}) {
  const missingLabels = formatCheck.sections
    .filter((s) => !s.found)
    .map((s) => s.label);

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Warning banner */}
      <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-amber-900 mb-1">
            Format Issues Detected
          </h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            Your proposal <strong>"{proposal.title}"</strong> was submitted and evaluated,
            but it's missing{' '}
            <strong>{formatCheck.missing_count} required section{formatCheck.missing_count > 1 ? 's' : ''}</strong>.
            You can still view your evaluation, or re-upload a corrected version.
          </p>
        </div>
      </div>

      {/* Missing sections quick list */}
      <div className="card p-5">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Missing Sections ({missingLabels.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {missingLabels.map((label) => (
            <div key={label} className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-rose-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Full format check card */}
      <FormatCheckCard formatCheck={formatCheck} />

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onViewAnyway}
          className="btn-primary flex-1 py-3 justify-center"
        >
          <CheckCircle className="w-4 h-4" />
          View Evaluation Anyway
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={onReUpload}
          className="btn-secondary flex-1 py-3 justify-center"
        >
          <Upload className="w-4 h-4" />
          Upload Corrected Version
        </button>
      </div>
    </div>
  );
}

// ─── Success State ────────────────────────────────────────────────────────────

function SuccessState({
  proposal,
  onNew,
  onView,
}: {
  proposal: Proposal;
  onNew: () => void;
  onView: () => void;
}) {
  return (
    <div className="card p-8 text-center max-w-lg mx-auto animate-slide-up">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Evaluation Complete!</h2>
      <p className="text-sm text-slate-500 mb-2">Your proposal has been successfully processed.</p>

      {/* Format check compact badge */}
      {proposal.format_check && (
        <div className="flex justify-center mb-4">
          <FormatCheckCard formatCheck={proposal.format_check} compact />
        </div>
      )}

      <p className="text-2xl font-bold text-primary-600 mb-4">
        {proposal.evaluation?.overall_score ?? '—'}
        <span className="text-base text-slate-400 font-normal"> / 10</span>
      </p>
      <p className="text-sm text-slate-600 mb-6 italic">
        "{proposal.evaluation?.overall_recommendation}"
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onView} className="btn-primary">
          View Full Evaluation <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={onNew} className="btn-secondary">Upload Another</button>
      </div>
    </div>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

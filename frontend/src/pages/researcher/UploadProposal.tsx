import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import UploadDropzone from '../../components/proposals/UploadDropzone';
import ProgressPipeline from '../../components/proposals/ProgressPipeline';
import { proposalsApi } from '../../api/proposals';
import type { PipelineStage, Proposal } from '../../types';
import { FileText, CheckCircle, Upload, LayoutDashboard, User, ChevronRight } from 'lucide-react';
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
  { id: 'upload',     label: 'PDF Upload',           status: 'waiting' },
  { id: 'extract',   label: 'Text Extraction',       status: 'waiting' },
  { id: 'preprocess',label: 'Text Preprocessing',    status: 'waiting' },
  { id: 'embedding', label: 'Embedding Generation',  status: 'waiting' },
  { id: 'similarity',label: 'Similarity Analysis',   status: 'waiting' },
  { id: 'gemini',    label: 'AI Evaluation',         status: 'waiting' },
  { id: 'store',     label: 'Storing Results',       status: 'waiting' },
];

type AppState = 'form' | 'processing' | 'success' | 'error';

export default function UploadProposal() {
  const navigate = useNavigate();

  const [title, setTitle]   = useState('');
  const [domain, setDomain] = useState('');
  const [file, setFile]     = useState<File | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [appState, setAppState] = useState<AppState>('form');
  const [result, setResult]    = useState<Proposal | null>(null);
  const [errMsg, setErrMsg]    = useState('');

  const setStage = useCallback((id: string, status: PipelineStage['status']) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }, []);

  const markAllComplete = () =>
    setStages((prev) => prev.map((s) => ({ ...s, status: 'complete' })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a PDF file.'); return; }
    if (!domain) { toast.error('Please select a research domain.'); return; }

    setAppState('processing');
    setStages(INITIAL_STAGES);

    try {
      // Simulate stage progression while the real request processes
      setStage('upload', 'active');
      await delay(400);
      setStage('upload', 'complete');
      setStage('extract', 'active');
      await delay(500);
      setStage('extract', 'complete');
      setStage('preprocess', 'active');
      await delay(400);
      setStage('preprocess', 'complete');
      setStage('embedding', 'active');
      setStage('similarity', 'active');

      // Fire actual API call
      const res = await proposalsApi.upload(title, domain, file);

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
      setAppState('success');
      toast.success('Proposal evaluated successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || 'Upload failed. Please ensure the backend is running and you are logged in.';
      setErrMsg(msg);
      setStages((prev) => prev.map((s) => s.status === 'active' ? { ...s, status: 'error' } : s));
      setAppState('error');
      toast.error(msg);
    }
  };

  return (
    <DashboardLayout items={navItems} role="researcher" pageTitle="Upload Proposal">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Upload Research Proposal</h1>
          <p className="text-sm text-slate-500 mt-1">Submit a PDF for AI-powered evaluation and similarity analysis.</p>
        </div>

        {appState === 'success' && result ? (
          <SuccessState proposal={result} onNew={() => { setAppState('form'); setFile(null); setTitle(''); setDomain(''); setStages(INITIAL_STAGES); }} onView={() => navigate(`/researcher/proposals/${result._id}`)} />
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
            <div>
              <div className="card p-6">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Processing Pipeline</h3>
                <ProgressPipeline stages={stages} />
              </div>
              <div className="mt-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                <p className="text-xs font-bold text-primary-700 mb-1">ℹ️ What happens next?</p>
                <p className="text-xs text-primary-600 leading-relaxed">
                  After upload, the system extracts text, generates AI scores via Gemini,
                  computes semantic embeddings, and finds similar proposals.
                  This may take 10–30 seconds.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function SuccessState({ proposal, onNew, onView }: { proposal: Proposal; onNew: () => void; onView: () => void }) {
  return (
    <div className="card p-8 text-center max-w-lg mx-auto animate-slide-up">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-emerald-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Evaluation Complete!</h2>
      <p className="text-sm text-slate-500 mb-2">Your proposal has been successfully processed.</p>
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

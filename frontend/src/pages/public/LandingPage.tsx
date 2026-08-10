import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import {
  Brain, Upload, Search, Star, ShieldCheck, Users, BarChart2,
  ArrowRight, CheckCircle, Cpu, Database, Zap, BookOpen, FileText,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center">
        {/* Ambient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-700/30 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-violet-700/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary-900/40 rounded-full blur-[80px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-semibold mb-6">
                <Zap className="w-3 h-3" />
                Powered by Google Gemini & Sentence-BERT
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
                Smarter Research
                <span className="block text-gradient mt-1">Proposal Evaluation</span>
                <span className="block text-white">with AI</span>
              </h1>
              <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
                Upload, analyze, compare, and evaluate research proposals with intelligent AI-assisted insights
                while keeping reviewers in control.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="btn-primary text-base px-6 py-3">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="glass px-6 py-3 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2">
                  Sign In
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-10">
                <Pill label="Human-in-the-Loop" />
                <Pill label="PDF Analysis" />
                <Pill label="AI Evaluation" />
              </div>
            </div>

            {/* Right — abstract graphic */}
            <div className="hidden lg:flex justify-center animate-float">
              <div className="relative w-96 h-96">
                {/* Central orb */}
                <div className="absolute inset-0 m-auto w-48 h-48 bg-primary-600/30 rounded-full border border-primary-500/40 flex items-center justify-center">
                  <Brain className="w-20 h-20 text-primary-400 animate-pulse-slow" />
                </div>
                {/* Orbiting pills */}
                {[
                  { label: 'PDF Upload', icon: Upload, deg: 0 },
                  { label: 'AI Scoring', icon: Star, deg: 72 },
                  { label: 'Similarity', icon: Search, deg: 144 },
                  { label: 'Analytics', icon: BarChart2, deg: 216 },
                  { label: 'Human Review', icon: Users, deg: 288 },
                ].map(({ label, icon: Icon, deg }) => {
                  const r = 160;
                  const rad = (deg - 90) * (Math.PI / 180);
                  const x = 192 + r * Math.cos(rad);
                  const y = 192 + r * Math.sin(rad);
                  return (
                    <div
                      key={label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 glass px-3 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap"
                      style={{ left: x, top: y }}
                    >
                      <Icon className="w-3.5 h-3.5 text-primary-300" />
                      <span className="text-xs font-medium text-white/80">{label}</span>
                    </div>
                  );
                })}
                {/* Orbit ring */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 384 384">
                  <circle cx="192" cy="192" r="160" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-indigo mb-3">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
              Everything you need to evaluate proposals
            </h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              A complete AI-powered research evaluation platform with structured scoring, semantic similarity, and human-in-the-loop controls.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-indigo mb-3">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">How It Works</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              From PDF upload to structured AI evaluation in seconds.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{s.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology ───────────────────────────────────────────────────────── */}
      <section id="technology" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-indigo mb-3">Technology Stack</span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">Built on modern AI infrastructure</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tech.map((t) => (
              <div key={t.name} className="card p-4 text-center hover:border-primary-200 hover:shadow-glow transition-all duration-200 group">
                <div className="text-2xl mb-2">{t.emoji}</div>
                <p className="text-xs font-bold text-slate-700">{t.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Human in the Loop ────────────────────────────────────────────────── */}
      <section className="py-24 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary-500/40">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            AI Assists. Humans Decide.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            AI-generated evaluations are advisory and should not replace expert human judgment.
            Our platform ensures final decisions remain in the hands of qualified reviewers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {['AI-generated scores', 'Expert human review', 'Final decision by reviewer'].map((item, i) => (
              <div key={item} className="glass px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-xs text-white/80 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ready to streamline proposal evaluation?
          </h2>
          <p className="text-slate-500 mb-8">
            Start evaluating research proposals with AI-powered insights today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary text-base px-8 py-3.5">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-navy-900 border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">AI-RD Evaluation System</span>
          </div>
          <p className="text-xs text-white/30">
            Final Year Project · Built with FastAPI, React, Gemini AI, Sentence-BERT
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="text-xs text-white/40 hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="text-xs text-white/40 hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
      <span className="text-xs text-white/50 font-medium">{label}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: typeof Brain; title: string; desc: string; color: string }) {
  return (
    <div className="card-hover p-6 group">
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

const features = [
  { icon: Upload, title: 'PDF Upload & Extraction', desc: 'Upload research proposals as PDFs. Text is automatically extracted and preprocessed for AI analysis.', color: 'bg-primary-50 text-primary-600' },
  { icon: Brain, title: 'Gemini AI Evaluation', desc: 'Google Gemini evaluates novelty, methodology, feasibility, and clarity with structured scoring.', color: 'bg-violet-50 text-violet-600' },
  { icon: Search, title: 'Semantic Similarity', desc: 'Sentence-BERT embeddings detect semantically similar proposals for human review.', color: 'bg-sky-50 text-sky-600' },
  { icon: Star, title: 'Structured Scoring', desc: 'Consistent numerical scores with strengths, weaknesses, and actionable suggestions.', color: 'bg-amber-50 text-amber-600' },
  { icon: Users, title: 'Role-Based Access', desc: 'Separate portals for researchers, reviewers, and administrators with appropriate controls.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: ShieldCheck, title: 'Human-in-the-Loop', desc: 'AI assists — reviewers decide. Final evaluation authority rests with qualified human experts.', color: 'bg-rose-50 text-rose-600' },
];

const steps = [
  { icon: Upload, title: 'Upload Proposal', desc: 'Researcher uploads a PDF research proposal to the platform.' },
  { icon: Cpu, title: 'AI Processing', desc: 'Gemini evaluates quality; Sentence-BERT generates semantic embeddings.' },
  { icon: Database, title: 'Similarity Check', desc: 'Cosine similarity identifies semantically related existing proposals.' },
  { icon: BookOpen, title: 'Reviewer Decision', desc: 'Human reviewer examines AI insights and makes the final evaluation decision.' },
];

const tech = [
  { emoji: '⚡', name: 'FastAPI', role: 'Backend' },
  { emoji: '🍃', name: 'MongoDB', role: 'Database' },
  { emoji: '🤖', name: 'Gemini AI', role: 'Evaluation' },
  { emoji: '🧠', name: 'Sentence-BERT', role: 'Embeddings' },
  { emoji: '⚛️', name: 'React', role: 'Frontend' },
  { emoji: '🔐', name: 'JWT Auth', role: 'Security' },
];

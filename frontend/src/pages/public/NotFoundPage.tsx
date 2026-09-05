import { Link } from 'react-router-dom';
import { Brain, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center px-4 text-center">
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-700/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-700/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto animate-slide-up">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="w-14 h-14 bg-primary-600/30 rounded-2xl flex items-center justify-center border border-primary-500/40">
            <Brain className="w-7 h-7 text-primary-400" />
          </div>
        </div>

        {/* 404 number */}
        <p className="text-[120px] font-black text-white/10 leading-none select-none mb-0">
          404
        </p>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-3">
          Page Not Found
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary text-base px-6 py-3"
          >
            <Home className="w-4 h-4" />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="glass px-6 py-3 rounded-xl text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Footer note */}
        <p className="text-white/25 text-xs mt-12">
          AI-RD Evaluation System · Final Year Project
        </p>
      </div>
    </div>
  );
}

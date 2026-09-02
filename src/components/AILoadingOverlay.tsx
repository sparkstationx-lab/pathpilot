import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export interface AILoadingOverlayProps {
  isOpen: boolean;
  title?: string;
  messages?: string[];
  subtext?: string;
  minDurationMs?: number;
  onComplete?: () => void;
}

export const DEFAULT_AI_MESSAGES = [
  'Analyzing your profile...',
  'Finding relevant opportunities...',
  'Matching your skills...',
  'Checking eligibility...',
  'Preparing your recommendations...',
];

export const AILoadingOverlay: React.FC<AILoadingOverlayProps> = ({
  isOpen,
  title = 'PathPilot AI Career Agent',
  messages = DEFAULT_AI_MESSAGES,
  subtext,
  minDurationMs = 2400,
  onComplete,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isOpen) {
      setCurrentMessageIndex(0);
      setProgress(15);
      return;
    }

    const startTime = Date.now();
    const intervalTime = Math.max(Math.floor(minDurationMs / messages.length), 450);

    const msgTimer = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, intervalTime);

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / minDurationMs) * 98), 98);
      setProgress((p) => Math.max(p, pct));
    }, 40);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, [isOpen, messages, minDurationMs]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[#090d16]/80 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none cursor-wait"
      role="dialog"
      aria-modal="true"
      aria-label="AI Processing"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div 
        className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl shadow-black/90 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Gradient Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 animate-pulse" />

        {/* Ambient Glow */}
        <div className="absolute -top-14 -left-14 w-28 h-28 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-14 -right-14 w-28 h-28 bg-teal-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Animated AI Core Icon / Spinner */}
        <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
          {/* Outer rotating glowing ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/25 border-t-emerald-400 animate-spin" />
          <div className="absolute -inset-1 rounded-2xl border border-teal-500/20 animate-pulse" />
          
          {/* Inner pulse container */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
            <Sparkles className="w-6 h-6 animate-pulse text-emerald-300" />
          </div>

          {/* Orbiting particle */}
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/90 animate-ping" />
        </div>

        {/* Contextual Status Heading */}
        <div className="space-y-1.5 mb-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-[11px] font-semibold">
            <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{title}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-100 min-h-[30px] transition-all duration-300 flex items-center justify-center gap-2">
            <span>{messages[currentMessageIndex] || messages[0]}</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            {subtext || 'Evaluating eligibility, verified skills, and match alignment in real-time.'}
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="w-full bg-slate-950 border border-slate-800/80 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-150 ease-out shadow-sm shadow-emerald-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-0.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Processing</span>
            </span>
            <span className="text-emerald-400 font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px]">
          {messages.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentMessageIndex
                  ? 'w-6 bg-emerald-400'
                  : idx < currentMessageIndex
                  ? 'w-2 bg-emerald-500/60'
                  : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


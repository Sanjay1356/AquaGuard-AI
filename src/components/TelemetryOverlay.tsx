import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Activity, Zap } from 'lucide-react';

interface TelemetryOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
}

const STEPS = [
  { label: 'CAPTURING WATER PROFILE', detail: 'Reading 20 analog sensor concentrations' },
  { label: 'BUILDING FEATURE VECTOR', detail: 'Quantizing 20-parameter IEEE-754 array' },
  { label: 'EVALUATING 300 BOOSTED TREES', detail: 'Traversing 20,748 frozen decision nodes' },
  { label: 'COMPUTING SAFETY SCORE', detail: 'Accumulating 32-bit Q8.24 margin register' },
  { label: 'FINALIZING DECISION', detail: 'Evaluating classification threshold (0.1200)' },
];

export const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setCycles(0);
      return;
    }

    // Step progression every ~300ms (total ~1.5 seconds)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(onComplete, 250);
          return prev;
        }
      });
    }, 300);

    // Fast cycle counter tick
    const cycleInterval = setInterval(() => {
      setCycles((prev) => prev + Math.floor(Math.random() * 85) + 35);
    }, 30);

    return () => {
      clearInterval(stepInterval);
      clearInterval(cycleInterval);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPct = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas-950/90 backdrop-blur-md px-4">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-canvas-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-slate-100 font-mono relative overflow-hidden">
        
        {/* Top Scanline Animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-16 w-full animate-scanline pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <div>
              <div className="text-xs font-bold text-white tracking-wider">AQUAGUARD INFERENCE ENGINE</div>
              <div className="text-[10px] text-cyan-400">HARDWARE ACCELERATED EVALUATION</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">ASIC CYCLES</div>
            <div className="text-sm font-bold text-cyan-300">{cycles.toLocaleString()}</div>
          </div>
        </div>

        {/* Telemetry Step List */}
        <div className="space-y-3.5 mb-6">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div
                key={step.label}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                    : isCompleted
                    ? 'bg-white/[0.02] border-emerald-500/30 text-emerald-300'
                    : 'bg-white/[0.01] border-white/[0.05] text-slate-400 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-white/20 text-[9px] flex items-center justify-center text-slate-400">
                        {idx + 1}
                      </span>
                    )}
                    <span className="text-xs font-semibold tracking-wide">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {isCompleted ? 'DONE' : isCurrent ? 'RUNNING' : 'QUEUED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 pl-6">
                  {step.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>PIPELINE PROGRESS</span>
            <span className="text-cyan-400">{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full h-1.5 bg-canvas-950 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

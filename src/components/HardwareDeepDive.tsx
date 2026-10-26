import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Binary, Database, ArrowRight, Activity, Zap } from 'lucide-react';

export const HardwareDeepDive: React.FC = () => {
  const [pulseActive, setPulseActive] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const triggerSimulation = () => {
    if (pulseActive) return;
    setPulseActive(true);
    let step = 0;
    setActiveStep(0);
    const interval = setInterval(() => {
      step++;
      if (step <= 7) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPulseActive(false);
          setActiveStep(null);
        }, 800);
      }
    }, 400);
  };

  const steps = [
    { title: '20 Inputs', spec: '20 × 20-bit signed' },
    { title: 'Feature Registers', spec: 'feat_q [399:0]' },
    { title: 'Tree / Node Memory', spec: 'ROM: 20,748 × 43b' },
    { title: 'Decision Comparator', spec: 'feat[i] < threshold' },
    { title: 'Node Traversal', spec: 'next_addr lookup' },
    { title: 'Leaf Value', spec: 'Q8.24 leaf extraction' },
    { title: 'Margin Accumulator', spec: '32-bit signed acc' },
    { title: 'Classification', spec: 'acc >= THR_SUM' },
  ];

  return (
    <section id="hardware" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>CUSTOM SILICON ACCELERATOR</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            A MACHINE-LEARNING MODEL, BUILT AS HARDWARE
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-mono mt-3 leading-relaxed">
            Direct silicon compilation of XGBoost decision forest eliminating runtime OS abstraction, CPU caches, and floating-point power overhead.
          </p>
        </div>

        {/* Interactive Architecture Signal Flow Diagram */}
        <div className="p-8 sm:p-12 rounded-3xl bg-canvas-900/80 border border-white/[0.09] shadow-2xl backdrop-blur-xl mb-12">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-white/[0.08] gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                PIPELINE DATAPATH & SIGNAL FLOW
              </div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                aquaguard_top.sv Microarchitecture
              </div>
            </div>

            <button
              onClick={triggerSimulation}
              disabled={pulseActive}
              className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>{pulseActive ? 'PROPAGATING SIGNAL...' : 'SIMULATE CLOCK CYCLE'}</span>
            </button>
          </div>

          {/* Architecture Stages Grid (Horizontal flow on desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative">
            {steps.map((stg, idx) => {
              const isCurrent = activeStep === idx;
              const isPast = activeStep !== null && activeStep > idx;

              return (
                <div
                  key={stg.title}
                  className={`relative p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[140px] font-mono ${
                    isCurrent
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-400/30 scale-105 z-20'
                      : isPast
                      ? 'bg-canvas-950 border-emerald-500/40 text-emerald-300'
                      : 'bg-canvas-950/80 border-white/[0.07] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mb-1.5">
                      <span>[{String(idx + 1).padStart(2, '0')}]</span>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                    </div>
                    <div className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : ''}`}>
                      {stg.title}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-400">
                    {stg.spec}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sequential Arrow Guidance */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400 bg-canvas-950/60 p-4 rounded-xl border border-white/[0.05]">
            <span>20 Inputs</span>
            <span className="text-cyan-400">→</span>
            <span>Feature Registers</span>
            <span className="text-cyan-400">→</span>
            <span>Tree / Node Memory</span>
            <span className="text-cyan-400">→</span>
            <span>Decision Comparator</span>
            <span className="text-cyan-400">→</span>
            <span>Node Traversal</span>
            <span className="text-cyan-400">→</span>
            <span>Leaf Value</span>
            <span className="text-cyan-400">→</span>
            <span>Margin Accumulator</span>
            <span className="text-cyan-400">→</span>
            <span className="text-emerald-400 font-bold">Safe / Unsafe (THR: 952341)</span>
          </div>

        </div>

        {/* Verified Hardware Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="p-6 rounded-2xl bg-canvas-900/60 border border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
              <Database className="w-4 h-4" />
              <span>ON-CHIP NODE ROM</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              20,748 Words
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Word width: 43 bits (is_leaf + feature_id + threshold/leaf + child_addr)
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-900/60 border border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
              <Binary className="w-4 h-4" />
              <span>MARGIN ACCUMULATOR</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              32-Bit Q8.24 Signed
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Fixed-point sum accumulator folding logit(0.12) - base_margin
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-900/60 border border-white/[0.08]">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
              <Activity className="w-4 h-4" />
              <span>DETERMINISTIC LATENCY</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              ~1,900 Clock Cycles
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Full evaluation of all 300 decision trees in single-node traversal
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { PredictResponse } from '../types';
import { ShieldCheck, AlertTriangle, Cpu, Gauge, Info, ChevronRight, Binary } from 'lucide-react';

interface ResultGaugeProps {
  result: PredictResponse;
  onExploreSilicon: () => void;
}

export const ResultGauge: React.FC<ResultGaugeProps> = ({ result, onExploreSilicon }) => {
  const isSafe = result.prediction === 'SAFE';
  const pct = Math.min(Math.max(result.p_safe * 100, 0), 100);
  const thresholdPct = result.threshold * 100; // 12.0%

  // SVG Gauge calculations
  // Arc from 140 deg to 400 deg (260 deg total sweep)
  const radius = 140;
  const strokeWidth = 14;
  const center = 170;
  const circumference = 2 * Math.PI * radius;
  const arcSweep = 260; // degrees
  const arcLength = (arcSweep / 360) * circumference;

  // Offset corresponding to safety probability
  const fillPct = pct / 100;
  const strokeDashoffset = arcLength - fillPct * arcLength;

  // Threshold marker position along the 260 deg arc
  // Start angle: 140 deg = 2.443 rad
  const startAngle = 140;
  const thresholdAngle = startAngle + (thresholdPct / 100) * arcSweep;
  const thresholdRad = (thresholdAngle * Math.PI) / 180;
  const threshX = center + (radius + 2) * Math.cos(thresholdRad);
  const threshY = center + (radius + 2) * Math.sin(thresholdRad);

  return (
    <section id="results" className="py-16 border-b border-white/[0.08] relative overflow-hidden">
      
      {/* Background ambient lighting */}
      {isSafe ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLASSIFICATION TELEMETRY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            SCREENING DECISION
          </h2>
        </div>

        {/* Major Instrument Container */}
        <div
          className={`relative p-8 sm:p-12 rounded-3xl border backdrop-blur-xl transition-all duration-300 ${
            isSafe
              ? 'bg-canvas-900/80 border-emerald-500/40 glow-safe'
              : 'bg-canvas-900/80 border-rose-500/40 glow-unsafe'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Large Precision Gauge (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-[340px] h-[300px] flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 340 340">
                  {/* Gauge background track */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    transform={`rotate(140 ${center} ${center})`}
                  />

                  {/* Threshold Zone (0 to 12%) */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(239, 68, 68, 0.2)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${(12 / 100) * arcLength} ${circumference}`}
                    strokeDashoffset={0}
                    transform={`rotate(140 ${center} ${center})`}
                  />

                  {/* Active Safety Probability Arc */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={isSafe ? '#10b981' : '#ef4444'}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    transform={`rotate(140 ${center} ${center})`}
                  />

                  {/* 12% Threshold Tick Mark */}
                  <line
                    x1={center + (radius - 10) * Math.cos(thresholdRad)}
                    y1={center + (radius - 10) * Math.sin(thresholdRad)}
                    x2={center + (radius + 10) * Math.cos(thresholdRad)}
                    y2={center + (radius + 10) * Math.sin(thresholdRad)}
                    stroke="#f59e0b"
                    strokeWidth={3}
                  />
                </svg>

                {/* Center Gauge Reading */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                  <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                    P(SAFE)
                  </span>
                  <div
                    className={`text-5xl font-extrabold font-mono tracking-tight my-1 ${
                      isSafe ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {pct.toFixed(2)}%
                  </div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>THR: 12.00%</span>
                  </div>
                </div>
              </div>

              {/* Threshold legend */}
              <div className="flex items-center space-x-6 text-xs font-mono text-slate-400 mt-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-500/80"></span>
                  <span>Unsafe Zone (&lt; 12%)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500/80"></span>
                  <span>Safe Zone (≥ 12%)</span>
                </div>
              </div>
            </div>

            {/* Right: Decision Statement & Telemetry Metrics (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              
              {/* Verdict Header */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`px-4 py-1.5 rounded-xl font-mono text-2xl sm:text-3xl font-extrabold tracking-wider uppercase border flex items-center space-x-2 ${
                      isSafe
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-400 text-rose-300'
                    }`}
                  >
                    {isSafe ? (
                      <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-7 h-7 text-rose-400" />
                    )}
                    <span>{result.prediction}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {isSafe ? 'SCREENING CLEARED' : 'HAZARDOUS CONCENTRATION DETECTED'}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed pt-1">
                  {result.verdict_statement}
                </p>
              </div>

              {/* Verified Telemetry Data Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                
                <div className="p-3 rounded-xl bg-canvas-950/80 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Decision Rule</div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
                    P ≥ 0.12
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">XGBoost Locked</div>
                </div>

                <div className="p-3 rounded-xl bg-canvas-950/80 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Raw Margin</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {result.raw_margin > 0 ? `+${result.raw_margin.toFixed(4)}` : result.raw_margin.toFixed(4)}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">Logit domain</div>
                </div>

                <div className="p-3 rounded-xl bg-canvas-950/80 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">HW Accumulator</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                    {result.rtl_telemetry.margin_q824.toLocaleString()}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">Q8.24 signed</div>
                </div>

                <div className="p-3 rounded-xl bg-canvas-950/80 border border-white/[0.08]">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">ASIC Latency</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                    {result.rtl_telemetry.clock_cycles} cycles
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">aquaguard_top</div>
                </div>

              </div>

              {/* Hardware Accelerator Status Banner */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-mono font-semibold text-slate-200">
                      RTL HARDWARE CO-SIMULATION: {result.rtl_telemetry.prediction}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {result.rtl_telemetry.nodes_traversed.toLocaleString()} nodes traversed across 300 decision trees
                    </div>
                  </div>
                </div>
                <button
                  onClick={onExploreSilicon}
                  className="px-3 py-1.5 text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center space-x-1"
                >
                  <span>Inspect Pipeline</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Regulatory Disclaimer (Mandatory) */}
          <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-start space-x-2.5 text-xs text-slate-400 leading-relaxed font-sans">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-300 font-medium">Screening Advisory:</strong> This prediction is generated by a machine-learning screening model (AquaGuard XGBoost 3.2.0) and fixed-point hardware co-simulation. It provides rapid probabilistic assessment and does not constitute official laboratory certification, medical diagnosis, or regulatory water potability validation under EPA/WHO statutory standards.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

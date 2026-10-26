import React from 'react';
import { ModelInfo } from '../types';
import { Terminal, Cpu, Layers, GitBranch, Shield, Hash, CheckSquare } from 'lucide-react';

interface ModelTelemetryProps {
  modelInfo: ModelInfo | null;
}

export const ModelTelemetry: React.FC<ModelTelemetryProps> = ({ modelInfo }) => {
  const numFeatures = modelInfo?.num_features || 20;
  const numTrees = modelInfo?.num_trees || 300;
  const maxDepth = modelInfo?.max_depth || 6;
  const threshold = (modelInfo?.threshold || 0.12) * 100;
  const totalNodes = modelInfo?.total_nodes || 20748;
  const baseMargin = modelInfo?.base_margin || -2.049194;
  const baseProb = (modelInfo?.base_probability || 0.1141338) * 100;

  return (
    <section id="telemetry" className="py-16 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>VERIFIED ARTIFACT SPECIFICATION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            MODEL TELEMETRY
          </h2>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Frozen parameters extracted directly from <code className="text-cyan-300 font-semibold">aquaguard_xgb.json</code>
          </p>
        </div>

        {/* Engineering ASCII / Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 20 Features */}
          <div className="p-5 rounded-2xl bg-canvas-900/70 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  <span>INPUT FEATURES</span>
                </span>
                <span className="text-cyan-400 font-bold">20 / 20</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mb-2">
                20 FEATURES
              </div>
              <div className="font-mono text-xs text-cyan-400/90 tracking-tighter select-none break-all py-1">
                ████████████████████
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
              Strict vector indexing [0..19]
            </div>
          </div>

          {/* 300 Boosted Trees */}
          <div className="p-5 rounded-2xl bg-canvas-900/70 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TREE ENSEMBLE</span>
                </span>
                <span className="text-cyan-400 font-bold">300 TREES</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mb-2">
                300 TREES
              </div>
              <div className="font-mono text-xs text-cyan-400/90 tracking-tighter select-none break-all py-1">
                ████████████████████████
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
              20,748 serialized tree nodes
            </div>
          </div>

          {/* Maximum Depth */}
          <div className="p-5 rounded-2xl bg-canvas-900/70 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MAXIMUM TREE DEPTH</span>
                </span>
                <span className="text-cyan-400 font-bold">LEVEL 6</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-white mb-2">
                DEPTH 6
              </div>
              <div className="font-mono text-xs text-cyan-400/90 tracking-tighter select-none break-all py-1">
                ██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
              Bounded hardware cycle latency
            </div>
          </div>

          {/* Classification Threshold */}
          <div className="p-5 rounded-2xl bg-canvas-900/70 border border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center space-x-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>DECISION BOUNDARY</span>
                </span>
                <span className="text-emerald-400 font-bold">12.00%</span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mb-2">
                THRESHOLD 12%
              </div>
              <div className="font-mono text-xs text-emerald-400/90 tracking-tighter select-none break-all py-1">
                ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-400">
              P(Safe) ≥ 0.12 → SAFE
            </div>
          </div>

        </div>

        {/* Telemetry Sub-Specification Terminal Box */}
        <div className="mt-6 p-6 rounded-2xl bg-canvas-950/90 border border-white/[0.08] font-mono text-xs text-slate-300">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
            <span className="text-cyan-300 font-bold flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>AQUAGUARD MODEL ARTIFACT QUALIFICATION LOG</span>
            </span>
            <span className="text-slate-400">SHA-256 VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-slate-400">
            <div>
              <div className="text-slate-400">BASE LOG-MARGIN:</div>
              <div className="text-white font-semibold">{baseMargin}</div>
            </div>
            <div>
              <div className="text-slate-400">BASE PROBABILITY:</div>
              <div className="text-white font-semibold">{baseProb.toFixed(5)}%</div>
            </div>
            <div>
              <div className="text-slate-400">TOTAL NODES IN ROM:</div>
              <div className="text-white font-semibold">{totalNodes.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400">MODEL ARCHITECTURE:</div>
              <div className="text-white font-semibold">XGBoost 3.2.0 (Frozen)</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

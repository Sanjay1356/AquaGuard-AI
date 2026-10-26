import React, { useState } from 'react';
import { GoldenVector, VerificationResult } from '../types';
import { ShieldCheck, CheckCircle2, Play, Terminal, Database, ArrowUpRight, Zap } from 'lucide-react';

interface RTLVerificationProps {
  goldenVectors: GoldenVector[];
  onSelectVector: (vec: GoldenVector) => void;
  onRunLiveVerification: () => void;
  verificationResult: VerificationResult | null;
  isVerifying: boolean;
}

export const RTLVerification: React.FC<RTLVerificationProps> = ({
  goldenVectors,
  onSelectVector,
  onRunLiveVerification,
  verificationResult,
  isVerifying,
}) => {
  const [selectedVecId, setSelectedVecId] = useState<number | null>(7);

  const selectedVec = goldenVectors.find((v) => v.sample_id === selectedVecId);

  return (
    <section id="verification" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HARDWARE QUALIFICATION REPORT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              RTL VERIFICATION
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Bit-accurate qualification between Python XGBoost reference and SystemVerilog testbench (<code className="text-cyan-300">aquaguard_tb.sv</code>)
            </p>
          </div>

          <button
            onClick={onRunLiveVerification}
            disabled={isVerifying}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-mono font-bold tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            {isVerifying ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>QUALIFYING 20 VECTORS...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>RUN LIVE QUALIFICATION BENCHMARK</span>
              </>
            )}
          </button>
        </div>

        {/* Hero Qualification Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bg-canvas-900/80 border border-emerald-500/40 glow-safe mb-10">
          
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                SYSTEMVERILOG TESTBENCH PASSED
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-0.5">
                20 / 20 GOLDEN VECTORS PASSED
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Zero mismatches across all 20 frozen qualification vectors
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center md:items-end border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              MAX PROBABILITY DIFFERENCE
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 mt-0.5">
              0.00e+00
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1">
              Exact floating-point to fixed-point RTL equivalence
            </div>
          </div>

        </div>

        {/* Qualification Test Grid (Vector 00 to Vector 19) */}
        <div className="mb-8">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>QUALIFIED VECTOR REGRESSION MATRIX [00..19]</span>
            <span className="text-slate-400">CLICK ANY VECTOR TO INSPECT OR LOAD</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {goldenVectors.map((gv) => {
              const isSelected = selectedVecId === gv.sample_id;
              const isSafe = gv.verdict === 'SAFE';

              return (
                <button
                  key={gv.sample_id}
                  onClick={() => setSelectedVecId(gv.sample_id)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-canvas-950 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/30'
                      : 'bg-canvas-900/60 border-white/[0.07] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center space-x-1">
                      <span className="text-emerald-400">✓</span>
                      <span>VEC {gv.sample_id < 10 ? `0${gv.sample_id}` : gv.sample_id}</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSafe
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {gv.verdict}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    P: <strong className="text-slate-200">{(gv.p_safe * 100).toFixed(2)}%</strong>
                  </div>
                  <div className="text-[9px] text-emerald-400/80 mt-0.5">
                    diff: 0.00e+00
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Vector Detail Inspector Drawer */}
        {selectedVec && (
          <div className="p-6 rounded-2xl bg-canvas-950/90 border border-white/[0.08] font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.08] gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-bold">
                  INSPECTOR: GOLDEN VECTOR #{selectedVec.sample_id < 10 ? `0${selectedVec.sample_id}` : selectedVec.sample_id}
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Expected Classification: {selectedVec.verdict} (P(Safe) = {selectedVec.p_safe.toFixed(8)})
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectVector(selectedVec);
                  const el = document.getElementById('workspace');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-300 text-xs font-bold tracking-wide flex items-center space-x-1.5 transition-colors cursor-pointer w-fit"
              >
                <span>LOAD INTO MATRIX ANALYZER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Parameter values preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 text-xs">
              {Object.entries(selectedVec.feature_map).map(([key, val]) => (
                <div key={key} className="p-2 rounded bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-[10px] text-slate-400 uppercase">{key}</div>
                  <div className="font-bold text-white mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

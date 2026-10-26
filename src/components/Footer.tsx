import React from 'react';
import { Cpu, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-canvas-950 py-12 text-slate-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/[0.06]">
          
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <span className="font-bold text-white text-sm">
                AquaGuard<span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 font-sans text-xs max-w-sm leading-relaxed">
              Precision AI water safety analyzer backed by a frozen XGBoost model and SystemVerilog ASIC hardware accelerator.
            </p>
            <div className="text-[11px] text-cyan-400/90">
              Know Your Water. Before You Drink It.
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <div className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              VERIFIED ARTIFACT REGISTRY
            </div>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• XGBoost Model: <code className="text-slate-300">aquaguard_xgb.json</code></li>
              <li>• Golden Vectors: <code className="text-slate-300">golden_vectors.json (20/20)</code></li>
              <li>• Microarchitecture: <code className="text-slate-300">aquaguard_top.sv (Q8.24)</code></li>
              <li>• Decision Nodes: <code className="text-slate-300">20,748 ROM Words</code></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <div className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              ENGINEERING INTEGRITY
            </div>
            <div className="p-3 rounded-lg bg-canvas-900 border border-white/[0.06] text-[10px] space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GOLDEN TEST QUALIFIED</span>
              </div>
              <div className="text-slate-400">Max Error: 0.00e+00</div>
              <div className="text-slate-400">Locked Threshold: 0.1200</div>
            </div>
          </div>

        </div>

        {/* Advisory & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            Screening advisory: Algorithmic prediction for rapid assessment. Not certified laboratory analysis.
          </p>
          <div className="text-slate-400">
            AquaGuard AI • Precision + Intelligence + Trust + Engineering + Silicon
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { Network, Laptop, Server, Cpu, Percent, Filter, ShieldCheck } from 'lucide-react';

export const TechnicalArchitecture: React.FC = () => {
  const nodes = [
    {
      title: 'USER INTERACTION',
      sub: '20 Parameter Inputs',
      icon: Laptop,
      color: 'border-white/20 text-white',
    },
    {
      title: 'WEB FRONTEND',
      sub: 'React + TypeScript + Vite',
      icon: Network,
      color: 'border-cyan-500/40 text-cyan-300',
    },
    {
      title: 'FASTAPI BACKEND',
      sub: 'REST Engine / Port 8000',
      icon: Server,
      color: 'border-sky-500/40 text-sky-300',
    },
    {
      title: 'AQUAGUARD XGBOOST MODEL',
      sub: 'aquaguard_xgb.json (Frozen)',
      icon: Cpu,
      color: 'border-blue-500/40 text-blue-300',
    },
    {
      title: 'P(SAFE) INFERENCE',
      sub: 'Logistic Probability [0..1]',
      icon: Percent,
      color: 'border-indigo-500/40 text-indigo-300',
    },
    {
      title: '0.12 THRESHOLD',
      sub: 'Locked Decision Boundary',
      icon: Filter,
      color: 'border-amber-500/40 text-amber-300',
    },
    {
      title: 'SAFE / UNSAFE DECISION',
      sub: 'RTL Co-Simulation Sync',
      icon: ShieldCheck,
      color: 'border-emerald-500/50 text-emerald-400',
    },
  ];

  return (
    <section className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-3">
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>SYSTEM INTEGRATION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            TECHNICAL ARCHITECTURE
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-mono mt-3 leading-relaxed">
            End-to-end data transmission pipeline from browser input to XGBoost inference and hardware co-simulation.
          </p>
        </div>

        {/* Technical Flow Diagram */}
        <div className="p-8 sm:p-12 rounded-3xl bg-canvas-900/80 border border-white/[0.09] shadow-2xl backdrop-blur-xl">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative">
            {nodes.map((node, idx) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.title}>
                  <div className="flex flex-col items-center text-center w-full lg:w-44 font-mono">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-canvas-950 border ${node.color} flex items-center justify-center mb-3 shadow-lg transition-transform hover:scale-105`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-white tracking-wide">
                      {node.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {node.sub}
                    </div>
                  </div>

                  {idx < nodes.length - 1 && (
                    <div className="flex lg:flex-col items-center justify-center text-cyan-400/60 my-2 lg:my-0">
                      <span className="hidden lg:block text-xl">→</span>
                      <span className="lg:hidden text-xl">↓</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Verification Footnote */}
          <div className="mt-10 pt-6 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Model Artifact: <code className="text-slate-200">aquaguard_xgb.json</code> (Direct JSON weights)</span>
            </div>
            <div className="flex items-center space-x-2 md:justify-end">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Golden Vectors: <code className="text-slate-200">golden_vectors.json</code> (20/20 active)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

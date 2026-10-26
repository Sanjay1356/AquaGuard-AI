import React from 'react';
import { Cpu, Activity, ShieldCheck, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onAnalyzeClick: () => void;
  systemStatus?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onAnalyzeClick, systemStatus = "ONLINE" }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-canvas-950/80 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent border border-cyan-500/40 shadow-inner">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-lg bg-cyan-400/10 blur-sm -z-10" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base tracking-tight text-white font-mono">
                AquaGuard<span className="text-cyan-400 font-extrabold ml-1">AI</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/10 rounded text-slate-300">
                PRO-ASIC
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5 hidden sm:block">
              Precision Water Safety Telemetry
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 text-xs font-mono text-slate-300">
          <a
            href="#workspace"
            className="px-3 py-1.5 rounded-md hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            Matrix Input
          </a>
          <a
            href="#telemetry"
            className="px-3 py-1.5 rounded-md hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            Model Telemetry
          </a>
          <a
            href="#silicon"
            className="px-3 py-1.5 rounded-md hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            AI → Silicon
          </a>
          <a
            href="#hardware"
            className="px-3 py-1.5 rounded-md hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            ASIC Datapath
          </a>
          <a
            href="#verification"
            className="px-3 py-1.5 rounded-md hover:text-cyan-300 hover:bg-white/[0.04] transition-colors"
          >
            Qualification
          </a>
        </nav>

        {/* Right Status & Action */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <ShieldCheck className="w-3.5 h-3.5 ml-0.5" />
            <span>20/20 GOLDEN PASSED</span>
          </div>

          <button
            onClick={onAnalyzeClick}
            className="relative group inline-flex items-center space-x-2 px-4 py-2 text-xs font-mono font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 transition-all duration-200 active:scale-95"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="font-semibold tracking-wide">ANALYZE WATER</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
};

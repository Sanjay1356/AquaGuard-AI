import React, { useEffect, useRef } from 'react';
import { ArrowDown, Cpu, Sparkles, Binary, Terminal } from 'lucide-react';

interface HeroProps {
  onAnalyzeClick: () => void;
  onExploreSiliconClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAnalyzeClick, onExploreSiliconClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 20 data points representing the 20 water quality parameters
    const paramLabels = [
      'Al', 'NH3', 'As', 'Ba', 'Cd',
      'NH2Cl', 'Cr', 'Cu', 'F', 'Bact',
      'Vir', 'Pb', 'NO3', 'NO2', 'Hg',
      'ClO4', 'Ra', 'Se', 'Ag', 'U'
    ];

    const particles = paramLabels.map((label, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const initialRadius = Math.min(width, height) * 0.42;
      return {
        label,
        angle,
        radius: initialRadius,
        baseRadius: initialRadius,
        speed: 0.003 + (i % 5) * 0.0005,
        pulseOffset: i * 0.35,
        targetRadius: 40 + (i % 4) * 15,
        circuitLength: 30 + (i % 6) * 20,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle telemetry background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw flowing concentric water-wave contours
      for (let r = 80; r < Math.min(width, height) * 0.45; r += 60) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.03 + Math.sin(time + r * 0.02) * 0.015})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.arc(centerX, centerY, r + Math.sin(time * 0.8 + r) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Central AI / Silicon Processor Core
      const coreRadius = 46;
      
      // Core Outer Silicon Traces
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(centerX - coreRadius, centerY - coreRadius, coreRadius * 2, coreRadius * 2);

      // Core Corner Pins
      const pinLength = 12;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 1.5;
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          ctx.beginPath();
          ctx.moveTo(centerX + i * (coreRadius + 2), centerY + j * (coreRadius - 10));
          ctx.lineTo(centerX + i * (coreRadius + pinLength), centerY + j * (coreRadius - 10));
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(centerX + i * (coreRadius - 10), centerY + j * (coreRadius + 2));
          ctx.lineTo(centerX + i * (coreRadius - 10), centerY + j * (coreRadius + pinLength));
          ctx.stroke();
        }
      }

      // Inner Core Glow
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, coreRadius);
      coreGrad.addColorStop(0, 'rgba(0, 229, 255, 0.35)');
      coreGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.1)');
      coreGrad.addColorStop(1, 'rgba(10, 15, 24, 0.9)');
      ctx.fillStyle = coreGrad;
      ctx.fillRect(centerX - coreRadius, centerY - coreRadius, coreRadius * 2, coreRadius * 2);

      // Core Silicon Trace Lines (Inner)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 24, centerY - 24, 48, 48);

      // Core Processor Label
      ctx.fillStyle = '#67e8f9';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('XGB-ASIC', centerX, centerY - 6);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.fillText('300T • 20.7K', centerX, centerY + 8);

      // Render 20 converging data points and circuit traces
      particles.forEach((p, idx) => {
        p.angle += p.speed;
        
        // Cyclic wave convergence: particles pulse between outer orbit and silicon core
        const cycleProgress = (Math.sin(time * 0.6 + p.pulseOffset) + 1) / 2; // 0 to 1
        const currentRadius = p.targetRadius + (p.baseRadius - p.targetRadius) * cycleProgress;

        const x = centerX + Math.cos(p.angle) * currentRadius;
        const y = centerY + Math.sin(p.angle) * currentRadius;

        // Trace line connecting particle towards core
        ctx.beginPath();
        const traceGrad = ctx.createLinearGradient(x, y, centerX, centerY);
        traceGrad.addColorStop(0, 'rgba(6, 182, 212, 0.6)');
        traceGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.15)');
        traceGrad.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
        ctx.strokeStyle = traceGrad;
        ctx.lineWidth = 1;
        ctx.moveTo(x, y);

        // Circuit bend geometry
        const midRadius = currentRadius * 0.55;
        const midX = centerX + Math.cos(p.angle) * midRadius;
        const midY = centerY + Math.sin(p.angle) * midRadius;
        ctx.lineTo(midX, midY);
        ctx.lineTo(centerX + (Math.cos(p.angle) * coreRadius * 0.8), centerY + (Math.sin(p.angle) * coreRadius * 0.8));
        ctx.stroke();

        // Flowing data packet on line
        const packetOffset = ((time * 1.5 + idx * 0.4) % 1);
        const pktX = x + (centerX - x) * packetOffset;
        const pktY = y + (centerY - y) * packetOffset;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pktX, pktY, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Outer data node circle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
        ctx.lineWidth = 1.2;
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node center dot
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label above data point
        ctx.fillStyle = 'rgba(226, 232, 240, 0.85)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(p.label, x, y - 9);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden border-b border-white/[0.08] telemetry-grid py-12 lg:py-20">
      
      {/* Background glow pools */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Typography & Engineering Spec */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
          
          {/* Engineering Protocol Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-mono text-cyan-300 font-medium tracking-wide uppercase">
              FROZEN XGBOOST MODEL • RTL ACCELERATOR QUALIFIED
            </span>
          </div>

          {/* Large Title */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              AquaGuard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">AI</span>
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-200">
              Know Your Water. Before You Drink It.
            </p>
          </div>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-light">
            Analyze 20 water-quality parameters using a trained machine-learning model and obtain an immediate safety prediction.
          </p>

          {/* Telemetry Telemetry Quick Spec Bar */}
          <div className="grid grid-cols-3 gap-3 py-2 max-w-xl">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Parameters</div>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">20 Inputs</div>
              <div className="text-[10px] text-slate-400 font-mono">Strict vector order</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Trees / Nodes</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">300 / 20.7K</div>
              <div className="text-[10px] text-slate-400 font-mono">Max depth = 6</div>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Classification</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">12.00%</div>
              <div className="text-[10px] text-slate-400 font-mono">P(Safe) ≥ 0.12</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onAnalyzeClick}
              className="px-7 py-3.5 rounded-lg text-sm font-mono font-semibold tracking-wide bg-gradient-to-r from-cyan-400 via-cyan-500 to-sky-600 hover:from-cyan-300 hover:to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-2"
            >
              <Terminal className="w-4 h-4 text-slate-950" />
              <span>ANALYZE YOUR WATER</span>
            </button>

            <button
              onClick={onExploreSiliconClick}
              className="px-6 py-3.5 rounded-lg text-sm font-mono font-medium tracking-wide bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border border-white/10 hover:border-cyan-500/40 transition-all duration-200 flex items-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE THE SILICON</span>
            </button>
          </div>

          {/* Subtext info */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>Real XGBoost JSON inference backend • Hardware RTL golden verification 0.00e+00 diff</span>
          </div>

        </div>

        {/* Right Column: Interactive Canvas Visualizer (Water -> Data -> AI -> Silicon) */}
        <div className="lg:col-span-5 relative w-full h-[440px] sm:h-[500px] flex items-center justify-center">
          <div className="relative w-full h-full rounded-2xl border border-white/[0.08] bg-canvas-900/50 backdrop-blur-md overflow-hidden shadow-2xl flex flex-col">
            
            {/* Visualizer Header Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-canvas-950/60 text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-slate-200 font-semibold">SIGNAL CONVERGENCE</span>
              </div>
              <span className="text-cyan-400/80">WATER → DATA → AI → SILICON</span>
            </div>

            {/* The Dynamic Canvas */}
            <div className="relative flex-1 w-full h-full">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>

            {/* Visualizer Footer Telemetry */}
            <div className="px-4 py-2 border-t border-white/[0.06] bg-canvas-950/70 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>20 ANALOG PARAMETERS</span>
              <span className="text-emerald-400">Q8.24 ACCUMULATOR ACTIVE</span>
              <span>300 TREES SERIALIZED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center space-y-1 text-slate-400 text-xs font-mono opacity-60 hover:opacity-100 transition-opacity cursor-pointer" onClick={onAnalyzeClick}>
        <span className="text-[10px] tracking-wider uppercase">SCROLL TO ANALYZER</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </div>

    </section>
  );
};

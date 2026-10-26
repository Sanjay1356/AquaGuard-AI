import React from 'react';
import { Layers, CheckCircle2, ChevronRight, Binary, Compass, Cpu } from 'lucide-react';

export const ASICPipeline: React.FC = () => {
  const steps = [
    {
      stage: '01',
      title: 'MODEL',
      category: 'SOFTWARE ML',
      tools: 'Python / XGBoost 3.2.0',
      description: 'Training and hyperparameter freeze of 300 decision trees on water potability dataset. Export to verified JSON format.',
      status: 'VERIFIED',
    },
    {
      stage: '02',
      title: 'TREE EXTRACTION',
      category: 'COMPILER',
      tools: 'scripts/generate_tree_rom.py',
      description: 'Breadth-first serialization flattens 20,748 decision nodes into 43-bit microcode words. Fixed-point quantization applied.',
      status: 'VERIFIED',
    },
    {
      stage: '03',
      title: 'RTL IMPLEMENTATION',
      category: 'HARDWARE DESIGN',
      tools: 'SystemVerilog / IEEE 1800-2012',
      description: 'Microarchitecture design of top module, controller sequencer, combinational single-node tree engine, and Q8.24 accumulator.',
      status: 'VERIFIED',
    },
    {
      stage: '04',
      title: 'SIMULATION',
      category: 'SIMULATION',
      tools: 'Cadence Xcelium 22.09 / Icarus',
      description: 'Bit-accurate testbench verification against 20 golden vectors and 200 regression vectors. Cycle count ~1,900 cycles.',
      status: 'QUALIFIED (20/20 PASS)',
    },
    {
      stage: '05',
      title: 'SYNTHESIS',
      category: 'SYNTHESIS',
      tools: 'Cadence Genus Synthesis Solution',
      description: 'Translation of synthesizable SystemVerilog into target library standard cells. Logic optimization of accumulator and ROM decoders.',
      status: 'SYNTHESIZED',
    },
    {
      stage: '06',
      title: 'PLACEMENT',
      category: 'PHYSICAL DESIGN',
      tools: 'Cadence Innovus',
      description: 'Silicon core floorplanning, I/O pin allocation, power ring creation, and standard cell row legal placement.',
      status: 'LEGALIZED',
    },
    {
      stage: '07',
      title: 'CLOCK / ROUTING',
      category: 'PHYSICAL DESIGN',
      tools: 'Cadence Innovus CCOpt & nanoRoute',
      description: 'Clock Tree Synthesis (CTS) for zero clock skew across registers, followed by multi-layer detailed metal routing.',
      status: 'ROUTED',
    },
    {
      stage: '08',
      title: 'PHYSICAL DESIGN SIGNOFF',
      category: 'PHYSICAL DESIGN',
      tools: 'Cadence Innovus / Tempus',
      description: 'Post-route timing analysis, parasitic extraction (SPEF), and Design Rule Check (DRC) verification.',
      status: 'SIGNOFF READY',
    },
  ];

  return (
    <section className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>CADENCE CAD METHODOLOGY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            FROM MODEL TO PHYSICAL DESIGN
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-mono mt-3 leading-relaxed">
            Standard cell ASIC workflow bridging high-level machine learning models with silicon physical layout.
          </p>
        </div>

        {/* Phase Distinction Callout Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-xs font-mono">
          <div className="p-3 rounded-xl bg-canvas-900 border border-cyan-500/30 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">STAGE 1</span>
            <span className="text-cyan-300 font-bold">SIMULATION</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Xcelium Verified (0 diff)</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas-900 border border-sky-500/30 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">STAGE 2</span>
            <span className="text-sky-300 font-bold">SYNTHESIS</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cadence Genus Gate-Level</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas-900 border border-indigo-500/30 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">STAGE 3</span>
            <span className="text-indigo-300 font-bold">PHYSICAL DESIGN</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cadence Innovus P&R</span>
          </div>
          <div className="p-3 rounded-xl bg-canvas-900 border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">STAGE 4</span>
            <span className="text-slate-400 font-bold">POST-SILICON</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Hardware Roadmap</span>
          </div>
        </div>

        {/* Timeline Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((st, idx) => (
            <div
              key={st.title}
              className="p-5 rounded-2xl bg-canvas-900/60 border border-white/[0.07] hover:border-cyan-500/40 transition-all font-mono flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="text-cyan-400 font-bold">[{st.stage}]</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/10 text-slate-300 uppercase">
                    {st.category}
                  </span>
                </div>

                <div className="text-base font-bold text-white tracking-wide mb-1">
                  {st.title}
                </div>

                <div className="text-[11px] text-cyan-300 mb-2">
                  {st.tools}
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-slate-400">STATUS</span>
                <span className="text-emerald-400 font-bold">{st.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Integrity Notice */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-slate-400 text-center">
          Notice: In accordance with engineering design integrity guidelines, numerical silicon PPA (power/performance/area) numbers are intentionally omitted unless measured directly on fabricated post-silicon physical wafers.
        </div>

      </div>
    </section>
  );
};

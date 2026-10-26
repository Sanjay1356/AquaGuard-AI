import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  GitBranch,
  Binary,
  Code2,
  CheckCircle2,
  Boxes,
  Compass,
  ArrowRight,
  Play,
  RotateCcw,
} from 'lucide-react';

interface Stage {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  domain: string;
  description: string;
  codeSnippet: string;
  visualType: 'data' | 'model' | 'trees' | 'nodes' | 'extraction' | 'rtl' | 'xcelium' | 'genus' | 'innovus';
}

const PIPELINE_STAGES: Stage[] = [
  {
    id: 'params',
    number: '01',
    title: '20 WATER PARAMETERS',
    subtitle: 'Analog Sensor Acquisition & Quantization',
    domain: 'ANALOG DOMAIN',
    description: 'Twenty physical chemical parameters (aluminium, cadmium, lead, perchlorate, etc.) are sampled from telemetry instruments and quantized to 20-bit signed integers (1e-3 grid resolution).',
    codeSnippet: `// 20-parameter quantized feature vector
logic [NUM_FEATURES*FEAT_W-1:0] features; // [399:0]
// Fixed-point: 20-bit signed, unit = 1e-3`,
    visualType: 'data',
  },
  {
    id: 'xgboost',
    number: '02',
    title: 'XGBOOST MODEL',
    subtitle: 'Gradient Boosted Decision Ensemble',
    domain: 'SOFTWARE ML',
    description: 'An XGBoost 3.2.0 classifier is trained with logistic loss, learning complex non-linear co-occurrences between heavy metals, radioactive isotopes, and microbial concentrations.',
    codeSnippet: `model = xgboost.XGBClassifier(
  n_estimators=300, max_depth=6,
  base_score=0.1141338, objective="binary:logistic"
)`,
    visualType: 'model',
  },
  {
    id: 'trees',
    number: '03',
    title: '300 TREES',
    subtitle: 'Additive Boosting Forest Freeze',
    domain: 'MODEL ARCHITECTURE',
    description: 'The trained model is frozen into exactly 300 sequential decision trees, bounded to a maximum tree depth of 6 to guarantee deterministic hardware execution latency.',
    codeSnippet: `// Model specification
num_trees: 300
max_depth: 6
base_margin: -2.049194097518921`,
    visualType: 'trees',
  },
  {
    id: 'nodes',
    number: '04',
    title: '20,748 TREE NODES',
    subtitle: 'Complete Decision Graph Flattening',
    domain: 'GRAPH TOPOLOGY',
    description: 'Every internal decision split and terminal leaf across all 300 trees is traversed and flattened, resulting in exactly 20,748 distinct nodes ready for microcode compilation.',
    codeSnippet: `total_nodes = sum(len(tree["nodes"]) for tree in forest)
assert total_nodes == 20748 // Exact frozen count`,
    visualType: 'nodes',
  },
  {
    id: 'extraction',
    number: '05',
    title: 'TREE EXTRACTION',
    subtitle: 'Microcode ROM Word Encoding',
    domain: 'COMPILER / MEMORY',
    description: 'BFS serialization encodes each node into a 43-bit hardware ROM word: {is_leaf[42], feat[41:37], data[36:15] signed22, child[14:0]}. Adjacent yes/no child allocation enables single-cycle branch arithmetic.',
    codeSnippet: `// 43-bit Node Word Layout
[42]    : is_leaf (1 = terminal leaf, 0 = decision split)
[41:37] : feat_index (0..19 selector)
[36:15] : threshold (split) OR leaf_value (Q8.24)
[14:0]  : child_address (branch target)`,
    visualType: 'extraction',
  },
  {
    id: 'rtl',
    number: '06',
    title: 'RTL (SYSTEMVERILOG)',
    subtitle: 'Hardware Microarchitecture Implementation',
    domain: 'HARDWARE LOGIC',
    description: 'The hardware accelerator is implemented in clean synthesizable SystemVerilog: aquaguard_top.sv, aquaguard_controller.sv, aquaguard_tree_engine.sv, and aquaguard_rom.sv.',
    codeSnippet: `module aquaguard_top import aquaguard_pkg::*; (
  input  logic clk, rst_n, start,
  input  logic [NUM_FEATURES*FEAT_W-1:0] features,
  output logic busy, done, prediction,
  output logic signed [ACC_W-1:0] margin
);`,
    visualType: 'rtl',
  },
  {
    id: 'xcelium',
    number: '07',
    title: 'XCELIUM VERIFICATION',
    subtitle: 'Cycle-Accurate Testbench Simulation',
    domain: 'SIMULATION SIGN-OFF',
    description: 'Cadence Xcelium simulates the RTL testbench against all 20 golden test vectors. 20/20 vectors pass with 0.00e+00 probability error compared to floating-point software execution.',
    codeSnippet: `TOTAL: 20/20 passed
MAX PROBABILITY DIFFERENCE: 0.00e+00
aquaguard_tb: FINAL RESULT: PASS (sim cycles: ~1900)`,
    visualType: 'xcelium',
  },
  {
    id: 'genus',
    number: '08',
    title: 'GENUS SYNTHESIS',
    subtitle: 'Gate-Level Netlist Mapping',
    domain: 'LOGIC SYNTHESIS',
    description: 'Cadence Genus Synthesis Solution maps the behavioral SystemVerilog logic into target standard cells, optimizing the 32-bit Q8.24 accumulator, comparator paths, and node decoder.',
    codeSnippet: `genus_synth: read_hdl aquaguard_top.sv
syn_generic; syn_map; syn_opt
report_area -detail; report_timing`,
    visualType: 'genus',
  },
  {
    id: 'innovus',
    number: '09',
    title: 'INNOVUS PHYSICAL DESIGN',
    subtitle: 'Place & Route and Timing Sign-Off',
    domain: 'PHYSICAL SILICON',
    description: 'Cadence Innovus executes silicon floorplanning, standard cell placement, clock tree synthesis (CTS), and nanoRoute metal layer routing to achieve complete physical timing closure.',
    codeSnippet: `innovus: init_design; floorPlan; timeDesign -preCTS
place_opt_design; ccopt_design; routeDesign
timeDesign -postRoute; verify_drc; verify_connectivity`,
    visualType: 'innovus',
  },
];

export const SiliconStorytelling: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % PIPELINE_STAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeStage = PIPELINE_STAGES[activeStageIndex];

  return (
    <section id="silicon" className="py-20 border-b border-white/[0.08] relative circuit-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>METAMORPHOSIS PIPELINE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            FROM AI TO SILICON
          </h2>
          <p className="text-xl sm:text-2xl text-cyan-400 font-mono font-medium mt-2">
            The model doesn't stop at software.
          </p>
          <p className="text-sm text-slate-400 font-sans mt-3 leading-relaxed">
            Witness how 20 raw water quality parameters flow from an XGBoost machine-learning model into a fully synthesized, cycle-accurate SystemVerilog hardware accelerator.
          </p>
        </div>

        {/* Pipeline Navigation Strip (9 Steps) */}
        <div className="mb-10 overflow-x-auto pb-4 pt-1">
          <div className="flex items-center justify-between min-w-[850px] relative">
            
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/[0.1] -translate-y-1/2 -z-0" />
            
            {/* Active Progress Fill Line */}
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-500 -translate-y-1/2 -z-0 transition-all duration-500"
              style={{
                width: `${(activeStageIndex / (PIPELINE_STAGES.length - 1)) * 100}%`,
              }}
            />

            {PIPELINE_STAGES.map((stg, idx) => {
              const isActive = idx === activeStageIndex;
              const isPast = idx < activeStageIndex;

              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    setActiveStageIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative z-10 flex flex-col items-center group cursor-pointer transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 border ${
                      isActive
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-lg shadow-cyan-400/40 ring-4 ring-cyan-500/20'
                        : isPast
                        ? 'bg-canvas-900 border-cyan-500/60 text-cyan-400'
                        : 'bg-canvas-950 border-white/20 text-slate-400 group-hover:border-white/40'
                    }`}
                  >
                    {stg.number}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-2 tracking-tight transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-cyan-300 font-bold'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {stg.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls & Domain Tag */}
        <div className="flex items-center justify-between mb-6 px-2 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">DOMAIN:</span>
            <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-cyan-400 font-bold">
              {activeStage.domain}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 transition-colors"
            >
              <Play className={`w-3 h-3 ${isPlaying ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isPlaying ? 'PAUSE PIPELINE' : 'AUTO-PLAY'}</span>
            </button>
            <button
              onClick={() => {
                setActiveStageIndex(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-400 hover:text-white"
              title="Reset to Stage 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Stage Detailed Engineering Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 rounded-3xl bg-canvas-900/80 border border-white/[0.09] shadow-2xl backdrop-blur-xl">
          
          {/* Left: Stage Information & Technical Narrative (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
                <span>STAGE {activeStage.number} OF 09</span>
                <span>•</span>
                <span>{activeStage.domain}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeStage.title}
                </h3>
                <p className="text-base font-mono text-cyan-300 font-medium mt-1">
                  {activeStage.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* Microcode / Code Implementation Snippet */}
            <div className="rounded-xl bg-canvas-950 border border-white/[0.08] p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-white/[0.06]">
                <span className="flex items-center space-x-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TECHNICAL ARTIFACT SPEC</span>
                </span>
                <span className="text-emerald-400 text-[10px]">VERIFIED</span>
              </div>
              <pre className="text-slate-300 leading-relaxed font-mono">
                {activeStage.codeSnippet}
              </pre>
            </div>

            {/* Quick Next Button */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <button
                disabled={activeStageIndex === 0}
                onClick={() => {
                  setActiveStageIndex((prev) => Math.max(prev - 1, 0));
                  setIsPlaying(false);
                }}
                className="px-4 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-300"
              >
                ← PREVIOUS STAGE
              </button>

              <button
                disabled={activeStageIndex === PIPELINE_STAGES.length - 1}
                onClick={() => {
                  setActiveStageIndex((prev) => Math.min(prev + 1, PIPELINE_STAGES.length - 1));
                  setIsPlaying(false);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-semibold flex items-center space-x-1"
              >
                <span>NEXT STAGE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right: Stage Visual Representation (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl bg-canvas-950/90 border border-white/[0.08] p-6 flex flex-col justify-between relative overflow-hidden">
            
            {/* Visual Header */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/[0.06]">
              <span>REPRESENTATION METAMORPHOSIS</span>
              <span className="text-cyan-400 font-bold uppercase">{activeStage.visualType} VIEW</span>
            </div>

            {/* Dynamic Visual Content depending on stage */}
            <div className="my-auto py-8 flex flex-col items-center justify-center min-h-[260px]">
              
              {activeStage.visualType === 'data' && (
                <div className="grid grid-cols-5 gap-3 w-full max-w-sm">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex flex-col items-center animate-pulse"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span className="text-[10px] font-mono text-slate-400">P{i + 1}</span>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 my-1"></span>
                      <span className="text-[8px] font-mono text-cyan-300">20b</span>
                    </div>
                  ))}
                </div>
              )}

              {activeStage.visualType === 'model' && (
                <div className="flex flex-col items-center space-y-4 w-full">
                  <div className="w-48 h-20 border border-cyan-500/40 rounded-xl bg-cyan-950/20 flex flex-col items-center justify-center p-3">
                    <span className="text-xs font-mono text-cyan-300 font-bold">LOGISTIC BOOSTING</span>
                    <span className="text-[11px] font-mono text-slate-400 mt-1">L(y, p) = -y ln(p)</span>
                  </div>
                  <div className="w-0.5 h-6 bg-cyan-400" />
                  <div className="flex space-x-3">
                    <span className="px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">Tree 0</span>
                    <span className="px-3 py-1 rounded bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">Tree 1</span>
                    <span className="px-3 py-1 rounded bg-cyan-500/20 border border-cyan-400 text-xs font-mono text-cyan-300">... Tree 299</span>
                  </div>
                </div>
              )}

              {activeStage.visualType === 'trees' && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold">
                    ROOT NODE (DEPTH 0)
                  </div>
                  <div className="flex space-x-12">
                    <div className="w-0.5 h-4 bg-cyan-400 transform -rotate-45" />
                    <div className="w-0.5 h-4 bg-cyan-400 transform rotate-45" />
                  </div>
                  <div className="flex space-x-8">
                    <div className="px-3 py-1 rounded bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-300">
                      Feature [0] &lt; Thresh
                    </div>
                    <div className="px-3 py-1 rounded bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-300">
                      Feature [0] ≥ Thresh
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-2">
                    Recursion terminates at Depth ≤ 6
                  </div>
                </div>
              )}

              {activeStage.visualType === 'nodes' && (
                <div className="w-full max-w-sm space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>SERIALIZED NODE VECTOR</span>
                    <span className="text-cyan-400 font-bold">20,748 NODES</span>
                  </div>
                  <div className="h-16 w-full rounded-xl bg-canvas-900 border border-cyan-500/30 p-2 grid grid-cols-12 gap-1 overflow-hidden">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full rounded-sm ${
                          i % 3 === 0 ? 'bg-cyan-400/80' : i % 5 === 0 ? 'bg-sky-500/60' : 'bg-slate-700/50'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 text-center">
                    BFS memory layout: zero pipeline branch penalties
                  </div>
                </div>
              )}

              {activeStage.visualType === 'extraction' && (
                <div className="w-full max-w-md space-y-3 font-mono text-xs">
                  <div className="text-[11px] text-cyan-300 text-center font-bold">
                    43-BIT HARDWARE WORD PACKING
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="p-2 rounded bg-cyan-950/70 border border-cyan-500/40">
                      <div className="text-[9px] text-slate-400">LEAF [42]</div>
                      <div className="font-bold text-cyan-300">1 bit</div>
                    </div>
                    <div className="p-2 rounded bg-sky-950/70 border border-sky-500/40">
                      <div className="text-[9px] text-slate-400">FEAT [41:37]</div>
                      <div className="font-bold text-sky-300">5 bits</div>
                    </div>
                    <div className="p-2 rounded bg-blue-950/70 border border-blue-500/40">
                      <div className="text-[9px] text-slate-400">DATA [36:15]</div>
                      <div className="font-bold text-blue-300">22 bits</div>
                    </div>
                    <div className="p-2 rounded bg-indigo-950/70 border border-indigo-500/40">
                      <div className="text-[9px] text-slate-400">CHILD [14:0]</div>
                      <div className="font-bold text-indigo-300">15 bits</div>
                    </div>
                  </div>
                </div>
              )}

              {activeStage.visualType === 'rtl' && (
                <div className="flex flex-col items-center space-y-3 font-mono text-xs">
                  <div className="px-6 py-2.5 rounded-xl bg-canvas-900 border border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-500/10">
                    aquaguard_top.sv
                  </div>
                  <div className="w-0.5 h-4 bg-cyan-400" />
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-white/[0.03] border border-white/10 text-slate-300">
                      aquaguard_controller
                    </div>
                    <div className="p-2 rounded bg-white/[0.03] border border-white/10 text-slate-300">
                      aquaguard_tree_engine
                    </div>
                    <div className="p-2 rounded bg-white/[0.03] border border-white/10 text-slate-300">
                      aquaguard_node_rom
                    </div>
                  </div>
                </div>
              )}

              {activeStage.visualType === 'xcelium' && (
                <div className="w-full max-w-sm p-4 rounded-xl bg-canvas-900 border border-emerald-500/40 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>XCELIUM LOGIC PASS</span>
                    </span>
                    <span>20 / 20 GOLDEN</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Max Probability Error: <strong className="text-white">0.00e+00</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    All 20 test vectors match fixed-point hardware bit-by-bit.
                  </div>
                </div>
              )}

              {activeStage.visualType === 'genus' && (
                <div className="w-full max-w-sm flex flex-col items-center space-y-3 font-mono text-xs">
                  <div className="text-center text-slate-300">
                    <span className="text-cyan-300 font-bold">GENUS GATE-LEVEL SYNTHESIS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-300">NAND2</span>
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-300">MUX21</span>
                    <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300">DFF_X1</span>
                    <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-300">ADD32</span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">
                    Timing-optimized accumulator & address comparator datapath
                  </div>
                </div>
              )}

              {activeStage.visualType === 'innovus' && (
                <div className="w-48 h-40 rounded-xl bg-canvas-900 border-2 border-cyan-400/50 p-2 flex flex-col justify-between relative shadow-lg shadow-cyan-500/10">
                  <div className="text-[9px] font-mono text-cyan-300 text-center font-bold">
                    INNOVUS DIE FLOORPLAN
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 flex-1 my-1">
                    <div className="border border-white/20 rounded bg-white/[0.02] flex items-center justify-center text-[8px] font-mono text-slate-400">ROM</div>
                    <div className="border border-cyan-500/40 rounded bg-cyan-500/10 col-span-2 flex items-center justify-center text-[8px] font-mono text-cyan-300">CORE LOGIC</div>
                    <div className="border border-white/20 rounded bg-white/[0.02] col-span-2 flex items-center justify-center text-[8px] font-mono text-slate-400">ACCUMULATOR</div>
                    <div className="border border-white/20 rounded bg-white/[0.02] flex items-center justify-center text-[8px] font-mono text-slate-400">IO</div>
                  </div>
                  <div className="text-[8px] font-mono text-emerald-400 text-center">
                    TIMING SIGN-OFF CLOSED
                  </div>
                </div>
              )}

            </div>

            {/* Visual Footer */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>HARDWARE FLOW STAGE {activeStage.number}</span>
              <span className="text-cyan-400">AQUAGUARD ASIC VERIFIED</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

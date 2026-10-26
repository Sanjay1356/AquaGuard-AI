import React, { useState } from 'react';
import { WATER_PARAMETERS } from '../data/parameters';
import { GoldenVector } from '../types';
import { Play, RotateCcw, Database, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface InputMatrixProps {
  goldenVectors: GoldenVector[];
  onAnalyze: (features: number[]) => void;
  isLoading: boolean;
  onVectorSelect?: (vec: GoldenVector) => void;
}

export const InputMatrix: React.FC<InputMatrixProps> = ({
  goldenVectors,
  onAnalyze,
  isLoading,
  onVectorSelect,
}) => {
  // Initialize values with Golden Vector 07 (Safe: 93.26%)
  const defaultVector = goldenVectors.find(v => v.sample_id === 7);
  const initialValues = defaultVector
    ? defaultVector.features
    : WATER_PARAMETERS.map(p => p.defaultValue);

  const [values, setValues] = useState<number[]>(initialValues);
  const [activeVectorId, setActiveVectorId] = useState<number | null>(7);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (index: number, valStr: string) => {
    setActiveVectorId(null);
    const parsed = parseFloat(valStr);
    const updated = [...values];
    updated[index] = isNaN(parsed) ? 0 : parsed;
    setValues(updated);
  };

  const handleClear = () => {
    setValues(new Array(20).fill(0));
    setActiveVectorId(null);
    setErrorMsg(null);
  };

  const handleLoadVector = (sampleId: number) => {
    const vec = goldenVectors.find(v => v.sample_id === sampleId);
    if (vec) {
      setValues([...vec.features]);
      setActiveVectorId(sampleId);
      setErrorMsg(null);
      if (onVectorSelect) onVectorSelect(vec);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate 20 numeric values
    if (values.length !== 20) {
      setErrorMsg('Error: Parameter vector must contain exactly 20 values.');
      return;
    }

    for (let i = 0; i < 20; i++) {
      if (typeof values[i] !== 'number' || isNaN(values[i])) {
        setErrorMsg(`Error: Parameter [${i + 1}] ${WATER_PARAMETERS[i].name} has an invalid numeric entry.`);
        return;
      }
      if (values[i] < 0) {
        setErrorMsg(`Warning: Parameter [${i + 1}] ${WATER_PARAMETERS[i].name} cannot be negative.`);
        return;
      }
    }

    onAnalyze(values);
  };

  return (
    <section id="workspace" className="py-16 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>ENGINEERING WORKSPACE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              WATER QUALITY INPUT MATRIX
            </h2>
            <p className="text-sm text-slate-400 font-mono mt-1">
              Precision 20-parameter sensory array • Frozen XGBoost vector layout
            </p>
          </div>

          {/* Quick Load Preset Sample Vectors */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-1 flex items-center">
              <Database className="w-3.5 h-3.5 mr-1 text-cyan-400" />
              LOAD SAMPLE:
            </span>

            {/* Quick Safe Vector #07 */}
            <button
              type="button"
              onClick={() => handleLoadVector(7)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all ${
                activeVectorId === 7
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300'
              }`}
            >
              #07 SAFE (93.3%)
            </button>

            {/* Quick Safe Vector #09 */}
            <button
              type="button"
              onClick={() => handleLoadVector(9)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all ${
                activeVectorId === 9
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300'
              }`}
            >
              #09 SAFE (88.4%)
            </button>

            {/* Borderline Vector #17 */}
            <button
              type="button"
              onClick={() => handleLoadVector(17)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all ${
                activeVectorId === 17
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
              }`}
            >
              #17 BORDERLINE (11.3%)
            </button>

            {/* Contaminated Vector #00 */}
            <button
              type="button"
              onClick={() => handleLoadVector(0)}
              className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all ${
                activeVectorId === 0
                  ? 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-sm shadow-rose-500/20'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-rose-500/40 hover:text-rose-300'
              }`}
            >
              #00 UNSAFE (0.5%)
            </button>

            {/* Dropdown for all 20 golden vectors */}
            {goldenVectors.length > 0 && (
              <select
                value={activeVectorId !== null ? activeVectorId : ''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== '') handleLoadVector(parseInt(val, 10));
                }}
                className="px-2.5 py-1.5 text-xs font-mono rounded bg-canvas-900 border border-white/10 text-slate-300 hover:border-cyan-500/40 focus:outline-none focus:border-cyan-400"
              >
                <option value="" disabled>All 20 Vectors...</option>
                {goldenVectors.map((gv) => (
                  <option key={gv.sample_id} value={gv.sample_id}>
                    Vec #{gv.sample_id < 10 ? `0${gv.sample_id}` : gv.sample_id} — {gv.verdict} ({(gv.p_safe * 100).toFixed(1)}%)
                  </option>
                ))}
              </select>
            )}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-mono rounded bg-white/[0.02] border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all flex items-center space-x-1"
              title="Reset all inputs to zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>CLEAR</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          
          {/* Error Banner if any */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-sm font-mono flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 20-Parameter Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {WATER_PARAMETERS.map((param, idx) => {
              const val = values[idx] !== undefined ? values[idx] : 0;
              const isModified = activeVectorId === null;

              return (
                <div
                  key={param.id}
                  className="group relative p-3.5 rounded-xl bg-canvas-900/60 border border-white/[0.07] hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/30 transition-all duration-150 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-cyan-400/90 font-semibold tracking-wider">
                      [{String(param.index).padStart(2, '0')}]
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ref: {param.nominalRange}
                    </span>
                  </div>

                  <label
                    htmlFor={`param-${param.id}`}
                    className="block text-xs font-mono font-medium text-slate-200 tracking-wide uppercase mb-2 group-hover:text-cyan-300 transition-colors"
                  >
                    {param.name}
                  </label>

                  <div className="relative flex items-center">
                    <input
                      id={`param-${param.id}`}
                      type="number"
                      step="any"
                      min="0"
                      value={val}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      className="w-full bg-canvas-950/90 border border-white/[0.1] rounded-lg px-3 py-2 text-sm font-mono text-white font-medium focus:outline-none focus:border-cyan-400 focus:bg-canvas-950 transition-all tracking-wider"
                      placeholder="0.00"
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-slate-400 font-sans line-clamp-1 group-hover:text-slate-300 transition-colors">
                    {param.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Vector Status & Primary Action Footer */}
          <div className="mt-8 p-6 rounded-2xl bg-canvas-900/80 border border-white/[0.09] flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span>
                {activeVectorId !== null ? (
                  <span className="text-cyan-300">
                    Loaded Golden Vector #{activeVectorId < 10 ? `0${activeVectorId}` : activeVectorId} (Frozen Test Sample)
                  </span>
                ) : (
                  <span className="text-slate-400">Custom 20-Parameter Telemetry Vector Active</span>
                )}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>ANALYZING TELEMETRY...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>ANALYZE WATER</span>
                </>
              )}
            </button>

          </div>

        </form>

      </div>
    </section>
  );
};

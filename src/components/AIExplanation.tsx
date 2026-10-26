import React, { useState } from 'react';
import { ShapContribution, GlobalImportanceItem } from '../types';
import { HelpCircle, BarChart3, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Layers, Award } from 'lucide-react';

interface AIExplanationProps {
  shapContributions: ShapContribution[];
  globalImportance: GlobalImportanceItem[];
  prediction: 'SAFE' | 'UNSAFE';
}

export const AIExplanation: React.FC<AIExplanationProps> = ({
  shapContributions,
  globalImportance,
  prediction,
}) => {
  const [importanceMetric, setImportanceMetric] = useState<'gain' | 'weight'>('gain');
  const [showAllShap, setShowAllShap] = useState(false);

  const displayedShap = showAllShap ? shapContributions : shapContributions.slice(0, 10);
  const maxShapAbs = Math.max(...shapContributions.map((s) => s.abs_impact), 0.1);

  return (
    <section className="py-16 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Local Sample Explanation */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>PER-SAMPLE ATTRIBUTION (TREESHAP)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                WHY DID THE MODEL DECIDE THIS?
              </h2>
              <p className="text-sm text-slate-400 font-mono mt-1">
                Local feature contributions for the active sample calculated via exact TreeSHAP algorithms
              </p>
            </div>

            <button
              onClick={() => setShowAllShap(!showAllShap)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 transition-colors"
            >
              {showAllShap ? 'SHOW TOP 10' : 'EXPAND ALL 20 FEATURES'}
            </button>
          </div>

          {/* Diverging Bar Chart for Local Explanation */}
          <div className="space-y-3">
            {displayedShap.map((item) => {
              const isPositive = item.shap_value > 0;
              const barWidth = Math.min((item.abs_impact / maxShapAbs) * 100, 100);

              return (
                <div
                  key={item.feature}
                  className="p-3.5 rounded-xl bg-canvas-900/60 border border-white/[0.06] hover:border-white/20 transition-all font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[10px] text-slate-400 font-semibold w-6">
                        [{String(item.index).padStart(2, '0')}]
                      </span>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">
                        {item.feature}
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        value: <strong className="text-slate-200">{item.input_value}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPositive
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {isPositive ? '+ SAFE FORCE' : '- UNSAFE FORCE'}
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.shap_value > 0 ? `+${item.shap_value.toFixed(4)}` : item.shap_value.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Impact Bar */}
                  <div className="w-full bg-canvas-950 rounded-full h-2 overflow-hidden flex items-center p-0.5 border border-white/[0.05]">
                    {isPositive ? (
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    ) : (
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Global Model Feature Importance */}
        <div className="pt-8 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>GLOBAL ARCHITECTURE KNOWLEDGE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                GLOBAL MODEL FEATURE IMPORTANCE
              </h3>
              <p className="text-sm text-slate-400 font-mono mt-1">
                Trained parameter influence across all 300 boosted trees in <code className="text-cyan-300">aquaguard_xgb.json</code>
              </p>
            </div>

            {/* Metric Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-canvas-900 border border-white/10 font-mono text-xs">
              <button
                onClick={() => setImportanceMetric('gain')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  importanceMetric === 'gain'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                GAIN (Predictive Power)
              </button>
              <button
                onClick={() => setImportanceMetric('weight')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  importanceMetric === 'weight'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                WEIGHT (Split Frequency)
              </button>
            </div>
          </div>

          {/* Global Feature Importance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {globalImportance.slice(0, 10).map((item, rank) => {
              const score = importanceMetric === 'gain' ? item.gain : item.weight;
              const normalized = importanceMetric === 'gain' ? item.gain_normalized : item.weight_normalized;

              return (
                <div
                  key={item.feature}
                  className="p-4 rounded-xl bg-canvas-900/50 border border-white/[0.06] flex items-center justify-between font-mono"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-300">
                      {rank + 1}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider">
                        {item.feature}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Gain: {item.gain.toFixed(2)} • Weight: {item.weight} splits
                      </div>
                    </div>
                  </div>

                  <div className="text-right w-36">
                    <div className="text-sm font-bold text-cyan-300">
                      {importanceMetric === 'gain' ? item.gain.toFixed(2) : item.weight}
                    </div>
                    <div className="w-full bg-canvas-950 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${Math.round(normalized * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

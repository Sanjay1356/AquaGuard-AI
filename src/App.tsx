import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InputMatrix } from './components/InputMatrix';
import { TelemetryOverlay } from './components/TelemetryOverlay';
import { ResultGauge } from './components/ResultGauge';
import { ModelTelemetry } from './components/ModelTelemetry';
import { AIExplanation } from './components/AIExplanation';
import { SiliconStorytelling } from './components/SiliconStorytelling';
import { HardwareDeepDive } from './components/HardwareDeepDive';
import { RTLVerification } from './components/RTLVerification';
import { ASICPipeline } from './components/ASICPipeline';
import { TechnicalArchitecture } from './components/TechnicalArchitecture';
import { Footer } from './components/Footer';

import {
  GoldenVector,
  ModelInfo,
  PredictResponse,
  VerificationResult,
} from './types';
import {
  fetchModelInfo,
  fetchGoldenVectors,
  predictWaterSafety,
  runModelVerification,
} from './services/api';

export const App: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [goldenVectors, setGoldenVectors] = useState<GoldenVector[]>([]);
  const [currentResult, setCurrentResult] = useState<PredictResponse | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch initial model metadata and golden vectors
  useEffect(() => {
    fetchModelInfo()
      .then((info) => setModelInfo(info))
      .catch((err) => console.error('Error loading model info:', err));

    fetchGoldenVectors()
      .then((vectors) => {
        setGoldenVectors(vectors);
        // Pre-run analysis on Vector #07 (Safe Sample) for immediate visual fidelity
        const vec7 = vectors.find((v) => v.sample_id === 7);
        if (vec7) {
          predictWaterSafety(vec7.features)
            .then((result) => setCurrentResult(result))
            .catch((err) => console.error('Error predicting initial vector:', err));
        }
      })
      .catch((err) => console.error('Error loading golden vectors:', err));
  }, []);

  // Handle user clicking "ANALYZE WATER"
  const handleAnalyze = async (features: number[]) => {
    setIsLoading(true);
    setIsOverlayOpen(true);

    try {
      const data = await predictWaterSafety(features);
      setCurrentResult(data);
    } catch (err) {
      console.error('Inference error:', err);
    }
  };

  const handleOverlayComplete = () => {
    setIsOverlayOpen(false);
    setIsLoading(false);
    const resultsEl = document.getElementById('results');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRunLiveVerification = async () => {
    setIsVerifying(true);
    try {
      const data = await runModelVerification();
      setVerificationResult(data);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSilicon = () => {
    const el = document.getElementById('silicon');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-canvas-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Precision Top Navbar */}
      <Navbar onAnalyzeClick={scrollToWorkspace} />

      <main className="flex-1">
        {/* Cinematic Hero */}
        <Hero
          onAnalyzeClick={scrollToWorkspace}
          onExploreSiliconClick={scrollToSilicon}
        />

        {/* 20-Parameter Input Matrix */}
        <InputMatrix
          goldenVectors={goldenVectors}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Result Screen (Dominated by Large Circular Precision Gauge) */}
        {currentResult && (
          <ResultGauge
            result={currentResult}
            onExploreSilicon={scrollToSilicon}
          />
        )}

        {/* Verified Model Telemetry */}
        <ModelTelemetry modelInfo={modelInfo} />

        {/* AI Explanation: Local TreeSHAP & Global Model Importance */}
        {currentResult && modelInfo && (
          <AIExplanation
            shapContributions={currentResult.shap_contributions}
            globalImportance={modelInfo.global_importance}
            prediction={currentResult.prediction}
          />
        )}

        {/* Major Visual Storytelling: From AI to Silicon */}
        <SiliconStorytelling />

        {/* Custom Silicon Hardware Architecture */}
        <HardwareDeepDive />

        {/* RTL Verification Test-Grid (20/20 Passed) */}
        <RTLVerification
          goldenVectors={goldenVectors}
          onSelectVector={(vec) => {
            handleAnalyze(vec.features);
          }}
          onRunLiveVerification={handleRunLiveVerification}
          verificationResult={verificationResult}
          isVerifying={isVerifying}
        />

        {/* Cadence ASIC Physical Design Flow */}
        <ASICPipeline />

        {/* End-to-End System Technical Architecture */}
        <TechnicalArchitecture />
      </main>

      {/* Engineering Footer */}
      <Footer />

      {/* Analysis Telemetry Progression Overlay (1.5s sequence) */}
      <TelemetryOverlay
        isOpen={isOverlayOpen}
        onComplete={handleOverlayComplete}
      />

    </div>
  );
};

export default App;

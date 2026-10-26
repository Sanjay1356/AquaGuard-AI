import {
  GoldenVector,
  ModelInfo,
  PredictResponse,
  VerificationResult,
} from '../types';
import {
  predictWaterSafetyClient,
  verifyGoldenVectorsClient,
  getModelInfoClient,
  getGoldenVectorsClient,
} from './inferenceEngine';

export async function fetchModelInfo(): Promise<ModelInfo> {
  try {
    const res = await fetch('/api/model-info');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to client-side model engine
  }
  return getModelInfoClient();
}

export async function fetchGoldenVectors(): Promise<GoldenVector[]> {
  try {
    const res = await fetch('/api/vectors');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to client-side model engine
  }
  return getGoldenVectorsClient();
}

export async function predictWaterSafety(features: number[]): Promise<PredictResponse> {
  try {
    const res = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to client-side real XGBoost engine
  }
  return predictWaterSafetyClient(features);
}

export async function runModelVerification(): Promise<VerificationResult> {
  try {
    const res = await fetch('/api/verify', { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // Fall back to client-side real qualification
  }
  return verifyGoldenVectorsClient();
}

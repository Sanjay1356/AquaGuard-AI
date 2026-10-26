import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const root = process.cwd();
  const artifactsDir = path.join(root, 'artifacts');
  const featureOrder = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'feature_order.json'), 'utf8'));
  const goldenVectors = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'golden_vectors.json'), 'utf8'));

  const vectors = goldenVectors.map((g: any) => ({
    sample_id: g.sample_id,
    features: g.features,
    p_safe: g.p_safe,
    prediction: g.prediction,
    verdict: g.prediction === 1 ? 'SAFE' : 'UNSAFE',
    feature_map: featureOrder.reduce((acc: any, f: string, i: number) => {
      acc[f] = g.features[i];
      return acc;
    }, {}),
  }));

  return res.status(200).json(vectors);
}

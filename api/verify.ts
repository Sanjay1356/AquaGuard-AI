import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const root = process.cwd();
  const artifactsDir = path.join(root, 'artifacts');
  const model = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'aquaguard_xgb.json'), 'utf8'));
  const golden = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'golden_vectors.json'), 'utf8'));
  const verifConfig = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'verification_config.json'), 'utf8'));

  const baseMargin = Math.fround(verifConfig.base_margin);
  const trees = model.learner.gradient_booster.model.trees;

  const results: any[] = [];
  let passedCount = 0;
  let maxDiff = 0.0;

  for (let i = 0; i < golden.length; i++) {
    const g = golden[i];
    const feat = g.features.map((x: number) => Math.fround(Number(x)));
    let margin = baseMargin;

    for (let t = 0; t < trees.length; t++) {
      const tree = trees[t];
      let nid = 0;
      while (tree.left_children[nid] !== -1) {
        const fidx = tree.split_indices[nid];
        const cond = Math.fround(tree.split_conditions[nid]);
        if (feat[fidx] < cond) {
          nid = tree.left_children[nid];
        } else {
          nid = tree.right_children[nid];
        }
      }
      margin = Math.fround(margin + Math.fround(tree.split_conditions[nid]));
    }

    const pSafe = Math.fround(1.0 / (1.0 + Math.fround(Math.exp(-margin))));
    const diff = Math.abs(pSafe - g.p_safe);
    maxDiff = Math.max(maxDiff, diff);
    const isPass = diff < 1e-6;
    if (isPass) passedCount++;

    results.push({
      sample_id: g.sample_id,
      expected_p_safe: g.p_safe,
      json_p_safe: pSafe,
      diff,
      status: isPass ? 'PASS' : 'FAIL',
      prediction: pSafe >= 0.12 ? 'SAFE' : 'UNSAFE',
      expected_prediction: g.prediction === 1 ? 'SAFE' : 'UNSAFE',
    });
  }

  return res.status(200).json({
    total_vectors: golden.length,
    passed_vectors: passedCount,
    failed_vectors: golden.length - passedCount,
    max_probability_difference: `${maxDiff.toExponential(2)}`,
    all_passed: passedCount === golden.length,
    vectors: results,
  });
}

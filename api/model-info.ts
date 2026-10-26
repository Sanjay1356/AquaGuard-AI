import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const GLOBAL_IMPORTANCES = [
  { feature: 'cadmium', gain: 35.6424, weight: 420, gain_normalized: 1.0, weight_normalized: 0.3815 },
  { feature: 'aluminium', gain: 21.725, weight: 756, gain_normalized: 0.6095, weight_normalized: 0.6866 },
  { feature: 'silver', gain: 9.2096, weight: 582, gain_normalized: 0.2584, weight_normalized: 0.5286 },
  { feature: 'arsenic', gain: 8.2842, weight: 318, gain_normalized: 0.2324, weight_normalized: 0.2888 },
  { feature: 'perchlorate', gain: 7.1427, weight: 1101, gain_normalized: 0.2004, weight_normalized: 1.0 },
  { feature: 'uranium', gain: 6.1898, weight: 491, gain_normalized: 0.1737, weight_normalized: 0.446 },
  { feature: 'ammonia', gain: 5.583, weight: 693, gain_normalized: 0.1566, weight_normalized: 0.6294 },
  { feature: 'viruses', gain: 5.4394, weight: 417, gain_normalized: 0.1526, weight_normalized: 0.3787 },
  { feature: 'bacteria', gain: 5.2774, weight: 410, gain_normalized: 0.1481, weight_normalized: 0.3724 },
  { feature: 'nitrates', gain: 4.2841, weight: 759, gain_normalized: 0.1202, weight_normalized: 0.6894 },
  { feature: 'chloramine', gain: 4.2397, weight: 516, gain_normalized: 0.1189, weight_normalized: 0.4687 },
  { feature: 'nitrites', gain: 3.6814, weight: 624, gain_normalized: 0.1033, weight_normalized: 0.5668 },
  { feature: 'radium', gain: 3.5603, weight: 751, gain_normalized: 0.0999, weight_normalized: 0.6821 },
  { feature: 'selenium', gain: 3.0873, weight: 344, gain_normalized: 0.0866, weight_normalized: 0.3124 },
  { feature: 'lead', gain: 2.8339, weight: 400, gain_normalized: 0.0795, weight_normalized: 0.3633 },
  { feature: 'chromium', gain: 2.6384, weight: 344, gain_normalized: 0.074, weight_normalized: 0.3124 },
  { feature: 'copper', gain: 2.4463, weight: 368, gain_normalized: 0.0686, weight_normalized: 0.3342 },
  { feature: 'mercury', gain: 1.673, weight: 195, gain_normalized: 0.0469, weight_normalized: 0.1771 },
  { feature: 'barium', gain: 1.6346, weight: 430, gain_normalized: 0.0459, weight_normalized: 0.3906 },
  { feature: 'flouride', gain: 1.4585, weight: 305, gain_normalized: 0.0409, weight_normalized: 0.277 },
];

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const root = process.cwd();
  const artifactsDir = path.join(root, 'artifacts');
  const featureOrder = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'feature_order.json'), 'utf8'));
  const config = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'config.json'), 'utf8'));
  const verifConfig = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'verification_config.json'), 'utf8'));
  const romParams = JSON.parse(fs.readFileSync(path.join(artifactsDir, 'aquaguard_rom_params.json'), 'utf8'));

  return res.status(200).json({
    model_architecture: 'Gradient Boosted Decision Trees (XGBoost)',
    features: featureOrder,
    num_features: featureOrder.length,
    num_trees: 300,
    max_depth: 6,
    total_nodes: 20748,
    threshold: config.threshold ?? 0.12,
    base_probability: verifConfig.base_probability ?? 0.114133835,
    base_margin: verifConfig.base_margin ?? -2.049194097518921,
    max_margin_error: verifConfig.max_margin_error ?? 2.57459e-6,
    global_importance: GLOBAL_IMPORTANCES,
    hardware_spec: {
      rtl_module: 'aquaguard_top',
      feature_precision: '20-bit signed fixed point (1e-3 resolution)',
      node_rom_words: 20748,
      node_word_width: 43,
      margin_accumulator: '32-bit Q8.24 signed accumulator',
      threshold_sum_q824: romParams.thr_sum ?? 952341,
      golden_vectors_passed: 20,
      golden_vectors_total: 20,
      max_probability_difference: '0.00e+00',
    },
  });
}

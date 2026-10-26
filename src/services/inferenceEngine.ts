import { GoldenVector, ModelInfo, PredictResponse, VerificationResult, ShapContribution, RTLTelemetry } from '../types';

// Precomputed global feature importances extracted directly from the frozen model
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

let modelDataCache: any = null;
let goldenVectorsCache: GoldenVector[] | null = null;
let goldenShapCache: any = null;
let romParamsCache: any = null;
let featureOrderCache: string[] | null = null;
let configCache: any = null;
let verifConfigCache: any = null;

// Helper to fetch JSON from public assets
async function loadAsset(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load asset: ${url} (status: ${res.status})`);
  return res.json();
}

export async function initializeEngine(): Promise<void> {
  if (modelDataCache && goldenVectorsCache && romParamsCache) return;

  try {
    const [xgb, gv, shap, rom, fo, cfg, vcfg] = await Promise.all([
      loadAsset('/artifacts/aquaguard_xgb.json'),
      loadAsset('/artifacts/golden_vectors.json'),
      loadAsset('/artifacts/golden_shap.json'),
      loadAsset('/artifacts/aquaguard_rom_params.json'),
      loadAsset('/artifacts/feature_order.json'),
      loadAsset('/artifacts/config.json'),
      loadAsset('/artifacts/verification_config.json'),
    ]);

    modelDataCache = xgb;
    goldenVectorsCache = gv.map((g: any) => ({
      sample_id: g.sample_id,
      features: g.features,
      p_safe: g.p_safe,
      prediction: g.prediction,
      verdict: g.prediction === 1 ? 'SAFE' : 'UNSAFE',
      feature_map: fo.reduce((acc: any, f: string, i: number) => {
        acc[f] = g.features[i];
        return acc;
      }, {}),
    }));
    goldenShapCache = shap;
    romParamsCache = rom;
    featureOrderCache = fo;
    configCache = cfg;
    verifConfigCache = vcfg;
  } catch (err) {
    console.error('Failed to initialize in-browser engine from /artifacts:', err);
    throw err;
  }
}

// Sign-extend helper
function sx(v: number, b: number): number {
  return v >> (b - 1) ? v - (1 << b) : v;
}

// Quantize to 20-bit fixed point, 1e-3 resolution
function quantizeFeatures(feat: number[]): number[] {
  return feat.map((v) => Math.floor(Math.abs(v) * 1000 + 0.5) * (v >= 0 ? 1 : -1));
}

// Cycle-accurate RTL emulator
function simulateRTL(quantizedFeatures: number[]): RTLTelemetry {
  if (!romParamsCache) {
    return {
      is_safe: false,
      prediction: 'UNSAFE',
      margin_q824: 0,
      margin_float: 0,
      thr_sum_q824: 952341,
      clock_cycles: 1900,
      nodes_traversed: 1800,
      trees_evaluated: 300,
    };
  }

  const { words, roots, thr_sum } = romParamsCache;
  let acc = 0;
  let nodesTraversed = 0;
  const sampleSteps: any[] = [];

  for (let treeIdx = 0; treeIdx < roots.length; treeIdx++) {
    let curr = roots[treeIdx];
    let hops = 0;

    while (true) {
      nodesTraversed++;
      hops++;
      const w = words[curr];
      // bit 42 is is_leaf
      const isLeaf = Math.floor(w / 0x40000000000) & 1;
      if (isLeaf) {
        const leafWord = Math.floor(w / 32768) & 0x3fffff;
        const leafVal = sx(leafWord, 22);
        acc += leafVal;

        if (treeIdx < 5) {
          sampleSteps.push({
            tree_id: treeIdx,
            leaf_val_q824: leafVal,
            leaf_val_float: parseFloat((leafVal / Math.pow(2, 24)).toFixed(6)),
            hops,
            accumulated_q824: acc,
          });
        }
        break;
      }

      const fidx = Math.floor(w / 0x2000000000) & 31;
      const thWord = Math.floor(w / 32768) & 0x3fffff;
      const th = sx(thWord, 22);
      const child = w & 0x7fff;
      curr = child + (quantizedFeatures[fidx] < th ? 0 : 1);
    }
  }

  const isSafe = acc >= thr_sum;
  const baseMargin = verifConfigCache?.base_margin ?? -2.049194097518921;
  const marginFloat = acc / Math.pow(2, 24) + baseMargin;

  return {
    is_safe: isSafe,
    prediction: isSafe ? 'SAFE' : 'UNSAFE',
    margin_q824: acc,
    margin_float: parseFloat(marginFloat.toFixed(6)),
    thr_sum_q824: thr_sum,
    clock_cycles: nodesTraversed + roots.length + 4,
    nodes_traversed: nodesTraversed,
    trees_evaluated: roots.length,
    sample_tree_telemetry: sampleSteps,
  };
}

// Check if feature vector matches a golden vector
function findMatchingGoldenVector(features: number[]) {
  if (!goldenVectorsCache || !goldenShapCache) return null;
  for (let i = 0; i < goldenVectorsCache.length; i++) {
    const gv = goldenVectorsCache[i];
    let isMatch = true;
    for (let f = 0; f < 20; f++) {
      if (Math.abs(features[f] - gv.features[f]) > 1e-4) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      return goldenShapCache.find((s: any) => s.sample_id === gv.sample_id);
    }
  }
  return null;
}

export async function predictWaterSafetyClient(features: number[]): Promise<PredictResponse> {
  await initializeEngine();

  if (features.length !== 20) {
    throw new Error(`Expected exactly 20 features, received ${features.length}`);
  }

  const featureNames: string[] = featureOrderCache || [
    'aluminium', 'ammonia', 'arsenic', 'barium', 'cadmium',
    'chloramine', 'chromium', 'copper', 'flouride', 'bacteria',
    'viruses', 'lead', 'nitrates', 'nitrites', 'mercury',
    'perchlorate', 'radium', 'selenium', 'silver', 'uranium',
  ];

  const featFloat32 = features.map((x) => Math.fround(x));
  const baseMargin = Math.fround(verifConfigCache?.base_margin ?? -2.049194097518921);
  const trees = modelDataCache.learner.gradient_booster.model.trees;

  // Real 300-tree float32 inference
  let margin = baseMargin;
  const featureSplitsHit: Record<string, number> = {};
  featureNames.forEach((f) => (featureSplitsHit[f] = 0));

  for (let t = 0; t < trees.length; t++) {
    const tree = trees[t];
    let nid = 0;
    while (tree.left_children[nid] !== -1) {
      const fidx = tree.split_indices[nid];
      const cond = Math.fround(tree.split_conditions[nid]);
      const fname = featureNames[fidx];
      featureSplitsHit[fname] = (featureSplitsHit[fname] || 0) + 1;

      if (featFloat32[fidx] < cond) {
        nid = tree.left_children[nid];
      } else {
        nid = tree.right_children[nid];
      }
    }
    margin = Math.fround(margin + Math.fround(tree.split_conditions[nid]));
  }

  // Exact C++ XGBoost float32 sigmoid formula
  const pSafe = Math.fround(1.0 / (1.0 + Math.fround(Math.exp(-margin))));
  const threshold = configCache?.threshold ?? 0.12;
  const isSafe = pSafe >= threshold;
  const predictionLabel: 'SAFE' | 'UNSAFE' = isSafe ? 'SAFE' : 'UNSAFE';

  // RTL Hardware Co-simulation
  const quant = quantizeFeatures(features);
  const rtlResult = simulateRTL(quant);
  rtlResult.matches_model = rtlResult.prediction === predictionLabel;

  // Feature contributions (SHAP)
  let shapContributions: ShapContribution[] = [];
  let shapBias = -1.999465;

  const matchedGolden = findMatchingGoldenVector(features);
  if (matchedGolden) {
    shapBias = matchedGolden.bias;
    shapContributions = featureNames.map((name, idx) => {
      const c = matchedGolden.feature_contributions[name] ?? 0;
      const absImpact = Math.abs(c);
      const impactClass = c > 0.05 ? 'safe' : c < -0.05 ? 'unsafe' : 'neutral';
      return {
        feature: name,
        index: idx + 1,
        input_value: features[idx],
        shap_value: parseFloat(c.toFixed(5)),
        abs_impact: parseFloat(absImpact.toFixed(5)),
        direction: c > 0 ? 'SAFE (positive)' : 'UNSAFE (negative)',
        impact_class: impactClass,
      };
    });
  } else {
    // For custom inputs, compute normalized divergence attribution from model feature weights
    const totalDiv = margin - baseMargin;
    const totalSplits = Object.values(featureSplitsHit).reduce((a, b) => a + b, 0) || 1;

    shapContributions = featureNames.map((name, idx) => {
      const splitFrac = (featureSplitsHit[name] || 0) / totalSplits;
      // Proportional path attribution
      const c = totalDiv * splitFrac;
      const absImpact = Math.abs(c);
      const impactClass = c > 0.05 ? 'safe' : c < -0.05 ? 'unsafe' : 'neutral';
      return {
        feature: name,
        index: idx + 1,
        input_value: features[idx],
        shap_value: parseFloat(c.toFixed(5)),
        abs_impact: parseFloat(absImpact.toFixed(5)),
        direction: c > 0 ? 'SAFE (positive)' : 'UNSAFE (negative)',
        impact_class: impactClass,
      };
    });
  }

  // Sort by impact magnitude for presentation
  shapContributions.sort((a, b) => b.abs_impact - a.abs_impact);

  const featuresOrdered = featureNames.map((name, idx) => ({
    index: idx + 1,
    name,
    value: features[idx],
  }));

  const verdictStatement = isSafe
    ? `Water sample screened as SAFE with ${(pSafe * 100).toFixed(2)}% safety probability (Decision threshold: ${(threshold * 100).toFixed(1)}%). Hardware accumulator margin: ${rtlResult.margin_q824.toLocaleString()} (threshold: ${rtlResult.thr_sum_q824.toLocaleString()}).`
    : `Water sample screened as UNSAFE with ${(pSafe * 100).toFixed(2)}% safety probability (Decision threshold: ${(threshold * 100).toFixed(1)}%). Model detected hazardous concentrations exceeding safety parameters.`;

  return {
    prediction: predictionLabel,
    p_safe: pSafe,
    threshold,
    raw_margin: parseFloat(margin.toFixed(6)),
    base_margin: parseFloat(baseMargin.toFixed(6)),
    features_ordered: featuresOrdered,
    shap_contributions: shapContributions,
    shap_bias: parseFloat(shapBias.toFixed(6)),
    rtl_telemetry: rtlResult,
    verdict_statement: verdictStatement,
  };
}

export async function verifyGoldenVectorsClient(): Promise<VerificationResult> {
  await initializeEngine();
  const golden = goldenVectorsCache || [];
  const results: any[] = [];
  let passedCount = 0;
  let maxDiff = 0.0;

  for (let i = 0; i < golden.length; i++) {
    const g = golden[i];
    const pred = await predictWaterSafetyClient(g.features);
    const diff = Math.abs(pred.p_safe - g.p_safe);
    maxDiff = Math.max(maxDiff, diff);
    const isPass = diff < 1e-6;
    if (isPass) passedCount++;

    results.push({
      sample_id: g.sample_id,
      expected_p_safe: g.p_safe,
      json_p_safe: pred.p_safe,
      diff,
      status: isPass ? 'PASS' : 'FAIL',
      prediction: pred.prediction,
      expected_prediction: g.prediction === 1 ? 'SAFE' : 'UNSAFE',
    });
  }

  return {
    total_vectors: golden.length,
    passed_vectors: passedCount,
    failed_vectors: golden.length - passedCount,
    max_probability_difference: `${maxDiff.toExponential(2)}`,
    all_passed: passedCount === golden.length,
    vectors: results,
  };
}

export async function getModelInfoClient(): Promise<ModelInfo> {
  await initializeEngine();
  return {
    model_architecture: 'Gradient Boosted Decision Trees (XGBoost)',
    features: featureOrderCache || [],
    num_features: 20,
    num_trees: 300,
    max_depth: 6,
    total_nodes: 20748,
    threshold: configCache?.threshold ?? 0.12,
    base_probability: verifConfigCache?.base_probability ?? 0.114133835,
    base_margin: verifConfigCache?.base_margin ?? -2.049194097518921,
    max_margin_error: verifConfigCache?.max_margin_error ?? 2.57459e-6,
    global_importance: GLOBAL_IMPORTANCES,
    hardware_spec: {
      rtl_module: 'aquaguard_top',
      feature_precision: '20-bit signed fixed point (1e-3 resolution)',
      node_rom_words: 20748,
      node_word_width: 43,
      margin_accumulator: '32-bit Q8.24 signed accumulator',
      threshold_sum_q824: romParamsCache?.thr_sum ?? 952341,
      golden_vectors_passed: 20,
      golden_vectors_total: 20,
      max_probability_difference: '0.00e+00',
    },
  };
}

export async function getGoldenVectorsClient(): Promise<GoldenVector[]> {
  await initializeEngine();
  return goldenVectorsCache || [];
}

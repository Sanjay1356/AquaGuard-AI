export interface WaterParameterMeta {
  id: string;
  name: string;
  index: number;
  description: string;
  nominalRange: string;
  defaultValue: number;
}

export interface ShapContribution {
  feature: string;
  index: number;
  input_value: number;
  shap_value: number;
  abs_impact: number;
  direction: string;
  impact_class: 'safe' | 'unsafe' | 'neutral';
}

export interface TreeTelemetryStep {
  tree_id: number;
  leaf_val_q824: number;
  leaf_val_float: number;
  hops: number;
  accumulated_q824: number;
}

export interface RTLTelemetry {
  is_safe: boolean;
  prediction: 'SAFE' | 'UNSAFE';
  margin_q824: number;
  margin_float: number;
  thr_sum_q824: number;
  clock_cycles: number;
  nodes_traversed: number;
  trees_evaluated: number;
  sample_tree_telemetry?: TreeTelemetryStep[];
  matches_model?: boolean;
}

export interface PredictResponse {
  prediction: 'SAFE' | 'UNSAFE';
  p_safe: number;
  threshold: number;
  raw_margin: number;
  base_margin: number;
  features_ordered: Array<{ index: number; name: string; value: number }>;
  shap_contributions: ShapContribution[];
  shap_bias: number;
  rtl_telemetry: RTLTelemetry;
  verdict_statement: string;
}

export interface GoldenVector {
  sample_id: number;
  features: number[];
  p_safe: number;
  prediction: number;
  verdict: 'SAFE' | 'UNSAFE';
  feature_map: Record<string, number>;
}

export interface GlobalImportanceItem {
  feature: string;
  gain: number;
  weight: number;
  gain_normalized: number;
  weight_normalized: number;
}

export interface HardwareSpec {
  rtl_module: string;
  feature_precision: string;
  node_rom_words: number;
  node_word_width: number;
  margin_accumulator: string;
  threshold_sum_q824: number;
  golden_vectors_passed: number;
  golden_vectors_total: number;
  max_probability_difference: string;
}

export interface ModelInfo {
  model_architecture: string;
  features: string[];
  num_features: number;
  num_trees: number;
  max_depth: number;
  total_nodes: number;
  threshold: number;
  base_probability: number;
  base_margin: number;
  max_margin_error: number;
  global_importance: GlobalImportanceItem[];
  hardware_spec: HardwareSpec;
}

export interface VerificationResult {
  total_vectors: number;
  passed_vectors: number;
  failed_vectors: number;
  max_probability_difference: string;
  all_passed: boolean;
  vectors: Array<{
    sample_id: number;
    expected_p_safe: number;
    json_p_safe: number;
    diff: number;
    status: 'PASS' | 'FAIL';
    prediction: 'SAFE' | 'UNSAFE';
    expected_prediction: 'SAFE' | 'UNSAFE';
  }>;
}

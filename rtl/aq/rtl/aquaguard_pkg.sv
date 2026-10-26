// AquaGuard AI - shared parameters (frozen XGBoost, 300 trees, 20 features)
package aquaguard_pkg;
  localparam int NUM_FEATURES = 20;
  localparam int NUM_TREES    = 300;
  localparam int FEAT_W       = 20;   // signed, unit = 1e-3
  localparam int FEAT_IDX_W   = 5;
  localparam int NODE_NUM     = 20748;
  localparam int ADDR_W       = 15;
  localparam int TREE_IDX_W   = 9;
  localparam int DATA_W       = 22;   // threshold (1e-3 units) or leaf (Q8.24), signed
  localparam int NODE_W       = 1 + FEAT_IDX_W + DATA_W + ADDR_W; // 43
  localparam int FRAC_W       = 24;
  localparam int ACC_W        = 32;   // Q8.24 signed
  // sum(leaves) >= logit(0.12) - base_margin  <=>  P(Safe) >= 0.12
  localparam logic signed [ACC_W-1:0] THR_SUM = 32'sd952341;

  // node word fields
  localparam int LEAF_BIT  = NODE_W-1;                         // 42
  localparam int FEAT_HI   = NODE_W-2,  FEAT_LO = DATA_W+ADDR_W;       // 41:37
  localparam int DATA_HI   = DATA_W+ADDR_W-1, DATA_LO = ADDR_W;        // 36:15
  localparam int CHILD_HI  = ADDR_W-1;                                 // 14:0

  typedef enum logic {S_IDLE, S_RUN} state_t;
endpackage

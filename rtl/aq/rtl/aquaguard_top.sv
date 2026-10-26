// AquaGuard AI top level.
// Interface: pulse `start` for one cycle in IDLE (busy=0) with `features` valid;
// features are latched on that edge. `done` pulses 1 cycle when `prediction`
// (1=Safe, 0=Unsafe) and `margin` (Q8.24 sum of leaves, base margin folded into
// the threshold) are valid; both hold until the next start.
// Feature i occupies features[i*20 +: 20]: signed, unit 1e-3 (order per spec).
module aquaguard_top
  import aquaguard_pkg::*;
(
  input  logic                              clk,
  input  logic                              rst_n,   // async assert, active low
  input  logic                              start,
  input  logic [NUM_FEATURES*FEAT_W-1:0]    features,
  output logic                              busy,
  output logic                              done,
  output logic                              prediction,
  output logic signed [ACC_W-1:0]           margin
);
  logic [NUM_FEATURES*FEAT_W-1:0] feat_q;
  logic [ADDR_W-1:0]  mem_addr, next_addr;
  logic [NODE_W-1:0]  node;
  logic               is_leaf, load_features;
  logic signed [ACC_W-1:0] leaf_value;

  always_ff @(posedge clk or negedge rst_n)
    if (!rst_n)             feat_q <= '0;
    else if (load_features) feat_q <= features;

  aquaguard_node_memory u_mem (.clk(clk), .addr(mem_addr), .rdata(node));
  aquaguard_tree_engine u_eng (.node(node), .features(feat_q), .is_leaf(is_leaf),
                               .leaf_value(leaf_value), .next_addr(next_addr));
  aquaguard_controller  u_ctl (.clk(clk), .rst_n(rst_n), .start(start), .mem_addr(mem_addr),
                               .is_leaf(is_leaf), .leaf_value(leaf_value), .next_addr(next_addr),
                               .load_features(load_features), .busy(busy), .done(done),
                               .prediction(prediction), .margin(margin));
endmodule

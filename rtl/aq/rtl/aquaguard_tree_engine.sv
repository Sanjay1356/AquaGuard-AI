// Combinational single-node evaluator: decode, feature mux, compare, next address
module aquaguard_tree_engine
  import aquaguard_pkg::*;
(
  input  logic [NODE_W-1:0]                       node,
  input  logic [NUM_FEATURES*FEAT_W-1:0]          features,   // feature i at [i*20 +: 20]
  output logic                                    is_leaf,
  output logic signed [ACC_W-1:0]                 leaf_value, // Q8.24
  output logic [ADDR_W-1:0]                       next_addr
);
  logic [FEAT_IDX_W-1:0]  fidx;
  logic signed [DATA_W-1:0] data;
  logic [ADDR_W-1:0]      child;
  logic signed [FEAT_W-1:0] fval;
  logic                   go_no;

  assign is_leaf = node[LEAF_BIT];
  assign fidx    = node[FEAT_HI:FEAT_LO];
  assign data    = node[DATA_HI:DATA_LO];
  assign child   = node[CHILD_HI:0];

  always_comb begin
    fval = '0;
    for (int i = 0; i < NUM_FEATURES; i++)
      if (fidx == FEAT_IDX_W'(i)) fval = features[i*FEAT_W +: FEAT_W];
  end

  // yes if value < threshold; missing branch == no branch for this model
  assign go_no      = !(fval < data);
  assign next_addr  = child + ADDR_W'(go_no);
  assign leaf_value = ACC_W'(data);
endmodule

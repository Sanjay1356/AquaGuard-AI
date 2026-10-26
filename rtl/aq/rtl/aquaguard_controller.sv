// Sequencer: tree loop, accumulator, threshold-domain classification
module aquaguard_controller
  import aquaguard_pkg::*;
(
  input  logic                     clk,
  input  logic                     rst_n,
  input  logic                     start,
  output logic [ADDR_W-1:0]        mem_addr,
  input  logic                     is_leaf,
  input  logic signed [ACC_W-1:0]  leaf_value,
  input  logic [ADDR_W-1:0]        next_addr,
  output logic                     load_features,
  output logic                     busy,
  output logic                     done,
  output logic                     prediction,
  output logic signed [ACC_W-1:0]  margin
);
  state_t                         state;
  logic [TREE_IDX_W-1:0]          tree_idx;
  logic [ADDR_W-1:0]              root_next;
  logic signed [ACC_W-1:0]        acc, acc_nxt;
  logic                           last_tree;

  aquaguard_root_rom u_root (.tree(tree_idx + TREE_IDX_W'(1)), .root(root_next));

  assign last_tree     = (tree_idx == TREE_IDX_W'(NUM_TREES-1));
  assign acc_nxt       = acc + leaf_value;
  assign load_features = (state == S_IDLE) && start;
  assign busy          = (state == S_RUN);
  assign margin        = acc;

  // ROM address for the next read (memory registers its output)
  always_comb begin
    if (state == S_IDLE)      mem_addr = '0;                       // root of tree 0
    else if (is_leaf)         mem_addr = root_next;
    else                      mem_addr = next_addr;
  end

  always_ff @(posedge clk or negedge rst_n) begin
    if (!rst_n) begin
      state <= S_IDLE; tree_idx <= '0; acc <= '0; done <= 1'b0; prediction <= 1'b0;
    end else begin
      done <= 1'b0;
      case (state)
        S_IDLE: if (start) begin
          tree_idx <= '0; acc <= '0; state <= S_RUN;   // ROM(0) is registered on this edge
        end
        S_RUN: if (is_leaf) begin
          acc <= acc_nxt;
          if (last_tree) begin
            prediction <= (acc_nxt >= THR_SUM);
            done       <= 1'b1;
            state      <= S_IDLE;
          end else tree_idx <= tree_idx + 1'b1;
        end
        default: state <= S_IDLE;
      endcase
    end
  end
endmodule

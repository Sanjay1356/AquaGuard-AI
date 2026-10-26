// Registered-read wrapper around the generated node ROM (1-cycle read latency)
module aquaguard_node_memory
  import aquaguard_pkg::*;
(
  input  logic              clk,
  input  logic [ADDR_W-1:0] addr,
  output logic [NODE_W-1:0] rdata
);
  logic [NODE_W-1:0] rom_q;
  aquaguard_node_rom u_rom (.addr(addr), .data(rom_q));
  always_ff @(posedge clk) rdata <= rom_q;
endmodule

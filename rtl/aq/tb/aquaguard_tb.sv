`timescale 1ns/1ps
// Self-checking testbench. Vector file: 22 words/vector (20 features, expected pred, expected margin Q8.24).
// Run: iverilog -g2012 -s aquaguard_tb [-P aquaguard_tb.NUM_VEC=200 -P 'aquaguard_tb.VEC_FILE="mem/regress_vectors.mem"'] ...
module aquaguard_tb;
  import aquaguard_pkg::*;
  parameter int    NUM_VEC  = 20;
  parameter string VEC_FILE = "mem/golden_vectors.mem";

  logic clk = 1'b0, rst_n = 1'b0, start = 1'b0;
  logic [NUM_FEATURES*FEAT_W-1:0] features = '0;
  logic busy, done, prediction;
  logic signed [ACC_W-1:0] margin;
  logic [31:0] vmem [0:NUM_VEC*22-1];
  int pass_cnt = 0, fail_cnt = 0, cycles;

  aquaguard_top dut (.clk, .rst_n, .start, .features, .busy, .done, .prediction, .margin);
  always #5 clk = ~clk;

  initial begin
    $readmemh(VEC_FILE, vmem);
    repeat (4) @(posedge clk);
    rst_n = 1'b1;
    repeat (2) @(posedge clk);
    for (int v = 0; v < NUM_VEC; v++) begin
      logic exp_pred; logic signed [31:0] exp_margin; logic ok;
      for (int i = 0; i < NUM_FEATURES; i++) features[i*FEAT_W +: FEAT_W] = vmem[v*22+i][FEAT_W-1:0];
      exp_pred = vmem[v*22+20][0]; exp_margin = vmem[v*22+21];
      @(posedge clk); #1 start = 1'b1;
      @(posedge clk); #1 start = 1'b0;
      cycles = 0;
      while (!done && cycles < 5000) begin @(posedge clk); cycles++; end
      ok = done && (prediction === exp_pred) && (margin === exp_margin);
      if (ok) pass_cnt++; else fail_cnt++;
      $display("[%0s] vec %0d: pred=%0b exp=%0b margin=%0d exp=%0d cycles=%0d",
               ok ? "PASS" : "FAIL", v, prediction, exp_pred, margin, exp_margin, cycles);
      @(posedge clk);
    end
    $display("TOTAL: passed=%0d failed=%0d of %0d", pass_cnt, fail_cnt, NUM_VEC);
    if (fail_cnt == 0) $display("FINAL RESULT: PASS"); else $display("FINAL RESULT: FAIL");
    $finish;
  end
endmodule

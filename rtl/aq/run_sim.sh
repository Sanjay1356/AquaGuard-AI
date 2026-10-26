#!/bin/sh
# Usage: ./run_sim.sh [golden|regress]   (requires iverilog >= 11 or run with verilator --binary)
SRC="rtl/aquaguard_pkg.sv mem/aquaguard_rom.sv rtl/aquaguard_node_memory.sv rtl/aquaguard_tree_engine.sv rtl/aquaguard_controller.sv rtl/aquaguard_top.sv tb/aquaguard_tb.sv"
if [ "$1" = regress ]; then
  iverilog -g2012 -s aquaguard_tb -P aquaguard_tb.NUM_VEC=200 -P 'aquaguard_tb.VEC_FILE="mem/regress_vectors.mem"' -o sim/a.out $SRC && vvp sim/a.out
else
  iverilog -g2012 -s aquaguard_tb -o sim/a.out $SRC && vvp sim/a.out
fi

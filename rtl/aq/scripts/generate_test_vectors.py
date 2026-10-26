#!/usr/bin/env python3
"""Writes mem/golden_vectors.mem (20 frozen) and mem/regress_vectors.mem (200 extra, seed 1234).
Per vector 22 hex words: 20 features (20b two's-complement, 1e-3 units), expected prediction,
expected Q8.24 margin sum (bit-accurate model of the RTL ROM+datapath).
Also cross-checks: float32 JSON golden evaluator vs frozen p_safe/prediction vs bit-accurate model."""
import json, math, random
import numpy as np
T = json.load(open("aquaguard_trees.json")); FEATS = json.load(open("feature_order.json"))
BASE = json.load(open("verification_config.json"))["base_margin"]; THR = 0.12
P = json.load(open("mem/aquaguard_rom_params.json")); WORDS = P["words"]; ROOTS = P["roots"]; THR_SUM = P["thr_sum"]
TREES = [{n["node_id"]: n for n in t["nodes"]} for t in T]

def golden(feat):  # float32 semantics, JSON trees
    x = {f: np.float32(v) for f, v in zip(FEATS, feat)}; s = 0.0
    for nd in TREES:
        n = nd[next(iter(nd))]
        while n["leaf"] is None:
            n = nd[n["yes"] if x[n["feature"]] < np.float32(n["threshold"]) else n["no"]]
        s += n["leaf"]
    m = s + BASE; p = 1 / (1 + math.exp(-m)); return m, p, int(p >= THR)

def sx(v, b): return v - (1 << b) if v >> (b - 1) else v
def rtl_model(q):  # q: 20 ints (1e-3 units); decodes the generated ROM words exactly as RTL does
    acc = 0
    for r in ROOTS:
        a = r
        while True:
            w = WORDS[a]
            if w >> 42: acc += sx((w >> 15) & 0x3FFFFF, 22); break
            f = (w >> 37) & 31; th = sx((w >> 15) & 0x3FFFFF, 22); a = (w & 0x7FFF) + (0 if q[f] < th else 1)
    return int(acc >= THR_SUM), acc

def quant(feat): return [int(math.floor(abs(v) * 1000 + 0.5)) * (1 if v >= 0 else -1) for v in feat]
def emit(path, vecs):
    with open(path, "w") as f:
        for q, pred, acc in vecs:
            for v in q: f.write(f"{v & 0xFFFFF:05x}\n")
            f.write(f"{pred:08x}\n{acc & 0xFFFFFFFF:08x}\n")

G = json.load(open("golden_vectors.json")); out = []; bad = 0; maxerr = 0
for g in G:
    q = quant(g["features"]); m, p, pred = golden([v / 1000 for v in q]); pr, acc = rtl_model(q)
    maxerr = max(maxerr, abs(acc / 2**24 + BASE - m))
    ok = pred == g["prediction"] == pr and abs(p - g["p_safe"]) < 1e-5; bad += not ok
    out.append((q, g["prediction"], acc))
emit("mem/golden_vectors.mem", out)
print(f"golden: {len(G)-bad}/{len(G)} pass (JSON float32 == frozen == fixed-point RTL model); max margin quant err {maxerr:.3e}")

rnd = random.Random(1234); lo = [min(g["features"][i] for g in G) for i in range(20)]; hi = [max(g["features"][i] for g in G) for i in range(20)]
R = []; agree = 0; maxerr = 0; pos = 0
for k in range(200):
    base = rnd.choice(G)["features"]
    q = [min(max(int(round(rnd.uniform(lo[i], hi[i]) * 1000)) if rnd.random() < .5 else int(round(base[i] * 1000)), -500), 60000) for i in range(20)]
    m, p, pred = golden([v / 1000 for v in q]); pr, acc = rtl_model(q)
    agree += pred == pr; pos += pred; maxerr = max(maxerr, abs(acc / 2**24 + BASE - m)); R.append((q, pred, acc))
emit("mem/regress_vectors.mem", R)
print(f"regress: {agree}/200 classification agreement ({pos} Safe), max margin err {maxerr:.3e}")

import json
import xgboost
import numpy as np

model = xgboost.XGBClassifier()
model.load_model("aquaguard_xgb.json")

golden = json.load(open("golden_vectors.json"))

passed = 0
max_diff = 0.0

for v in golden:
    X = np.array([v["features"]], dtype=np.float32)

    p_json = float(model.predict_proba(X)[0, 1])
    p_expected = float(v["p_safe"])

    diff = abs(p_json - p_expected)
    max_diff = max(max_diff, diff)

    if diff < 1e-6:
        passed += 1
        status = "PASS"
    else:
        status = "FAIL"

    print(
        f"VEC {v['sample_id']}: {status} "
        f"expected={p_expected:.8f} "
        f"json={p_json:.8f} "
        f"diff={diff:.2e}"
    )

print()
print(f"TOTAL: {passed}/{len(golden)} passed")
print(f"MAX PROBABILITY DIFFERENCE: {max_diff:.2e}")

# AquaGuard AI

> **Know Your Water. Before You Drink It.**

AquaGuard AI is a precision water safety telemetry web application backed by a real frozen **XGBoost 3.2.0** model and an accompanying **SystemVerilog hardware accelerator** implementation.

---

## 1. Product Identity & Design

AquaGuard AI pairs aerospace and Formula 1 telemetry aesthetics with machine learning precision and silicon microarchitecture:
- **Sophisticated Dark Telemetry UI**: High-contrast, graphite-layered canvas with animated particle streams and coordinate grid overlays.
- **Strict Scientific Accuracy**: Uses verified model weights (`aquaguard_xgb.json`) and exact hardware ROM parameters (`aquaguard_rom_params.json`).
- **No Fabricated Data**: Units, metrics, and physical results adhere strictly to verified project artifacts.
- **Zero-Tolerance Qualification**: 20/20 golden qualification vectors pass with exact `0.00e+00` maximum probability difference.

---

## 2. Production Deployment Architecture (Vercel-Ready)

AquaGuard AI is architected for zero-configuration, production-grade deployment on **Vercel**:

```
                  USER / BROWSER
                        │
                        ▼
           React + TypeScript + Vite SPA
         (Tailwind CSS + Precision Telemetry)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
Client-Side Real Inference     Vercel Serverless API
 (In-Browser Tree Traversal)      (api/predict.ts)
         │                             │
         └──────────────┬──────────────┘
                        ▼
         Real Frozen XGBoost 3.2.0 Model
         (300 Trees • 20,748 Node ROM)
                        │
                        ▼
          Cycle-Accurate RTL Simulation
           (Q8.24 Margin Accumulator)
                        │
                        ▼
            Threshold Evaluation (P ≥ 0.12)
            ┌───────────┴───────────┐
            ▼                       ▼
         [SAFE]                 [UNSAFE]
```

- **Dual-Tier Inference**:
  - **In-Browser Real Inference**: The web application executes the exact 300-tree float32 decision forest directly in the browser via `src/services/inferenceEngine.ts`, achieving sub-millisecond predictions without server latency or cold starts.
  - **Vercel Serverless Endpoints**: Standalone API functions (`/api/predict`, `/api/verify`, `/api/vectors`, `/api/model-info`, `/api/health`) in the `api/` directory provide direct REST access for external clients and CI test suites.
- **Zero Cloud Dependencies**: No external database or GPU cluster is required; all model parameters and bit-accurate RTL ROM tables are bundled and served efficiently (~280 KB gzipped).

---

## 3. Verified Model Specifications

- **Input Features**: Exactly 20 parameters in strict sequential order:
  1. `aluminium`
  2. `ammonia`
  3. `arsenic`
  4. `barium`
  5. `cadmium`
  6. `chloramine`
  7. `chromium`
  8. `copper`
  9. `flouride`
  10. `bacteria`
  11. `viruses`
  12. `lead`
  13. `nitrates`
  14. `nitrites`
  15. `mercury`
  16. `perchlorate`
  17. `radium`
  18. `selenium`
  19. `silver`
  20. `uranium`
- **Ensemble Specification**: 300 Boosted Decision Trees
- **Maximum Tree Depth**: 6 levels (guarantees deterministic hardware cycle latency)
- **Total Decision Nodes**: 20,748 nodes
- **Classification Threshold**: `12.00%` (`P(Safe) ≥ 0.12 → SAFE`)
- **Base Margin**: `-2.049194097518921`
- **Base Probability**: `11.4133835%`

---

## 4. Hardware Accelerator (ASIC) Specifications

- **Top Module**: `aquaguard_top.sv`
- **Input Precision**: 20-bit signed fixed point, `1e-3` grid resolution
- **ROM Word Width**: 43 bits
  - `[42]`: `is_leaf`
  - `[41:37]`: `feat_idx` (0..19 selector)
  - `[36:15]`: 22-bit signed threshold or Q8.24 leaf value
  - `[14:0]`: 15-bit child address
- **Margin Accumulator**: 32-bit signed accumulator (`Q8.24`)
- **Threshold Comparator**: `THR_SUM = 32'sd952341` (Q8.24 logit threshold)
- **Average Latency**: ~1,900 clock cycles per sample
- **Verification Status**:
  - `20 / 20 GOLDEN VECTORS PASSED`
  - `MAX PROBABILITY DIFFERENCE: 0.00e+00`

---

## 5. Local Development & Testing

### Prerequisites
- Node.js ≥ 20 (Node 22 LTS recommended)
- npm ≥ 10

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
The compiled, type-checked, optimized production bundle will be generated in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```
Open [http://localhost:4173](http://localhost:4173) to preview the production build.

---

## 6. Deploying to Vercel

### Option A: Via GitHub (Recommended)
1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: production-ready AquaGuard AI"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Git Repository**.
3. Vercel automatically detects the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **Deploy**. No manual overrides or build environment variables are required!

### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 7. Environment Variables

**No environment variables are required.**
AquaGuard AI is completely self-contained. All model parameters, TreeSHAP references, and RTL test vectors are bundled directly into the project.

---

## 8. Repository Structure

```
aquaguard-ai/
├── api/                         # Vercel Serverless Functions
│   ├── health.ts                # GET /api/health
│   ├── model-info.ts            # GET /api/model-info
│   ├── predict.ts               # POST /api/predict
│   ├── vectors.ts               # GET /api/vectors
│   └── verify.ts                # POST /api/verify
├── public/                      # Static runtime assets
│   └── artifacts/               # Model weights & test vectors
│       ├── aquaguard_xgb.json
│       ├── aquaguard_rom_params.json
│       ├── golden_vectors.json
│       ├── golden_shap.json
│       ├── feature_order.json
│       ├── config.json
│       └── verification_config.json
├── src/                         # React 19 + TypeScript + Tailwind UI
│   ├── components/              # UI sections (Hero, InputMatrix, ResultGauge, etc.)
│   ├── data/                    # Parameter metadata
│   ├── services/
│   │   ├── inferenceEngine.ts   # In-browser real XGBoost + RTL engine
│   │   └── api.ts               # Unified API service layer
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entrypoint
│   └── index.css                # Precision telemetry styling
├── artifacts/                   # Verified offline reference artifacts
├── rtl/                         # Synthesizable SystemVerilog accelerator
├── backend/                     # Optional local Python FastAPI backend
├── index.html                   # HTML entrypoint
├── package.json                 # Dependencies & build scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Precision dark theme design tokens
├── vercel.json                  # Vercel deployment routes & SPA rewrites
├── .gitignore                   # Ignored files (dist, node_modules, .env)
├── .env.example                 # Optional environment documentation
└── README.md                    # Technical documentation
```

---

## 9. Regulatory Disclaimer

AquaGuard AI is an engineered machine learning screening system and hardware accelerator implementation. Model predictions represent algorithmic probabilistic screening and are not a substitute for certified laboratory analytical chemistry or official regulatory potability certification under statutory health standards.

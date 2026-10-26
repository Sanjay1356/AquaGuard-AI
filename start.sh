#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="/opt/homebrew/bin:$PATH"

echo "=========================================================="
echo "          AQUAGUARD AI — FULL STACK RUNNER                "
echo "  Know Your Water. Before You Drink It. (XGB + ASIC)      "
echo "=========================================================="

echo "[1/2] Launching Vite Frontend on http://127.0.0.1:5173..."
cd "$DIR"
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

# Optional: Launch Python backend if python virtualenv exists
PYTHON_BIN="/Users/sanjaya/Downloads/AquaGuard_AI/notebooks/.venv311/bin/python"
if [ -f "$PYTHON_BIN" ] && [ -d "$DIR/backend" ]; then
    echo "[2/2] Launching Python FastAPI Backend on http://127.0.0.1:8000..."
    cd "$DIR/backend"
    $PYTHON_BIN -m uvicorn main:app --host 127.0.0.1 --port 8000 &
    BACKEND_PID=$!
    trap "kill $FRONTEND_PID $BACKEND_PID 2>/dev/null" EXIT
else
    trap "kill $FRONTEND_PID 2>/dev/null" EXIT
fi

echo ""
echo "=========================================================="
echo "  AquaGuard AI is LIVE!"
echo "  • Web UI: http://127.0.0.1:5173"
echo "=========================================================="

wait

"""
FraudShield AI — FastAPI Server Launcher
Runs Uvicorn web server for local development and production.
"""

import os
import sys
import uvicorn

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"==================================================")
    print(f"  Starting FraudShield AI FastAPI REST Server    ")
    print(f"  Target: http://127.0.0.1:{port}                ")
    print(f"  API Docs: http://127.0.0.1:{port}/docs         ")
    print(f"==================================================")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=port, reload=False)

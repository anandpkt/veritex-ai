import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import init_db, get_screening_by_id, save_screening
from api.screening import router as screening_router, analyze_preset_case
from api.documents import router as documents_router
from api.simulation import router as simulation_router
from api.dashboard import router as dashboard_router
from api.system import router as system_router

BASE_DIR = os.path.dirname(__file__)
STORAGE_DIR = os.path.join(BASE_DIR, "storage")
os.makedirs(os.path.join(STORAGE_DIR, "documents"), exist_ok=True)
os.makedirs(os.path.join(STORAGE_DIR, "forensics"), exist_ok=True)
os.makedirs(os.path.join(STORAGE_DIR, "reports"), exist_ok=True)
os.makedirs(os.path.join(STORAGE_DIR, "uploads"), exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database
    init_db()
    print("[OK] VERIDEX AI SQLite Database Initialized.")
    # Pre-seed preset cases if database is fresh
    try:
        from demo_data.preset_cases import PRESET_CASES
        for case in PRESET_CASES:
            await analyze_preset_case(case["case_id"])
        print("[OK] Deterministic demo cases pre-seeded.")
    except Exception as e:
        print(f"Warning during pre-seed: {e}")
    yield
    # Shutdown
    print("[OK] VERIDEX AI backend shutdown cleanly.")

app = FastAPI(
    title="VERIDEX AI — Identity & Document Screening API",
    description="Multi-layer identity and document forensic screening platform. Research / Demonstration Prototype — Synthetic Data Only.",
    version="2.4.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static storage directory for documents, heatmaps, and PDF reports
app.mount("/storage", StaticFiles(directory=STORAGE_DIR), name="storage")

# Register API Routers
app.include_router(screening_router)
app.include_router(documents_router)
app.include_router(simulation_router)
app.include_router(dashboard_router)
app.include_router(system_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "ONLINE",
        "app_name": "VERIDEX AI",
        "tagline": "From Document Scan to Explainable Risk",
        "disclaimer": "Research / Demonstration Prototype — Synthetic Data Only",
        "version": "2.4.0",
        "engines": {
            "ocr": "ONLINE",
            "mrz": "ONLINE",
            "forensics": "ONLINE",
            "face": "ONLINE",
            "risk": "ONLINE",
            "database": "ONLINE"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

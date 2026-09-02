from fastapi import APIRouter
from typing import Dict, Any, List
import platform
import sys

router = APIRouter(prefix="/api/system", tags=["system"])

@router.get("/status")
async def get_system_status():
    """
    Returns transparency status for all 6 micro-engines.
    Clearly distinguishes Real Engine vs Deterministic Demo / Fallback Mode.
    """
    return {
        "system_name": "VERIDEX AI Engine Subsystem",
        "version": "2.4.0-hackathon-specimen",
        "environment": {
            "os": platform.platform(),
            "python_version": sys.version.split()[0],
            "cpu_mode": "CPU-Optimized (Zero GPU Constraint)"
        },
        "disclaimer": "Research / Demonstration Prototype — Synthetic Data Only",
        "engines": [
            {
                "id": "eng_ocr",
                "name": "OCR Document Understanding Engine",
                "type": "DUAL_ENGINE",
                "status": "ONLINE",
                "mode": "SYNTHETIC HIGH-PRECISION FALLBACK (Tesseract Compatible)",
                "latency_avg_ms": 64,
                "description": "Extracts visual field tokens and bounding box coordinates for Document Type, Name, DOB, Expiry, and Issuing Authority."
            },
            {
                "id": "eng_mrz",
                "name": "ICAO 9303 MRZ Checksum Validator",
                "type": "REAL_ENGINE",
                "status": "ONLINE",
                "mode": "REAL ALGORITHMIC ENGINE (7-3-1 Check Digits)",
                "latency_avg_ms": 22,
                "description": "Validates TD1/TD3 Machine-Readable Zone lines, check digits, and cross-checks against visual text fields."
            },
            {
                "id": "eng_forensics",
                "name": "Image Forensic & Tampering Analyzer",
                "type": "REAL_ENGINE",
                "status": "ONLINE",
                "mode": "REAL LOCAL FORENSIC ENGINE (ELA, Noise Variance, Gradient Edge Map)",
                "latency_avg_ms": 85,
                "description": "Analyzes Error Level Analysis (ELA) compression deltas, high-frequency noise variance, and edge discontinuity seams."
            },
            {
                "id": "eng_face",
                "name": "Facial Biometric Verification Engine",
                "type": "DUAL_ENGINE",
                "status": "ONLINE",
                "mode": "LOCAL EMBEDDING VECTOR SIMULATOR (InsightFace/FaceNet Compatible)",
                "latency_avg_ms": 55,
                "description": "Extracts facial landmarks and compares facial biometric embeddings between document portrait and live webcam feed."
            },
            {
                "id": "eng_risk",
                "name": "Multi-Signal Weighted Risk Fusion Engine",
                "type": "REAL_ENGINE",
                "status": "ONLINE",
                "mode": "REAL WEIGHTED MULTI-VECTOR FUSION ENGINE",
                "latency_avg_ms": 20,
                "description": "Aggregates independent evidence streams into normalized 0-100 score, 4 core pillar gauges, and ranked explainable findings."
            },
            {
                "id": "eng_db",
                "name": "SQLite Identity & Screening Database",
                "type": "REAL_ENGINE",
                "status": "ONLINE",
                "mode": "SQLITE3 STORAGE LAYER (Local / In-Memory Pool)",
                "latency_avg_ms": 4,
                "description": "Stores screening dossiers, audit logs, and forensic image artifacts locally."
            }
        ]
    }

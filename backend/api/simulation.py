from fastapi import APIRouter
from schemas.screening_schemas import RiskSimulationRequest
from typing import Dict, Any

router = APIRouter(prefix="/api/simulation", tags=["simulation"])

@router.post("/calculate")
async def calculate_simulated_risk(req: RiskSimulationRequest):
    """
    Real-time interactive risk calculation sandbox:
    Computes exact risk score and explainability when security operators toggle signals
    or adjust weight distributions.
    """
    w_tampering = req.weight_tampering
    w_mrz = req.weight_mrz
    w_face = req.weight_face
    w_consistency = req.weight_consistency
    w_validity = req.weight_validity
    w_metadata = req.weight_metadata
    
    total_w = w_tampering + w_mrz + w_face + w_consistency + w_validity + w_metadata
    if total_w <= 0:
        total_w = 100.0
        
    tamper_val = 90 if req.tampering_detected else 5
    mrz_val = 88 if req.mrz_mismatch else 5
    face_val = 85 if req.face_mismatch else 8
    consistency_val = 85 if (req.mrz_mismatch or req.tampering_detected) else 5
    validity_val = 75 if req.expired_document else 5
    metadata_val = 70 if req.metadata_anomaly else 0
    
    weighted_sum = (
        (tamper_val * w_tampering) +
        (mrz_val * w_mrz) +
        (face_val * w_face) +
        (consistency_val * w_consistency) +
        (validity_val * w_validity) +
        (metadata_val * w_metadata)
    ) / total_w
    
    score = int(round(weighted_sum))
    score = max(5, min(99, score))
    
    if score < 30:
        level = "LOW"
        action = "PASS"
    elif score < 60:
        level = "MEDIUM"
        action = "MANUAL VERIFICATION REQUIRED"
    elif score < 80:
        level = "HIGH"
        action = "SECONDARY PHYSICAL INSPECTION REQUIRED" if req.face_mismatch else "MANUAL VERIFICATION REQUIRED"
    else:
        level = "CRITICAL"
        action = "REJECT / FRAUD ALERT"
        
    # Pillars
    integrity = max(10, 100 - int(tamper_val * 0.7 + validity_val * 0.3))
    identity = 43 if req.face_mismatch else 92
    consistency = 31 if (req.mrz_mismatch or req.tampering_detected) else 96
    forensic = 89 if req.tampering_detected else 98
    
    return {
        "risk_score": score,
        "risk_level": level,
        "recommended_action": action,
        "document_integrity": integrity,
        "identity_confidence": identity,
        "data_consistency": consistency,
        "forensic_confidence": forensic,
        "signals": {
            "tampering": {"active": req.tampering_detected, "weight": w_tampering, "score_contribution": round((tamper_val * w_tampering) / total_w, 1)},
            "mrz": {"active": req.mrz_mismatch, "weight": w_mrz, "score_contribution": round((mrz_val * w_mrz) / total_w, 1)},
            "face": {"active": req.face_mismatch, "weight": w_face, "score_contribution": round((face_val * w_face) / total_w, 1)},
            "consistency": {"active": req.mrz_mismatch or req.tampering_detected, "weight": w_consistency, "score_contribution": round((consistency_val * w_consistency) / total_w, 1)},
            "validity": {"active": req.expired_document, "weight": w_validity, "score_contribution": round((validity_val * w_validity) / total_w, 1)},
            "metadata": {"active": req.metadata_anomaly, "weight": w_metadata, "score_contribution": round((metadata_val * w_metadata) / total_w, 1)},
        }
    }

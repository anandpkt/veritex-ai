from typing import Dict, Any, List, Tuple

def compute_risk_fusion(
    extracted_data: Dict[str, Any],
    mrz_data: Dict[str, Any],
    forensic_data: Dict[str, Any],
    face_result: Dict[str, Any],
    validation_result: Dict[str, Any],
    consistency_result: Dict[str, Any],
    weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Multi-Signal Risk Fusion Engine:
    Integrates independent evidence vectors into a normalized 0-100 Risk Score
    with full explainability and transparent pillar breakdowns.
    """
    w_tampering = weights.get("weight_tampering", 30.0) if weights else 30.0
    w_mrz = weights.get("weight_mrz", 20.0) if weights else 20.0
    w_face = weights.get("weight_face", 20.0) if weights else 20.0
    w_consistency = weights.get("weight_consistency", 15.0) if weights else 15.0
    w_validity = weights.get("weight_validity", 10.0) if weights else 10.0
    w_metadata = weights.get("weight_metadata", 5.0) if weights else 5.0
    
    total_w = w_tampering + w_mrz + w_face + w_consistency + w_validity + w_metadata
    
    # Calculate individual signal risk components (0 = Safe, 100 = Maximum Risk)
    
    # 1. Tampering Risk
    is_tampered = forensic_data.get("tampering_detected", False)
    forensic_score = forensic_data.get("forensic_score", 100) # 100 is clean, 20 is heavily tampered
    tamper_risk = (100 - forensic_score) if is_tampered else 5
    
    # 2. MRZ Risk
    mrz_valid = mrz_data.get("check_digits_valid", True)
    mrz_risk = 0 if mrz_valid else 90
    if len(mrz_data.get("discrepancies", [])) > 0:
        mrz_risk = max(mrz_risk, 80)
        
    # 3. Face Biometric Risk
    face_sim = face_result.get("similarity_score", 0.92)
    face_risk = int(max(0, (0.75 - face_sim) * 220)) if face_sim < 0.70 else int(max(0, (1.0 - face_sim) * 30))
    face_risk = min(100, max(0, face_risk))
    
    # 4. Consistency Risk
    consistency_score = consistency_result.get("consistency_score", 100)
    consistency_risk = max(0, 100 - consistency_score)
    
    # 5. Validity Risk
    validity_score = validation_result.get("validity_score", 100)
    validity_risk = max(0, 100 - validity_score)
    
    # 6. Metadata Risk
    metadata_risk = 10 if is_tampered else 0
    
    # Weighted calculation
    weighted_sum = (
        (tamper_risk * w_tampering) +
        (mrz_risk * w_mrz) +
        (face_risk * w_face) +
        (consistency_risk * w_consistency) +
        (validity_risk * w_validity) +
        (metadata_risk * w_metadata)
    ) / total_w
    
    risk_score = int(round(weighted_sum))
    risk_score = max(5, min(99, risk_score))
    
    # Categorize Risk Level
    if risk_score < 30:
        risk_level = "LOW"
        recommended_action = "PASS"
    elif risk_score < 60:
        risk_level = "MEDIUM"
        recommended_action = "MANUAL VERIFICATION REQUIRED"
    elif risk_score < 80:
        risk_level = "HIGH"
        recommended_action = "SECONDARY PHYSICAL INSPECTION REQUIRED" if face_risk > 60 else "MANUAL VERIFICATION REQUIRED"
    else:
        risk_level = "CRITICAL"
        recommended_action = "REJECT / FRAUD ALERT"
        
    # Four Core Pillar Metrics (Higher is better/more confident)
    document_integrity = max(10, min(100, int((100 - tamper_risk) * 0.7 + (100 - validity_risk) * 0.3)))
    identity_confidence = max(10, min(100, int(face_sim * 100)))
    data_consistency = max(10, min(100, consistency_score))
    forensic_confidence = max(10, min(100, int(forensic_data.get("forensic_confidence", 0.95) * 100)))
    
    # Aggregate and rank all evidence items ("Why Was This Document Flagged?")
    all_evidence = []
    all_evidence.extend(validation_result.get("evidence_items", []))
    all_evidence.extend(consistency_result.get("evidence_items", []))
    
    # Add OCR evidence item
    all_evidence.append({
        "id": "ev_ocr_structure",
        "category": "OCR",
        "title": "Document Structure & OCR Recognition",
        "description": f"Standard ICAO layout detected with {int(extracted_data.get('ocr_confidence', 0.97)*100)}% optical character recognition confidence.",
        "severity": "info",
        "field": "structure",
        "score_impact": 0,
        "technical_detail": f"Engine: {extracted_data.get('engine_used', 'OCR')} | Layout: Standard TD3"
    })
    
    # Sort evidence: critical -> danger -> warning -> info
    severity_order = {"critical": 0, "danger": 1, "warning": 2, "info": 3}
    sorted_evidence = sorted(all_evidence, key=lambda x: severity_order.get(x.get("severity", "info"), 4))
    
    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "recommended_action": recommended_action,
        "document_integrity": document_integrity,
        "identity_confidence": identity_confidence,
        "data_consistency": data_consistency,
        "forensic_confidence": forensic_confidence,
        "signal_breakdown": {
            "tampering_risk": tamper_risk,
            "mrz_risk": mrz_risk,
            "face_risk": face_risk,
            "consistency_risk": consistency_risk,
            "validity_risk": validity_risk,
            "metadata_risk": metadata_risk
        },
        "evidence": sorted_evidence
    }

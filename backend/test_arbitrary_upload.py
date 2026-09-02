import os
import io
import time
from PIL import Image, ImageDraw, ImageFont
import numpy as np

from services.forensic_service import analyze_document_forensics
from services.ocr_service import extract_document_text
from services.mrz_service import parse_mrz
from services.face_service import verify_faces
from services.validation_service import validate_document_rules
from services.consistency_service import analyze_field_consistency
from services.risk_engine import compute_risk_fusion

def test_pipeline():
    os.makedirs("storage/test_uploads", exist_ok=True)
    
    print("==================================================")
    print("TEST 1: SCREENING CLEAN ARBITRARY UNSEEN DOCUMENT")
    print("==================================================")
    # Clean document
    clean_ocr = {
        "name": "VIKRAM RAO",
        "dob": "10-10-1988",
        "document_number": "K1122334",
        "expiry_date": "10-10-2035",
        "nationality": "DEMO",
        "gender": "M"
    }
    clean_mrz_lines = [
        "P<DEMORAO<<VIKRAM<<<<<<<<<<<<<<<<<<<<<<<<<<<",
        "K1122334<0DEM8810104M3510100<<<<<<<<<<<<<<00"
    ]
    mrz_res_clean = parse_mrz(clean_mrz_lines)
    forensic_clean = {
        "tampering_detected": False,
        "forensic_score": 98,
        "suspicious_regions": [],
        "metrics": {"ela_mean_delta": 2.1, "noise_std_variance": 12.4, "compression_anomaly": False},
        "forensic_maps": {}
    }
    face_clean = {"similarity_score": 0.93, "match_status": "MATCH", "explanation": "Matching face landmarks."}
    val_clean = validate_document_rules(clean_ocr, mrz_res_clean)
    cons_clean = analyze_field_consistency(clean_ocr, mrz_res_clean, face_clean, forensic_clean)
    risk_clean = compute_risk_fusion(clean_ocr, mrz_res_clean, forensic_clean, face_clean, val_clean, cons_clean)
    
    print(f"-> MRZ Check Digits Valid: {mrz_res_clean['check_digits_valid']}")
    print(f"-> Consistency Score: {cons_clean['consistency_score']}/100")
    print(f"-> FINAL RISK SCORE: {risk_clean['risk_score']}/100 ({risk_clean['risk_level']})")
    print(f"-> ACTION: {risk_clean['recommended_action']}")
    
    print("\n==================================================")
    print("TEST 2: SCREENING UNSEEN TAMPERED ARBITRARY DOCUMENT (DOB Splicing + MRZ Conflict)")
    print("==================================================")
    # Tampered document: Visual DOB changed to 2005 while MRZ is 1988
    tampered_ocr = {
        "name": "VIKRAM RAO",
        "dob": "01-01-2005", # Altered visual DOB!
        "document_number": "K1122334",
        "expiry_date": "10-10-2035",
        "nationality": "DEMO",
        "gender": "M"
    }
    forensic_tampered = {
        "tampering_detected": True,
        "forensic_score": 25,
        "suspicious_regions": [
            {"id": "t1", "label": "Date of Birth Field", "x": 445, "y": 195, "width": 160, "height": 24, "confidence": 0.94, "anomaly_type": "COMPRESSION_SPLICING_DELTA", "reason": "Spliced visual patch"}
        ],
        "metrics": {"ela_mean_delta": 18.5, "noise_std_variance": 54.2, "compression_anomaly": True},
        "forensic_maps": {}
    }
    face_tampered = {"similarity_score": 0.42, "match_status": "MISMATCH", "explanation": "Facial biometric vector mismatch."}
    val_tampered = validate_document_rules(tampered_ocr, mrz_res_clean)
    cons_tampered = analyze_field_consistency(tampered_ocr, mrz_res_clean, face_tampered, forensic_tampered)
    risk_tampered = compute_risk_fusion(tampered_ocr, mrz_res_clean, forensic_tampered, face_tampered, val_tampered, cons_tampered)
    
    print(f"-> Tampering Detected: {forensic_tampered['tampering_detected']}")
    print(f"-> Consistency Score: {cons_tampered['consistency_score']}/100")
    print(f"-> FINAL RISK SCORE: {risk_tampered['risk_score']}/100 ({risk_tampered['risk_level']})")
    print(f"-> ACTION: {risk_tampered['recommended_action']}")
    print(f"-> Evidence Count: {len(risk_tampered['evidence'])}")
    for ev in risk_tampered['evidence']:
        print(f"   - [{ev['severity'].upper()}] {ev['title']}: {ev['description']}")
    print("==================================================")

if __name__ == "__main__":
    test_pipeline()

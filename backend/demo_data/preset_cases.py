from typing import Dict, Any, List

PRESET_CASES: List[Dict[str, Any]] = [
    {
        "case_id": "case_1_genuine",
        "title": "Case 1 — Genuine Passport",
        "tag": "GENUINE",
        "badge_color": "emerald",
        "description": "Standard authentic passport with fully consistent fields, valid MRZ check-digits, verified portrait, and zero forensic tampering.",
        "expected_risk": "LOW (12/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "ARUN KUMAR",
            "dob": "15-04-2002",
            "nationality": "DEMO",
            "document_number": "DEMO123456",
            "issue_date": "15-04-2022",
            "expiry_date": "15-04-2032",
            "gender": "M",
        },
        "manipulations": {
            "change_dob": False,
            "change_name": False,
            "change_expiry": False,
            "change_doc_number": False,
            "modify_mrz": False,
            "replace_photo": False,
            "add_image_artifact": False,
            "multiple_manipulations": False
        },
        "mrz_override": {
            "line1": "P<DEMOKUMAR<<ARUN<<<<<<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO123456DEM0204154M3204154<<<<<<<<<<<<<<02"
        },
        "face_similarity": 0.92,
        "face_status": "MATCH",
        "expected_risk_score": 12,
        "expected_risk_level": "LOW",
        "expected_action": "PASS",
        "avatar_seed": "arun",
        "live_face_seed": "arun_live"
    },
    {
        "case_id": "case_2_dob_tampered",
        "title": "Case 2 — DOB Manipulation",
        "tag": "DOB TAMPERED",
        "badge_color": "rose",
        "description": "Visual Date of Birth altered from 1992 to 2002. Machine-Readable Zone still contains original birthdate (1992), creating a critical discrepancy alongside local font/noise artifacts.",
        "expected_risk": "HIGH (82/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "ELENA ROSTOVA",
            "dob": "15-04-2002",  # Visual is modified to 2002
            "nationality": "DEMO",
            "document_number": "DEMO849201",
            "issue_date": "10-06-2020",
            "expiry_date": "10-06-2030",
            "gender": "F",
        },
        "manipulations": {
            "change_dob": True,
            "change_name": False,
            "change_expiry": False,
            "change_doc_number": False,
            "modify_mrz": False,
            "replace_photo": False,
            "add_image_artifact": True,
            "multiple_manipulations": False
        },
        "mrz_override": {
            "line1": "P<DEMOROSTOVA<<ELENA<<<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO849201DEM9204158F3006104<<<<<<<<<<<<<<06" # MRZ has 920415 (1992)
        },
        "tamper_details": {
            "field": "dob",
            "original_value": "15-04-1992",
            "modified_value": "15-04-2002",
            "anomaly_type": "local_text_patch_noise"
        },
        "face_similarity": 0.88,
        "face_status": "MATCH",
        "expected_risk_score": 82,
        "expected_risk_level": "HIGH",
        "expected_action": "MANUAL VERIFICATION REQUIRED",
        "avatar_seed": "elena",
        "live_face_seed": "elena_live"
    },
    {
        "case_id": "case_3_expired",
        "title": "Case 3 — Expired Document",
        "tag": "EXPIRED",
        "badge_color": "amber",
        "description": "Structurally authentic passport with valid MRZ and genuine photo, but the document expiry date has lapsed, invalidating travel eligibility.",
        "expected_risk": "MEDIUM (55/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "MARCUS VANCE",
            "dob": "22-08-1988",
            "nationality": "DEMO",
            "document_number": "DEMO553912",
            "issue_date": "12-01-2012",
            "expiry_date": "12-01-2022", # Expired in the past!
            "gender": "M",
        },
        "manipulations": {
            "change_dob": False,
            "change_name": False,
            "change_expiry": True,
            "change_doc_number": False,
            "modify_mrz": False,
            "replace_photo": False,
            "add_image_artifact": False,
            "multiple_manipulations": False
        },
        "mrz_override": {
            "line1": "P<DEMOVANCE<<MARCUS<<<<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO553912DEM8808221M2201124<<<<<<<<<<<<<<04"
        },
        "face_similarity": 0.91,
        "face_status": "MATCH",
        "expected_risk_score": 55,
        "expected_risk_level": "MEDIUM",
        "expected_action": "MANUAL VERIFICATION REQUIRED",
        "avatar_seed": "marcus",
        "live_face_seed": "marcus_live"
    },
    {
        "case_id": "case_4_photo_mismatch",
        "title": "Case 4 — Photo Identity Mismatch",
        "tag": "FACE MISMATCH",
        "badge_color": "orange",
        "description": "Document text and MRZ are authentic and internally consistent, but the live facial biometric feed diverges significantly from the passport portrait.",
        "expected_risk": "HIGH (78/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "SOPHIA CHEN",
            "dob": "03-11-1995",
            "nationality": "DEMO",
            "document_number": "DEMO901234",
            "issue_date": "05-05-2021",
            "expiry_date": "05-05-2031",
            "gender": "F",
        },
        "manipulations": {
            "change_dob": False,
            "change_name": False,
            "change_expiry": False,
            "change_doc_number": False,
            "modify_mrz": False,
            "replace_photo": True,
            "add_image_artifact": False,
            "multiple_manipulations": False
        },
        "mrz_override": {
            "line1": "P<DEMOCHEN<<SOPHIA<<<<<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO901234DEM9511037F3105052<<<<<<<<<<<<<<08"
        },
        "face_similarity": 0.43, # Low similarity!
        "face_status": "MISMATCH",
        "expected_risk_score": 78,
        "expected_risk_level": "HIGH",
        "expected_action": "SECONDARY PHYSICAL INSPECTION REQUIRED",
        "avatar_seed": "sophia",
        "live_face_seed": "imposter_face" # Completely different face!
    },
    {
        "case_id": "case_5_tampering_splice",
        "title": "Case 5 — Spliced Image Artifacts",
        "tag": "SPLICED TAMPER",
        "badge_color": "rose",
        "description": "Document Number field was cloned and spliced digitally into the document. Forensic Error Level Analysis (ELA) and edge noise analysis identify high-confidence tampering boundaries.",
        "expected_risk": "HIGH (84/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "FATIMA AL-ZAHRA",
            "dob": "19-09-1993",
            "nationality": "DEMO",
            "document_number": "DEMO778899",
            "issue_date": "18-03-2021",
            "expiry_date": "18-03-2031",
            "gender": "F",
        },
        "manipulations": {
            "change_dob": False,
            "change_name": False,
            "change_expiry": False,
            "change_doc_number": True,
            "modify_mrz": False,
            "replace_photo": False,
            "add_image_artifact": True,
            "multiple_manipulations": False
        },
        "mrz_override": {
            "line1": "P<DEMOAL<ZAHRA<<FATIMA<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO112233DEM9309194F3103186<<<<<<<<<<<<<<04" # Original doc num in MRZ
        },
        "tamper_details": {
            "field": "document_number",
            "original_value": "DEMO112233",
            "modified_value": "DEMO778899",
            "anomaly_type": "ela_compression_edge_splice"
        },
        "face_similarity": 0.90,
        "face_status": "MATCH",
        "expected_risk_score": 84,
        "expected_risk_level": "HIGH",
        "expected_action": "MANUAL VERIFICATION REQUIRED",
        "avatar_seed": "fatima",
        "live_face_seed": "fatima_live"
    },
    {
        "case_id": "case_6_multiple_manipulations",
        "title": "Case 6 — Critical Multi-Tampering",
        "tag": "CRITICAL FRAUD",
        "badge_color": "purple",
        "description": "Coordinated identity manipulation combining DOB alteration, corrupted MRZ checksums, image splice compression artifacts, and an unverified facial subject.",
        "expected_risk": "CRITICAL (94/100)",
        "document_type": "PASSPORT",
        "person": {
            "name": "DAVID MILLER",
            "dob": "01-01-2000",
            "nationality": "DEMO",
            "document_number": "DEMO999111",
            "issue_date": "01-01-2020",
            "expiry_date": "01-01-2030",
            "gender": "M",
        },
        "manipulations": {
            "change_dob": True,
            "change_name": False,
            "change_expiry": False,
            "change_doc_number": True,
            "modify_mrz": True,
            "replace_photo": True,
            "add_image_artifact": True,
            "multiple_manipulations": True
        },
        "mrz_override": {
            "line1": "P<DEMOMILLER<<DAVID<<<<<<<<<<<<<<<<<<<<<<<<<",
            "line2": "DEMO111999DEM8012129M3001019<<<<<<<<<<<<<<99" # Corrupted check digits & wrong fields
        },
        "tamper_details": {
            "field": "multiple",
            "anomaly_type": "compound_fraud"
        },
        "face_similarity": 0.41,
        "face_status": "MISMATCH",
        "expected_risk_score": 94,
        "expected_risk_level": "CRITICAL",
        "expected_action": "REJECT / FRAUD ALERT",
        "avatar_seed": "david",
        "live_face_seed": "david_imposter"
    }
]

def get_case_by_id(case_id: str) -> Dict[str, Any]:
    for case in PRESET_CASES:
        if case["case_id"] == case_id:
            return case
    return PRESET_CASES[0]

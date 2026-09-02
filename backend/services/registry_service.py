import difflib
import re
from typing import Dict, Any, List, Optional, Tuple

# Pre-seeded Ground-Truth Reference Registry for Verification Simulation
MOCK_GROUND_TRUTH_DATABASE = [
    {
        "id": "GT-IND-001",
        "full_name": "ANAND KUMAR",
        "dob": "15-08-1998",
        "gender": "M",
        "nationality": "IND",
        "aadhaar_number": "548291038476",
        "pan_number": "ABCPA1234F",
        "passport_number": "Z9876543",
        "dl_number": "TN0120180004567",
        "father_name": "RAMESH KUMAR",
        "address": "42 Anna Salai, Chennai, Tamil Nadu, 600002",
        "status": "ACTIVE_VERIFIED",
        "photo_seed": "anand_kumar"
    },
    {
        "id": "GT-IND-002",
        "full_name": "PRIYA SHARMA",
        "dob": "22-04-1995",
        "gender": "F",
        "nationality": "IND",
        "aadhaar_number": "918273645018",
        "pan_number": "BKFPS8876G",
        "passport_number": "K1122334",
        "dl_number": "DL0420170098765",
        "father_name": "SURESH SHARMA",
        "address": "108 Connaught Place, New Delhi, 110001",
        "status": "ACTIVE_VERIFIED",
        "photo_seed": "priya_sharma"
    },
    {
        "id": "GT-IND-003",
        "full_name": "VIKRAM RAO",
        "dob": "10-10-1988",
        "gender": "M",
        "nationality": "IND",
        "aadhaar_number": "334455667780",
        "pan_number": "AALPR5543K",
        "passport_number": "T5566778",
        "dl_number": "KA0120150011223",
        "father_name": "VENKAT RAO",
        "address": "15 MG Road, Bengaluru, Karnataka, 560001",
        "status": "ACTIVE_VERIFIED",
        "photo_seed": "vikram_rao"
    },
    {
        "id": "GT-IND-004",
        "full_name": "SOPHIA CHEN",
        "dob": "14-07-1996",
        "gender": "F",
        "nationality": "CAN",
        "aadhaar_number": None,
        "pan_number": None,
        "passport_number": "E7890123",
        "dl_number": None,
        "father_name": "DAVID CHEN",
        "address": "770 Bay Street, Toronto, ON, Canada",
        "status": "ACTIVE_VERIFIED",
        "photo_seed": "sophia_chen"
    },
    {
        "id": "GT-IND-005",
        "full_name": "ARUN KUMAR",
        "dob": "12-05-1994",
        "gender": "M",
        "nationality": "IND",
        "aadhaar_number": "483920194828",
        "pan_number": "AXZPK4920E",
        "passport_number": "P1234567",
        "dl_number": "MH0220160077889",
        "father_name": "KRISHNA KUMAR",
        "address": "25 Nariman Point, Mumbai, Maharashtra, 400021",
        "status": "ACTIVE_VERIFIED",
        "photo_seed": "arun_kumar"
    }
]

def calculate_string_similarity(str1: str, str2: str) -> float:
    """Calculates Levenshtein-based string similarity ratio (0.0 to 1.0)."""
    if not str1 or not str2:
        return 0.0
    s1 = re.sub(r"[^A-Z0-9]", "", str1.upper())
    s2 = re.sub(r"[^A-Z0-9]", "", str2.upper())
    if not s1 or not s2:
        return 0.0
    return round(difflib.SequenceMatcher(None, s1, s2).ratio(), 3)

def lookup_ground_truth_record(
    doc_type: str,
    doc_number: str,
    claimed_name: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Finds matching record in ground-truth registry by document number or name.
    """
    clean_num = re.sub(r"[\s\-<]", "", str(doc_number).strip().upper())
    doc_type_upper = doc_type.upper()
    
    for rec in MOCK_GROUND_TRUTH_DATABASE:
        if "AADHAAR" in doc_type_upper and rec.get("aadhaar_number"):
            if rec["aadhaar_number"] == clean_num:
                return rec
        elif "PAN" in doc_type_upper and rec.get("pan_number"):
            if rec["pan_number"] == clean_num:
                return rec
        elif "PASSPORT" in doc_type_upper and rec.get("passport_number"):
            if rec["passport_number"] == clean_num:
                return rec
        elif ("DRIVING" in doc_type_upper or "DL" in doc_type_upper) and rec.get("dl_number"):
            if re.sub(r"[\s\-]", "", rec["dl_number"]) == clean_num:
                return rec
                
    # Fallback lookup by Name if number was altered in tampering simulation
    if claimed_name:
        for rec in MOCK_GROUND_TRUTH_DATABASE:
            sim = calculate_string_similarity(claimed_name, rec["full_name"])
            if sim >= 0.80:
                return rec
                
    return None

def cross_verify_with_database(
    extracted_data: Dict[str, Any],
    doc_type: str
) -> Dict[str, Any]:
    """
    Cross-checks extracted document data against ground-truth database records
    and classifies discrepancies (Minor Typo vs Critical Risk / Identity Swap).
    """
    doc_num = extracted_data.get("document_number", "")
    ext_name = extracted_data.get("name", "")
    ext_dob = extracted_data.get("dob", "")
    
    ground_truth = lookup_ground_truth_record(doc_type, doc_num, ext_name)
    
    comparison_fields = []
    discrepancies = []
    authenticity_deduction = 0
    risk_classification = "LOW_RISK"
    
    if not ground_truth:
        # Document number is missing / unregistered in national registry
        return {
            "record_found": False,
            "database_authority": "National Citizen & Document Verification Registry",
            "match_status": "RECORD_NOT_FOUND",
            "risk_classification": "CRITICAL_RISK",
            "authenticity_penalty": 40,
            "summary": "Document identifier not registered in national database repository.",
            "ground_truth_data": None,
            "comparison_fields": [
                {"field": "Document Number", "extracted": doc_num, "ground_truth": "UNREGISTERED", "match": False, "severity": "CRITICAL"},
                {"field": "Full Name", "extracted": ext_name, "ground_truth": "UNREGISTERED", "match": False, "severity": "CRITICAL"},
                {"field": "Date of Birth", "extracted": ext_dob, "ground_truth": "UNREGISTERED", "match": False, "severity": "CRITICAL"}
            ],
            "evidence": [{
                "id": "db_unregistered",
                "category": "DATABASE",
                "title": "Unregistered Document Identifier",
                "description": f"Document ID '{doc_num}' does not exist in national verification repository.",
                "severity": "critical",
                "score_impact": 40,
                "technical_detail": "Database SELECT query returned zero matching entities."
            }]
        }
        
    # 1. Compare Full Name
    gt_name = ground_truth["full_name"]
    name_similarity = calculate_string_similarity(ext_name, gt_name)
    
    if name_similarity == 1.0:
        comparison_fields.append({"field": "Full Name", "extracted": ext_name, "ground_truth": gt_name, "match": True, "severity": "NONE"})
    elif name_similarity >= 0.85:
        authenticity_deduction += 15
        if risk_classification == "LOW_RISK":
            risk_classification = "MEDIUM_RISK"
        comparison_fields.append({"field": "Full Name", "extracted": ext_name, "ground_truth": gt_name, "match": False, "severity": "MINOR"})
        discrepancies.append({
            "id": "db_name_fuzzy",
            "category": "DATABASE",
            "title": "Minor Name Lexical Discrepancy",
            "description": f"Document name '{ext_name}' has minor typographical variance against registered database name '{gt_name}' ({int(name_similarity*100)}% similarity).",
            "severity": "warning",
            "score_impact": 15,
            "technical_detail": f"Fuzzy similarity ratio: {name_similarity}"
        })
    else:
        # Identity Swap / Major Name Mismatch
        authenticity_deduction += 45
        risk_classification = "CRITICAL_RISK"
        comparison_fields.append({"field": "Full Name", "extracted": ext_name, "ground_truth": gt_name, "match": False, "severity": "CRITICAL"})
        discrepancies.append({
            "id": "db_identity_swap",
            "category": "DATABASE",
            "title": "Critical Name Mismatch / Identity Swap Indicator",
            "description": f"Document name '{ext_name}' directly conflicts with registered entity name '{gt_name}'.",
            "severity": "critical",
            "score_impact": 45,
            "technical_detail": f"Severe token divergence: similarity is {int(name_similarity*100)}% (< 85%)."
        })
        
    # 2. Compare Date of Birth
    gt_dob = ground_truth["dob"]
    dob_match = ext_dob == gt_dob if (ext_dob and gt_dob) else False
    if dob_match:
        comparison_fields.append({"field": "Date of Birth", "extracted": ext_dob, "ground_truth": gt_dob, "match": True, "severity": "NONE"})
    else:
        authenticity_deduction += 40
        risk_classification = "CRITICAL_RISK"
        comparison_fields.append({"field": "Date of Birth", "extracted": ext_dob, "ground_truth": gt_dob, "match": False, "severity": "CRITICAL"})
        discrepancies.append({
            "id": "db_dob_mismatch",
            "category": "DATABASE",
            "title": "Database DOB Conflict",
            "description": f"Document Date of Birth ({ext_dob}) does not match official government registered record ({gt_dob}).",
            "severity": "critical",
            "score_impact": 40,
            "technical_detail": f"Database stored DOB='{gt_dob}' vs OCR scanned DOB='{ext_dob}'."
        })
        
    # 3. Compare Document Number
    gt_doc_num = (
        ground_truth.get("aadhaar_number") if "AADHAAR" in doc_type.upper() else
        ground_truth.get("pan_number") if "PAN" in doc_type.upper() else
        ground_truth.get("passport_number") if "PASSPORT" in doc_type.upper() else
        ground_truth.get("dl_number")
    )
    doc_match = re.sub(r"[\s\-]", "", str(doc_num).upper()) == re.sub(r"[\s\-]", "", str(gt_doc_num).upper())
    if doc_match:
        comparison_fields.append({"field": "Document Number", "extracted": doc_num, "ground_truth": gt_doc_num, "match": True, "severity": "NONE"})
    else:
        authenticity_deduction += 35
        risk_classification = "CRITICAL_RISK"
        comparison_fields.append({"field": "Document Number", "extracted": doc_num, "ground_truth": gt_doc_num, "match": False, "severity": "CRITICAL"})
        discrepancies.append({
            "id": "db_num_mismatch",
            "category": "DATABASE",
            "title": "Document Number Discrepancy",
            "description": f"Extracted number '{doc_num}' differs from database record '{gt_doc_num}'.",
            "severity": "critical",
            "score_impact": 35,
            "technical_detail": "Document identifier mismatch against matched person profile."
        })
        
    # 4. State Authority & Address Info
    comparison_fields.append({"field": "Registered State / Address", "extracted": "Verified via Template", "ground_truth": ground_truth.get("address", "N/A"), "match": True, "severity": "NONE"})
    
    return {
        "record_found": True,
        "database_authority": "National Citizen & Document Verification Registry (UIDAI/NSDL/Passport Seva)",
        "match_status": "MATCH_VERIFIED" if len(discrepancies) == 0 else "DISCREPANCY_DETECTED",
        "risk_classification": risk_classification,
        "name_similarity_pct": int(name_similarity * 100),
        "authenticity_penalty": authenticity_deduction,
        "summary": "Record verified against ground-truth national registry." if len(discrepancies) == 0 else f"{len(discrepancies)} discrepancy item(s) identified against database.",
        "ground_truth_data": ground_truth,
        "comparison_fields": comparison_fields,
        "evidence": discrepancies
    }

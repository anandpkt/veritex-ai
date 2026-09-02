import os
import sys
from services.checksum_service import validate_aadhaar_verhoeff, validate_pan_format, validate_driving_license_format, validate_document_checksums
from services.registry_service import cross_verify_with_database, calculate_string_similarity
from database import init_db, record_manual_override, get_audit_logs, get_screening_by_id

def test_sih26188_engine():
    print("==================================================")
    print("VERIDEX AI — SIH26188 VERIFICATION TEST SUITE")
    print("==================================================")
    
    # 1. Test Aadhaar Verhoeff
    print("\n[1] Testing Aadhaar Verhoeff Checksum Algorithm...")
    valid_aadhaar = "548291038476"
    is_valid, msg = validate_aadhaar_verhoeff(valid_aadhaar)
    assert is_valid == True, f"Failed on valid Aadhaar: {msg}"
    print(f" -> Valid Aadhaar {valid_aadhaar}: PASSED ({msg})")
    
    invalid_aadhaar = "548291038473" # Tampered check digit
    is_invalid, msg_inv = validate_aadhaar_verhoeff(invalid_aadhaar)
    assert is_invalid == False, "Failed to catch invalid Aadhaar check digit!"
    print(f" -> Tampered Aadhaar {invalid_aadhaar}: CAUGHT ({msg_inv})")
    
    # 2. Test PAN Format
    print("\n[2] Testing PAN Structure & Entity Code Validator...")
    valid_pan = "ABCPA1234F" # Individual Person PAN
    is_pan_valid, pan_msg, details = validate_pan_format(valid_pan)
    assert is_pan_valid == True, f"Failed on valid PAN: {pan_msg}"
    print(f" -> Valid PAN {valid_pan}: PASSED (Entity: {details['entity_type']})")
    
    invalid_pan = "ABC1234F" # Bad format
    is_bad_pan, bad_msg, _ = validate_pan_format(invalid_pan)
    assert is_bad_pan == False, "Failed to catch invalid PAN!"
    print(f" -> Bad PAN {invalid_pan}: CAUGHT ({bad_msg})")
    
    # 3. Test Fuzzy Typo vs Identity Swap
    print("\n[3] Testing External Database Cross-Verification & Discrepancies...")
    # Exact Match
    exact_ocr = {"name": "ANAND KUMAR", "dob": "15-08-1998", "document_number": "548291038476"}
    exact_res = cross_verify_with_database(exact_ocr, "AADHAAR")
    print(f" -> Exact Match Status: {exact_res['match_status']} (Penalty: {exact_res['authenticity_penalty']} pts)")
    assert exact_res["match_status"] == "MATCH_VERIFIED"
    assert exact_res["authenticity_penalty"] == 0
    
    # Minor Typo (Anand Kummar vs Anand Kumar)
    typo_ocr = {"name": "ANAND KUMMAR", "dob": "15-08-1998", "document_number": "548291038476"}
    typo_res = cross_verify_with_database(typo_ocr, "AADHAAR")
    print(f" -> Minor Typo Status: {typo_res['match_status']} (Name Sim: {typo_res['name_similarity_pct']}%, Penalty: {typo_res['authenticity_penalty']} pts)")
    assert typo_res["name_similarity_pct"] >= 85
    assert typo_res["authenticity_penalty"] == 15
    
    # Critical Mismatch (DOB conflict & Identity Swap)
    mismatch_ocr = {"name": "ROHIT SHARMA", "dob": "01-01-2005", "document_number": "548291038476"}
    crit_res = cross_verify_with_database(mismatch_ocr, "AADHAAR")
    print(f" -> Identity Conflict Status: {crit_res['risk_classification']} (Penalty: {crit_res['authenticity_penalty']} pts)")
    assert crit_res["risk_classification"] == "CRITICAL_RISK"
    assert crit_res["authenticity_penalty"] >= 45
    
    # 4. Database Init & Audit Logging
    print("\n[4] Initializing Enterprise Database & Audit Logs...")
    init_db()
    logs = get_audit_logs(5)
    print(f" -> Total Audit Trail Entries: {len(logs)}")
    
    print("\n==================================================")
    print("ALL SIH26188 BACKEND VERIFICATION TESTS PASSED (100%)")
    print("==================================================")

if __name__ == "__main__":
    test_sih26188_engine()

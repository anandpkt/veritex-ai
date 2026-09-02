from typing import Dict, Any, List, Tuple, Optional

def _mrz_char_value(c: str) -> int:
    if c.isdigit():
        return int(c)
    elif c.isalpha():
        return ord(c.upper()) - ord('A') + 10
    elif c == '<':
        return 0
    return 0

def compute_check_digit(data: str) -> int:
    weights = [7, 3, 1]
    total = 0
    for idx, ch in enumerate(data):
        val = _mrz_char_value(ch)
        weight = weights[idx % 3]
        total += val * weight
    return total % 10

def parse_mrz_td3(lines: List[str]) -> Dict[str, Any]:
    """
    Parses ICAO Doc 9303 TD3 (2 lines x 44 chars - Standard Passport).
    """
    if len(lines) < 2:
        return {
            "format_type": "TD3",
            "is_valid_format": False,
            "check_digits_valid": False,
            "error": "Insufficient MRZ lines (expected 2 lines of 44 characters)",
            "discrepancies": ["MRZ missing or incomplete"],
            "raw_mrz": lines
        }
        
    line1 = lines[0].strip().upper().ljust(44, '<')[:44]
    line2 = lines[1].strip().upper().ljust(44, '<')[:44]
    
    doc_type = line1[0:2].replace('<', '')
    issuing_country = line1[2:5].replace('<', '')
    
    # Extract names: SURNAME<<GIVEN<NAMES
    name_field = line1[5:44]
    parts = name_field.split('<<')
    surname = parts[0].replace('<', ' ').strip()
    given_names = parts[1].replace('<', ' ').strip() if len(parts) > 1 else ""
    full_name = f"{given_names} {surname}".strip() if given_names else surname
    
    # Line 2 components
    doc_number_raw = line2[0:9]
    doc_number = doc_number_raw.replace('<', '')
    doc_number_check = line2[9]
    
    nationality = line2[10:13].replace('<', '')
    
    dob_raw = line2[13:19] # YYMMDD
    dob_check = line2[19]
    
    gender = line2[20]
    if gender not in ['M', 'F', 'X']:
        gender = 'M'
        
    expiry_raw = line2[21:27] # YYMMDD
    expiry_check = line2[27]
    
    optional_data = line2[28:42]
    composite_check = line2[43]
    
    # Validate Check Digits
    discrepancies = []
    
    # 1. Document Number Check
    expected_doc_check = compute_check_digit(doc_number_raw)
    doc_check_valid = (doc_number_check.isdigit() and int(doc_number_check) == expected_doc_check)
    if not doc_check_valid:
        discrepancies.append(f"MRZ Document Number check digit failure (got '{doc_number_check}', expected '{expected_doc_check}')")
        
    # 2. DOB Check
    expected_dob_check = compute_check_digit(dob_raw)
    dob_check_valid = (dob_check.isdigit() and int(dob_check) == expected_dob_check)
    if not dob_check_valid:
        discrepancies.append(f"MRZ DOB check digit failure (got '{dob_check}', expected '{expected_dob_check}')")
        
    # 3. Expiry Check
    expected_exp_check = compute_check_digit(expiry_raw)
    exp_check_valid = (expiry_check.isdigit() and int(expiry_check) == expected_exp_check)
    if not exp_check_valid:
        discrepancies.append(f"MRZ Expiry Date check digit failure (got '{expiry_check}', expected '{expected_exp_check}')")
        
    # Parse dates to standard string
    # Assuming DOB: 1900-1999 vs 2000-2099 logic
    try:
        yy = int(dob_raw[0:2])
        century = "20" if yy <= 30 else "19"
        dob_formatted = f"{dob_raw[4:6]}-{dob_raw[2:4]}-{century}{dob_raw[0:2]}"
    except Exception:
        dob_formatted = "Unknown"
        
    try:
        exp_formatted = f"{expiry_raw[4:6]}-{expiry_raw[2:4]}-20{expiry_raw[0:2]}"
    except Exception:
        exp_formatted = "Unknown"
        
    all_check_digits_valid = (doc_check_valid and dob_check_valid and exp_check_valid)
    
    return {
        "raw_mrz": [line1, line2],
        "format_type": "TD3",
        "doc_type": doc_type,
        "issuing_country": issuing_country,
        "name": full_name,
        "surname": surname,
        "given_names": given_names,
        "document_number": doc_number,
        "nationality": nationality,
        "dob": dob_formatted,
        "dob_raw": dob_raw,
        "gender": gender,
        "expiry_date": exp_formatted,
        "expiry_raw": expiry_raw,
        "is_valid_format": True,
        "check_digits_valid": all_check_digits_valid,
        "check_digit_details": {
            "document_number": {"valid": doc_check_valid, "expected": expected_doc_check, "found": doc_number_check},
            "dob": {"valid": dob_check_valid, "expected": expected_dob_check, "found": dob_check},
            "expiry": {"valid": exp_check_valid, "expected": expected_exp_check, "found": expiry_check},
        },
        "discrepancies": discrepancies
    }

def parse_mrz(mrz_lines: List[str]) -> Dict[str, Any]:
    """Universal MRZ parser handling TD3 passports and future card formats."""
    if not mrz_lines:
        return {
            "format_type": "UNKNOWN",
            "is_valid_format": False,
            "check_digits_valid": False,
            "discrepancies": ["No MRZ lines present on document"],
            "raw_mrz": []
        }
    return parse_mrz_td3(mrz_lines)

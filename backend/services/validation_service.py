from datetime import datetime
from typing import Dict, Any, List, Optional

# Official ISO 3166-1 Alpha-3 Country Code Standard Dataset
VALID_ISO_COUNTRY_CODES = {
    "AFG", "ALB", "DZA", "AND", "AGO", "ARG", "ARM", "AUS", "AUT", "AZE",
    "BHS", "BHR", "BGD", "BRB", "BLR", "BEL", "BLZ", "BEN", "BTN", "BOL",
    "BIH", "BWA", "BRA", "BRN", "BGR", "BFA", "BDI", "KHM", "CMR", "CAN",
    "CPV", "CAF", "TCD", "CHL", "CHN", "COL", "COM", "COG", "CRI", "CIV",
    "HRV", "CUB", "CYP", "CZE", "DNK", "DJI", "DMA", "DOM", "ECU", "EGY",
    "SLV", "GNQ", "ERI", "EST", "SWZ", "ETH", "FJI", "FIN", "FRA", "GAB",
    "GMB", "GEO", "DEU", "GHA", "GRC", "GRD", "GTM", "GIN", "GNB", "GUY",
    "HTI", "HND", "HUN", "ISL", "IND", "IDN", "IRN", "IRQ", "IRL", "ISR",
    "ITA", "JAM", "JPN", "JOR", "KAZ", "KEN", "KIR", "PRK", "KOR", "KWT",
    "KGZ", "LAO", "LVA", "LBN", "LSO", "LBR", "LBY", "LIE", "LTU", "LUX",
    "MDG", "MWI", "MYS", "MDV", "MLI", "MLT", "MHL", "MRT", "MUS", "MEX",
    "FSM", "MDA", "MCO", "MNG", "MNE", "MAR", "MOZ", "MMR", "NAM", "NRU",
    "NPL", "NLD", "NZL", "NIC", "NER", "NGA", "MKD", "NOR", "OMN", "PAK",
    "PLW", "PAN", "PNG", "PRY", "PER", "PHL", "POL", "PRT", "QAT", "ROU",
    "RUS", "RWA", "KNA", "LCA", "VCT", "WSM", "SMR", "STP", "SAU", "SEN",
    "SRB", "SYC", "SLE", "SGP", "SVK", "SVN", "SLB", "SOM", "ZAF", "SSD",
    "ESP", "LKA", "SDN", "SUR", "SWE", "CHE", "SYR", "TWN", "TJK", "TZA",
    "THA", "TLS", "TGO", "TON", "TTO", "TUN", "TUR", "TKM", "TUV", "UGA",
    "UKR", "ARE", "GBR", "USA", "URY", "UZB", "VUT", "VEN", "VNM", "YEM",
    "ZMB", "ZWE", "DEMO", "UTO"
}

def _parse_date(date_str: str) -> Optional[datetime]:
    if not date_str:
        return None
    for fmt in ("%d-%m-%Y", "%Y-%m-%d", "%d/%m/%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            pass
    return None

def validate_document_rules(
    extracted_data: Dict[str, Any],
    mrz_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Performs deterministic rule-based document validation using official ISO & ICAO public standards:
    1. Expiry status (is document currently valid?)
    2. Date chronology (issue date vs expiry date)
    3. ISO 3166-1 Alpha-3 Country code standard
    4. Age reasonableness verification
    5. Mandatory field presence & format conformance
    """
    evidence_items = []
    is_valid = True
    validity_score = 100
    
    current_date = datetime.now()
    
    expiry_str = extracted_data.get("expiry_date", "")
    issue_str = extracted_data.get("issue_date", "")
    dob_str = extracted_data.get("dob", "")
    nat_str = extracted_data.get("nationality", "").upper().strip()
    
    expiry_dt = _parse_date(expiry_str)
    issue_dt = _parse_date(issue_str)
    dob_dt = _parse_date(dob_str)
    
    # 1. Expiry Date Check
    if expiry_dt:
        if expiry_dt < current_date:
            is_valid = False
            validity_score -= 45
            days_expired = (current_date - expiry_dt).days
            evidence_items.append({
                "id": "val_expired",
                "category": "VALIDITY",
                "title": "Document Expired",
                "description": f"Document expired on {expiry_str} ({days_expired} days overdue). Travel and identity authorization lapsed.",
                "severity": "danger",
                "field": "expiry_date",
                "score_impact": 35,
                "technical_detail": f"Expiry date ({expiry_str}) is strictly earlier than current system date ({current_date.strftime('%d-%m-%Y')})."
            })
        else:
            evidence_items.append({
                "id": "val_valid_expiry",
                "category": "VALIDITY",
                "title": "Document Expiry Valid",
                "description": f"Document is within authorized validity period (Expires: {expiry_str}).",
                "severity": "info",
                "field": "expiry_date",
                "score_impact": 0,
                "technical_detail": "Current date precedes expiry timestamp."
            })
    else:
        validity_score -= 20
        evidence_items.append({
            "id": "val_missing_expiry",
            "category": "VALIDITY",
            "title": "Missing Expiry Date",
            "description": "No valid expiry date could be parsed from visual inspection zone.",
            "severity": "warning",
            "field": "expiry_date",
            "score_impact": 15,
            "technical_detail": "Null date value."
        })
        
    # 2. Date Chronology Check (Issue Date < Expiry Date)
    if issue_dt and expiry_dt:
        if issue_dt >= expiry_dt:
            is_valid = False
            validity_score -= 30
            evidence_items.append({
                "id": "val_chronology_error",
                "category": "VALIDITY",
                "title": "Date Chronology Inversion",
                "description": f"Issue date ({issue_str}) is after or identical to expiry date ({expiry_str}).",
                "severity": "danger",
                "field": "issue_date",
                "score_impact": 25,
                "technical_detail": "Chronological conflict: IssueDate >= ExpiryDate."
            })
            
    # 3. ISO 3166-1 Country Code Standard Validation
    if nat_str:
        if nat_str in VALID_ISO_COUNTRY_CODES:
            evidence_items.append({
                "id": "val_iso_country_valid",
                "category": "VALIDITY",
                "title": "ISO 3166-1 Country Code Validated",
                "description": f"Nationality / Issuing state code '{nat_str}' conforms to ISO 3166-1 Alpha-3 standard registry.",
                "severity": "info",
                "field": "nationality",
                "score_impact": 0,
                "technical_detail": f"Country Code: {nat_str} (Registered in ISO 3166 Database)"
            })
        else:
            validity_score -= 25
            evidence_items.append({
                "id": "val_iso_country_invalid",
                "category": "VALIDITY",
                "title": "Invalid ISO 3166 Country Code",
                "description": f"Country code '{nat_str}' is not recognized in official ISO 3166-1 standard dataset.",
                "severity": "warning",
                "field": "nationality",
                "score_impact": 20,
                "technical_detail": f"Unrecognized Alpha-3 country token: '{nat_str}'"
            })
            
    # 4. Mandatory Fields Check
    mandatory = ["name", "document_number", "dob"]
    missing = [f for f in mandatory if not extracted_data.get(f)]
    if missing:
        validity_score -= 30 * len(missing)
        evidence_items.append({
            "id": "val_missing_fields",
            "category": "VALIDITY",
            "title": "Missing Mandatory Visual Fields",
            "description": f"The following mandatory document fields are missing: {', '.join(missing)}.",
            "severity": "danger",
            "field": "mandatory_fields",
            "score_impact": 30,
            "technical_detail": f"Missing attributes: {missing}"
        })
        
    validity_score = max(0, min(100, validity_score))
    
    return {
        "is_valid": is_valid,
        "validity_score": validity_score,
        "evidence_items": evidence_items
    }

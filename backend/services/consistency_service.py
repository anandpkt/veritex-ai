from typing import Dict, Any, List, Tuple

def analyze_field_consistency(
    extracted_data: Dict[str, Any],
    mrz_data: Dict[str, Any],
    face_result: Dict[str, Any],
    forensic_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Cross-checks all extracted signals and constructs the explainable Identity Consistency Graph.
    """
    evidence_items = []
    consistency_score = 100
    
    # 1. DOB Consistency (Visual vs MRZ)
    vis_dob = extracted_data.get("dob", "").strip()
    mrz_dob = mrz_data.get("dob", "").strip()
    
    dob_status = "consistent"
    if vis_dob and mrz_dob and vis_dob != "Unknown" and mrz_dob != "Unknown":
        # Extract years / compare
        vis_year = vis_dob.split("-")[-1] if "-" in vis_dob else vis_dob
        mrz_year = mrz_dob.split("-")[-1] if "-" in mrz_dob else mrz_dob
        
        if vis_dob != mrz_dob and vis_year != mrz_year:
            dob_status = "mismatch"
            consistency_score -= 40
            evidence_items.append({
                "id": "cons_dob_mismatch",
                "category": "MRZ",
                "title": "Date of Birth Mismatch",
                "description": f"Visual inspection zone DOB ({vis_dob}) directly conflicts with Machine-Readable Zone DOB ({mrz_dob}).",
                "severity": "critical",
                "field": "dob",
                "score_impact": 40,
                "technical_detail": f"Visual OCR parsed '{vis_dob}', whereas ICAO MRZ TD3 Line 2 specifies '{mrz_dob}'."
            })
        else:
            evidence_items.append({
                "id": "cons_dob_match",
                "category": "MRZ",
                "title": "Date of Birth Consistent",
                "description": f"Visual DOB matches MRZ encoded record ({vis_dob}).",
                "severity": "info",
                "field": "dob",
                "score_impact": 0,
                "technical_detail": "Visual and MRZ birth dates are identical."
            })
            
    # 2. Document Number Consistency
    vis_doc = extracted_data.get("document_number", "").strip().upper()
    mrz_doc = mrz_data.get("document_number", "").strip().upper()
    
    doc_status = "consistent"
    if vis_doc and mrz_doc:
        if vis_doc != mrz_doc:
            doc_status = "mismatch"
            consistency_score -= 35
            evidence_items.append({
                "id": "cons_doc_mismatch",
                "category": "MRZ",
                "title": "Document Number Mismatch",
                "description": f"Visual document number '{vis_doc}' differs from MRZ payload '{mrz_doc}'.",
                "severity": "critical",
                "field": "document_number",
                "score_impact": 35,
                "technical_detail": f"Field divergence: Visual='{vis_doc}' vs MRZ='{mrz_doc}'."
            })
            
    # 3. Name Consistency
    vis_name = extracted_data.get("name", "").strip().upper()
    mrz_name = mrz_data.get("name", "").strip().upper()
    name_status = "consistent"
    if vis_name and mrz_name:
        # Check if parts overlap
        v_parts = set(vis_name.replace(",", " ").split())
        m_parts = set(mrz_name.replace("<", " ").split())
        if not v_parts.intersection(m_parts):
            name_status = "mismatch"
            consistency_score -= 30
            evidence_items.append({
                "id": "cons_name_mismatch",
                "category": "MRZ",
                "title": "Name Discrepancy",
                "description": f"Visual name '{vis_name}' does not match MRZ record '{mrz_name}'.",
                "severity": "danger",
                "field": "name",
                "score_impact": 25,
                "technical_detail": "Name tokens show zero lexical intersection between Visual and MRZ."
            })
            
    # 4. Face Match Status
    face_sim = face_result.get("similarity_score", 1.0)
    face_status = "consistent" if face_sim >= 0.70 else "mismatch"
    if face_status == "mismatch":
        consistency_score -= 30
        evidence_items.append({
            "id": "cons_face_mismatch",
            "category": "FACE",
            "title": "Biometric Facial Divergence",
            "description": f"Live face camera comparison similarity ({int(face_sim*100)}%) is below match threshold.",
            "severity": "danger",
            "field": "face",
            "score_impact": 30,
            "technical_detail": face_result.get("explanation", "")
        })
        
    # 5. MRZ Check Digit Integrity
    if not mrz_data.get("check_digits_valid", True):
        consistency_score -= 25
        evidence_items.append({
            "id": "cons_mrz_checksum",
            "category": "MRZ",
            "title": "MRZ Checksum Algorithm Failure",
            "description": "One or more ICAO 9303 7-3-1 check digit formulas failed validation.",
            "severity": "danger",
            "field": "mrz",
            "score_impact": 25,
            "technical_detail": "; ".join(mrz_data.get("discrepancies", []))
        })
        
    # 6. Forensic Tamper Impact
    if forensic_data.get("tampering_detected", False):
        consistency_score -= 35
        for reg in forensic_data.get("suspicious_regions", []):
            evidence_items.append({
                "id": f"cons_forensic_{reg.get('id', 'tamper')}",
                "category": "FORENSIC",
                "title": f"Forensic Anomaly: {reg.get('label', 'Tampered Area')}",
                "description": reg.get("reason", "Local image inconsistency detected."),
                "severity": "critical" if reg.get("confidence", 0.9) > 0.9 else "danger",
                "field": reg.get("label", "tamper"),
                "score_impact": 30,
                "technical_detail": f"Confidence: {int(reg.get('confidence', 0.9)*100)}% | Type: {reg.get('anomaly_type')} at ({reg.get('x')}, {reg.get('y')})"
            })
            
    consistency_score = max(5, min(100, consistency_score))
    
    # Generate Identity Consistency Graph Nodes & Edges
    graph_nodes = [
        {"id": "node_person", "label": "SUBJECT ENTITY", "type": "PERSON", "value": vis_name, "status": "valid" if consistency_score > 60 else "suspicious"},
        {"id": "node_name", "label": "NAME", "type": "FIELD", "value": vis_name, "status": name_status},
        {"id": "node_dob", "label": "DOB", "type": "FIELD", "value": vis_dob, "status": dob_status},
        {"id": "node_doc_num", "label": "DOC NUMBER", "type": "FIELD", "value": vis_doc, "status": doc_status},
        {"id": "node_expiry", "label": "EXPIRY", "type": "FIELD", "value": extracted_data.get("expiry_date", ""), "status": "consistent"},
        {"id": "node_mrz", "label": "MRZ ENCODING", "type": "SOURCE", "value": "ICAO 9303 TD3", "status": "consistent" if mrz_data.get("check_digits_valid") and dob_status == "consistent" else "mismatch"},
        {"id": "node_ocr", "label": "VISUAL OCR", "type": "SOURCE", "value": "Visual Zone", "status": "consistent"},
        {"id": "node_face", "label": "FACE BIOMETRIC", "type": "SOURCE", "value": f"{int(face_sim*100)}% Sim", "status": face_status},
        {"id": "node_forensics", "label": "IMAGE FORENSICS", "type": "SOURCE", "value": f"{forensic_data.get('forensic_score')}/100", "status": "mismatch" if forensic_data.get("tampering_detected") else "consistent"},
    ]
    
    graph_edges = [
        {"source": "node_person", "target": "node_name", "label": "Claims Identity", "status": name_status},
        {"source": "node_person", "target": "node_dob", "label": "Born On", "status": dob_status},
        {"source": "node_person", "target": "node_doc_num", "label": "Issued Document", "status": doc_status},
        {"source": "node_person", "target": "node_face", "label": "Live Biometrics", "status": face_status},
        {"source": "node_name", "target": "node_ocr", "label": "Extracted Via", "status": "consistent"},
        {"source": "node_name", "target": "node_mrz", "label": "Cross Check", "status": name_status},
        {"source": "node_dob", "target": "node_ocr", "label": "Visual Read", "status": "consistent"},
        {"source": "node_dob", "target": "node_mrz", "label": "MRZ Cross-Check", "status": dob_status},
        {"source": "node_doc_num", "target": "node_mrz", "label": "MRZ Checksum", "status": doc_status},
        {"source": "node_doc_num", "target": "node_forensics", "label": "Forensic Inspection", "status": "mismatch" if forensic_data.get("tampering_detected") else "consistent"},
    ]
    
    return {
        "consistency_score": consistency_score,
        "evidence_items": evidence_items,
        "identity_graph": {
            "nodes": graph_nodes,
            "edges": graph_edges
        }
    }

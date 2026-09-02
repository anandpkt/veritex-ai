import uuid
import time
from datetime import datetime
from fastapi import APIRouter
from typing import Dict, Any, List

from demo_data.preset_cases import PRESET_CASES, get_case_by_id
from schemas.screening_schemas import SyntheticGenerateRequest
from services.synthetic_document_service import generate_synthetic_passport
from services.ocr_service import extract_document_text
from services.mrz_service import parse_mrz
from services.validation_service import validate_document_rules
from services.forensic_service import analyze_document_forensics
from services.face_service import verify_faces
from services.consistency_service import analyze_field_consistency
from services.risk_engine import compute_risk_fusion
from database import save_screening

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/presets")
async def get_presets():
    """Returns the catalog of 6 built-in deterministic demo cases."""
    return PRESET_CASES

@router.post("/synthetic/generate")
async def generate_custom_synthetic_doc(req: SyntheticGenerateRequest):
    """
    Generates a custom synthetic document in the Synthetic Document Lab with specific user-selected manipulations.
    """
    doc_id = str(uuid.uuid4())[:8]
    
    person = {
        "name": req.name or ("ARUN KUMAR" if not req.change_name else "VIKTOR VANCE"),
        "dob": req.dob or ("15-04-2002" if not req.change_dob else "15-04-1992"),
        "nationality": req.nationality or "DEMO",
        "document_number": req.document_number or ("DEMO123456" if not req.change_doc_number else "DEMO998877"),
        "issue_date": req.issue_date or "15-04-2022",
        "expiry_date": req.expiry_date or ("15-04-2032" if not req.change_expiry else "15-04-2020"),
        "gender": req.gender or "M",
    }
    
    manipulations = {
        "change_dob": req.change_dob or req.multiple_manipulations,
        "change_name": req.change_name,
        "change_expiry": req.change_expiry,
        "change_doc_number": req.change_doc_number or req.multiple_manipulations,
        "modify_mrz": req.modify_mrz or req.multiple_manipulations,
        "replace_photo": req.replace_photo or req.multiple_manipulations,
        "add_image_artifact": req.add_image_artifact or req.multiple_manipulations,
        "multiple_manipulations": req.multiple_manipulations
    }
    
    # Generate document
    doc_res = generate_synthetic_passport(
        doc_id=doc_id,
        person=person,
        manipulations=manipulations
    )
    
    # Also generate a pristine reference original for side-by-side comparison
    orig_doc_res = generate_synthetic_passport(
        doc_id=f"orig_{doc_id}",
        person={
            "name": "ARUN KUMAR",
            "dob": "15-04-2002",
            "nationality": "DEMO",
            "document_number": "DEMO123456",
            "issue_date": "15-04-2022",
            "expiry_date": "15-04-2032",
            "gender": "M",
        },
        manipulations={"change_dob": False, "change_name": False, "change_expiry": False, "change_doc_number": False, "modify_mrz": False, "replace_photo": False, "add_image_artifact": False, "multiple_manipulations": False}
    )
    
    return {
        "doc_id": doc_id,
        "original_image_url": orig_doc_res["image_url"],
        "modified_image_url": doc_res["image_url"],
        "live_photo_url": doc_res["live_photo_url"],
        "person": person,
        "manipulations_applied": manipulations,
        "tampered_regions": doc_res["tampered_regions"]
    }

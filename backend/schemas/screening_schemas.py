from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RecommendedAction(str, Enum):
    PASS = "PASS"
    MANUAL_REVIEW = "MANUAL VERIFICATION REQUIRED"
    HIGH_RISK_INSPECTION = "SECONDARY PHYSICAL INSPECTION REQUIRED"
    REJECT = "REJECT / FRAUD ALERT"

class DocumentType(str, Enum):
    PASSPORT = "PASSPORT"
    NATIONAL_ID = "NATIONAL_ID"
    DRIVERS_LICENSE = "DRIVERS_LICENSE"

class ExtractedField(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    nationality: Optional[str] = None
    document_number: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    gender: Optional[str] = None
    document_type: Optional[str] = "PASSPORT"
    ocr_confidence: float = 0.95
    bounding_boxes: Optional[List[Dict[str, Any]]] = []

class MRZData(BaseModel):
    raw_mrz: List[str] = []
    format_type: str = "TD3"
    is_valid_format: bool = True
    check_digits_valid: bool = True
    document_number: Optional[str] = None
    dob: Optional[str] = None
    expiry_date: Optional[str] = None
    nationality: Optional[str] = None
    gender: Optional[str] = None
    name: Optional[str] = None
    discrepancies: List[str] = []

class EvidenceItem(BaseModel):
    id: str
    category: str  # 'MRZ', 'OCR', 'FORENSIC', 'FACE', 'VALIDITY', 'METADATA'
    title: str
    description: str
    severity: str  # 'info', 'warning', 'danger', 'critical'
    field: Optional[str] = None
    score_impact: int
    technical_detail: Optional[str] = None

class ForensicRegion(BaseModel):
    id: str
    label: str
    x: int
    y: int
    width: int
    height: int
    confidence: float
    anomaly_type: str  # 'text_tampering', 'noise_inconsistency', 'ela_anomaly', 'clone_artifact', 'photo_tamper'
    reason: str

class FaceVerificationResult(BaseModel):
    similarity_score: float
    threshold: float = 0.70
    match_status: str  # 'MATCH', 'MISMATCH', 'INCONCLUSIVE'
    confidence_label: str  # 'Likely Match', 'Potential Identity Mismatch', 'No Face Detected'
    document_face_url: Optional[str] = None
    live_photo_url: Optional[str] = None
    landmarks_detected: bool = True
    explanation: str

class TimelineStep(BaseModel):
    step_id: str
    step_name: str
    status: str  # 'COMPLETED', 'FLAGGED', 'WARNING'
    duration_ms: int
    timestamp: str
    details: str

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # 'PERSON', 'FIELD', 'SOURCE', 'STATUS'
    value: Optional[str] = None
    status: str  # 'consistent', 'mismatch', 'suspicious', 'valid', 'unknown'

class GraphEdge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None
    status: str  # 'consistent', 'mismatch', 'suspicious'

class IdentityGraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class ScreeningResponse(BaseModel):
    id: str
    created_at: str
    document_type: str
    source_type: str
    case_id: Optional[str] = None
    document_image_url: str
    live_photo_url: Optional[str] = None
    risk_score: int
    risk_level: str
    recommended_action: str
    integrity_score: int
    identity_score: int
    consistency_score: int
    forensic_score: int
    processing_time_ms: int
    extracted_data: Dict[str, Any]
    mrz_data: Dict[str, Any]
    evidence: List[Dict[str, Any]]
    forensic_regions: List[Dict[str, Any]]
    forensic_maps: Dict[str, str]
    face_result: Dict[str, Any]
    timeline: List[Dict[str, Any]]
    identity_graph: Dict[str, Any]
    status: str = "COMPLETED"

class SyntheticGenerateRequest(BaseModel):
    document_type: str = "PASSPORT"  # 'PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE'
    name: Optional[str] = None
    dob: Optional[str] = None
    nationality: Optional[str] = None
    document_number: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    gender: Optional[str] = "M"
    # Manipulations
    change_dob: bool = False
    change_name: bool = False
    change_expiry: bool = False
    change_doc_number: bool = False
    modify_mrz: bool = False
    replace_photo: bool = False
    add_image_artifact: bool = False
    multiple_manipulations: bool = False

class RiskSimulationRequest(BaseModel):
    tampering_detected: bool = True
    mrz_mismatch: bool = False
    face_mismatch: bool = False
    expired_document: bool = False
    metadata_anomaly: bool = False
    # Configurable weights (must sum to 100 or normalized)
    weight_tampering: float = 30.0
    weight_mrz: float = 20.0
    weight_face: float = 20.0
    weight_consistency: float = 15.0
    weight_validity: float = 10.0
    weight_metadata: float = 5.0

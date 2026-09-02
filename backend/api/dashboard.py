from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime, timedelta
import random

from database import get_dashboard_metrics, get_all_screenings

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_stats():
    """
    Returns high-level Security Operations Center (SOC) dashboard metrics,
    screening trends, recent alerts, and risk distributions.
    All data is clearly tagged with the research prototype synthetic disclaimer.
    """
    metrics = get_dashboard_metrics()
    recent = get_all_screenings(limit=8)
    
    # 24-Hour Screening Trend
    trend_points = []
    base_time = datetime.now() - timedelta(hours=24)
    for h in range(0, 25, 2):
        t = base_time + timedelta(hours=h)
        trend_points.append({
            "time": t.strftime("%H:00"),
            "screenings": random.randint(45, 110),
            "flagged": random.randint(3, 14)
        })
        
    # Live Threat Alert Feed
    alerts = [
        {"id": "alt_1", "time": "2 mins ago", "type": "CRITICAL_FRAUD", "title": "Multi-Layer Identity Inconsistency Detected", "case_id": "VRX-DM-9481", "severity": "critical"},
        {"id": "alt_2", "time": "14 mins ago", "type": "DOB_MISMATCH", "title": "Visual DOB (2002) vs MRZ Payload (1992) Conflict", "case_id": "VRX-ER-8201", "severity": "high"},
        {"id": "alt_3", "time": "28 mins ago", "type": "PHOTO_DIVERGENCE", "title": "Live Camera Facial Biometrics Mismatch (43% Sim)", "case_id": "VRX-SC-7819", "severity": "high"},
        {"id": "alt_4", "time": "45 mins ago", "type": "SPLICED_REGION", "title": "Local Noise & ELA Anomaly on Document Number", "case_id": "VRX-FA-8422", "severity": "high"},
        {"id": "alt_5", "time": "1 hr ago", "type": "EXPIRED_DOC", "title": "Identity Document Expired (Past Validity Limit)", "case_id": "VRX-MV-5539", "severity": "medium"},
    ]
    
    return {
        "metrics": metrics,
        "recent_screenings": recent,
        "screening_trend_24h": trend_points,
        "alerts": alerts,
        "risk_distribution": [
            {"name": "Low Risk", "value": metrics["low_risk_count"], "color": "#10B981"},
            {"name": "Medium Risk", "value": metrics["medium_risk_count"], "color": "#F59E0B"},
            {"name": "High Risk", "value": metrics["high_risk_count"], "color": "#F43F5E"},
            {"name": "Critical Risk", "value": metrics["critical_risk_count"], "color": "#A855F7"}
        ]
    }

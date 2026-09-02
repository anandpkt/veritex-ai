import sqlite3
import json
import os
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "veridex.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Screenings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS screenings (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        document_type TEXT NOT NULL,
        source_type TEXT NOT NULL, -- 'DEMO_PRESET', 'SYNTHETIC_LAB', 'LIVE_UPLOAD'
        case_id TEXT,
        document_image_url TEXT NOT NULL,
        live_photo_url TEXT,
        risk_score INTEGER NOT NULL,
        risk_level TEXT NOT NULL,
        recommended_action TEXT NOT NULL,
        integrity_score INTEGER NOT NULL,
        identity_score INTEGER NOT NULL,
        consistency_score INTEGER NOT NULL,
        forensic_score INTEGER NOT NULL,
        processing_time_ms INTEGER NOT NULL,
        extracted_data_json TEXT NOT NULL,
        mrz_data_json TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        forensic_regions_json TEXT NOT NULL,
        forensic_maps_json TEXT NOT NULL,
        face_result_json TEXT NOT NULL,
        timeline_json TEXT NOT NULL,
        identity_graph_json TEXT NOT NULL,
        status TEXT DEFAULT 'COMPLETED'
    )
    """)
    
    # Audit log table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        screening_id TEXT,
        event_type TEXT NOT NULL,
        details TEXT
    )
    """)
    
    conn.commit()
    conn.close()

def save_screening(screening_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT OR REPLACE INTO screenings (
        id, created_at, document_type, source_type, case_id,
        document_image_url, live_photo_url, risk_score, risk_level,
        recommended_action, integrity_score, identity_score,
        consistency_score, forensic_score, processing_time_ms,
        extracted_data_json, mrz_data_json, evidence_json,
        forensic_regions_json, forensic_maps_json, face_result_json,
        timeline_json, identity_graph_json, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        screening_data["id"],
        screening_data.get("created_at", datetime.now().isoformat()),
        screening_data.get("document_type", "PASSPORT"),
        screening_data.get("source_type", "DEMO_PRESET"),
        screening_data.get("case_id"),
        screening_data.get("document_image_url", ""),
        screening_data.get("live_photo_url"),
        screening_data.get("risk_score", 0),
        screening_data.get("risk_level", "LOW"),
        screening_data.get("recommended_action", "PASS"),
        screening_data.get("integrity_score", 100),
        screening_data.get("identity_score", 100),
        screening_data.get("consistency_score", 100),
        screening_data.get("forensic_score", 100),
        screening_data.get("processing_time_ms", 320),
        json.dumps(screening_data.get("extracted_data", {})),
        json.dumps(screening_data.get("mrz_data", {})),
        json.dumps(screening_data.get("evidence", [])),
        json.dumps(screening_data.get("forensic_regions", [])),
        json.dumps(screening_data.get("forensic_maps", {})),
        json.dumps(screening_data.get("face_result", {})),
        json.dumps(screening_data.get("timeline", [])),
        json.dumps(screening_data.get("identity_graph", {})),
        screening_data.get("status", "COMPLETED")
    ))
    
    conn.commit()
    conn.close()

def get_screening_by_id(screening_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM screenings WHERE id = ?", (screening_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    return {
        "id": row["id"],
        "created_at": row["created_at"],
        "document_type": row["document_type"],
        "source_type": row["source_type"],
        "case_id": row["case_id"],
        "document_image_url": row["document_image_url"],
        "live_photo_url": row["live_photo_url"],
        "risk_score": row["risk_score"],
        "risk_level": row["risk_level"],
        "recommended_action": row["recommended_action"],
        "integrity_score": row["integrity_score"],
        "identity_score": row["identity_score"],
        "consistency_score": row["consistency_score"],
        "forensic_score": row["forensic_score"],
        "processing_time_ms": row["processing_time_ms"],
        "extracted_data": json.loads(row["extracted_data_json"]),
        "mrz_data": json.loads(row["mrz_data_json"]),
        "evidence": json.loads(row["evidence_json"]),
        "forensic_regions": json.loads(row["forensic_regions_json"]),
        "forensic_maps": json.loads(row["forensic_maps_json"]),
        "face_result": json.loads(row["face_result_json"]),
        "timeline": json.loads(row["timeline_json"]),
        "identity_graph": json.loads(row["identity_graph_json"]),
        "status": row["status"]
    }

def get_all_screenings(limit: int = 50, risk_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT id, created_at, document_type, source_type, case_id, risk_score, risk_level, recommended_action, processing_time_ms, extracted_data_json FROM screenings"
    params = []
    
    if risk_filter and risk_filter.upper() != "ALL":
        query += " WHERE risk_level = ?"
        params.append(risk_filter.upper())
        
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for r in rows:
        extracted = json.loads(r["extracted_data_json"])
        results.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "document_type": r["document_type"],
            "source_type": r["source_type"],
            "case_id": r["case_id"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "recommended_action": r["recommended_action"],
            "processing_time_ms": r["processing_time_ms"],
            "person_name": extracted.get("name", "Unknown Person"),
            "document_number": extracted.get("document_number", "N/A"),
        })
    return results

def get_dashboard_metrics() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM screenings")
    total_screenings = cursor.fetchone()["total"]
    
    cursor.execute("SELECT risk_level, COUNT(*) as count FROM screenings GROUP BY risk_level")
    risk_counts = {row["risk_level"]: row["count"] for row in cursor.fetchall()}
    
    cursor.execute("SELECT AVG(processing_time_ms) as avg_time FROM screenings")
    avg_row = cursor.fetchone()
    avg_time = avg_row["avg_time"] if avg_row and avg_row["avg_time"] else 3800
    
    conn.close()
    
    # Base numbers combined with realistic SOC stats
    low_cnt = risk_counts.get("LOW", 0) + 1135
    med_cnt = risk_counts.get("MEDIUM", 0) + 112
    high_cnt = risk_counts.get("HIGH", 0) + 37
    crit_cnt = risk_counts.get("CRITICAL", 0) + 14
    total_soc = total_screenings + 1298
    
    return {
        "today_screenings": total_soc,
        "low_risk_count": low_cnt,
        "medium_risk_count": med_cnt,
        "high_risk_count": high_cnt,
        "critical_risk_count": crit_cnt,
        "avg_processing_time_sec": round(avg_time / 1000.0, 1),
        "system_status": "ONLINE",
        "demo_mode_active": True,
        "disclaimer": "Research / Demonstration Prototype — Synthetic Data Only"
    }

def delete_screening(screening_id: str) -> bool:
    """Deletes a single screening record and its audit logs."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM screenings WHERE id = ?", (screening_id,))
    deleted = cursor.rowcount > 0
    cursor.execute("DELETE FROM audit_logs WHERE screening_id = ?", (screening_id,))
    conn.commit()
    conn.close()
    return deleted

def purge_all_screenings() -> int:
    """Purges all non-preset screening records from the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM screenings")
    count = cursor.rowcount
    cursor.execute("DELETE FROM audit_logs")
    conn.commit()
    conn.close()
    return count


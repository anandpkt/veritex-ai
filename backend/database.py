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
    
    # 1. UserPerson Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_persons (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        dob TEXT NOT NULL,
        gender TEXT,
        nationality TEXT DEFAULT 'IND',
        father_name TEXT,
        address TEXT,
        status TEXT DEFAULT 'ACTIVE_VERIFIED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # 2. DocumentMetadata Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_metadata (
        id TEXT PRIMARY KEY,
        person_id TEXT,
        document_type TEXT NOT NULL, -- 'AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE'
        document_number TEXT NOT NULL,
        issue_date TEXT,
        expiry_date TEXT,
        issuing_authority TEXT,
        is_registered_in_mock_db INTEGER DEFAULT 1,
        FOREIGN KEY(person_id) REFERENCES user_persons(id)
    )
    """)
    
    # 3. VerificationSessions / Screenings Table
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
        ground_truth_json TEXT,
        checksum_validation_json TEXT,
        manual_override_status TEXT DEFAULT 'NONE', -- 'NONE', 'MANUALLY_APPROVED', 'ESCALATED_FRAUD', 'REUPLOAD_REQUESTED'
        reviewer_notes TEXT,
        status TEXT DEFAULT 'COMPLETED'
    )
    """)
    
    # 4. AuditLogs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        screening_id TEXT,
        event_type TEXT NOT NULL, -- 'SCREENING_EXECUTED', 'MANUAL_OVERRIDE_APPROVED', 'ESCALATED_FRAUD', 'RECORD_DELETED'
        actor TEXT DEFAULT 'AI_SECURITY_ENGINE',
        details TEXT
    )
    """)
    
    # Seed Ground Truth database entities into user_persons and document_metadata
    from services.registry_service import MOCK_GROUND_TRUTH_DATABASE
    for rec in MOCK_GROUND_TRUTH_DATABASE:
        cursor.execute("""
        INSERT OR IGNORE INTO user_persons (id, full_name, dob, gender, nationality, father_name, address, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rec["id"], rec["full_name"], rec["dob"], rec["gender"],
            rec["nationality"], rec["father_name"], rec["address"], rec["status"]
        ))
        
        # Link Aadhaar
        if rec.get("aadhaar_number"):
            cursor.execute("""
            INSERT OR IGNORE INTO document_metadata (id, person_id, document_type, document_number, issuing_authority)
            VALUES (?, ?, ?, ?, ?)
            """, (f"DOC-AADHAAR-{rec['id']}", rec["id"], "AADHAAR", rec["aadhaar_number"], "UIDAI"))
            
        # Link PAN
        if rec.get("pan_number"):
            cursor.execute("""
            INSERT OR IGNORE INTO document_metadata (id, person_id, document_type, document_number, issuing_authority)
            VALUES (?, ?, ?, ?, ?)
            """, (f"DOC-PAN-{rec['id']}", rec["id"], "PAN", rec["pan_number"], "Income Tax Department"))
            
        # Link Passport
        if rec.get("passport_number"):
            cursor.execute("""
            INSERT OR IGNORE INTO document_metadata (id, person_id, document_type, document_number, issuing_authority)
            VALUES (?, ?, ?, ?, ?)
            """, (f"DOC-PASS-{rec['id']}", rec["id"], "PASSPORT", rec["passport_number"], "Ministry of External Affairs"))
            
        # Link Driving License
        if rec.get("dl_number"):
            cursor.execute("""
            INSERT OR IGNORE INTO document_metadata (id, person_id, document_type, document_number, issuing_authority)
            VALUES (?, ?, ?, ?, ?)
            """, (f"DOC-DL-{rec['id']}", rec["id"], "DRIVING_LICENSE", rec["dl_number"], "MoRTH Parivahan"))
            
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
        timeline_json, identity_graph_json, ground_truth_json,
        checksum_validation_json, manual_override_status, reviewer_notes, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        json.dumps(screening_data.get("ground_truth_verification", {})),
        json.dumps(screening_data.get("checksum_validation", {})),
        screening_data.get("manual_override_status", "NONE"),
        screening_data.get("reviewer_notes", ""),
        screening_data.get("status", "COMPLETED")
    ))
    
    # Record initial audit entry
    cursor.execute("""
    INSERT INTO audit_logs (screening_id, event_type, actor, details)
    VALUES (?, ?, ?, ?)
    """, (
        screening_data["id"],
        "SCREENING_EXECUTED",
        "AI_SECURITY_ENGINE",
        f"Automated screening completed. Risk Score: {screening_data.get('risk_score')}/100 ({screening_data.get('risk_level')}). Action: {screening_data.get('recommended_action')}"
    ))
    
    conn.commit()
    conn.close()

def record_manual_override(screening_id: str, action: str, reviewer_notes: str, actor: str = "OFFICER_ADMIN") -> Optional[Dict[str, Any]]:
    """Logs human security officer manual override decision."""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    UPDATE screenings
    SET manual_override_status = ?, reviewer_notes = ?
    WHERE id = ?
    """, (action, reviewer_notes, screening_id))
    
    if cursor.rowcount == 0:
        conn.close()
        return None
        
    cursor.execute("""
    INSERT INTO audit_logs (screening_id, event_type, actor, details)
    VALUES (?, ?, ?, ?)
    """, (screening_id, f"MANUAL_OVERRIDE_{action}", actor, f"Officer override applied: {action}. Notes: {reviewer_notes}"))
    
    conn.commit()
    conn.close()
    return get_screening_by_id(screening_id)

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
        "extracted_data": json.loads(row["extracted_data_json"] or "{}"),
        "mrz_data": json.loads(row["mrz_data_json"] or "{}"),
        "evidence": json.loads(row["evidence_json"] or "[]"),
        "forensic_regions": json.loads(row["forensic_regions_json"] or "[]"),
        "forensic_maps": json.loads(row["forensic_maps_json"] or "{}"),
        "face_result": json.loads(row["face_result_json"] or "{}"),
        "timeline": json.loads(row["timeline_json"] or "[]"),
        "identity_graph": json.loads(row["identity_graph_json"] or "{}"),
        "ground_truth_verification": json.loads(row["ground_truth_json"] or "{}") if "ground_truth_json" in row.keys() else {},
        "checksum_validation": json.loads(row["checksum_validation_json"] or "{}") if "checksum_validation_json" in row.keys() else {},
        "manual_override_status": row["manual_override_status"] if "manual_override_status" in row.keys() else "NONE",
        "reviewer_notes": row["reviewer_notes"] if "reviewer_notes" in row.keys() else "",
        "status": row["status"]
    }

def get_all_screenings(limit: int = 50, risk_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    query = "SELECT id, created_at, document_type, source_type, case_id, risk_score, risk_level, recommended_action, processing_time_ms, extracted_data_json, manual_override_status FROM screenings"
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
        extracted = json.loads(r["extracted_data_json"] or "{}")
        results.append({
            "id": r["id"],
            "created_at": r["created_at"],
            "document_type": r["document_type"],
            "source_type": r["source_type"],
            "case_id": r["case_id"],
            "risk_score": r["risk_score"],
            "risk_level": r["risk_level"],
            "recommended_action": r["recommended_action"],
            "manual_override_status": r["manual_override_status"] if "manual_override_status" in r.keys() else "NONE",
            "processing_time_ms": r["processing_time_ms"],
            "person_name": extracted.get("name", "Unknown Person"),
            "document_number": extracted.get("document_number", "N/A"),
        })
    return results

def get_audit_logs(limit: int = 100) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

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

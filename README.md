# VERIDEX AI — AI-Based Fake Identity & Document Screening System (SIH26188)

> **Tagline:** *From Document Scan to Explainable Risk*  
> **Problem Statement ID:** SIH26188 — Automated Multi-Signal Identity Forgery & Fake Document Screening System  
> **Architecture:** Enterprise Multi-Vector Security Core (FastAPI Backend + React / Tailwind Admin Console)

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT APPLICATION & ADMIN SOC                            │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌──────────────────────────┐  │
│  │ Multi-Doc Upload Zone  │  │ Live Webcam Biometric  │  │ Admin Comparative Matrix │  │
│  │ (Aadhaar, PAN, Pass,DL)│  │ Liveness Capture Modal │  │ & Human Manual Override  │  │
│  └───────────┬────────────┘  └───────────┬────────────┘  └────────────▲─────────────┘  │
└──────────────┼───────────────────────────┼────────────────────────────┼────────────────┘
               │ Multipart ID Attachment   │ WebRTC Video Snapshot      │ REST API
               ▼                           ▼                            │
┌───────────────────────────────────────────────────────────────────────┴────────────────┐
│                              FASTAPI AI SECURITY ENGINE                                │
│                                                                                        │
│ 1. Multi-Template OCR & Visual Extraction Zone (VIZ)                                  │
│    • Bounding box layout normalization for Aadhaar, PAN, Passport, and DL credentials. │
│                                                                                        │
│ 2. Algorithmic Checksum & Mathematical Rule Engine                                     │
│    • Verhoeff Checksum Algorithm (Modulus 10, Dihedral Group D5 for 12-Digit Aadhaar). │
│    • Income Tax PAN 10-Char Entity Alphanumeric Rule ([A-Z]{5}[0-9]{4}[A-Z]).         │
│    • ICAO Doc 9303 TD3 7-3-1 Weighted Modulus-10 Check Digits (Passport MRTD).        │
│    • Parivahan State RTO & Issuance Format Validator (Driving License).                │
│                                                                                        │
│ 3. External Database Cross-Verification & Discrepancy Classifier                       │
│    • Queries National Citizen Ground-Truth Registry (UIDAI, NSDL, Passport Seva).      │
│    • Discrepancy Classification:                                                       │
│      - Minor Typo (Fuzzy Levenshtein similarity >= 85%) -> -15 pts penalty.           │
│      - Critical Discrepancy (Unregistered ID, DOB Conflict, Face Swap) -> HIGH RISK.   │
│                                                                                        │
│ 4. Deep Image Forensics & Forgery Saliency Mapping                                     │
│    • Error Level Analysis (ELA): Detects localized JPEG compression discrepancies.     │
│    • Laplacian Noise Variance: Maps substrate noise variance and smooth paste seams.   │
│    • Grad-CAM Saliency Heatmap: Visualizes neural network attention focus on forgery.  │
│    • Sobel Gradient Magnitude: Edge discontinuity and spliced font boundary detection. │
│                                                                                        │
│ 5. Biometric Facial Cross-Correlation & Liveness Match                                 │
│    • Normalized Cross-Correlation (NCC) + RGB Color Histogram Intersection (0-100%).   │
│                                                                                        │
│ 6. Multi-Signal Risk Fusion Engine & Human Decision Overrides                          │
│    • Synthesizes multi-vector evidence chain into 0-100 Authenticity & Risk Score.     │
│    • Human Officer Actions: [ Approve Override ], [ Escalate Fraud ], [ Re-upload ].   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

### 1. One-Click Startup (Windows)
Double-click `start_all.bat` or run:
```powershell
.\start_all.bat
```

### 2. Manual Startup
#### Backend (FastAPI Core)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend (React Admin Console)
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Web Console & API Endpoints

| Portal / API | Address | Description |
|---|---|---|
| **Web Application Portal** | **`http://localhost:5173`** | Citizen & Officer Verification Dashboard |
| **New Screening Form** | **`http://localhost:5173/screening/new`** | Upload ID, capture live webcam selfie, select category |
| **Audit Registry** | **`http://localhost:5173/history`** | Immutable session audit log & search register |
| **Interactive Swagger Docs** | **`http://localhost:8000/docs`** | FastAPI OpenAPI Interactive Documentation |
| **Health Telemetry** | **`http://localhost:8000/api/health`** | Engine health probe |

---

## 🗄️ Database Schema (SQLite Relational Model)

- **`user_persons`**: Registered citizen identity records (`id`, `full_name`, `dob`, `gender`, `nationality`, `father_name`, `address`, `status`).
- **`document_metadata`**: Linked identity credentials (`id`, `person_id`, `document_type`, `document_number`, `issuing_authority`).
- **`screenings`**: Verification dossiers (`id`, `document_type`, `source_type`, `risk_score`, `risk_level`, `extracted_data_json`, `ground_truth_json`, `checksum_validation_json`, `manual_override_status`, `reviewer_notes`).
- **`audit_logs`**: Immutable audit ledger (`id`, `timestamp`, `screening_id`, `event_type`, `actor`, `details`).

---

## 🧪 Automated Testing

To run the automated verification test suite:
```bash
cd backend
python test_sih26188_pipeline.py
```
*Validates Verhoeff Aadhaar algorithm, PAN syntax validator, external database cross-checks, fuzzy typo penalties, and audit trail logging.*

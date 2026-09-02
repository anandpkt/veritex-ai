# VERIDEX AI — AI-Based Fake Identity & Document Screening System

> **Tagline:** *From Document Scan to Explainable Risk*  
> **Problem Statement:** SIH26188 — AI-Based Fake Identity & Document Screening System  
> **Disclaimer:** *Research / Demonstration Prototype — Synthetic Data Only. Standalone execution with zero dataset dependency.*

---

## 🌟 Executive Summary

**VERIDEX AI** is a multi-layer identity and document forensic screening platform designed to analyze physical documents, digital files, and biometric facial feeds to produce transparent, **explainable risk assessments** rather than black-box binary verdicts.

Instead of asserting *"This document is 100% fake"*, VERIDEX AI answers:
> **"Why was this document flagged?"** with a ranked, mathematically fused evidence chain across 6 independent verification pillars.

---

## 🔒 Zero-Dataset Standalone Architecture

To ensure zero friction and 100% reproducibility on any standard CPU laptop:
1. **Built-in Synthetic Document Generator:** Creates high-definition fictional passports and ID cards with security guilloche patterns, microtext, and ICAO 9303 OCR-B Machine-Readable Zones.
2. **6 Deterministic Benchmark Test Cases:** Pre-configured ground-truth scenarios (Genuine, DOB Manipulation, Expired Document, Photo Identity Mismatch, Spliced Image Artifacts, Multiple Compound Fraud).
3. **Local Image Forensics:** Employs Error Level Analysis (ELA), Laplacian high-pass noise variance mapping, and Sobel gradient edge analysis without requiring heavyweight neural networks.
4. **Dual Engine Abstraction:** Seamless fallback from optional deep-learning packages (PaddleOCR / InsightFace / Tesseract) to high-precision algorithmic simulation with standard unified schemas.

---

## 🏗️ Multi-Layer Evidence Chain Architecture

```text
       Document Ingestion (PNG / JPG / PDF)
                         ↓
       OCR Field Extraction & Bounding Boxes
                         ↓
       ICAO 9303 MRZ Parsing & 7-3-1 Checksums
                         ↓
       Field Consistency & Chronology Validation
                         ↓
       Image Forensics (ELA, Noise, Edge Seams)
                         ↓
       Facial Biometric Verification Comparison
                         ↓
       Multi-Signal Weighted Risk Fusion Engine
                         ↓
             Explainable Decision Output
          (LOW / MEDIUM / HIGH / CRITICAL)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Automatic One-Click Launch (Windows)
Double-click:
```bash
start_all.bat
```
Or run separately:
- **Backend:** `.\start_backend.bat` (runs on `http://localhost:8000`)
- **Frontend:** `.\start_frontend.bat` (runs on `http://localhost:5173`)

### 3. Manual Launch

#### Start Backend:
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Documentation (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 🎯 3–5 Minute Hackathon Presentation Walkthrough

| Step | Screen | Action | Key Demonstration Talking Point |
|---|---|---|---|
| **1. Dashboard** | `/` | Open SOC Dashboard | Point out 1,298 daily volume metric, 24h screening graph, and live threat feed tagged as synthetic demo data. |
| **2. Genuine Case** | `/screening/new` | Click **Case 1 — Genuine Passport** | Show Risk **12/100 (LOW RISK)**, all 4 pillars green, action **PASS**. |
| **3. DOB Tampering** | `/screening/new` | Click **Case 2 — DOB Manipulation** | Show Risk **82/100 (HIGH RISK)**, DOB mismatch (Visual 2002 vs MRZ 1992). |
| **4. Forensic Studio** | `/forensics` | Switch tabs: **Heatmap / ELA / Noise / Split Slider** | Demonstrate interactive before/after split slider and suspicious bounding box over DOB. |
| **5. Digital Twin** | `/digital-twin` | View side-by-side table | Show physical scan paired with parsed structured attributes and red mismatch highlights. |
| **6. Identity Graph** | `/identity-graph` | Click entity nodes | Demonstrate the explainable topological graph connecting Subject $\leftrightarrow$ DOB $\leftrightarrow$ MRZ $\leftrightarrow$ OCR. |
| **7. Risk Simulator** | `/risk-simulator` | Toggle signals (Tamper, MRZ, Face) and adjust weights | Show dynamic score recalculation (e.g. 87 $\to$ 69 $\to$ 12) without hard-coded animations. |
| **8. Synthetic Lab** | `/synthetic-lab` | Check "Change Doc Number" + "Corrupt MRZ" $\to$ Generate | Show instantaneous custom specimen generation with ground truth mutation tracking. |
| **9. PDF Dossier** | Dossier Page | Click **Download PDF Dossier** | Open professional multi-page ReportLab PDF report containing full audit evidence. |

---

## 📁 Repository Structure

```text
veridex-ai/
├── backend/
│   ├── main.py                           # FastAPI application & lifecycle
│   ├── database.py                       # SQLite database layer
│   ├── api/
│   │   ├── screening.py                  # Upload, analyze, and retrieve dossiers
│   │   ├── documents.py                  # Synthetic doc lab & presets catalog
│   │   ├── simulation.py                 # Risk simulator calculation sandbox
│   │   ├── dashboard.py                  # SOC dashboard metrics & telemetry
│   │   ├── reports.py                    # PDF report generation
│   │   └── system.py                     # Micro-engine health & diagnostics
│   ├── services/
│   │   ├── synthetic_document_service.py # High-res fictional document generator
│   │   ├── ocr_service.py                # Dual OCR engine (Tesseract/Synthetic fallback)
│   │   ├── mrz_service.py                # ICAO 9303 MRZ parser & 7-3-1 check digits
│   │   ├── validation_service.py         # Rule validation (expiry, chronology)
│   │   ├── forensic_service.py           # ELA, noise variance, edge gradient maps
│   │   ├── face_service.py               # Biometric facial similarity verification
│   │   ├── consistency_service.py        # Cross-signal matrix & identity graph generator
│   │   ├── risk_engine.py                # Weighted multi-signal risk fusion
│   │   └── report_service.py             # ReportLab PDF dossier generator
│   ├── demo_data/
│   │   └── preset_cases.py               # 6 deterministic demo cases with ground truth
│   └── storage/                          # Generated documents, heatmaps, and PDFs
│
├── frontend/
│   ├── src/
│   │   ├── components/                   # RiskGauge, EvidenceCard, ForensicViewer, DigitalTwin, Graph
│   │   ├── pages/                        # Dashboard, NewScreening, Dossier, SyntheticLab, Simulator
│   │   └── services/api.js               # API client wrapper
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── start_all.bat                         # Unified Windows launcher
├── start_backend.bat                     # Backend launcher
├── start_frontend.bat                    # Frontend launcher
└── README.md
```

---

## 🛡️ Ethics & Responsible AI Policy

- **No Real Personal Data:** All names, identity numbers, and photographs are 100% fictional.
- **No Official Claims:** Does not claim authoritative government verification or immigration authority.
- **Explainable Decisions:** Decisions are advisory risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`, `MANUAL VERIFICATION REQUIRED`) backed by observable evidence.

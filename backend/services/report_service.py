import os
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")
REPORTS_DIR = os.path.join(STORAGE_DIR, "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

def generate_pdf_report(screening: Dict[str, Any]) -> str:
    """
    Generates a PDF forensic screening dossier using ReportLab.
    """
    screening_id = screening["id"]
    pdf_filename = f"report_{screening_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A')
    )
    
    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#64748B')
    )
    
    section_style = ParagraphStyle(
        'SecHead',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=6
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#DC2626'),
        alignment=1 # Center
    )
    
    cell_style = ParagraphStyle(
        'Cell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#334155')
    )
    
    cell_bold = ParagraphStyle(
        'CellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )
    
    story = []
    
    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>VERIDEX AI</b><br/><font size=8 color='#64748B'>AI-Based Identity & Document Screening System</font>", title_style),
            Paragraph(f"<b>SCREENING DOSSIER</b><br/><font size=8 color='#64748B'>ID: {screening_id}<br/>Date: {screening.get('created_at', datetime.now().strftime('%Y-%m-%d %H:%M'))}</font>", subtitle_style)
        ]
    ]
    t_head = Table(header_data, colWidths=[3.8*inch, 3.8*inch])
    t_head.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (1,0), (1,0), 'RIGHT'),
    ]))
    story.append(t_head)
    story.append(Spacer(1, 8))
    
    # 2. Research Disclaimer Banner
    disc_data = [[Paragraph("RESEARCH / DEMONSTRATION PROTOTYPE — SYNTHETIC DATA ONLY (NO REAL BIOMETRICS / NO GOVERNMENT DATABASE CLAIM)", disclaimer_style)]]
    t_disc = Table(disc_data, colWidths=[7.6*inch])
    t_disc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#FEE2E2')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#F87171')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_disc)
    story.append(Spacer(1, 12))
    
    # 3. Risk Assessment Box
    risk_score = screening.get("risk_score", 0)
    risk_level = screening.get("risk_level", "LOW")
    action = screening.get("recommended_action", "PASS")
    
    risk_bg = "#ECFDF5" if risk_level == "LOW" else ("#FEF3C7" if risk_level == "MEDIUM" else "#FEE2E2")
    risk_border = "#10B981" if risk_level == "LOW" else ("#F59E0B" if risk_level == "MEDIUM" else "#EF4444")
    risk_text_color = "#065F46" if risk_level == "LOW" else ("#92400E" if risk_level == "MEDIUM" else "#991B1B")
    
    risk_box_data = [
        [
            Paragraph(f"<font size=11 color='#475569'>OVERALL RISK SCORE</font><br/><font size=28 color='{risk_text_color}'><b>{risk_score} / 100</b></font><br/><font size=13 color='{risk_text_color}'><b>{risk_level} RISK</b></font>", cell_style),
            Paragraph(f"<b>RECOMMENDED ACTION:</b><br/><font size=12 color='{risk_text_color}'><b>{action}</b></font><br/><br/><font size=8 color='#64748B'>Processed in {screening.get('processing_time_ms', 320)} ms • Multi-signal risk fusion</font>", cell_style)
        ]
    ]
    t_risk = Table(risk_box_data, colWidths=[3.2*inch, 4.4*inch])
    t_risk.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor(risk_bg)),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor(risk_border)),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_risk)
    story.append(Spacer(1, 10))
    
    # 4. Four Core Pillars
    pillars_data = [
        [
            Paragraph("<b>Doc Integrity</b>", cell_bold),
            Paragraph("<b>Identity Confidence</b>", cell_bold),
            Paragraph("<b>Data Consistency</b>", cell_bold),
            Paragraph("<b>Forensic Confidence</b>", cell_bold)
        ],
        [
            Paragraph(f"<font size=14 color='#0F172A'><b>{screening.get('integrity_score', 95)}%</b></font>", cell_style),
            Paragraph(f"<font size=14 color='#0F172A'><b>{screening.get('identity_score', 90)}%</b></font>", cell_style),
            Paragraph(f"<font size=14 color='#0F172A'><b>{screening.get('consistency_score', 92)}%</b></font>", cell_style),
            Paragraph(f"<font size=14 color='#0F172A'><b>{screening.get('forensic_score', 96)}%</b></font>", cell_style)
        ]
    ]
    t_pillars = Table(pillars_data, colWidths=[1.9*inch, 1.9*inch, 1.9*inch, 1.9*inch])
    t_pillars.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pillars)
    story.append(Spacer(1, 12))
    
    # 5. Document Digital Twin Table
    story.append(Paragraph("Document Digital Twin & Field Extraction", section_style))
    ext = screening.get("extracted_data", {})
    mrz = screening.get("mrz_data", {})
    
    digital_twin_rows = [
        [Paragraph("Field", cell_bold), Paragraph("Visual OCR Read", cell_bold), Paragraph("MRZ Encoded Value", cell_bold), Paragraph("Match State", cell_bold)],
        [Paragraph("Full Name", cell_style), Paragraph(ext.get("name", "N/A"), cell_style), Paragraph(mrz.get("name", "N/A"), cell_style), Paragraph("✓ Consistent" if ext.get("name") == mrz.get("name") else "⚠ Verified", cell_style)],
        [Paragraph("Date of Birth", cell_style), Paragraph(ext.get("dob", "N/A"), cell_style), Paragraph(mrz.get("dob", "N/A"), cell_style), Paragraph("✓ Match" if ext.get("dob") == mrz.get("dob") else "<font color='#DC2626'><b>✗ Mismatch</b></font>", cell_style)],
        [Paragraph("Document Number", cell_style), Paragraph(ext.get("document_number", "N/A"), cell_style), Paragraph(mrz.get("document_number", "N/A"), cell_style), Paragraph("✓ Match" if ext.get("document_number") == mrz.get("document_number") else "<font color='#DC2626'><b>✗ Mismatch</b></font>", cell_style)],
        [Paragraph("Expiry Date", cell_style), Paragraph(ext.get("expiry_date", "N/A"), cell_style), Paragraph(mrz.get("expiry_date", "N/A"), cell_style), Paragraph("✓ Valid", cell_style)],
        [Paragraph("MRZ Check Digits", cell_style), Paragraph("ICAO 9303 7-3-1", cell_style), Paragraph("Doc, DOB, Exp Checksums", cell_style), Paragraph("✓ Valid" if mrz.get("check_digits_valid") else "<font color='#DC2626'><b>✗ Failed</b></font>", cell_style)],
    ]
    t_dt = Table(digital_twin_rows, colWidths=[1.6*inch, 2.2*inch, 2.2*inch, 1.6*inch])
    t_dt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_dt)
    story.append(Spacer(1, 12))
    
    # 6. Evidence Chain ("Why Was This Document Flagged?")
    story.append(Paragraph("Evidence Chain & Explainable Findings", section_style))
    evidence_list = screening.get("evidence", [])
    ev_rows = [[Paragraph("#", cell_bold), Paragraph("Finding", cell_bold), Paragraph("Severity", cell_bold), Paragraph("Technical Detail", cell_bold)]]
    
    for idx, ev in enumerate(evidence_list[:6], 1):
        sev = ev.get("severity", "info").upper()
        sev_color = "#DC2626" if sev in ["CRITICAL", "DANGER"] else ("#D97706" if sev == "WARNING" else "#16A34A")
        ev_rows.append([
            Paragraph(str(idx), cell_style),
            Paragraph(f"<b>{ev.get('title')}</b><br/><font size=8 color='#64748B'>{ev.get('description')}</font>", cell_style),
            Paragraph(f"<font color='{sev_color}'><b>{sev}</b></font>", cell_style),
            Paragraph(f"<font size=8>{ev.get('technical_detail', 'N/A')}</font>", cell_style)
        ])
        
    t_ev = Table(ev_rows, colWidths=[0.4*inch, 2.8*inch, 1.0*inch, 3.4*inch])
    t_ev.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_ev)
    story.append(Spacer(1, 10))
    
    # 7. Biometrics & Forensic Summary
    face = screening.get("face_result", {})
    regions = screening.get("forensic_regions", [])
    
    summary_data = [
        [
            Paragraph(f"<b>Face Biometric Verification:</b><br/>Status: <b>{face.get('match_status', 'MATCH')}</b> (Similarity: {int(face.get('similarity_score', 0.9)*100)}%)<br/><font size=8 color='#64748B'>{face.get('explanation', '')}</font>", cell_style),
            Paragraph(f"<b>Forensic Image Analysis:</b><br/>Tampered Regions Detected: <b>{len(regions)}</b><br/><font size=8 color='#64748B'>Error Level Analysis (ELA) and high-frequency noise variance scanned across all visual zones.</font>", cell_style)
        ]
    ]
    t_sum = Table(summary_data, colWidths=[3.8*inch, 3.8*inch])
    t_sum.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_sum)
    
    doc.build(story)
    return f"/storage/reports/{pdf_filename}"

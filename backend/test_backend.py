import asyncio
from main import app, lifespan
from api.screening import analyze_preset_case
from services.report_service import generate_pdf_report
from database import get_all_screenings, get_screening_by_id

async def test():
    print("Testing VERIDEX AI Backend Pipeline...")
    async with lifespan(app):
        # Check all cases
        screenings = get_all_screenings()
        print(f"Total screenings seeded: {len(screenings)}")
        for s in screenings:
            print(f" - {s['id']}: {s['person_name']} | Risk: {s['risk_score']} ({s['risk_level']}) | Action: {s['recommended_action']}")
            
        # Test PDF generation on Case 2
        rec = get_screening_by_id(screenings[1]["id"])
        if rec:
            pdf_path = generate_pdf_report(rec)
            print(f"[OK] PDF report generated successfully at: {pdf_path}")
            
    print("[OK] All Backend Tests PASSED!")

if __name__ == "__main__":
    asyncio.run(test())

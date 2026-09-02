import os
import math
import random
import hashlib
from io import BytesIO
from typing import Dict, Any, List, Tuple, Optional
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageChops

STORAGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "storage")
DOCUMENTS_DIR = os.path.join(STORAGE_DIR, "documents")
FORENSICS_DIR = os.path.join(STORAGE_DIR, "forensics")

os.makedirs(DOCUMENTS_DIR, exist_ok=True)
os.makedirs(FORENSICS_DIR, exist_ok=True)

def _get_font(size: int = 14, bold: bool = False):
    try:
        # Try common windows fonts
        font_name = "arialbd.ttf" if bold else "arial.ttf"
        font_path = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", font_name)
        if os.path.exists(font_path):
            return ImageFont.truetype(font_path, size)
        # Try Consolas / Courier for MRZ
        mono_path = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "consola.ttf")
        if os.path.exists(mono_path):
            return ImageFont.truetype(mono_path, size)
    except Exception:
        pass
    return ImageFont.load_default()

def _get_mono_font(size: int = 16):
    try:
        mono_path = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "consola.ttf")
        if os.path.exists(mono_path):
            return ImageFont.truetype(mono_path, size)
        ocr_path = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", "cour.ttf")
        if os.path.exists(ocr_path):
            return ImageFont.truetype(ocr_path, size)
    except Exception:
        pass
    return ImageFont.load_default()

def generate_avatar(seed_name: str, width: int = 180, height: int = 220, is_live_photo: bool = False) -> Image.Image:
    """Generates a clean synthetic avatar portrait deterministically based on seed string."""
    img = Image.new("RGB", (width, height), color=(240, 243, 246) if not is_live_photo else (225, 230, 238))
    draw = ImageDraw.Draw(img)
    
    # Hash seed to get deterministic palette and features
    h = int(hashlib.md5(seed_name.encode()).hexdigest(), 16)
    
    skin_tones = [
        (245, 205, 175), # light
        (225, 175, 140), # medium-light
        (198, 145, 105), # medium-tan
        (160, 110, 75),  # deep
        (240, 195, 160)  # olive
    ]
    hair_colors = [
        (40, 30, 25),    # dark brown
        (20, 20, 20),    # black
        (90, 50, 30),    # chestnut
        (140, 90, 50),   # light brown
        (80, 80, 85)     # grey
    ]
    shirt_colors = [
        (35, 60, 95),    # navy
        (50, 80, 60),    # dark green
        (100, 40, 45),   # burgundy
        (55, 55, 65),    # charcoal
        (30, 85, 105)    # teal
    ]
    
    skin = skin_tones[(h >> 4) % len(skin_tones)]
    hair = hair_colors[(h >> 8) % len(hair_colors)]
    shirt = shirt_colors[(h >> 12) % len(shirt_colors)]
    
    # Background gradient / vignette
    for y in range(height):
        grad = int(15 * (y / height))
        r = min(255, max(0, img.getpixel((width//2, y))[0] - grad))
        g = min(255, max(0, img.getpixel((width//2, y))[1] - grad))
        b = min(255, max(0, img.getpixel((width//2, y))[2] - grad))
        draw.line([(0, y), (width, y)], fill=(r, g, b))
        
    # Shoulders / Body
    shoulder_top = int(height * 0.68)
    draw.ellipse([(width * 0.1, shoulder_top), (width * 0.9, height * 1.3)], fill=shirt)
    # Neck
    neck_w = int(width * 0.28)
    neck_x1 = (width - neck_w) // 2
    neck_x2 = neck_x1 + neck_w
    draw.rectangle([(neck_x1, int(height * 0.5)), (neck_x2, shoulder_top + 10)], fill=(int(skin[0]*0.9), int(skin[1]*0.9), int(skin[2]*0.9)))
    
    # Head / Face oval
    head_w = int(width * 0.54)
    head_h = int(height * 0.52)
    head_x = (width - head_w) // 2
    head_y = int(height * 0.16)
    draw.ellipse([(head_x, head_y), (head_x + head_w, head_y + head_h)], fill=skin)
    
    # Hair style
    hair_type = (h >> 16) % 3
    if hair_type == 0:
        # Short hair
        draw.ellipse([(head_x - 4, head_y - 8), (head_x + head_w + 4, head_y + int(head_h * 0.5))], fill=hair)
    elif hair_type == 1:
        # Long/Side hair
        draw.ellipse([(head_x - 8, head_y - 10), (head_x + head_w + 8, head_y + int(head_h * 0.8))], fill=hair)
        draw.ellipse([(head_x + 6, head_y + 8), (head_x + head_w - 6, head_y + head_h)], fill=skin)
    else:
        # Cropped
        draw.arc([(head_x - 2, head_y - 6), (head_x + head_w + 2, head_y + int(head_h * 0.45))], start=180, end=0, fill=hair, width=12)
        
    # Eyes
    eye_y = head_y + int(head_h * 0.45)
    eye_spacing = int(head_w * 0.22)
    mid_x = width // 2
    # Left eye
    draw.ellipse([(mid_x - eye_spacing - 7, eye_y - 4), (mid_x - eye_spacing + 7, eye_y + 4)], fill=(255, 255, 255))
    draw.ellipse([(mid_x - eye_spacing - 3, eye_y - 3), (mid_x - eye_spacing + 3, eye_y + 3)], fill=(40, 30, 20))
    # Right eye
    draw.ellipse([(mid_x + eye_spacing - 7, eye_y - 4), (mid_x + eye_spacing + 7, eye_y + 4)], fill=(255, 255, 255))
    draw.ellipse([(mid_x + eye_spacing - 3, eye_y - 3), (mid_x + eye_spacing + 3, eye_y + 3)], fill=(40, 30, 20))
    
    # Eyebrows
    draw.line([(mid_x - eye_spacing - 9, eye_y - 9), (mid_x - eye_spacing + 7, eye_y - 8)], fill=hair, width=2)
    draw.line([(mid_x + eye_spacing - 7, eye_y - 8), (mid_x + eye_spacing + 9, eye_y - 9)], fill=hair, width=2)
    
    # Nose
    nose_y = head_y + int(head_h * 0.6)
    draw.line([(mid_x, eye_y + 4), (mid_x - 2, nose_y), (mid_x + 3, nose_y)], fill=(int(skin[0]*0.75), int(skin[1]*0.75), int(skin[2]*0.75)), width=2)
    
    # Mouth
    mouth_y = head_y + int(head_h * 0.76)
    draw.line([(mid_x - 10, mouth_y), (mid_x + 10, mouth_y)], fill=(160, 70, 70), width=2)
    
    # Subdued security border if it's passport photo
    if not is_live_photo:
        draw.rectangle([(0, 0), (width - 1, height - 1)], outline=(180, 190, 205), width=2)
    else:
        # Camera badge watermark for live selfie simulation
        cam_font = _get_font(10, bold=True)
        draw.rectangle([(5, height - 20), (width - 5, height - 5)], fill=(15, 23, 42))
        draw.text((10, height - 18), "LIVE VERIFICATION FEED", fill=(16, 185, 129), font=cam_font)
        
    return img

def _draw_guilloche_pattern(draw: ImageDraw.Draw, w: int, h: int, color=(220, 230, 245, 60)):
    """Draws security rosette / guilloche wave patterns in background."""
    for i in range(0, w, 40):
        points = []
        for y in range(0, h, 10):
            x = i + int(12 * math.sin(y * 0.05 + i * 0.1))
            points.append((x, y))
        for p1, p2 in zip(points[:-1], points[1:]):
            draw.line([p1, p2], fill=(225, 235, 248), width=1)
            
    for j in range(0, h, 35):
        points = []
        for x in range(0, w, 10):
            y = j + int(8 * math.cos(x * 0.04 + j * 0.08))
            points.append((x, y))
        for p1, p2 in zip(points[:-1], points[1:]):
            draw.line([p1, p2], fill=(230, 240, 252), width=1)

def generate_synthetic_passport(
    doc_id: str,
    person: Dict[str, Any],
    manipulations: Dict[str, bool],
    mrz_override: Optional[Dict[str, str]] = None,
    avatar_seed: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates a high-resolution fictional synthetic passport image.
    Records ground truth bounding boxes and tampered coordinates.
    """
    width = 850
    height = 540
    
    # Document Canvas with security paper texture
    img = Image.new("RGB", (width, height), color=(248, 250, 253))
    draw = ImageDraw.Draw(img)
    
    # Draw security patterns
    _draw_guilloche_pattern(draw, width, height)
    
    # Outer Passport Booklet Border
    draw.rectangle([(8, 8), (width - 9, height - 9)], outline=(30, 41, 59), width=2)
    draw.rectangle([(12, 12), (width - 13, height - 13)], outline=(148, 163, 184), width=1)
    
    # Header Security Banner
    draw.rectangle([(14, 14), (width - 15, 62)], fill=(15, 23, 42))
    
    font_title = _get_font(18, bold=True)
    font_sub = _get_font(11, bold=False)
    font_field_label = _get_font(10, bold=True)
    font_field_val = _get_font(14, bold=True)
    font_mrz = _get_mono_font(16)
    font_watermark = _get_font(28, bold=True)
    
    draw.text((30, 22), "DEMO SPECIMEN PASSPORT", fill=(255, 255, 255), font=font_title)
    draw.text((450, 24), "NOT A REAL IDENTITY DOCUMENT — SYNTHETIC ONLY", fill=(244, 63, 94), font=font_sub)
    draw.text((30, 44), "DEMO STATE / REPUBLIQUE DE DEMO", fill=(148, 163, 184), font=font_sub)
    
    # Diagonal Watermark across document
    watermark_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    w_draw = ImageDraw.Draw(watermark_img)
    w_draw.text((220, 220), "SYNTHETIC DEMO ONLY", fill=(203, 213, 225, 45), font=font_watermark)
    w_draw.text((250, 260), "NOT A VALID TRAVEL DOCUMENT", fill=(244, 63, 94, 40), font=_get_font(16, bold=True))
    
    # Avatar Photo
    photo_w, photo_h = 160, 200
    photo_x, photo_y = 35, 85
    seed = avatar_seed or person.get("name", "demo_person")
    avatar = generate_avatar(seed, photo_w, photo_h, is_live_photo=False)
    img.paste(avatar, (photo_x, photo_y))
    
    # Secondary Ghost Hologram Image
    ghost_w, ghost_h = 60, 75
    ghost_avatar = avatar.resize((ghost_w, ghost_h)).convert("L").convert("RGB")
    ghost_avatar = ImageEnhance.Brightness(ghost_avatar).enhance(1.4)
    ghost_avatar = ImageEnhance.Contrast(ghost_avatar).enhance(0.6)
    img.paste(ghost_avatar, (width - 100, 110))
    draw.rectangle([(width - 100, 110), (width - 40, 185)], outline=(203, 213, 225), width=1)
    draw.text((width - 98, 95), "GHOST SEAL", fill=(148, 163, 184), font=_get_font(8, bold=True))
    
    # Optical Crest Seal in Background
    draw.ellipse([(660, 210), (790, 340)], outline=(226, 232, 240), width=3)
    draw.ellipse([(680, 230), (770, 320)], outline=(203, 213, 225), width=2)
    draw.text((695, 270), "DEMO", fill=(203, 213, 225), font=_get_font(16, bold=True))
    
    # Visual Inspection Fields
    fields_x = 225
    field_boxes = {}
    tampered_regions = []
    
    # 1. Type / Code / Passport No
    draw.text((fields_x, 80), "Type / Type", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x, 95), "P", fill=(15, 23, 42), font=font_field_val)
    
    draw.text((fields_x + 90, 80), "Code / Code", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x + 90, 95), person.get("nationality", "DEMO"), fill=(15, 23, 42), font=font_field_val)
    
    doc_num = person.get("document_number", "DEMO123456")
    draw.text((fields_x + 220, 80), "Passport No. / No du Passeport", fill=(100, 116, 139), font=font_field_label)
    
    doc_num_box = (fields_x + 220, 95, 170, 24)
    field_boxes["document_number"] = {"x": doc_num_box[0], "y": doc_num_box[1], "width": doc_num_box[2], "height": doc_num_box[3]}
    
    if manipulations.get("change_doc_number"):
        # Spliced altered document number
        draw.rectangle([(doc_num_box[0]-2, doc_num_box[1]-2), (doc_num_box[0]+doc_num_box[2], doc_num_box[1]+doc_num_box[3])], fill=(245, 247, 252))
        draw.text((fields_x + 220, 95), doc_num, fill=(30, 27, 75), font=_get_font(14, bold=True))
        tampered_regions.append({
            "id": "tamper_doc_num",
            "label": "Document Number Splice",
            "x": doc_num_box[0] - 4,
            "y": doc_num_box[1] - 4,
            "width": doc_num_box[2] + 8,
            "height": doc_num_box[3] + 8,
            "confidence": 0.93,
            "anomaly_type": "text_tampering",
            "reason": "Local noise discontinuity & compression seam detected in Document Number region."
        })
    else:
        draw.text((fields_x + 220, 95), doc_num, fill=(15, 23, 42), font=font_field_val)
        
    # 2. Name
    name = person.get("name", "ARUN KUMAR")
    draw.text((fields_x, 130), "Surname & Given Names / Nom et Prenoms", fill=(100, 116, 139), font=font_field_label)
    name_box = (fields_x, 145, 360, 24)
    field_boxes["name"] = {"x": name_box[0], "y": name_box[1], "width": name_box[2], "height": name_box[3]}
    draw.text((fields_x, 145), name, fill=(15, 23, 42), font=_get_font(15, bold=True))
    
    # 3. Nationality
    draw.text((fields_x, 180), "Nationality / Nationalite", fill=(100, 116, 139), font=font_field_label)
    nat_box = (fields_x, 195, 160, 22)
    field_boxes["nationality"] = {"x": nat_box[0], "y": nat_box[1], "width": nat_box[2], "height": nat_box[3]}
    draw.text((fields_x, 195), "DEMONIAN", fill=(15, 23, 42), font=font_field_val)
    
    # 4. Date of Birth (DOB)
    dob = person.get("dob", "15-04-2002")
    draw.text((fields_x + 220, 180), "Date of Birth / Date de Naissance", fill=(100, 116, 139), font=font_field_label)
    dob_box = (fields_x + 220, 195, 160, 24)
    field_boxes["dob"] = {"x": dob_box[0], "y": dob_box[1], "width": dob_box[2], "height": dob_box[3]}
    
    if manipulations.get("change_dob"):
        # Synthesize local patch tampering: subtle color difference & jagged noise boundary
        draw.rectangle([(dob_box[0]-3, dob_box[1]-2), (dob_box[0]+dob_box[2], dob_box[1]+dob_box[3])], fill=(244, 248, 255))
        draw.text((fields_x + 220, 195), dob, fill=(10, 15, 30), font=_get_font(14, bold=True))
        # Add subtle noise speckles to simulate altered patch
        for _ in range(35):
            nx = random.randint(dob_box[0], dob_box[0] + dob_box[2])
            ny = random.randint(dob_box[1], dob_box[1] + dob_box[3])
            draw.point((nx, ny), fill=(210, 220, 235))
            
        tampered_regions.append({
            "id": "tamper_dob",
            "label": "Date of Birth Modification",
            "x": dob_box[0] - 6,
            "y": dob_box[1] - 5,
            "width": dob_box[2] + 12,
            "height": dob_box[3] + 10,
            "confidence": 0.91,
            "anomaly_type": "text_tampering",
            "reason": "Local pixel density inconsistency & font rasterization discrepancy on Date of Birth."
        })
    else:
        draw.text((fields_x + 220, 195), dob, fill=(15, 23, 42), font=font_field_val)
        
    # 5. Sex / Place of Birth
    draw.text((fields_x, 230), "Sex / Sexe", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x, 245), person.get("gender", "M"), fill=(15, 23, 42), font=font_field_val)
    
    draw.text((fields_x + 90, 230), "Place of Birth / Lieu de Naiss.", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x + 90, 245), "METROPOLIS, DEMO", fill=(15, 23, 42), font=font_field_val)
    
    # 6. Issue Date & Expiry Date
    issue_date = person.get("issue_date", "15-04-2022")
    expiry_date = person.get("expiry_date", "15-04-2032")
    
    draw.text((fields_x, 280), "Date of Issue / Date de Delivrance", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x, 295), issue_date, fill=(15, 23, 42), font=font_field_val)
    
    draw.text((fields_x + 220, 280), "Date of Expiry / Date d'Expiration", fill=(100, 116, 139), font=font_field_label)
    expiry_box = (fields_x + 220, 295, 160, 24)
    field_boxes["expiry_date"] = {"x": expiry_box[0], "y": expiry_box[1], "width": expiry_box[2], "height": expiry_box[3]}
    
    if manipulations.get("change_expiry"):
        draw.text((fields_x + 220, 295), expiry_date, fill=(185, 28, 28), font=font_field_val) # highlighted expired
    else:
        draw.text((fields_x + 220, 295), expiry_date, fill=(15, 23, 42), font=font_field_val)
        
    # 7. Issuing Authority
    draw.text((fields_x + 400, 280), "Authority / Autorite", fill=(100, 116, 139), font=font_field_label)
    draw.text((fields_x + 400, 295), "PASSPORT OFFICE 01", fill=(15, 23, 42), font=_get_font(12, bold=True))
    
    # Machine Readable Zone (MRZ) Background Band
    mrz_band_y = 390
    draw.rectangle([(14, mrz_band_y), (width - 15, height - 16)], fill=(241, 245, 249))
    draw.line([(14, mrz_band_y), (width - 15, mrz_band_y)], fill=(203, 213, 225), width=2)
    
    # Generate or format MRZ lines
    if mrz_override:
        mrz_line1 = mrz_override.get("line1", "P<DEMOKUMAR<<ARUN<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        mrz_line2 = mrz_override.get("line2", "DEMO123456DEM0204154M3204154<<<<<<<<<<<<<<02")
    else:
        # Default MRZ computation
        clean_name = name.replace(" ", "<<").upper()
        clean_name = (clean_name + "<" * 39)[:39]
        mrz_line1 = f"P<DEMO{clean_name}"[:44]
        
        # Format birthdate and expiry to YYMMDD
        dob_parts = dob.split("-")
        if len(dob_parts) == 3:
            dob_yy = dob_parts[2][-2:]
            dob_mm = dob_parts[1]
            dob_dd = dob_parts[0]
            mrz_dob = f"{dob_yy}{dob_mm}{dob_dd}"
        else:
            mrz_dob = "020415"
            
        exp_parts = expiry_date.split("-")
        if len(exp_parts) == 3:
            exp_yy = exp_parts[2][-2:]
            exp_mm = exp_parts[1]
            exp_dd = exp_parts[0]
            mrz_exp = f"{exp_yy}{exp_mm}{exp_dd}"
        else:
            mrz_exp = "320415"
            
        clean_doc = (doc_num.upper() + "<" * 9)[:9]
        gender_char = person.get("gender", "M")[0].upper()
        mrz_line2 = f"{clean_doc}9DEM{mrz_dob}4{gender_char}{mrz_exp}4<<<<<<<<<<<<<<02"[:44]
        
    draw.text((35, mrz_band_y + 22), mrz_line1, fill=(15, 23, 42), font=font_mrz)
    draw.text((35, mrz_band_y + 64), mrz_line2, fill=(15, 23, 42), font=font_mrz)
    
    if manipulations.get("modify_mrz"):
        tampered_regions.append({
            "id": "tamper_mrz",
            "label": "Corrupted MRZ Checksum",
            "x": 35,
            "y": mrz_band_y + 15,
            "width": 780,
            "height": 90,
            "confidence": 0.95,
            "anomaly_type": "mrz_inconsistency",
            "reason": "Machine Readable Zone check digit validation failed and contains unverified control bytes."
        })
        
    if manipulations.get("add_image_artifact") and not tampered_regions:
        tampered_regions.append({
            "id": "tamper_artifact",
            "label": "JPEG Compression Block Anomaly",
            "x": 220,
            "y": 90,
            "width": 240,
            "height": 50,
            "confidence": 0.89,
            "anomaly_type": "ela_anomaly",
            "reason": "Error Level Analysis shows elevated high-frequency quantization error indicative of copy-paste splice."
        })
        
    if manipulations.get("replace_photo"):
        tampered_regions.append({
            "id": "tamper_photo",
            "label": "Photo Substitution Seam",
            "x": photo_x - 4,
            "y": photo_y - 4,
            "width": photo_w + 8,
            "height": photo_h + 8,
            "confidence": 0.88,
            "anomaly_type": "photo_tamper",
            "reason": "Boundary edge gradient discrepancy and color palette mismatch around facial portrait frame."
        })
        
    # Composite watermark
    final_img = Image.alpha_composite(img.convert("RGBA"), watermark_img).convert("RGB")
    
    # Save document image
    file_name = f"doc_{doc_id}.jpg"
    file_path = os.path.join(DOCUMENTS_DIR, file_name)
    final_img.save(file_path, "JPEG", quality=95)
    
    # Also generate live face portrait for pairing
    live_seed = seed + "_live" if not manipulations.get("replace_photo") else "imposter_divergent_seed"
    live_avatar = generate_avatar(live_seed, 200, 240, is_live_photo=True)
    live_file_name = f"live_{doc_id}.jpg"
    live_file_path = os.path.join(DOCUMENTS_DIR, live_file_name)
    live_avatar.save(live_file_path, "JPEG", quality=95)
    
    return {
        "doc_id": doc_id,
        "image_path": file_path,
        "image_url": f"/storage/documents/{file_name}",
        "live_photo_url": f"/storage/documents/{live_file_name}",
        "field_boxes": field_boxes,
        "tampered_regions": tampered_regions,
        "mrz_lines": [mrz_line1, mrz_line2],
        "person": person
    }

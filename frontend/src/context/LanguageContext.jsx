import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Utility & Brand
    prototypeBadge: "Government Digital Service — Prototype",
    disclaimerBar: "Research & Demonstration Prototype — 100% Synthetic Fictional Data • Zero Real Biometrics",
    appName: "AI DIGITAL SERVICES",
    appSub: "Citizen-Centric Artificial Intelligence Platform",
    tagline: "From Document Scan to Explainable Risk",
    serviceStatus: "Service Status: Operational",
    appVersion: "Version 1.0",
    lastUpdated: "Last Updated: 02 September 2026",

    // Navigation
    navHome: "Home",
    navScreening: "AI Verification Service",
    navSyntheticLab: "Synthetic Document Lab",
    navForensics: "Document Forensics",
    navDigitalTwin: "Digital Twin",
    navIdentityGraph: "Identity Graph",
    navSimulator: "Risk Simulator",
    navHistory: "Audit History",
    navReports: "Official Dossiers",
    navGuidelines: "Guidelines",
    navSystemStatus: "System Telemetry",

    // Accessibility Controls
    accessibility: "Accessibility",
    textSize: "Text Size",
    highContrast: "High Contrast",
    screenReader: "Screen Reader Access",
    help: "Help & Support",
    skipToContent: "Skip to main content",

    // Common Buttons & Actions
    btnStartService: "Start Using Service",
    btnVerifyDocument: "Verify Document",
    btnGenerateSpecimen: "Generate Test Specimen",
    btnRunScreening: "Run Verification Pipeline",
    btnDownloadPdf: "Download Official Dossier (PDF)",
    btnReset: "Reset",
    btnSearch: "Search",
    btnFilter: "Filter",
    btnViewDetails: "View Full Dossier",
    btnCopy: "Copy Reference ID",
    btnPrint: "Print Record",

    // Notices
    importantNoticeTitle: "Important Public Notice",
    importantNoticeBody: "Please verify all AI-assisted screening assessments before taking official, administrative, or legal action. The system provides explainable risk scoring to assist authorized officers.",
    privacyNoticeTitle: "Privacy & Data Protection Notice",
    privacyNoticeBody: "All personal identifiers, photographs, and records processed in this demonstration environment are 100% fictional and synthetically generated. No real citizen biometrics are stored or transmitted.",

    // Risk Levels & Actions
    riskLow: "LOW RISK",
    riskMedium: "MEDIUM RISK",
    riskHigh: "HIGH RISK",
    riskCritical: "CRITICAL RISK",
    actionPass: "APPROVED / PASS",
    actionManualReview: "MANUAL VERIFICATION REQUIRED",
    actionPhysicalInspect: "SECONDARY PHYSICAL INSPECTION REQUIRED",
    actionReject: "REJECT / FRAUD ALERT",

    // Pillars
    pillarIntegrity: "Document Integrity",
    pillarIdentity: "Identity Confidence",
    pillarConsistency: "Data Consistency",
    pillarForensic: "Forensic Reliability",

    // Footer
    footerAboutTitle: "About AI Digital Services",
    footerAboutText: "AI Digital Services is an automated multi-layer document intelligence platform designed to assist public service officers with explainable identity and document screening.",
    footerLinksTitle: "Quick Navigation",
    footerPoliciesTitle: "Policies & Legal",
    footerInfoTitle: "Service Information",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerAccessibility: "Accessibility Statement",
    footerDisclaimer: "AI Digital Services — Digital Service Prototype. Not an official Government of India website.",
  },
  ta: {
    // Utility & Brand
    prototypeBadge: "அரசு எண்மிய சேவை — மாதிரி தளம்",
    disclaimerBar: "ஆய்வு மற்றும் மாதிரி தளம் — 100% செயற்கை மாதிரி தரவு • உண்மையான உயிரியல் அளவீடுகள் இல்லை",
    appName: "எண்மிய செயற்கை நுண்ணறிவு சேவைகள்",
    appSub: "குடிமக்கள் மைய செயற்கை நுண்ணறிவு தளம்",
    tagline: "ஆவண ஸ்கேன் முதல் விளக்கக்கூடிய இடர் மதிப்பீடு வரை",
    serviceStatus: "சேவை நிலை: செயல்பாட்டில் உள்ளது",
    appVersion: "பதிப்பு 1.0",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது: 02 செப்டம்பர் 2026",

    // Navigation
    navHome: "முகப்பு",
    navScreening: "சரிபார்ப்பு சேவை",
    navSyntheticLab: "செயற்கை ஆவண ஆய்வகம்",
    navForensics: "ஆவண தடயவியல்",
    navDigitalTwin: "எண்மிய இரட்டை",
    navIdentityGraph: "அடையாள வரைபடம்",
    navSimulator: "இடர் மாதிரி",
    navHistory: "சரிபார்ப்பு வரலாறு",
    navReports: "அதிகாரப்பூர்வ அறிக்கைகள்",
    navGuidelines: "வழிகாட்டுதல்கள்",
    navSystemStatus: "கணினி நிலை",

    // Accessibility Controls
    accessibility: "அணுகல்தன்மை",
    textSize: "எழுத்து அளவு",
    highContrast: "உயர் மாறுபாடு",
    screenReader: "திரை வாசிப்பான் அணுகல்",
    help: "உதவி மற்றும் ஆதரவு",
    skipToContent: "முதன்மை உள்ளடக்கத்திற்கு செல்லவும்",

    // Common Buttons & Actions
    btnStartService: "சேவையைத் தொடங்கவும்",
    btnVerifyDocument: "ஆவணத்தை சரிபார்க்கவும்",
    btnGenerateSpecimen: "மாதிரி ஆவணத்தை உருவாக்கவும்",
    btnRunScreening: "சரிபார்ப்பை இயக்கவும்",
    btnDownloadPdf: "அறிக்கையைப் பதிவிறக்கவும் (PDF)",
    btnReset: "மீட்டமை",
    btnSearch: "தேடு",
    btnFilter: "வடிகட்டு",
    btnViewDetails: "முழு விவரங்களைப் பார்க்கவும்",
    btnCopy: "குறிப்பு எண்ணை நகலெடு",
    btnPrint: "அச்சிடுக",

    // Notices
    importantNoticeTitle: "முக்கிய பொது அறிவிப்பு",
    importantNoticeBody: "அதிகாரப்பூர்வ நடவடிக்கை எடுப்பதற்கு முன் செயற்கை நுண்ணறிவு சரிபார்ப்பு முடிவுகளை முழுமையாக ஆய்வு செய்யவும். கணினி அதிகாரிகளுக்கு உதவ விளக்கக்கூடிய இடர் மதிப்பீட்டை வழங்குகிறது.",
    privacyNoticeTitle: "தனியுரிமை மற்றும் தரவு பாதுகாப்பு அறிவிப்பு",
    privacyNoticeBody: "இந்த மாதிரி தளத்தில் கையாளப்படும் அனைத்து பெயர்கள் மற்றும் ஆவணங்கள் 100% மாதிரி தரவுகளாகும். எந்த உண்மையான குடிமகன் தரவும் சேமிக்கப்படவில்லை.",

    // Risk Levels & Actions
    riskLow: "குறைந்த இடர்",
    riskMedium: "நடுத்தர இடர்",
    riskHigh: "அதிக இடர்",
    riskCritical: "மிகத் தீவிர இடர்",
    actionPass: "அங்கீகரிக்கப்பட்டது / தேர்ச்சி",
    actionManualReview: "நேரடி சரிபார்ப்பு தேவை",
    actionPhysicalInspect: "இரண்டாம் நிலை நேரடி ஆய்வு தேவை",
    actionReject: "நிராகரிப்பு / மோசடி எச்சரிக்கை",

    // Pillars
    pillarIntegrity: "ஆவண நம்பகத்தன்மை",
    pillarIdentity: "அடையாள நம்பிக்கை",
    pillarConsistency: "தரவு பொருத்தம்",
    pillarForensic: "தடயவியல் துல்லியம்",

    // Footer
    footerAboutTitle: "எண்மிய சேவைகள் பற்றி",
    footerAboutText: "பொது சேவை அதிகாரிகளுக்கு உதவ ஆவணங்களின் உண்மைத்தன்மையை பல அடுக்குகளில் விளக்கும் வகையில் ஆய்வு செய்யும் தளம்.",
    footerLinksTitle: "விரைவு இணைப்புகள்",
    footerPoliciesTitle: "கொள்கைகள் மற்றும் சட்டம்",
    footerInfoTitle: "சேவை தகவல்",
    footerPrivacy: "தனியுரிமைக் கொள்கை",
    footerTerms: "பயன்பாட்டு விதிமுறைகள்",
    footerAccessibility: "அணுகல்தன்மை அறிக்கை",
    footerDisclaimer: "எண்மிய செயற்கை நுண்ணறிவு சேவைகள் — மாதிரி தளம். இந்திய அரசின் அதிகாரப்பூர்வ தளம் அல்ல.",
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [textScale, setTextScale] = useState('normal'); // 'sm', 'normal', 'lg', 'xl'
  const [highContrast, setHighContrast] = useState(false);

  const t = translations[lang] || translations.en;

  const toggleLanguage = (newLang) => {
    setLang(newLang);
    document.documentElement.lang = newLang;
  };

  const handleTextScale = (scale) => {
    setTextScale(scale);
    document.body.className = `text-scale-${scale} ${highContrast ? 'high-contrast' : ''}`;
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.body.className = `text-scale-${textScale} ${next ? 'high-contrast' : ''}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang: toggleLanguage,
        textScale,
        setTextScale: handleTextScale,
        highContrast,
        toggleHighContrast,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    home: 'Home', horoscope: 'Horoscope', kundli: 'Kundli', zodiac: 'Zodiac',
    compatibility: 'Compatibility', panchang: 'Panchang', services: 'Services',
    tagline: 'Discover Your Cosmic Blueprint',
    heroSub: 'Ancient Vedic wisdom meets modern astrology. Unlock the secrets written in the stars for you.',
    getHoroscope: 'Get Your Horoscope', exploreZodiac: 'Explore Zodiac',
    todaysEnergy: "Today's Cosmic Energy",
    energyDesc: "The planets align in powerful harmony today. Jupiter's expansion meets Saturn's discipline — a perfect day for focused action and spiritual growth.",
    chooseSign: 'Choose Your Sign', chooseSignSub: 'Select your zodiac sign to reveal today\'s cosmic guidance',
    dailyHoroscope: 'Daily Horoscope', dailyHoroscopeDesc: 'Personalized predictions for love, career, and health — crafted from planetary movements.',
    compatibilityCheck: 'Compatibility', compatibilityDesc: 'Discover how the stars align between you and your partner across love, friendship, and marriage.',
    checkNow: 'Check Now', readMore: 'Read More',
    selectSign: 'Select Zodiac Sign', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
    love: 'Love', career: 'Career', health: 'Health', luckyNumber: 'Lucky Number', luckyColor: 'Lucky Color', mood: 'Mood',
    birthChart: 'Birth Chart', birthChartSub: 'Enter your birth details to generate your Vedic Kundli',
    yourName: 'Your Name', dateOfBirth: 'Date of Birth', timeOfBirth: 'Time of Birth', placeOfBirth: 'Place of Birth',
    generateKundli: 'Generate Kundli', planetaryPositions: 'Planetary Positions', yourAscendant: 'Your Ascendant',
    generating: 'Generating your cosmic map...',
    zodiacSigns: 'Zodiac Signs', zodiacSub: 'Explore the twelve celestial archetypes and discover your cosmic identity',
    element: 'Element', ruling: 'Ruling Planet', traits: 'Traits', strengths: 'Strengths', weaknesses: 'Weaknesses', compatible: 'Compatible With',
    compatibilityTitle: 'Compatibility Checker', compatibilitySub: 'Discover the cosmic connection between two souls',
    selectFirst: 'Select First Sign', selectSecond: 'Select Second Sign', checkCompatibility: 'Check Compatibility',
    overall: 'Overall', friendship: 'Friendship', marriage: 'Marriage',
    panchangTitle: 'Panchang', panchangSub: 'Sacred Hindu calendar with daily auspicious timings',
    tithi: 'Tithi', nakshatra: 'Nakshatra', yoga: 'Yoga', karana: 'Karana', auspicious: 'Auspicious Time', inauspicious: 'Inauspicious Time',
    about: 'About', contact: 'Contact', privacy: 'Privacy',
    footerDesc: 'GrahShastra brings ancient Vedic astrological wisdom to the modern seeker.',

    // Services Hub
    servicesTitle: 'Our Sacred Services',
    servicesSub: 'From cosmic readings to divine rituals — all under one celestial roof',
    tabAstrology: 'Astrology', tabNumerology: 'Numerology', tabVastu: 'Vastu Shastra',
    tabConsultation: 'Consultation', tabPooja: 'Pooja Services',

    // Consultation
    consultationTitle: 'Book a Consultation',
    consultationSub: 'Connect with our expert Vedic astrologers for a personalised one-on-one session',
    consultTypes: 'Choose Consultation Type',
    consultName: 'Full Name', consultPhone: 'Phone / WhatsApp', consultEmail: 'Email Address',
    consultDate: 'Preferred Date', consultTime: 'Preferred Time',
    consultMessage: 'Your Question / Concern',
    consultMessagePlaceholder: 'Describe what you\'d like guidance on — career, marriage, health, finance...',
    bookConsult: 'Book Consultation',
    bookingSuccess: 'Booking Confirmed! ✨',
    bookingSuccessMsg: 'Our astrologer will contact you within 24 hours on your WhatsApp / email.',
    consultTypes_astro: 'Astrology Reading', consultTypes_num: 'Numerology Session',
    consultTypes_vastu: 'Vastu Consultation', consultTypes_kundli: 'Kundli Matching',
    consultTypes_career: 'Career & Finance', consultTypes_marriage: 'Marriage & Relationships',
    feeLabel: 'Session Fee', durationLabel: 'Duration', expertLabel: 'Expert',
    min30: '30 min', min60: '60 min', min90: '90 min',

    // Pooja
    poojaTitle: 'Sacred Pooja Services',
    poojaSub: 'Traditional rituals performed by learned pandits for peace, prosperity and divine blessings',
    bookPooja: 'Book This Pooja', poojaDate: 'Select Date', poojaAddress: 'Venue / Address',
    poojaGuests: 'Number of Guests', poojaSpecial: 'Special Requirements', poojaSubmit: 'Confirm Booking',
    poojaSuccess: 'Pooja Booking Confirmed! 🙏',
    poojaSuccessMsg: 'Our pandit will call you 48 hours before the event to confirm all arrangements.',
    poojaCategories: 'Pooja Categories',
    categoryHome: 'Home & Family', categoryOffice: 'Office & Business',
    categoryWedding: 'Weddings & Events', categoryPlanetary: 'Planetary Remedies',
    poojaItems: 'Samagri Included', poojaDuration: 'Duration', poojaPrice: 'Starting From',

    grihaPooja: 'Griha Pravesh Pooja', grihaDesc: 'Sacred housewarming ceremony to bless your new home with divine energy and positive vibrations.',
    satyanarayan: 'Satyanarayan Katha', satyannarayanDesc: 'Auspicious recitation of Lord Vishnu\'s divine tales for blessings, peace and prosperity.',
    navgraha: 'Navgraha Shanti', navgrahaDesc: 'Appease all nine planetary deities and neutralise malefic effects in your birth chart.',
    ganesh: 'Ganesh Pooja', ganeshDesc: 'Remove obstacles and invite auspicious beginnings with Lord Ganesha\'s divine blessings.',
    officePooja: 'Office / Shop Pooja', officeDesc: 'Energise your workspace with positive vibrations for growth, success and employee harmony.',
    udyogPooja: 'Udyog / Business Pooja', udyogDesc: 'Rituals to invoke Goddess Lakshmi and Lord Kuber for financial abundance and business growth.',
    vaastuPooja: 'Vastu Dosh Nivaran', vaastuDesc: 'Correct architectural energy imbalances in your home or office through sacred Vastu rituals.',
    rudrabhishek: 'Rudrabhishek', rudrabhishekDesc: 'Powerful Shiva abhishek to remove negativity, illness and bestow divine protection.',
    kalash: 'Kalash Sthapana', kalashDesc: 'Sacred pot installation to sanctify any new beginning, ceremony or auspicious occasion.',
    sudershan: 'Sudarshana Homa', sudershanDesc: 'Fire ritual invoking Lord Vishnu\'s Sudarshana Chakra to destroy evil and protect family.',

    // Astrology tab
    astrologyTitle: 'Vedic Astrology', astrologySub: 'Ancient Jyotish science decoded for your modern life — Kundli, transits, dashas and more',
    astrologyServices: 'Astrology Services', generateReport: 'Generate Report',
    reportTitle: 'Astrology Report', reportSub: 'Fill in your birth details to generate a detailed personalised astrology report',
    reportGenerating: 'Analysing planetary positions...', reportReady: 'Your Astrology Report is Ready',
    downloadReport: 'Download PDF Report', shareReport: 'Share Report',

    // Numerology
    numerologyTitle: 'Vedic Numerology', numerologySub: 'Decode the sacred numbers that govern your destiny, personality and life path',
    yourFullName: 'Full Name (as per birth certificate)',
    lifePathNumber: 'Life Path Number', destinyNumber: 'Destiny Number', soulNumber: 'Soul Urge Number',
    personalityNumber: 'Personality Number', maturityNumber: 'Maturity Number',
    calculateNumerology: 'Calculate My Numbers',
    numReportTitle: 'Numerology Report', numReportReady: 'Your Numerology Report is Ready',
    numGenerating: 'Calculating your sacred numbers...',

    // Vastu
    vastuTitle: 'Vastu Shastra', vastuSub: 'Align your living and working spaces with the five elements for health, wealth and harmony',
    vastuHome: 'Home Vastu', vastuOffice: 'Office / Shop Vastu', vastuPlot: 'Plot & Land Vastu',
    vastuRemedies: 'Vastu Remedies', vastuTips: 'Vastu Tips', vastuConsult: 'Book Vastu Visit',
    directions: 'Vastu Directions',
    north: 'North', south: 'South', east: 'East', west: 'West',
    northeast: 'North East', northwest: 'North West', southeast: 'South East', southwest: 'South West',
    center: 'Center (Brahmasthan)',
  },

  hi: {
    home: 'होम', horoscope: 'राशिफल', kundli: 'कुंडली', zodiac: 'राशि चक्र',
    compatibility: 'अनुकूलता', panchang: 'पंचांग', services: 'सेवाएँ',
    tagline: 'अपना ब्रह्मांडीय मानचित्र खोजें',
    heroSub: 'प्राचीन वैदिक ज्ञान और आधुनिक ज्योतिष का संगम। तारों में लिखे रहस्यों को उजागर करें।',
    getHoroscope: 'राशिफल देखें', exploreZodiac: 'राशियाँ देखें',
    todaysEnergy: 'आज की ब्रह्मांडीय ऊर्जा',
    energyDesc: 'आज ग्रह शक्तिशाली सामंजस्य में हैं। बृहस्पति का विस्तार शनि के अनुशासन से मिलता है — केंद्रित कार्य और आध्यात्मिक विकास के लिए उत्तम दिन।',
    chooseSign: 'अपनी राशि चुनें', chooseSignSub: 'आज का ब्रह्मांडीय मार्गदर्शन पाने के लिए अपनी राशि चुनें',
    dailyHoroscope: 'दैनिक राशिफल', dailyHoroscopeDesc: 'प्रेम, करियर और स्वास्थ्य के लिए व्यक्तिगत भविष्यवाणियाँ — ग्रहों की गतिविधियों से बनाई गई।',
    compatibilityCheck: 'अनुकूलता', compatibilityDesc: 'जानें कि आपके और आपके साथी के बीच प्रेम, मित्रता और विवाह में तारे कैसे संरेखित होते हैं।',
    checkNow: 'अभी जाँचें', readMore: 'और पढ़ें',
    selectSign: 'राशि चुनें', daily: 'दैनिक', weekly: 'साप्ताहिक', monthly: 'मासिक',
    love: 'प्रेम', career: 'करियर', health: 'स्वास्थ्य', luckyNumber: 'भाग्यशाली अंक', luckyColor: 'भाग्यशाली रंग', mood: 'मनोदशा',
    birthChart: 'जन्म कुंडली', birthChartSub: 'अपनी वैदिक कुंडली बनाने के लिए जन्म विवरण दर्ज करें',
    yourName: 'आपका नाम', dateOfBirth: 'जन्म तिथि', timeOfBirth: 'जन्म समय', placeOfBirth: 'जन्म स्थान',
    generateKundli: 'कुंडली बनाएं', planetaryPositions: 'ग्रहों की स्थिति', yourAscendant: 'आपका लग्न',
    generating: 'आपका ब्रह्मांडीय मानचित्र बन रहा है...',
    zodiacSigns: 'राशि चक्र', zodiacSub: 'बारह खगोलीय आर्कटाइप्स को एक्सप्लोर करें और अपनी ब्रह्मांडीय पहचान खोजें',
    element: 'तत्व', ruling: 'स्वामी ग्रह', traits: 'विशेषताएं', strengths: 'गुण', weaknesses: 'दोष', compatible: 'अनुकूल राशियाँ',
    compatibilityTitle: 'अनुकूलता जाँचकर्ता', compatibilitySub: 'दो आत्माओं के बीच ब्रह्मांडीय संबंध खोजें',
    selectFirst: 'पहली राशि चुनें', selectSecond: 'दूसरी राशि चुनें', checkCompatibility: 'अनुकूलता जाँचें',
    overall: 'कुल', friendship: 'मित्रता', marriage: 'विवाह',
    panchangTitle: 'पंचांग', panchangSub: 'दैनिक शुभ समय के साथ पवित्र हिंदू कैलेंडर',
    tithi: 'तिथि', nakshatra: 'नक्षत्र', yoga: 'योग', karana: 'करण', auspicious: 'शुभ समय', inauspicious: 'अशुभ समय',
    about: 'हमारे बारे में', contact: 'संपर्क', privacy: 'गोपनीयता',
    footerDesc: 'GrahShastra आधुनिक साधकों के लिए प्राचीन वैदिक ज्योतिषीय ज्ञान लाता है।',

    // Services Hub
    servicesTitle: 'हमारी पवित्र सेवाएँ',
    servicesSub: 'ब्रह्मांडीय पठन से दिव्य अनुष्ठान तक — सब एक छत के नीचे',
    tabAstrology: 'ज्योतिष', tabNumerology: 'अंक ज्योतिष', tabVastu: 'वास्तु शास्त्र',
    tabConsultation: 'परामर्श', tabPooja: 'पूजा सेवाएँ',

    // Consultation
    consultationTitle: 'परामर्श बुक करें',
    consultationSub: 'व्यक्तिगत एक-पर-एक सत्र के लिए हमारे विशेषज्ञ वैदिक ज्योतिषियों से जुड़ें',
    consultTypes: 'परामर्श का प्रकार चुनें',
    consultName: 'पूरा नाम', consultPhone: 'फ़ोन / WhatsApp', consultEmail: 'ईमेल पता',
    consultDate: 'पसंदीदा तिथि', consultTime: 'पसंदीदा समय',
    consultMessage: 'आपका प्रश्न / समस्या',
    consultMessagePlaceholder: 'बताएं आप किस विषय पर मार्गदर्शन चाहते हैं — करियर, विवाह, स्वास्थ्य, आर्थिक...',
    bookConsult: 'परामर्श बुक करें',
    bookingSuccess: 'बुकिंग की पुष्टि हो गई! ✨',
    bookingSuccessMsg: 'हमारे ज्योतिषी 24 घंटों के भीतर आपके WhatsApp / ईमेल पर संपर्क करेंगे।',
    consultTypes_astro: 'ज्योतिष पठन', consultTypes_num: 'अंक ज्योतिष सत्र',
    consultTypes_vastu: 'वास्तु परामर्श', consultTypes_kundli: 'कुंडली मिलान',
    consultTypes_career: 'करियर और आर्थिक', consultTypes_marriage: 'विवाह और संबंध',
    feeLabel: 'सत्र शुल्क', durationLabel: 'अवधि', expertLabel: 'विशेषज्ञ',
    min30: '30 मिनट', min60: '60 मिनट', min90: '90 मिनट',

    // Pooja
    poojaTitle: 'पवित्र पूजा सेवाएँ',
    poojaSub: 'शांति, समृद्धि और दिव्य आशीर्वाद के लिए विद्वान पंडितों द्वारा पारंपरिक अनुष्ठान',
    bookPooja: 'यह पूजा बुक करें', poojaDate: 'तिथि चुनें', poojaAddress: 'स्थान / पता',
    poojaGuests: 'अतिथियों की संख्या', poojaSpecial: 'विशेष आवश्यकताएं', poojaSubmit: 'बुकिंग की पुष्टि करें',
    poojaSuccess: 'पूजा बुकिंग की पुष्टि हो गई! 🙏',
    poojaSuccessMsg: 'हमारे पंडित जी कार्यक्रम से 48 घंटे पहले फोन करेंगे।',
    poojaCategories: 'पूजा श्रेणियाँ',
    categoryHome: 'घर और परिवार', categoryOffice: 'कार्यालय और व्यवसाय',
    categoryWedding: 'विवाह और समारोह', categoryPlanetary: 'ग्रह शांति',
    poojaItems: 'सामग्री सहित', poojaDuration: 'अवधि', poojaPrice: 'शुरुआत',

    grihaPooja: 'गृह प्रवेश पूजा', grihaDesc: 'अपने नए घर को दिव्य ऊर्जा और सकारात्मक कंपन से आशीर्वाद देने के लिए पवित्र गृहप्रवेश समारोह।',
    satyanarayan: 'सत्यनारायण कथा', satyannarayanDesc: 'आशीर्वाद, शांति और समृद्धि के लिए भगवान विष्णु की दिव्य कथा का शुभ वाचन।',
    navgraha: 'नवग्रह शांति', navgrahaDesc: 'सभी नौ ग्रह देवताओं को प्रसन्न करें और जन्म कुंडली में दोषों को शांत करें।',
    ganesh: 'गणेश पूजा', ganeshDesc: 'भगवान गणेश के दिव्य आशीर्वाद से बाधाएं दूर करें और शुभ आरंभ का स्वागत करें।',
    officePooja: 'कार्यालय / दुकान पूजा', officeDesc: 'विकास, सफलता और कर्मचारी सद्भाव के लिए अपने कार्यस्थल को सकारात्मक ऊर्जा से सक्रिय करें।',
    udyogPooja: 'उद्योग / व्यापार पूजा', udyogDesc: 'माँ लक्ष्मी और कुबेर जी को आमंत्रित करने के लिए अनुष्ठान — आर्थिक समृद्धि हेतु।',
    vaastuPooja: 'वास्तु दोष निवारण', vaastuDesc: 'पवित्र वास्तु अनुष्ठानों के माध्यम से घर या कार्यालय में वास्तु दोषों का निवारण।',
    rudrabhishek: 'रुद्राभिषेक', rudrabhishekDesc: 'नकारात्मकता और बीमारी दूर करने और दिव्य सुरक्षा के लिए शक्तिशाली शिव अभिषेक।',
    kalash: 'कलश स्थापना', kalashDesc: 'किसी भी नए आरंभ, समारोह या शुभ अवसर को पवित्र करने के लिए कलश स्थापना।',
    sudershan: 'सुदर्शन होम', sudershanDesc: 'भगवान विष्णु के सुदर्शन चक्र को आमंत्रित करने वाला अग्नि अनुष्ठान — बुराई नष्ट करने हेतु।',

    // Astrology tab
    astrologyTitle: 'वैदिक ज्योतिष', astrologySub: 'आपके आधुनिक जीवन के लिए प्राचीन ज्योतिष विज्ञान — कुंडली, गोचर, दशा और अधिक',
    astrologyServices: 'ज्योतिष सेवाएँ', generateReport: 'रिपोर्ट बनाएं',
    reportTitle: 'ज्योतिष रिपोर्ट', reportSub: 'विस्तृत व्यक्तिगत ज्योतिष रिपोर्ट के लिए अपना जन्म विवरण भरें',
    reportGenerating: 'ग्रहों की स्थिति का विश्लेषण हो रहा है...', reportReady: 'आपकी ज्योतिष रिपोर्ट तैयार है',
    downloadReport: 'PDF रिपोर्ट डाउनलोड करें', shareReport: 'रिपोर्ट शेयर करें',

    // Numerology
    numerologyTitle: 'वैदिक अंक ज्योतिष', numerologySub: 'उन पवित्र अंकों को समझें जो आपकी नियति, व्यक्तित्व और जीवन पथ को नियंत्रित करते हैं',
    yourFullName: 'पूरा नाम (जन्म प्रमाण पत्र अनुसार)',
    lifePathNumber: 'जीवन पथ अंक', destinyNumber: 'भाग्य अंक', soulNumber: 'आत्मा अंक',
    personalityNumber: 'व्यक्तित्व अंक', maturityNumber: 'परिपक्वता अंक',
    calculateNumerology: 'मेरे अंक गणना करें',
    numReportTitle: 'अंक ज्योतिष रिपोर्ट', numReportReady: 'आपकी अंक ज्योतिष रिपोर्ट तैयार है',
    numGenerating: 'आपके पवित्र अंकों की गणना हो रही है...',

    // Vastu
    vastuTitle: 'वास्तु शास्त्र', vastuSub: 'स्वास्थ्य, धन और सद्भाव के लिए अपने स्थानों को पंच तत्वों के साथ संरेखित करें',
    vastuHome: 'घर वास्तु', vastuOffice: 'कार्यालय / दुकान वास्तु', vastuPlot: 'भूखंड और भूमि वास्तु',
    vastuRemedies: 'वास्तु उपाय', vastuTips: 'वास्तु टिप्स', vastuConsult: 'वास्तु विजिट बुक करें',
    directions: 'वास्तु दिशाएँ',
    north: 'उत्तर', south: 'दक्षिण', east: 'पूर्व', west: 'पश्चिम',
    northeast: 'उत्तर-पूर्व (ईशान)', northwest: 'उत्तर-पश्चिम (वायव्य)',
    southeast: 'दक्षिण-पूर्व (आग्नेय)', southwest: 'दक्षिण-पश्चिम (नैऋत्य)',
    center: 'केंद्र (ब्रह्मस्थान)',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const t = (key) => translations[lang][key] ?? translations.en[key] ?? key;
  const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en');
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

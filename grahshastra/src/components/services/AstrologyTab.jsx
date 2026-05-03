import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Share2, Star, TrendingUp, Heart, Shield, Zap } from 'lucide-react';
import { zodiacSigns, planetaryData } from '../../data/astroData';
import { GlowButton, FadeIn, Badge, ProgressBar, SkeletonCard } from '../UI';
import { useLang } from '../../context/LanguageContext';

const ASTRO_SERVICES = [
  { icon: '🪐', titleKey: 'Natal Chart Reading', descKey: 'Complete analysis of your birth chart — planets, houses, aspects and their combined influence on your life journey.', price: '₹999', duration: '60 min' },
  { icon: '📅', titleKey: 'Annual Forecast', descKey: 'Year-ahead planetary transits and dashas decoded into actionable guidance for career, love and finance.', price: '₹1,499', duration: '75 min' },
  { icon: '💍', titleKey: 'Kundli Milan', descKey: 'Comprehensive Ashtakoot guna milan and Mangal dosha analysis for marriage compatibility.', price: '₹799', duration: '45 min' },
  { icon: '💼', titleKey: 'Career Astrology', descKey: 'Best career paths, auspicious timings for job change, business launch and promotion decoded from your chart.', price: '₹699', duration: '45 min' },
  { icon: '🌙', titleKey: 'Muhurta Selection', descKey: 'Auspicious timing selection for marriage, business launch, travel, surgery and all major life events.', price: '₹499', duration: '30 min' },
  { icon: '🔮', titleKey: 'Prashna Astrology', descKey: 'Get immediate answers to burning questions through the ancient Vedic horary astrology system.', price: '₹399', duration: '30 min' },
];

const REPORT_SECTIONS_EN = [
  { icon: '☀️', title: 'Sun Sign Analysis', score: 88, desc: 'Your Sun in Aries in the 1st house grants you exceptional leadership qualities and a pioneering spirit. You are naturally confident, direct and energetic — a trailblazer who thrives on challenges and new beginnings.' },
  { icon: '🌙', title: 'Moon Sign & Emotions', score: 74, desc: 'Moon in Taurus in the 4th house blesses you with emotional stability and a deep need for security. You are nurturing, patient and deeply attached to home and family. Financial security is crucial for your emotional wellbeing.' },
  { icon: '⬆️', title: 'Ascendant & Personality', score: 91, desc: 'Scorpio Ascendant gives you an intense, magnetic and perceptive personality. You are strategic, resourceful and possess a natural ability to see through illusions. Others are drawn to your mysterious charisma.' },
  { icon: '♃', title: 'Jupiter & Blessings', score: 82, desc: 'Jupiter in Sagittarius in the 9th house (its own sign and house) is extraordinarily powerful. Expect divine blessings in higher learning, spirituality, long-distance travel and philosophical pursuits throughout your life.' },
  { icon: '♄', title: 'Saturn & Karma', score: 65, desc: 'Saturn in Aquarius in the 4th house creates karmic lessons around home, mother and domestic peace. Property matters may require patience. Service to society and humanitarian work will accelerate your spiritual growth.' },
  { icon: '💕', title: 'Venus & Relationships', score: 79, desc: 'Venus in Libra (its own sign) in the 12th house creates a romantic and idealistic nature. Deep, spiritual connections are favoured over casual relationships. Your partner is likely to be elegant, artistic and refined.' },
];

const REPORT_SECTIONS_HI = [
  { icon: '☀️', title: 'सूर्य राशि विश्लेषण', score: 88, desc: 'पहले भाव में मेष राशि में आपका सूर्य आपको असाधारण नेतृत्व गुण और अग्रणी भावना प्रदान करता है। आप स्वाभाविक रूप से आत्मविश्वासी, सीधे और ऊर्जावान हैं — एक पथप्रदर्शक जो चुनौतियों में फलता-फूलता है।' },
  { icon: '🌙', title: 'चंद्र राशि और भावनाएं', score: 74, desc: 'चौथे भाव में वृषभ राशि में चंद्रमा आपको भावनात्मक स्थिरता और सुरक्षा की गहरी जरूरत का आशीर्वाद देता है। आप पोषण करने वाले, धैर्यवान और घर-परिवार से गहराई से जुड़े हैं।' },
  { icon: '⬆️', title: 'लग्न और व्यक्तित्व', score: 91, desc: 'वृश्चिक लग्न आपको तीव्र, चुंबकीय और बोधगम्य व्यक्तित्व देता है। आप रणनीतिक, साधन-संपन्न हैं और भ्रम को देखने की स्वाभाविक क्षमता रखते हैं।' },
  { icon: '♃', title: 'बृहस्पति और आशीर्वाद', score: 82, desc: 'धनु राशि में नवम भाव में बृहस्पति (अपनी राशि और भाव में) असाधारण रूप से शक्तिशाली है। उच्च शिक्षा, अध्यात्म और दार्शनिक खोज में दिव्य आशीर्वाद की प्रतीक्षा करें।' },
  { icon: '♄', title: 'शनि और कर्म', score: 65, desc: 'कुंभ में चतुर्थ भाव में शनि घर, माता और घरेलू शांति के आसपास कर्म संबंधी पाठ बनाता है। संपत्ति के मामलों में धैर्य की आवश्यकता हो सकती है।' },
  { icon: '💕', title: 'शुक्र और संबंध', score: 79, desc: 'तुला राशि में (अपनी राशि में) द्वादश भाव में शुक्र रोमांटिक और आदर्शवादी स्वभाव बनाता है। गहरे, आध्यात्मिक संबंधों को आकस्मिक संबंधों पर तरजीह दी जाती है।' },
];

export default function AstrologyTab() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: '', dob: '', tob: '', place: '' });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeService, setActiveService] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === 'hi' ? 'नाम आवश्यक है' : 'Name is required';
    if (!form.dob) e.dob = lang === 'hi' ? 'जन्म तिथि आवश्यक है' : 'Date of birth required';
    if (!form.tob) e.tob = lang === 'hi' ? 'जन्म समय आवश्यक है' : 'Time of birth required';
    if (!form.place.trim()) e.place = lang === 'hi' ? 'स्थान आवश्यक है' : 'Place required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleGenerate = () => {
    if (!validate()) return;
    setLoading(true);
    setReport(null);
    setTimeout(() => {
      setReport(true);
      setLoading(false);
    }, 2500);
  };

  const sections = lang === 'hi' ? REPORT_SECTIONS_HI : REPORT_SECTIONS_EN;

  return (
    <div className="space-y-10">
      {/* Services Grid */}
      <div>
        <h3 className="text-lg font-bold text-amber-400 mb-5 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
          🌟 {t('astrologyServices')}
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASTRO_SERVICES.map((svc, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-card p-5 border border-purple-800/30 hover:border-amber-500/40 transition-all duration-300 group cursor-pointer"
                onClick={() => setActiveService(activeService === i ? null : i)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{svc.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>{svc.titleKey}</h4>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="gold">{svc.price}</Badge>
                      <Badge variant="purple">{svc.duration}</Badge>
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {activeService === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-slate-400 text-xs leading-relaxed"
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    >
                      {svc.descKey}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="cosmic-divider" />

      {/* Report Generation */}
      <div>
        <h3 className="text-lg font-bold text-amber-400 mb-2 text-center" style={{ fontFamily: 'Cinzel, serif' }}>
          📋 {t('reportTitle')}
        </h3>
        <p className="text-slate-400 text-sm text-center mb-6" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {t('reportSub')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form */}
          <div className="glass-card p-6 space-y-4">
            {[
              { key: 'name', label: t('yourName'), type: 'text', placeholder: lang === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name' },
              { key: 'dob', label: t('dateOfBirth'), type: 'date', placeholder: '' },
              { key: 'tob', label: t('timeOfBirth'), type: 'time', placeholder: '' },
              { key: 'place', label: t('placeOfBirth'), type: 'text', placeholder: lang === 'hi' ? 'शहर, देश' : 'City, Country' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium" style={{ fontFamily: 'Cinzel, serif' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className={`cosmic-input w-full px-4 py-2.5 rounded-xl text-sm ${errors[f.key] ? 'border-red-500/60' : ''}`}
                  style={{ fontFamily: 'Raleway, sans-serif', colorScheme: 'dark' }}
                />
                {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
              </div>
            ))}
            <GlowButton variant="gold" className="w-full py-3" onClick={handleGenerate} disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">🪐</motion.span>{t('reportGenerating')}</span>
                : `📋 ${t('generateReport')}`}
            </GlowButton>
          </div>

          {/* Report preview or placeholder */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </motion.div>
            )}
            {!loading && !report && (
              <motion.div key="ph" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="text-7xl">🌌</motion.div>
                  <p className="text-slate-500 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                    {lang === 'hi' ? 'जन्म विवरण भरें और रिपोर्ट बनाएं' : 'Fill birth details to generate your report'}
                  </p>
                </div>
              </motion.div>
            )}
            {!loading && report && (
              <motion.div key="rep" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-transparent">
                  <h4 className="text-amber-400 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>✦ {t('reportReady')}</h4>
                  <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.08 }} className="px-3 py-1.5 text-xs glass-card-dark border border-purple-700/40 rounded-xl text-purple-300 flex items-center gap-1.5">
                      <Download size={12} />{lang === 'hi' ? 'PDF' : 'PDF'}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.08 }} className="px-3 py-1.5 text-xs glass-card-dark border border-purple-700/40 rounded-xl text-purple-300 flex items-center gap-1.5">
                      <Share2 size={12} />{lang === 'hi' ? 'शेयर' : 'Share'}
                    </motion.button>
                  </div>
                </div>
                {sections.map((sec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-4 border border-purple-800/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{sec.icon}</span>
                      <span className="text-xs font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{sec.title}</span>
                      <span className="ml-auto text-amber-400 text-xs font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{sec.score}/100</span>
                    </div>
                    <div className="mb-2">
                      <ProgressBar value={sec.score} color="purple" showPercent={false} />
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>{sec.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

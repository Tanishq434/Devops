import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton, FadeIn, Badge } from '../UI';
import { useLang } from '../../context/LanguageContext';

const VASTU_DIRECTIONS = [
  { key: 'north', element: 'Water', deity: 'Kuber', color: '#06b6d4', icon: '💧', benefits: 'Wealth, Career, Finance', tipEn: 'Keep this zone clutter-free. Place a water feature, safe or locker here for financial prosperity.', tipHi: 'यह क्षेत्र साफ रखें। आर्थिक समृद्धि के लिए यहाँ जल तत्व, तिजोरी रखें।', grid: 'col-start-2 row-start-1' },
  { key: 'northeast', element: 'Water/Earth', deity: 'Ishaan (Shiva)', color: '#818cf8', icon: '🙏', benefits: 'Wisdom, Spirituality, Health', tipEn: 'The most sacred zone. Place prayer room, meditation space or water here. Keep it very clean.', tipHi: 'सबसे पवित्र क्षेत्र। यहाँ पूजा कक्ष, ध्यान स्थान रखें। इसे बहुत स्वच्छ रखें।', grid: 'col-start-3 row-start-1' },
  { key: 'east', element: 'Air', deity: 'Indra', color: '#22c55e', icon: '🌅', benefits: 'Health, Growth, New Beginnings', tipEn: 'Allow maximum morning sunlight. Ideal for living room, prayer room. Keep windows open here.', tipHi: 'अधिकतम प्रातःकाल की धूप आने दें। बैठक, पूजा कक्ष के लिए आदर्श। यहाँ खिड़कियाँ खुली रखें।', grid: 'col-start-3 row-start-2' },
  { key: 'southeast', element: 'Fire', deity: 'Agni', color: '#ef4444', icon: '🔥', benefits: 'Energy, Wealth, Kitchen', tipEn: 'Ideal zone for kitchen and fire-related activities. Electrical appliances, generator can be placed here.', tipHi: 'रसोई और अग्नि संबंधी गतिविधियों के लिए आदर्श। यहाँ विद्युत उपकरण रखें।', grid: 'col-start-3 row-start-3' },
  { key: 'south', element: 'Fire/Earth', deity: 'Yama', color: '#f97316', icon: '🏆', benefits: 'Fame, Success, Achievements', tipEn: 'Heavy furniture, stairs and store rooms are best here. Avoid main entrance or sleeping with head to south.', tipHi: 'भारी फर्नीचर, सीढ़ियाँ यहाँ सबसे अच्छी हैं। मुख्य प्रवेश या दक्षिण की ओर सिर करके सोने से बचें।', grid: 'col-start-2 row-start-3' },
  { key: 'southwest', element: 'Earth', deity: 'Niriti', color: '#84cc16', icon: '🏠', benefits: 'Stability, Relationships, Master Bedroom', tipEn: 'Master bedroom belongs here. Keep this zone heavy and stable. Owner should sleep here with head to south.', tipHi: 'मुख्य शयनकक्ष यहाँ होना चाहिए। यह क्षेत्र भारी और स्थिर रखें। मालिक दक्षिण की ओर सिर करके सोएं।', grid: 'col-start-1 row-start-3' },
  { key: 'west', element: 'Air', deity: 'Varuna', color: '#a855f7', icon: '🌊', benefits: 'Gains, Children, Study', tipEn: 'Children\'s room, study room and dining room are ideal here. Good for earning and accumulation of wealth.', tipHi: 'बच्चों का कमरा, पढ़ाई का कमरा यहाँ आदर्श है। कमाई और धन संचय के लिए अच्छा।', grid: 'col-start-1 row-start-2' },
  { key: 'northwest', element: 'Air', deity: 'Vayu', color: '#0ea5e9', icon: '💨', benefits: 'Communication, Guests, Support', tipEn: 'Guest rooms and store rooms work well here. Good for communication, travel and business support.', tipHi: 'अतिथि कक्ष यहाँ अच्छे रहते हैं। संचार, यात्रा और व्यापार सहायता के लिए अच्छा।', grid: 'col-start-1 row-start-1' },
  { key: 'center', element: 'Space/Akasha', deity: 'Brahma', color: '#f59e0b', icon: '☀️', benefits: 'Overall Health & Family Harmony', tipEn: 'The Brahmasthan — must be kept open, clean and free from heavy structures. Central courtyard is ideal.', tipHi: 'ब्रह्मस्थान — खुला, साफ और भारी निर्माण से मुक्त रखें। केंद्रीय आँगन आदर्श है।', grid: 'col-start-2 row-start-2' },
];

const VASTU_SERVICES = [
  { icon: '🏠', titleEn: 'Home Vastu Analysis', titleHi: 'घर वास्तु विश्लेषण', price: '₹2,499', descEn: 'Complete room-by-room Vastu analysis of your home with detailed correction report and remedy prescription.', descHi: 'आपके घर का कमरा-दर-कमरा वास्तु विश्लेषण और विस्तृत सुधार रिपोर्ट।' },
  { icon: '🏢', titleEn: 'Office / Shop Vastu', titleHi: 'कार्यालय / दुकान वास्तु', price: '₹3,499', descEn: 'Business space Vastu for maximum productivity, sales growth and positive workplace energy.', descHi: 'अधिकतम उत्पादकता, बिक्री वृद्धि के लिए व्यावसायिक स्थान वास्तु।' },
  { icon: '🌿', titleEn: 'Plot Selection', titleHi: 'भूखंड चयन', price: '₹1,999', descEn: 'Expert Vastu evaluation of plot shape, soil quality, direction and surrounding energies before purchase.', descHi: 'खरीदने से पहले भूखंड का विशेषज्ञ वास्तु मूल्यांकन।' },
  { icon: '🛠️', titleEn: 'Vastu Remedies', titleHi: 'वास्तु उपाय', price: '₹999', descEn: 'Non-structural Vastu corrections using crystals, mirrors, colors, yantras and plants — no demolition required.', descHi: 'स्फटिक, दर्पण, रंग, यंत्र का उपयोग करके गैर-संरचनात्मक वास्तु सुधार।' },
];

const VASTU_TIPS = [
  { icon: '🚪', en: 'Main entrance should ideally face North, East or North-East. Avoid South-West entrance.', hi: 'मुख्य प्रवेश द्वार उत्तर, पूर्व या उत्तर-पूर्व की ओर होना चाहिए।' },
  { icon: '🍳', en: 'Kitchen should be in the South-East zone and cook should face East while cooking.', hi: 'रसोई दक्षिण-पूर्व में होनी चाहिए और खाना बनाते समय पूर्व की ओर मुख होना चाहिए।' },
  { icon: '😴', en: 'Sleeping with your head to the South or East is most beneficial. Never sleep facing North.', hi: 'दक्षिण या पूर्व की ओर सिर करके सोना सबसे लाभकारी है। उत्तर की ओर कभी न सोएं।' },
  { icon: '🪴', en: 'Tulsi plant in North-East attracts divine blessings. Avoid cactus and thorny plants inside the home.', hi: 'उत्तर-पूर्व में तुलसी दिव्य आशीर्वाद आकर्षित करती है। घर के अंदर कैक्टस से बचें।' },
  { icon: '💧', en: 'Water features, aquariums and fountains are best placed in the North or North-East.', hi: 'जल तत्व, एक्वेरियम उत्तर या उत्तर-पूर्व में सबसे अच्छे हैं।' },
  { icon: '🪞', en: 'Mirrors should not face the bed directly. Best placed on North or East walls.', hi: 'दर्पण सीधे बिस्तर के सामने नहीं होना चाहिए। उत्तर या पूर्व दीवार पर सबसे अच्छे हैं।' },
];

export default function VastuTab() {
  const { t, lang } = useLang();
  const [selected, setSelected] = useState(null);

  const sel = selected !== null ? VASTU_DIRECTIONS.find(d => d.key === selected) : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <FadeIn>
        <div className="glass-card-dark p-6 text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <h3 className="text-xl font-bold gradient-text-gold mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{t('vastuTitle')}</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto" style={{ fontFamily: 'Raleway, sans-serif' }}>{t('vastuSub')}</p>
        </div>
      </FadeIn>

      {/* Vastu Compass Grid */}
      <div>
        <h4 className="text-amber-400 font-bold text-sm text-center mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
          🧭 {t('directions')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compass */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1.5 aspect-square max-w-xs mx-auto w-full">
            {VASTU_DIRECTIONS.map((dir, i) => (
              <motion.button
                key={dir.key}
                onClick={() => setSelected(selected === dir.key ? null : dir.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={`${dir.grid} flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                  selected === dir.key
                    ? 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'border-purple-800/30 hover:border-purple-600/50'
                }`}
                style={{ background: selected === dir.key ? `${dir.color}22` : `${dir.color}0a` }}
              >
                <span className="text-xl mb-0.5">{dir.icon}</span>
                <span className="text-xs font-bold leading-tight text-center" style={{ color: dir.color, fontFamily: 'Cinzel, serif', fontSize: '9px' }}>
                  {t(dir.key)}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Direction detail */}
          <AnimatePresence mode="wait">
            {sel ? (
              <motion.div
                key={sel.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-5 border h-fit"
                style={{ borderColor: `${sel.color}33` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{sel.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm" style={{ fontFamily: 'Cinzel, serif' }}>{t(sel.key)}</h4>
                    <p className="text-xs" style={{ color: sel.color, fontFamily: 'Cinzel, serif' }}>{sel.deity} · {sel.element}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Benefits</p>
                  <p className="text-sm text-amber-300 font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>{sel.benefits}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                    {lang === 'hi' ? 'वास्तु टिप' : 'Vastu Tip'}
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {lang === 'hi' ? sel.tipHi : sel.tipEn}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ph"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex items-center justify-center h-full"
              >
                <p className="text-slate-500 text-sm text-center" style={{ fontFamily: 'Cinzel, serif' }}>
                  {lang === 'hi' ? '← किसी दिशा पर क्लिक करें' : '← Click any direction to learn more'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Services */}
      <div>
        <h4 className="text-amber-400 font-bold text-sm text-center mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
          🏛️ {lang === 'hi' ? 'वास्तु सेवाएँ' : 'Vastu Services'}
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {VASTU_SERVICES.map((svc, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <motion.div whileHover={{ scale: 1.02, y: -3 }} className="glass-card p-5 border border-purple-800/30 hover:border-amber-500/30 transition-all">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl">{svc.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                        {lang === 'hi' ? svc.titleHi : svc.titleEn}
                      </h5>
                      <Badge variant="gold">{svc.price}</Badge>
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {lang === 'hi' ? svc.descHi : svc.descEn}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div>
        <h4 className="text-amber-400 font-bold text-sm text-center mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
          💡 {t('vastuTips')}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {VASTU_TIPS.map((tip, i) => (
            <FadeIn key={i} delay={i * 0.07}>
              <motion.div whileHover={{ x: 4 }} className="glass-card p-4 border border-green-900/30 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{tip.icon}</span>
                <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {lang === 'hi' ? tip.hi : tip.en}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

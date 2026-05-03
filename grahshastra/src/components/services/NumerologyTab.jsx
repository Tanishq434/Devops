import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { GlowButton, FadeIn, ProgressBar, SkeletonCard } from '../UI';
import { useLang } from '../../context/LanguageContext';

// ── Numerology calculation engine ──────────────────────────────
const LETTER_VALUES = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const VOWELS = new Set(['A','E','I','O','U']);

function reduceNum(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + +d, 0);
  }
  return n;
}

function calcLifePath(dob) {
  if (!dob) return null;
  const digits = dob.replace(/-/g,'').split('').map(Number);
  return reduceNum(digits.reduce((a, d) => a + d, 0));
}

function calcDestiny(name) {
  if (!name.trim()) return null;
  const total = name.toUpperCase().replace(/[^A-Z]/g,'').split('').reduce((a, c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNum(total);
}

function calcSoul(name) {
  if (!name.trim()) return null;
  const total = name.toUpperCase().replace(/[^A-Z]/g,'').split('').filter(c => VOWELS.has(c)).reduce((a, c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNum(total || 1);
}

function calcPersonality(name) {
  if (!name.trim()) return null;
  const total = name.toUpperCase().replace(/[^A-Z]/g,'').split('').filter(c => !VOWELS.has(c)).reduce((a, c) => a + (LETTER_VALUES[c]||0), 0);
  return reduceNum(total || 1);
}

function calcMaturity(lp, destiny) {
  if (!lp || !destiny) return null;
  return reduceNum(lp + destiny);
}

// ── Number meanings ──────────────────────────────────────────────
const NUM_MEANINGS = {
  en: {
    1: { title: 'The Leader', desc: 'Independent, pioneering, ambitious. Born to lead and innovate. Your path is one of self-reliance and original thinking.', color: '#ef4444', traits: ['Ambitious','Independent','Creative','Original','Driven'] },
    2: { title: 'The Peacemaker', desc: 'Sensitive, cooperative and diplomatic. You thrive in partnerships and have a gift for seeing multiple perspectives.', color: '#ec4899', traits: ['Diplomatic','Sensitive','Cooperative','Intuitive','Gentle'] },
    3: { title: 'The Creator', desc: 'Expressive, joyful and communicative. Your life path is filled with creativity, social connections and artistic expression.', color: '#f59e0b', traits: ['Creative','Expressive','Social','Optimistic','Artistic'] },
    4: { title: 'The Builder', desc: 'Practical, disciplined and hardworking. You build lasting structures — in life, relationships and career — with patience and precision.', color: '#22c55e', traits: ['Disciplined','Reliable','Practical','Patient','Organised'] },
    5: { title: 'The Adventurer', desc: 'Freedom-loving, versatile and curious. Change is your natural habitat. You are adaptable, adventurous and always seeking new experiences.', color: '#a855f7', traits: ['Adventurous','Versatile','Curious','Free-spirited','Dynamic'] },
    6: { title: 'The Nurturer', desc: 'Responsible, caring and harmonious. Family and community are your foundations. You are a natural healer and provider.', color: '#06b6d4', traits: ['Caring','Responsible','Harmonious','Protective','Healing'] },
    7: { title: 'The Seeker', desc: 'Analytical, introspective and spiritually inclined. You seek deep truth and wisdom beyond the surface of things.', color: '#8b5cf6', traits: ['Analytical','Spiritual','Introspective','Wise','Mysterious'] },
    8: { title: 'The Achiever', desc: 'Ambitious, powerful and materially successful. You are destined for achievement in the material world — business, finance and authority.', color: '#d97706', traits: ['Ambitious','Powerful','Successful','Authoritative','Resilient'] },
    9: { title: 'The Humanitarian', desc: 'Compassionate, generous and idealistic. Your soul\'s mission is to serve humanity and leave the world better than you found it.', color: '#10b981', traits: ['Compassionate','Generous','Idealistic','Wise','Selfless'] },
    11: { title: 'The Visionary (Master)', desc: 'Highly intuitive, inspirational and spiritually gifted. Master Number 11 carries exceptional spiritual awareness and the potential for profound impact.', color: '#818cf8', traits: ['Intuitive','Inspirational','Psychic','Spiritual','Illuminating'] },
    22: { title: 'The Master Builder', desc: 'Visionary combined with practical power to build lasting legacies. Master Number 22 has the capacity to turn the greatest dreams into reality.', color: '#f59e0b', traits: ['Visionary','Practical','Powerful','Legacy-builder','Masterful'] },
    33: { title: 'The Master Teacher', desc: 'The most spiritually evolved of all numbers — compassionate wisdom at the highest level, dedicated to the upliftment of all souls.', color: '#ec4899', traits: ['Compassionate','Wise','Spiritual','Nurturing','Selfless'] },
  },
  hi: {
    1: { title: 'नेता', desc: 'स्वतंत्र, अग्रणी, महत्वाकांक्षी। नेतृत्व और नवाचार के लिए जन्मे। आपका मार्ग आत्मनिर्भरता और मौलिक सोच का है।', color: '#ef4444', traits: ['महत्वाकांक्षी','स्वतंत्र','रचनात्मक','मौलिक','दृढ़'] },
    2: { title: 'शांतिदूत', desc: 'संवेदनशील, सहयोगी और कूटनीतिक। आप साझेदारी में फलते-फूलते हैं और कई दृष्टिकोणों को देखने की प्रतिभा रखते हैं।', color: '#ec4899', traits: ['कूटनीतिक','संवेदनशील','सहयोगी','सहज ज्ञानयुक्त','कोमल'] },
    3: { title: 'रचनाकार', desc: 'अभिव्यंजक, आनंदमय और संचारी। आपका जीवन पथ रचनात्मकता, सामाजिक संबंधों और कलात्मक अभिव्यक्ति से भरा है।', color: '#f59e0b', traits: ['रचनात्मक','अभिव्यंजक','सामाजिक','आशावादी','कलात्मक'] },
    4: { title: 'निर्माता', desc: 'व्यावहारिक, अनुशासित और मेहनती। आप जीवन, रिश्तों और करियर में धैर्य और परिशुद्धता के साथ स्थायी संरचनाएं बनाते हैं।', color: '#22c55e', traits: ['अनुशासित','विश्वसनीय','व्यावहारिक','धैर्यवान','व्यवस्थित'] },
    5: { title: 'साहसी', desc: 'स्वतंत्रता-प्रेमी, बहुमुखी और जिज्ञासु। परिवर्तन आपका प्राकृतिक आवास है। आप अनुकूलनीय, साहसी हैं।', color: '#a855f7', traits: ['साहसी','बहुमुखी','जिज्ञासु','स्वतंत्र','गतिशील'] },
    6: { title: 'पालनकर्ता', desc: 'जिम्मेदार, देखभाल करने वाला और सामंजस्यपूर्ण। परिवार और समुदाय आपकी नींव हैं।', color: '#06b6d4', traits: ['देखभाल करने वाला','जिम्मेदार','सामंजस्यपूर्ण','सुरक्षात्मक','उपचारक'] },
    7: { title: 'साधक', desc: 'विश्लेषणात्मक, आत्मनिरीक्षण करने वाला और आध्यात्मिक। आप चीजों की सतह से परे गहरे सत्य और ज्ञान की तलाश करते हैं।', color: '#8b5cf6', traits: ['विश्लेषणात्मक','आध्यात्मिक','आत्मनिरीक्षण','ज्ञानी','रहस्यमय'] },
    8: { title: 'उपलब्धिकर्ता', desc: 'महत्वाकांक्षी, शक्तिशाली और भौतिक रूप से सफल। व्यापार, वित्त और अधिकार में उपलब्धि के लिए नियत।', color: '#d97706', traits: ['महत्वाकांक्षी','शक्तिशाली','सफल','आधिकारिक','लचीला'] },
    9: { title: 'मानवतावादी', desc: 'दयालु, उदार और आदर्शवादी। आपकी आत्मा का मिशन मानवता की सेवा करना और दुनिया को बेहतर बनाना है।', color: '#10b981', traits: ['दयालु','उदार','आदर्शवादी','ज्ञानी','निःस्वार्थ'] },
    11: { title: 'दूरदर्शी (मास्टर)', desc: 'अत्यधिक सहज, प्रेरणादायक और आध्यात्मिक रूप से प्रतिभाशाली। मास्टर नंबर 11 असाधारण आध्यात्मिक जागरूकता लाता है।', color: '#818cf8', traits: ['सहज ज्ञानयुक्त','प्रेरणादायक','मनोवैज्ञानिक','आध्यात्मिक','प्रकाशमान'] },
    22: { title: 'मास्टर बिल्डर', desc: 'स्थायी विरासत बनाने की व्यावहारिक शक्ति के साथ दूरदर्शिता। मास्टर नंबर 22 सबसे बड़े सपनों को वास्तविकता में बदलने की क्षमता रखता है।', color: '#f59e0b', traits: ['दूरदर्शी','व्यावहारिक','शक्तिशाली','विरासत-निर्माता','कुशल'] },
    33: { title: 'मास्टर शिक्षक', desc: 'सभी अंकों में सबसे अधिक आध्यात्मिक — सर्वोच्च स्तर पर दयालु ज्ञान, सभी आत्माओं के उत्थान के लिए समर्पित।', color: '#ec4899', traits: ['दयालु','ज्ञानी','आध्यात्मिक','पोषण करने वाला','निःस्वार्थ'] },
  }
};

function NumberCard({ label, value, color, delay = 0, lang }) {
  const meanings = NUM_MEANINGS[lang] || NUM_MEANINGS.en;
  const meaning = meanings[value] || meanings[1];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="glass-card p-5 border border-purple-800/30 hover:border-amber-500/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
          style={{ background: `${meaning.color}22`, border: `1px solid ${meaning.color}44`, color: meaning.color, boxShadow: `0 0 15px ${meaning.color}33`, fontFamily: 'Cinzel, serif' }}
        >
          {value}
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>{label}</p>
          <p className="text-sm font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{meaning.title}</p>
        </div>
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>{meaning.desc}</p>
      <div className="flex flex-wrap gap-1">
        {meaning.traits.map(tr => (
          <span key={tr} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${meaning.color}15`, color: meaning.color, border: `1px solid ${meaning.color}30`, fontFamily: 'Cinzel, serif', fontSize: '10px' }}>
            {tr}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function NumerologyTab() {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!name.trim() || !dob) {
      setError(lang === 'hi' ? 'कृपया नाम और जन्म तिथि दर्ज करें' : 'Please enter your name and date of birth');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const lp = calcLifePath(dob);
      const destiny = calcDestiny(name);
      const soul = calcSoul(name);
      const personality = calcPersonality(name);
      const maturity = calcMaturity(lp, destiny);
      setResult({ lifePath: lp, destiny, soul, personality, maturity, name, dob });
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Header visual */}
      <FadeIn>
        <div className="glass-card-dark p-6 text-center relative overflow-hidden">
          <div className="nebula-blob w-48 h-48 bg-purple-700 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.12 }} />
          <div className="relative z-10">
            <div className="flex justify-center gap-4 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <motion.span
                  key={n}
                  animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: n * 0.2 }}
                  className="text-lg font-bold"
                  style={{ color: `hsl(${n * 40}, 70%, 65%)`, fontFamily: 'Cinzel, serif' }}
                >
                  {n}
                </motion.span>
              ))}
            </div>
            <h3 className="text-xl font-bold gradient-text-gold mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{t('numerologyTitle')}</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto" style={{ fontFamily: 'Raleway, sans-serif' }}>{t('numerologySub')}</p>
          </div>
        </div>
      </FadeIn>

      {/* Calculator Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <FadeIn direction="left">
          <div className="glass-card p-6 space-y-4">
            <h4 className="font-bold text-amber-400 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
              🔢 {t('numReportTitle')}
            </h4>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{t('yourFullName')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: Rahul Kumar Sharma' : 'e.g. Rahul Kumar Sharma'}
                className="cosmic-input w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{t('dateOfBirth')}</label>
              <input
                type="date"
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="cosmic-input w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <GlowButton variant="gold" className="w-full py-3" onClick={handleCalculate} disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">🔢</motion.span>{t('numGenerating')}</span>
                : `🔢 ${t('calculateNumerology')}`}
            </GlowButton>

            {/* What we calculate */}
            <div className="pt-2 space-y-1.5">
              {[t('lifePathNumber'), t('destinyNumber'), t('soulNumber'), t('personalityNumber'), t('maturityNumber')].map((label, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <span className="text-purple-500">✦</span> {label}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Quick number guide */}
        <FadeIn direction="right">
          <div className="glass-card p-5">
            <h4 className="font-bold text-purple-300 text-sm mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              {lang === 'hi' ? '✨ अंकों का अर्थ' : '✨ Number Meanings'}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6,7,8,9].map(n => {
                const meanings = NUM_MEANINGS[lang] || NUM_MEANINGS.en;
                const m = meanings[n];
                return (
                  <motion.div key={n} whileHover={{ scale: 1.05 }}
                    className="p-2 rounded-xl text-center cursor-default border border-slate-800/50 hover:border-purple-700/50 transition-all"
                    style={{ background: `${m.color}11` }}>
                    <p className="text-lg font-black mb-0.5" style={{ color: m.color, fontFamily: 'Cinzel, serif' }}>{n}</p>
                    <p className="text-slate-400 leading-tight" style={{ fontSize: '9px', fontFamily: 'Cinzel, serif' }}>{m.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-amber-400 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                ✦ {t('numReportReady')} — {result.name}
              </h4>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.08 }} className="px-3 py-1.5 text-xs glass-card-dark border border-purple-700/40 rounded-xl text-purple-300 flex items-center gap-1.5">
                  <Download size={11} /> PDF
                </motion.button>
                <motion.button whileHover={{ scale: 1.08 }} className="px-3 py-1.5 text-xs glass-card-dark border border-purple-700/40 rounded-xl text-purple-300 flex items-center gap-1.5">
                  <Share2 size={11} /> {lang === 'hi' ? 'शेयर' : 'Share'}
                </motion.button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: t('lifePathNumber'), value: result.lifePath, delay: 0 },
                { label: t('destinyNumber'), value: result.destiny, delay: 0.1 },
                { label: t('soulNumber'), value: result.soul, delay: 0.2 },
                { label: t('personalityNumber'), value: result.personality, delay: 0.3 },
                { label: t('maturityNumber'), value: result.maturity, delay: 0.4 },
              ].map(({ label, value, delay }) => (
                <NumberCard key={label} label={label} value={value} delay={delay} lang={lang} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

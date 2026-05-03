import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, Star, Heart, Briefcase, Zap } from 'lucide-react';
import { zodiacSigns } from '../data/astroData';
import { GlowButton, FadeIn, Card, SectionHeader, ZodiacMini } from '../components/UI';
import { useLang } from '../context/LanguageContext';

// Animated planet component
function Planet({ size, color, top, left, delay = 0, duration = 8 }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}cc, ${color}44)`,
        boxShadow: `0 0 ${size}px ${color}44`,
        top, left,
        filter: 'blur(0.5px)',
      }}
    />
  );
}

// Zodiac symbol ring
function ZodiacRing() {
  const symbols = zodiacSigns.map(s => s.symbol);
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
      {/* Center orb */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-8 rounded-full border border-purple-500/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-16 rounded-full border border-amber-500/20"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-700/60 to-indigo-700/60 flex items-center justify-center border border-purple-500/40"
          style={{ boxShadow: '0 0 40px rgba(107,33,168,0.5), 0 0 80px rgba(107,33,168,0.2)' }}
        >
          <span className="text-4xl">🪐</span>
        </motion.div>
      </div>
      {/* Orbiting symbols */}
      {symbols.map((sym, i) => {
        const angle = (i / symbols.length) * 360;
        const rad = angle * (Math.PI / 180);
        const r = 130;
        const x = Math.cos(rad) * r + 48;
        const y = Math.sin(rad) * r + 48;
        return (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', left: `calc(50% + ${Math.cos(rad) * r}px - 16px)`, top: `calc(50% + ${Math.sin(rad) * r}px - 16px)` }}
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 flex items-center justify-center text-lg"
              style={{ color: `hsl(${i * 30}, 70%, 70%)`, textShadow: `0 0 10px hsl(${i * 30}, 70%, 50%)` }}
            >
              {sym}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const handleSignSelect = (sign) => {
    setSelectedSign(sign.id);
    setTimeout(() => navigate(`/horoscope?sign=${sign.id}`), 300);
  };

  // Today's date display
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Floating planets */}
        <Planet size="80px" color="#6b21a8" top="15%" left="5%" delay={0} duration={8} />
        <Planet size="50px" color="#f59e0b" top="25%" left="88%" delay={2} duration={10} />
        <Planet size="40px" color="#0ea5e9" top="70%" left="3%" delay={1} duration={7} />
        <Planet size="60px" color="#4338ca" top="75%" left="90%" delay={3} duration={9} />
        <Planet size="30px" color="#ec4899" top="45%" left="92%" delay={1.5} duration={12} />

        {/* Cosmic energy banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-900/10 backdrop-blur-sm"
        >
          <p className="text-amber-400 text-xs md:text-sm font-semibold flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            ✦ {t('todaysEnergy')} ✦
            <Sparkles className="w-4 h-4 animate-pulse" />
          </p>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-2 leading-none"
            style={{ fontFamily: 'Cinzel Decorative, serif' }}
          >
            <span className="gradient-text-gold text-glow-gold">Grah</span>
            <span className="gradient-text-cosmic">Shastra</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="cosmic-divider max-w-md mx-auto my-5"
          />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-200 mb-6"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {t('tagline')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: 'Raleway, sans-serif' }}
          >
            {t('heroSub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/horoscope">
              <GlowButton variant="gold" className="w-full sm:w-auto px-8 py-4 text-base">
                ✨ {t('getHoroscope')}
              </GlowButton>
            </Link>
            <Link to="/zodiac">
              <GlowButton variant="outline" className="w-full sm:w-auto px-8 py-4 text-base">
                ♈ {t('exploreZodiac')}
              </GlowButton>
            </Link>
          </motion.div>

          {/* Zodiac ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="mb-12"
          >
            <ZodiacRing />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-purple-400 opacity-60"
        >
          <span className="text-xs tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>SCROLL</span>
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ===== COSMIC ENERGY BANNER ===== */}
      <FadeIn>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20">
          <div className="cosmic-border rounded-3xl overflow-hidden">
            <div className="glass-card-dark p-6 md:p-8 rounded-3xl">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-600/20 flex items-center justify-center text-3xl flex-shrink-0 border border-amber-500/30">
                  ☀️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <h3 className="text-amber-400 font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                      {t('todaysEnergy')} · {today}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {t('energyDesc')}
                  </p>
                </div>
                <div className="flex gap-4 text-center flex-shrink-0">
                  {['☀️ Aries', '🌙 Taurus', '⬆️ Gemini'].map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-lg">{item.split(' ')[0]}</p>
                      <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'Cinzel, serif' }}>{item.split(' ')[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ===== ZODIAC SELECTOR ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <SectionHeader
          title={t('chooseSign')}
          subtitle={t('chooseSignSub')}
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {},
          }}
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 md:gap-3"
        >
          {zodiacSigns.map((sign, i) => (
            <motion.div
              key={sign.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
            >
              <ZodiacMini
                sign={sign}
                selected={selectedSign === sign.id}
                onClick={() => handleSignSelect(sign)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Daily Horoscope Preview */}
          <FadeIn direction="left">
            <Card hover glow className="h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/30 to-orange-700/20 flex items-center justify-center text-2xl border border-amber-600/30 flex-shrink-0">
                  🔮
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                    {t('dailyHoroscope')}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {t('dailyHoroscopeDesc')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Heart, label: t('love'), color: 'text-pink-400' },
                  { icon: Briefcase, label: t('career'), color: 'text-blue-400' },
                  { icon: Zap, label: t('health'), color: 'text-green-400' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="glass-card-dark p-3 text-center rounded-xl">
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                    <span className="text-xs text-slate-400" style={{ fontFamily: 'Cinzel, serif' }}>{label}</span>
                  </div>
                ))}
              </div>
              <Link to="/horoscope">
                <GlowButton variant="gold" className="w-full">
                  {t('readMore')} →
                </GlowButton>
              </Link>
            </Card>
          </FadeIn>

          {/* Compatibility Preview */}
          <FadeIn direction="right">
            <Card hover glow className="h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-600/30 to-rose-700/20 flex items-center justify-center text-2xl border border-pink-600/30 flex-shrink-0">
                  💘
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                    {t('compatibilityCheck')}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {t('compatibilityDesc')}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['♈ ♌', '♋ ♏', '♊ ♎', '♉ ♍'].map((pair, i) => (
                  <div key={i} className="px-3 py-1.5 glass-card-dark rounded-xl text-sm text-purple-300 border border-purple-800/30">
                    {pair}
                  </div>
                ))}
              </div>
              <Link to="/compatibility">
                <GlowButton variant="primary" className="w-full">
                  {t('checkNow')} →
                </GlowButton>
              </Link>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ===== WHY GRAHSHASTRA ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <FadeIn>
          <SectionHeader title="Ancient Wisdom. Modern Clarity." subtitle="GrahShastra bridges thousands of years of Vedic astrological knowledge with an intuitive digital experience." />
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '🪐', title: 'Vedic Astrology', desc: 'Rooted in 5,000 years of Jyotish tradition' },
            { icon: '✨', title: 'Daily Guidance', desc: 'Fresh cosmic insights updated every day' },
            { icon: '🔐', title: 'Private & Sacred', desc: 'Your birth data stays completely private' },
            { icon: '🌍', title: 'Hindi & English', desc: 'Available in both Indian languages' },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="glass-card p-5 text-center zodiac-card group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h4 className="font-bold text-white mb-2 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>{item.title}</h4>
                <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>


      {/* ===== SERVICES PROMO ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24">
        <FadeIn>
          <SectionHeader
            title={lang === 'hi' ? 'हमारी पवित्र सेवाएँ' : 'Our Sacred Services'}
            subtitle={lang === 'hi' ? 'ज्योतिष, अंक ज्योतिष, वास्तु, परामर्श और पूजा — सब एक जगह' : 'Astrology, Numerology, Vastu, Consultation & Pooja — all in one place'}
          />
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { icon: '🪐', labelEn: 'Astrology', labelHi: 'ज्योतिष', tab: 'astrology', color: 'from-purple-700/30 to-indigo-700/20', border: 'border-purple-700/40' },
            { icon: '🔢', labelEn: 'Numerology', labelHi: 'अंक ज्योतिष', tab: 'numerology', color: 'from-blue-700/30 to-cyan-700/20', border: 'border-blue-700/40' },
            { icon: '🏛️', labelEn: 'Vastu', labelHi: 'वास्तु', tab: 'vastu', color: 'from-green-700/30 to-emerald-700/20', border: 'border-green-700/40' },
            { icon: '🧑‍💼', labelEn: 'Consultation', labelHi: 'परामर्श', tab: 'consultation', color: 'from-amber-700/30 to-orange-700/20', border: 'border-amber-700/40' },
            { icon: '🕉️', labelEn: 'Pooja', labelHi: 'पूजा', tab: 'pooja', color: 'from-rose-700/30 to-pink-700/20', border: 'border-rose-700/40' },
          ].map((svc, i) => (
            <FadeIn key={svc.tab} delay={i * 0.08}>
              <Link to={`/services?tab=${svc.tab}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className={`glass-card p-5 text-center border ${svc.border} bg-gradient-to-br ${svc.color} cursor-pointer group transition-all duration-300 hover:shadow-[0_0_25px_rgba(107,33,168,0.25)]`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{svc.icon}</div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                    {lang === 'hi' ? svc.labelHi : svc.labelEn}
                  </p>
                </motion.div>
              </Link>
            </FadeIn>
          ))}
        </div>
        <div className="text-center">
          <Link to="/services">
            <GlowButton variant="primary" className="px-10 py-3">
              {lang === 'hi' ? '✨ सभी सेवाएँ देखें' : '✨ Explore All Services'}
            </GlowButton>
          </Link>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-24">
        <FadeIn>
          <div className="cosmic-border rounded-3xl overflow-hidden">
            <div
              className="relative p-10 md:p-16 text-center rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(107,33,168,0.25) 0%, rgba(67,56,202,0.2) 50%, rgba(124,58,237,0.15) 100%)' }}
            >
              <div className="nebula-blob w-64 h-64 bg-purple-600 -top-20 -left-20" style={{ opacity: 0.2 }} />
              <div className="nebula-blob w-48 h-48 bg-indigo-600 -bottom-10 -right-10" style={{ opacity: 0.15 }} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-6xl mb-6 inline-block"
              >
                🌌
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold gradient-text-aurora mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                Begin Your Cosmic Journey
              </h2>
              <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Your birth chart holds the blueprint of your destiny. Let GrahShastra decode the language of the stars for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/kundli">
                  <GlowButton variant="gold" className="px-10 py-4 text-base">
                    🪐 Generate Your Kundli
                  </GlowButton>
                </Link>
                <Link to="/zodiac">
                  <GlowButton variant="outline" className="px-10 py-4 text-base">
                    ♈ Explore Signs
                  </GlowButton>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
// Services section added via patch - see ServicesPage.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { zodiacSigns, getCompatibility } from '../data/astroData';
import { GlowButton, SectionHeader, FadeIn, ProgressBar } from '../components/UI';
import { useLang } from '../context/LanguageContext';

function CircleMeter({ value, label, color, delay = 0 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const colorMap = {
    pink: { stroke: '#ec4899', glow: '#ec489944', text: 'text-pink-400' },
    purple: { stroke: '#8b5cf6', glow: '#8b5cf644', text: 'text-purple-400' },
    gold: { stroke: '#f59e0b', glow: '#f59e0b44', text: 'text-amber-400' },
  };
  const c = colorMap[color] || colorMap.pink;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          {/* Background circle */}
          <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          {/* Progress circle */}
          <motion.circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference * (1 - value / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.5 }}
            className={`text-lg font-black ${c.text}`}
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
        {label}
      </span>
    </div>
  );
}

function SignDropdown({ label, value, onChange }) {
  return (
    <div className="flex-1 min-w-[140px]">
      <label className="block text-xs text-purple-300 font-semibold mb-2 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="cosmic-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
        style={{ fontFamily: 'Cinzel, serif', colorScheme: 'dark' }}
      >
        <option value="">— Select —</option>
        {zodiacSigns.map(s => (
          <option key={s.id} value={s.id}>
            {s.symbol} {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CompatibilityPage() {
  const { t } = useLang();
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const s1 = zodiacSigns.find(s => s.id === sign1);
  const s2 = zodiacSigns.find(s => s.id === sign2);

  const handleCheck = () => {
    if (!sign1 || !sign2) { setError('Please select both zodiac signs.'); return; }
    if (sign1 === sign2) { setError('Please select two different zodiac signs.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(getCompatibility(sign1, sign2));
      setLoading(false);
    }, 1200);
  };

  const overallScore = result ? Math.round((result.love + result.friendship + result.marriage) / 3) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader title={t('compatibilityTitle')} subtitle={t('compatibilitySub')} />

      {/* Selector */}
      <FadeIn>
        <div className="glass-card p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <SignDropdown label={t('selectFirst')} value={sign1} onChange={v => { setSign1(v); setResult(null); }} />
            {/* VS divider */}
            <div className="flex-shrink-0 pb-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600/40 to-rose-600/30 border border-pink-600/40 flex items-center justify-center text-xl"
              >
                💘
              </motion.div>
            </div>
            <SignDropdown label={t('selectSecond')} value={sign2} onChange={v => { setSign2(v); setResult(null); }} />
          </div>

          {/* Sign preview */}
          {(s1 || s2) && (
            <div className="flex items-center justify-center gap-4 mb-6">
              {s1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-4 py-2 glass-card-dark rounded-xl border border-purple-800/30">
                  <span className="text-2xl">{s1.symbol}</span>
                  <div>
                    <p className="text-xs font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{s1.name}</p>
                    <p className="text-xs text-slate-500" style={{ fontFamily: 'Raleway, sans-serif' }}>{s1.element}</p>
                  </div>
                </motion.div>
              )}
              {s1 && s2 && <span className="text-slate-500 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>+</span>}
              {s2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-4 py-2 glass-card-dark rounded-xl border border-purple-800/30">
                  <span className="text-2xl">{s2.symbol}</span>
                  <div>
                    <p className="text-xs font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{s2.name}</p>
                    <p className="text-xs text-slate-500" style={{ fontFamily: 'Raleway, sans-serif' }}>{s2.element}</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs text-center mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
              ⚠ {error}
            </p>
          )}

          <GlowButton
            variant="gold"
            className="w-full py-4 text-base"
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">💫</motion.span>
                Reading the Stars...
              </span>
            ) : `💘 ${t('checkCompatibility')}`}
          </GlowButton>
        </div>
      </FadeIn>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            {/* Overall score banner */}
            <div className="cosmic-border rounded-3xl overflow-hidden mb-6">
              <div className="glass-card-dark p-6 md:p-8 text-center rounded-3xl relative overflow-hidden">
                <div className="nebula-blob w-48 h-48 bg-pink-600 -top-10 left-1/2 -translate-x-1/2" style={{ opacity: 0.15 }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-6 mb-4">
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      {s1?.symbol}
                    </motion.span>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        className="text-5xl font-black gradient-text-aurora mb-1"
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        {overallScore}%
                      </motion.div>
                      <p className="text-slate-400 text-xs tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                        {t('overall')} Match
                      </p>
                    </div>
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="text-4xl"
                    >
                      {s2?.symbol}
                    </motion.span>
                  </div>
                  <p className="text-base font-semibold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
                    {s1?.name} & {s2?.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Circle meters */}
            <div className="glass-card p-6 md:p-8 mb-6">
              <div className="flex justify-around items-center flex-wrap gap-4">
                <CircleMeter value={result.love} label={t('love')} color="pink" delay={0} />
                <CircleMeter value={result.friendship} label={t('friendship')} color="purple" delay={0.2} />
                <CircleMeter value={result.marriage} label={t('marriage')} color="gold" delay={0.4} />
              </div>
            </div>

            {/* Progress bars */}
            <div className="glass-card p-6 md:p-8 mb-6 space-y-5">
              <ProgressBar value={result.love} label={`❤️ ${t('love')} Compatibility`} color="pink" />
              <ProgressBar value={result.friendship} label={`👥 ${t('friendship')} Compatibility`} color="purple" />
              <ProgressBar value={result.marriage} label={`💍 ${t('marriage')} Compatibility`} color="gold" />
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="glass-card p-6 md:p-8"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🌟</span>
                <div>
                  <h4 className="text-amber-400 font-bold mb-2 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                    Cosmic Reading
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {result.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick compatibility matrix preview */}
      {!result && (
        <FadeIn delay={0.3}>
          <div className="glass-card p-6">
            <h3 className="text-center text-sm font-bold text-purple-300 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              ✨ Famous Compatible Pairs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { a: '♈', b: '♌', label: 'Aries + Leo', score: 95 },
                { a: '♋', b: '♏', label: 'Cancer + Scorpio', score: 93 },
                { a: '♊', b: '♎', label: 'Gemini + Libra', score: 90 },
                { a: '♉', b: '♑', label: 'Taurus + Capricorn', score: 88 },
              ].map((pair, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  className="glass-card-dark p-3 text-center rounded-xl border border-purple-800/30"
                >
                  <p className="text-xl mb-1">{pair.a} {pair.b}</p>
                  <p className="text-xs text-slate-400 mb-1" style={{ fontFamily: 'Cinzel, serif', fontSize: '10px' }}>{pair.label}</p>
                  <p className="text-amber-400 font-bold text-sm" style={{ fontFamily: 'Cinzel, serif' }}>{pair.score}%</p>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

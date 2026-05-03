import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Briefcase, Zap, Sparkles } from 'lucide-react';
import { zodiacSigns, horoscopeData, defaultHoroscope } from '../data/astroData';
import { GlowButton, Card, SectionHeader, ZodiacMini, FadeIn, Badge, SkeletonCard, StatCard } from '../components/UI';
import { useLang } from '../context/LanguageContext';

const TABS = ['daily', 'weekly', 'monthly'];

export default function HoroscopePage() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [selectedSign, setSelectedSign] = useState(
    zodiacSigns.find(s => s.id === searchParams.get('sign')) || zodiacSigns[0]
  );
  const [tab, setTab] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const loadHoroscope = (sign, tabKey) => {
    setLoading(true);
    setData(null);
    setTimeout(() => {
      const signData = horoscopeData[sign.id] || {};
      setData(signData[tabKey] || defaultHoroscope[tabKey]);
      setLoading(false);
    }, 700);
  };

  useEffect(() => { loadHoroscope(selectedSign, tab); }, [selectedSign, tab]);

  const handleSignChange = (sign) => {
    setSelectedSign(sign);
  };

  const elementColors = {
    Fire: 'fire', Water: 'water', Earth: 'earth', Air: 'air'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        title={t('horoscope')}
        subtitle={`${selectedSign.symbol} ${selectedSign.name} ${selectedSign.dates}`}
      />

      {/* Zodiac Sign Selector */}
      <FadeIn className="mb-8">
        <div className="glass-card p-4 md:p-6">
          <p className="text-xs text-amber-400 font-semibold mb-4 tracking-widest uppercase text-center" style={{ fontFamily: 'Cinzel, serif' }}>
            {t('selectSign')}
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {zodiacSigns.map(sign => (
              <ZodiacMini
                key={sign.id}
                sign={sign}
                selected={selectedSign.id === sign.id}
                onClick={() => handleSignChange(sign)}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1} className="mb-8">
        <div className="flex gap-2 justify-center">
          {TABS.map(tabKey => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                tab === tabKey
                  ? 'tab-active text-amber-300 border-purple-600/60'
                  : 'bg-transparent border-slate-700/40 text-slate-400 hover:border-purple-700/50 hover:text-slate-300'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {tab === tabKey && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-xl tab-active"
                />
              )}
              <span className="relative z-10">
                {tabKey === 'daily' && '☀️ '}
                {tabKey === 'weekly' && '🌙 '}
                {tabKey === 'monthly' && '🌟 '}
                {t(tabKey)}
              </span>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Sign Header */}
      <FadeIn delay={0.2} className="mb-8">
        <div className="glass-card-dark p-6 md:p-8 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 50% 50%, ${selectedSign.color}, transparent)` }}
          />
          <div className="relative z-10">
            <motion.div
              key={selectedSign.id}
              initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="text-7xl mb-3"
              style={{ textShadow: `0 0 30px ${selectedSign.color}` }}
            >
              {selectedSign.symbol}
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
              {selectedSign.name}
              {selectedSign.hindiName && <span className="text-amber-400 ml-3 text-xl">({selectedSign.hindiName})</span>}
            </h2>
            <p className="text-slate-400 text-sm mb-3" style={{ fontFamily: 'Raleway, sans-serif' }}>{selectedSign.dates}</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant={elementColors[selectedSign.element] || 'purple'}>
                {selectedSign.element} Element
              </Badge>
              <Badge variant="gold">
                {selectedSign.ruling}
              </Badge>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Horoscope Cards */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </motion.div>
        ) : data ? (
          <motion.div
            key={`${selectedSign.id}-${tab}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { key: 'love', icon: Heart, emoji: '❤️', label: t('love'), color: 'text-pink-400', borderColor: 'border-pink-800/30', bg: 'from-pink-900/20 to-rose-900/10' },
                { key: 'career', icon: Briefcase, emoji: '💼', label: t('career'), color: 'text-blue-400', borderColor: 'border-blue-800/30', bg: 'from-blue-900/20 to-indigo-900/10' },
                { key: 'health', icon: Zap, emoji: '🧘', label: t('health'), color: 'text-green-400', borderColor: 'border-green-800/30', bg: 'from-green-900/20 to-teal-900/10' },
              ].map(({ key, icon: Icon, emoji, label, color, borderColor, bg }, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <div className={`glass-card p-6 h-full border ${borderColor} hover:scale-[1.02] transition-all duration-300`}
                    style={{ background: `linear-gradient(135deg, ${bg.replace('from-', '').replace(' to-', ', ')})` }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-xl`}>
                        {emoji}
                      </div>
                      <h3 className={`font-bold text-base ${color}`} style={{ fontFamily: 'Cinzel, serif' }}>{label}</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
                      {data[key]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lucky info row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon="🎲" label={t('luckyNumber')} value={data.lucky} color="gold" />
                <StatCard icon="🎨" label={t('luckyColor')} value={data.color} color="purple" />
                <StatCard icon="✨" label={t('mood')} value={data.mood} color="teal" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

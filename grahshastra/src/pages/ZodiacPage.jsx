import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Shield, AlertTriangle, Heart } from 'lucide-react';
import { zodiacSigns } from '../data/astroData';
import { SectionHeader, FadeIn, Badge, GlowButton } from '../components/UI';
import { useLang } from '../context/LanguageContext';

const elementColors = {
  Fire: { bg: 'from-red-900/30 to-orange-900/20', border: 'border-red-800/40', badge: 'fire', icon: '🔥' },
  Water: { bg: 'from-cyan-900/30 to-blue-900/20', border: 'border-cyan-800/40', badge: 'water', icon: '💧' },
  Earth: { bg: 'from-green-900/30 to-emerald-900/20', border: 'border-green-800/40', badge: 'earth', icon: '🌿' },
  Air: { bg: 'from-blue-900/30 to-indigo-900/20', border: 'border-blue-800/40', badge: 'air', icon: '💨' },
};

function ZodiacDetailModal({ sign, onClose }) {
  const { t } = useLang();
  if (!sign) return null;
  const ec = elementColors[sign.element] || elementColors.Fire;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 z-10"
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(7,11,26,0.95)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${ec.bg} border ${ec.border} flex items-center justify-center`}
            style={{ boxShadow: `0 0 30px ${sign.color}44` }}
          >
            <span className="text-4xl">{sign.symbol}</span>
          </motion.div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>
              {sign.name}
            </h2>
            <p className="text-amber-400 text-sm font-medium" style={{ fontFamily: 'Cinzel, serif' }}>
              {sign.hindiName} · {sign.dates}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant={ec.badge}>{ec.icon} {sign.element}</Badge>
              <Badge variant="gold">♃ {sign.ruling}</Badge>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Raleway, sans-serif' }}>
          {sign.description}
        </p>

        <div className="cosmic-divider mb-6" />

        {/* Traits */}
        <div className="mb-5">
          <h4 className="flex items-center gap-2 text-sm font-bold text-purple-300 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            <Zap className="w-4 h-4" /> {t('traits')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sign.traits.map(t => (
              <span key={t} className="px-3 py-1 glass-card-dark rounded-full text-xs text-slate-300 border border-purple-800/30"
                style={{ fontFamily: 'Raleway, sans-serif' }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {/* Strengths */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-green-400 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
              <Shield className="w-4 h-4" /> {t('strengths')}
            </h4>
            <ul className="space-y-2">
              {sign.strengths.map(s => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-300" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <span className="text-green-400 mt-0.5">✦</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-bold text-red-400 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
              <AlertTriangle className="w-4 h-4" /> {t('weaknesses')}
            </h4>
            <ul className="space-y-2">
              {sign.weaknesses.map(w => (
                <li key={w} className="flex items-start gap-2 text-sm text-slate-300" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  <span className="text-red-400 mt-0.5">✦</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Compatible signs */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-bold text-pink-400 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>
            <Heart className="w-4 h-4" /> {t('compatible')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {sign.compatible.map(c => {
              const s = zodiacSigns.find(z => z.name === c);
              return (
                <span key={c} className="px-3 py-1.5 glass-card-dark rounded-xl text-sm text-amber-300 border border-amber-800/30 flex items-center gap-1"
                  style={{ fontFamily: 'Cinzel, serif' }}>
                  {s?.symbol} {c}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ZodiacPage() {
  const { t } = useLang();
  const [selected, setSelected] = useState(null);
  const [filterElement, setFilterElement] = useState('All');

  const elements = ['All', 'Fire', 'Earth', 'Air', 'Water'];
  const filtered = filterElement === 'All' ? zodiacSigns : zodiacSigns.filter(s => s.element === filterElement);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        title={t('zodiacSigns')}
        subtitle={t('zodiacSub')}
      />

      {/* Element filter */}
      <FadeIn className="flex flex-wrap gap-2 justify-center mb-10">
        {elements.map(el => {
          const ec = elementColors[el];
          return (
            <motion.button
              key={el}
              onClick={() => setFilterElement(el)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                filterElement === el
                  ? 'bg-purple-900/50 border-amber-500/60 text-amber-300'
                  : 'border-slate-700/40 text-slate-400 hover:border-purple-700/50 hover:text-slate-300'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {ec?.icon} {el}
            </motion.button>
          );
        })}
      </FadeIn>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
      >
        <AnimatePresence>
          {filtered.map((sign, i) => {
            const ec = elementColors[sign.element] || elementColors.Fire;
            return (
              <motion.div
                key={sign.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <motion.button
                  onClick={() => setSelected(sign)}
                  whileHover={{ scale: 1.06, y: -6 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full glass-card p-4 text-center cursor-pointer group border ${ec.border} transition-all duration-300 hover:shadow-[0_0_25px_rgba(107,33,168,0.3)]`}
                  style={{ background: `linear-gradient(135deg, ${ec.bg})` }}
                >
                  {/* Symbol */}
                  <div
                    className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300"
                    style={{ textShadow: `0 0 20px ${sign.color}` }}
                  >
                    {sign.symbol}
                  </div>

                  {/* Name */}
                  <h3 className="text-xs font-bold text-white mb-0.5 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                    {sign.name}
                  </h3>
                  <p className="text-slate-400 text-xs mb-2" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '10px' }}>
                    {sign.hindiName}
                  </p>
                  <p className="text-purple-300 text-xs leading-tight mb-3" style={{ fontFamily: 'Raleway, sans-serif', fontSize: '10px' }}>
                    {sign.dates}
                  </p>

                  {/* Element badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${ec.border} text-slate-300`}
                    style={{ fontSize: '9px', fontFamily: 'Cinzel, serif' }}>
                    {ec.icon} {sign.element}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <ZodiacDetailModal sign={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

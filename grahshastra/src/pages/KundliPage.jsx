import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { planetaryData } from '../data/astroData';
import { GlowButton, SectionHeader, FadeIn, Badge } from '../components/UI';
import { useLang } from '../context/LanguageContext';

// Circular Kundli Chart Component
function KundliChart({ data }) {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  // House positions in the diamond grid layout
  const housePositions = [
    { col: 2, row: 1 }, // 1
    { col: 3, row: 1 }, // 2
    { col: 4, row: 1 }, // 3
    { col: 4, row: 2 }, // 4
    { col: 4, row: 3 }, // 5
    { col: 4, row: 4 }, // 6
    { col: 3, row: 4 }, // 7
    { col: 2, row: 4 }, // 8
    { col: 1, row: 4 }, // 9
    { col: 1, row: 3 }, // 10
    { col: 1, row: 2 }, // 11
    { col: 2, row: 2 }, // 12
  ];

  const planets = ['☀️', '🌙', '♂️', '☿️', '♃', '♀️', '♄'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 blur-xl" />

      <div className="relative glass-card p-4 rounded-2xl">
        <div className="grid grid-cols-4 grid-rows-4 gap-1 aspect-square">
          {/* Corner cells + edge cells = 12 houses */}
          {houses.map((house, i) => {
            const pos = housePositions[i];
            const isCorner = [0, 2, 6, 8].includes(i);
            return (
              <motion.div
                key={house}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`
                  border border-purple-700/40 rounded-lg flex flex-col items-center justify-center p-1
                  ${isCorner ? 'bg-purple-900/30' : 'bg-indigo-900/20'}
                  text-center
                `}
                style={{
                  gridColumn: pos.col,
                  gridRow: pos.row,
                }}
              >
                <span className="text-purple-400 text-xs font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{house}</span>
                <span className="text-base">{planets[i % planets.length]}</span>
              </motion.div>
            );
          })}

          {/* Center block - 2x2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="col-start-2 col-end-4 row-start-2 row-end-4 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-600/40 rounded-xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-3xl mb-1"
            >
              🪐
            </motion.div>
            <p className="text-amber-400 text-xs font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Lagna</p>
            <p className="text-purple-300 text-xs">{data?.name?.split(' ')[0] || 'Your'}</p>
          </motion.div>
        </div>

        {/* Chart label */}
        <p className="text-center text-xs text-slate-500 mt-2" style={{ fontFamily: 'Cinzel, serif' }}>
          North Indian Style Kundli
        </p>
      </div>
    </motion.div>
  );
}

export default function KundliPage() {
  const { t } = useLang();
  const [form, setForm] = useState({ name: '', dob: '', tob: '', place: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.dob) e.dob = 'Date of birth is required';
    if (!form.tob) e.tob = 'Time of birth is required';
    if (!form.place.trim()) e.place = 'Place is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult({ ...form, ascendant: 'Scorpio (वृश्चिक)', moonSign: 'Taurus (वृषभ)' });
      setLoading(false);
    }, 2500);
  };

  const inputFields = [
    { key: 'name', label: t('yourName'), icon: User, type: 'text', placeholder: 'Enter your full name' },
    { key: 'dob', label: t('dateOfBirth'), icon: Calendar, type: 'date', placeholder: '' },
    { key: 'tob', label: t('timeOfBirth'), icon: Clock, type: 'time', placeholder: '' },
    { key: 'place', label: t('placeOfBirth'), icon: MapPin, type: 'text', placeholder: 'City, Country' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        title={t('birthChart')}
        subtitle={t('birthChartSub')}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Form */}
        <FadeIn direction="left">
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-lg font-bold text-amber-400 mb-6 flex items-center gap-2" style={{ fontFamily: 'Cinzel, serif' }}>
              <Sparkles className="w-5 h-5" />
              {t('birthChart')} Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {inputFields.map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    <Icon className="w-3.5 h-3.5 inline mr-2 text-purple-400" />
                    {label}
                  </label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={`cosmic-input w-full px-4 py-3 rounded-xl text-sm ${errors[key] ? 'border-red-500/60' : ''}`}
                    style={{ fontFamily: 'Raleway, sans-serif', colorScheme: 'dark' }}
                  />
                  {errors[key] && (
                    <p className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Raleway, sans-serif' }}>{errors[key]}</p>
                  )}
                </div>
              ))}
              <GlowButton
                variant="gold"
                className="w-full py-4 text-base mt-6"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">🪐</motion.span>
                    {t('generating')}
                  </span>
                ) : (
                  `🔮 ${t('generateKundli')}`
                )}
              </GlowButton>
            </form>
          </div>
        </FadeIn>

        {/* Chart Display */}
        <FadeIn direction="right">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="text-8xl mx-auto"
                  >
                    🪐
                  </motion.div>
                  <p className="text-slate-400 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                    Fill in your birth details to generate your Kundli
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['🌙 Moon Sign', '☀️ Sun Sign', '⬆️ Ascendant', '♃ Jupiter'].map(item => (
                      <span key={item} className="text-xs px-3 py-1 glass-card-dark rounded-full text-purple-300" style={{ fontFamily: 'Cinzel, serif' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 rounded-full border-4 border-purple-700 border-t-amber-400 mx-auto mb-6"
                  />
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-amber-400 text-sm"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {t('generating')}
                  </motion.p>
                  <div className="mt-4 space-y-2">
                    {['Calculating planetary positions...', 'Drawing house boundaries...', 'Placing grahas...'].map((msg, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.6 }}
                        className="text-slate-500 text-xs"
                        style={{ fontFamily: 'Raleway, sans-serif' }}
                      >
                        ✦ {msg}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Chart */}
                <KundliChart data={result} />

                {/* Ascendant info */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t('yourAscendant'), value: result.ascendant, icon: '⬆️' },
                    { label: 'Moon Sign', value: result.moonSign, icon: '🌙' },
                  ].map(item => (
                    <div key={item.label} className="glass-card p-4 text-center">
                      <p className="text-2xl mb-1">{item.icon}</p>
                      <p className="text-xs text-slate-400 mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{item.label}</p>
                      <p className="text-sm font-bold text-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>

      {/* Planetary Table */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h3 className="text-xl font-bold text-amber-400 text-center mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
              🪐 {t('planetaryPositions')}
            </h3>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-800/40">
                      {['Planet', 'Sanskrit', 'House', 'Sign', 'Degree', 'Nature'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-purple-300 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {planetaryData.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-slate-800/40 hover:bg-purple-900/10 transition-colors"
                      >
                        <td className="px-4 py-3 text-white text-sm font-medium" style={{ fontFamily: 'Cinzel, serif' }}>{row.planet}</td>
                        <td className="px-4 py-3 text-purple-300 text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{row.sanskrit}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{row.house}</td>
                        <td className="px-4 py-3 text-slate-300 text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{row.sign}</td>
                        <td className="px-4 py-3 text-amber-400 text-sm font-mono">{row.degree}</td>
                        <td className="px-4 py-3">
                          <Badge variant={row.nature === 'Benefic' ? 'earth' : row.nature === 'Malefic' ? 'fire' : 'purple'}>
                            {row.nature}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

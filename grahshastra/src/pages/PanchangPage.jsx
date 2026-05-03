import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Clock, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { panchangData } from '../data/astroData';
import { SectionHeader, FadeIn, Card } from '../components/UI';
import { useLang } from '../context/LanguageContext';

function InfoCard({ icon, label, value, hindiValue, color = 'purple', delay = 0 }) {
  const colors = {
    purple: 'from-purple-900/30 to-indigo-900/20 border-purple-700/40 text-purple-300',
    gold: 'from-amber-900/20 to-yellow-900/10 border-amber-700/30 text-amber-300',
    teal: 'from-teal-900/20 to-cyan-900/10 border-teal-700/30 text-teal-300',
    blue: 'from-blue-900/20 to-indigo-900/10 border-blue-700/30 text-blue-300',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={`glass-card p-5 border bg-gradient-to-br ${colors[color]} transition-all duration-300 hover:shadow-[0_0_20px_rgba(107,33,168,0.2)]`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{label}</p>
          <p className="font-bold text-white text-sm" style={{ fontFamily: 'Cinzel, serif' }}>{value}</p>
          {hindiValue && (
            <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'Raleway, sans-serif' }}>{hindiValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Analog-style clock widget
function CosmicClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = (h / 12) * 360 + (m / 60) * 30;
  const minDeg = (m / 60) * 360;
  const secDeg = (s / 60) * 360;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Face */}
        <circle cx="50" cy="50" r="48" fill="rgba(10,15,46,0.8)" stroke="rgba(107,33,168,0.4)" strokeWidth="1.5" />
        {/* Hour marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 360 - 90;
          const r = 42;
          const x1 = 50 + r * Math.cos((a * Math.PI) / 180);
          const y1 = 50 + r * Math.sin((a * Math.PI) / 180);
          const x2 = 50 + 38 * Math.cos((a * Math.PI) / 180);
          const y2 = 50 + 38 * Math.sin((a * Math.PI) / 180);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(167,139,250,0.4)" strokeWidth="1" />;
        })}
        {/* Hour hand */}
        <line
          x1="50" y1="50"
          x2={50 + 22 * Math.cos(((hourDeg - 90) * Math.PI) / 180)}
          y2={50 + 22 * Math.sin(((hourDeg - 90) * Math.PI) / 180)}
          stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="50" y1="50"
          x2={50 + 30 * Math.cos(((minDeg - 90) * Math.PI) / 180)}
          y2={50 + 30 * Math.sin(((minDeg - 90) * Math.PI) / 180)}
          stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1="50" y1="50"
          x2={50 + 34 * Math.cos(((secDeg - 90) * Math.PI) / 180)}
          y2={50 + 34 * Math.sin(((secDeg - 90) * Math.PI) / 180)}
          stroke="#ec4899" strokeWidth="1" strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="#f59e0b" />
        {/* Glow */}
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(167,139,250,0.15)" strokeWidth="6" />
      </svg>
    </div>
  );
}

export default function PanchangPage() {
  const { t } = useLang();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        title={t('panchangTitle')}
        subtitle={t('panchangSub')}
      />

      {/* Date + Clock header */}
      <FadeIn className="mb-10">
        <div className="glass-card-dark p-6 md:p-8 text-center relative overflow-hidden">
          <div className="nebula-blob w-64 h-64 bg-indigo-600 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.12 }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8">
            <CosmicClock />
            <div>
              <p className="text-amber-400 text-xs tracking-widest uppercase mb-2 font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                ✦ Aaj ka Panchang ✦
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                {dateStr}
              </h2>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                <span className="px-3 py-1 glass-card rounded-full text-xs text-purple-300 border border-purple-700/30 flex items-center gap-1.5" style={{ fontFamily: 'Cinzel, serif' }}>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Sunrise {panchangData.sunrise}
                </span>
                <span className="px-3 py-1 glass-card rounded-full text-xs text-purple-300 border border-purple-700/30 flex items-center gap-1.5" style={{ fontFamily: 'Cinzel, serif' }}>
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                  Sunset {panchangData.sunset}
                </span>
                <span className="px-3 py-1 glass-card rounded-full text-xs text-purple-300 border border-purple-700/30 flex items-center gap-1.5" style={{ fontFamily: 'Cinzel, serif' }}>
                  🌙 {panchangData.moonPhase}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Panchang 5 elements */}
      <div className="mb-10">
        <h3 className="text-center text-sm font-bold text-purple-300 mb-5 tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
          ✦ Panch Ang — Five Limbs of the Day
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard icon="🌕" label={t('tithi')} value={panchangData.tithi} hindiValue="तृतीया — Third lunar day" color="gold" delay={0} />
          <InfoCard icon="⭐" label={t('nakshatra')} value={panchangData.nakshatra} hindiValue="रोहिणी — The Red One" color="purple" delay={0.1} />
          <InfoCard icon="🔱" label={t('yoga')} value={panchangData.yoga} hindiValue="सिद्ध — The Accomplished" color="teal" delay={0.2} />
          <InfoCard icon="🌙" label={t('karana')} value={panchangData.karana} hindiValue="बव — Fixed Karana" color="blue" delay={0.3} />
          <InfoCard icon="☀️" label="Sun Sign" value={`${panchangData.sunSign} ♈`} hindiValue="मेष राशि में सूर्य" color="gold" delay={0.4} />
          <InfoCard icon="🌙" label="Moon Sign" value={`${panchangData.moonSign} ♉`} hindiValue="वृषभ राशि में चंद्र" color="purple" delay={0.5} />
        </div>
      </div>

      {/* Auspicious & Inauspicious times */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Auspicious */}
        <FadeIn direction="left">
          <div className="glass-card p-6 border border-green-800/30">
            <h3 className="flex items-center gap-2 font-bold text-green-400 mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
              <CheckCircle className="w-5 h-5" />
              {t('auspicious')} ✦ शुभ समय
            </h3>
            <div className="space-y-3">
              {panchangData.auspicious.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 glass-card-dark rounded-xl border border-green-900/30 hover:border-green-700/40 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-lg">✦</span>
                    <span className="text-sm text-white font-medium" style={{ fontFamily: 'Cinzel, serif' }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Inauspicious */}
        <FadeIn direction="right">
          <div className="glass-card p-6 border border-red-800/30">
            <h3 className="flex items-center gap-2 font-bold text-red-400 mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
              <AlertCircle className="w-5 h-5" />
              {t('inauspicious')} ✦ अशुभ समय
            </h3>
            <div className="space-y-3">
              {panchangData.inauspicious.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 glass-card-dark rounded-xl border border-red-900/30 hover:border-red-700/40 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-lg">⚠</span>
                    <span className="text-sm text-white font-medium" style={{ fontFamily: 'Cinzel, serif' }}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Today's festivals */}
      <FadeIn>
        <div className="glass-card p-6 text-center">
          <h3 className="font-bold text-amber-400 mb-4 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
            🎉 Today's Festivals & Vrats
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {panchangData.festivals.map((fest, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-4 py-2 glass-card-dark rounded-full text-sm text-purple-200 border border-purple-700/40 font-medium"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                ✦ {fest}
              </motion.span>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

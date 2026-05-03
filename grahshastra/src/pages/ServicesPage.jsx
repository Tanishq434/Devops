import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, FadeIn } from '../components/UI';
import { useLang } from '../context/LanguageContext';
import AstrologyTab from '../components/services/AstrologyTab';
import NumerologyTab from '../components/services/NumerologyTab';
import VastuTab from '../components/services/VastuTab';
import ConsultationTab from '../components/services/ConsultationTab';
import PoojaTab from '../components/services/PoojaTab';

const TABS = [
  { key: 'astrology',     labelKey: 'tabAstrology',     icon: '🪐', accentColor: 'from-purple-700 to-indigo-600' },
  { key: 'numerology',    labelKey: 'tabNumerology',     icon: '🔢', accentColor: 'from-blue-700 to-cyan-600' },
  { key: 'vastu',         labelKey: 'tabVastu',          icon: '🏛️', accentColor: 'from-green-700 to-emerald-600' },
  { key: 'consultation',  labelKey: 'tabConsultation',   icon: '🧑‍💼', accentColor: 'from-amber-700 to-orange-600' },
  { key: 'pooja',         labelKey: 'tabPooja',          icon: '🕉️', accentColor: 'from-rose-700 to-pink-600' },
];

export default function ServicesPage() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramTab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    TABS.find(tb => tb.key === paramTab) ? paramTab : 'astrology'
  );

  // Sync URL when tab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab]);

  const currentTab = TABS.find(tb => tb.key === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SectionHeader
        title={t('servicesTitle')}
        subtitle={t('servicesSub')}
      />

      {/* ── Tab navigation bar ─────────────────────────────────── */}
      <FadeIn delay={0.1} className="mb-10">
        {/* Desktop — inline row */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-wrap">
          {TABS.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-semibold border transition-all duration-300 ${
                activeTab === tab.key
                  ? 'text-white border-transparent shadow-[0_0_20px_rgba(107,33,168,0.35)]'
                  : 'text-slate-400 border-slate-700/40 hover:border-purple-700/50 hover:text-slate-200'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tabHighlight"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tab.accentColor} opacity-80`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 text-base">{tab.icon}</span>
              <span className="relative z-10">{t(tab.labelKey)}</span>
            </motion.button>
          ))}
        </div>

        {/* Mobile — 2-column grid */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {TABS.map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              whileTap={{ scale: 0.96 }}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold border transition-all duration-300 ${
                activeTab === tab.key
                  ? 'text-white border-transparent shadow-[0_0_15px_rgba(107,33,168,0.3)]'
                  : 'text-slate-400 border-slate-700/40'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="tabHighlightMobile"
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tab.accentColor} opacity-80`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.icon}</span>
              <span className="relative z-10 truncate">{t(tab.labelKey)}</span>
            </motion.button>
          ))}
        </div>
      </FadeIn>

      {/* ── Active tab label stripe ─────────────────────────────── */}
      <FadeIn delay={0.15} className="mb-8">
        <div className={`h-1 rounded-full bg-gradient-to-r ${currentTab?.accentColor} opacity-60 max-w-xs mx-auto`} />
      </FadeIn>

      {/* ── Tab content panel ──────────────────────────────────── */}
      <div className="glass-card p-6 md:p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 22, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {activeTab === 'astrology'    && <AstrologyTab />}
            {activeTab === 'numerology'   && <NumerologyTab />}
            {activeTab === 'vastu'        && <VastuTab />}
            {activeTab === 'consultation' && <ConsultationTab />}
            {activeTab === 'pooja'        && <PoojaTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Quick-jump cards at the bottom ─────────────────────── */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {TABS.filter(tb => tb.key !== activeTab).map((tab, i) => (
          <FadeIn key={tab.key} delay={i * 0.07}>
            <motion.button
              onClick={() => setActiveTab(tab.key)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="w-full glass-card p-4 text-center border border-slate-800/50 hover:border-purple-700/50 transition-all duration-300 group"
            >
              <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-300">{tab.icon}</div>
              <p className="text-xs font-semibold text-slate-400 group-hover:text-amber-400 transition-colors leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                {t(tab.labelKey)}
              </p>
            </motion.button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}

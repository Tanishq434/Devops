import React from 'react';
import { motion } from 'framer-motion';

// ==================== GLOW BUTTON ====================
export function GlowButton({ children, onClick, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white shadow-[0_0_20px_rgba(107,33,168,0.4)] hover:shadow-[0_0_35px_rgba(107,33,168,0.7)]',
    gold: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)]',
    outline: 'bg-transparent border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30 hover:text-white hover:border-purple-400',
    ghost: 'bg-purple-900/20 border border-purple-700/40 text-purple-300 hover:bg-purple-800/30 hover:text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300
        ${variants[variant]}
        ${className}
      `}
      style={{ fontFamily: 'Cinzel, serif' }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ==================== GLASS CARD ====================
export function Card({ children, className = '', hover = false, glow = false }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        glass-card p-6
        ${glow ? 'hover:shadow-[0_0_30px_rgba(107,33,168,0.3)]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

// ==================== PROGRESS BAR ====================
export function ProgressBar({ value, color = 'purple', label, showPercent = true }) {
  const colors = {
    purple: 'from-purple-700 to-indigo-500',
    gold: 'from-amber-600 to-yellow-400',
    pink: 'from-pink-600 to-rose-400',
    teal: 'from-teal-600 to-cyan-400',
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300 font-medium" style={{ fontFamily: 'Raleway, sans-serif' }}>{label}</span>
          {showPercent && (
            <span className="text-sm font-bold text-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>{value}%</span>
          )}
        </div>
      )}
      <div className="h-3 bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/40">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]} relative`}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

// ==================== SECTION HEADER ====================
export function SectionHeader({ title, subtitle, center = true }) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={`flex items-center gap-3 mb-3 ${center ? 'justify-center' : ''}`}>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-500/50 max-w-16" />
          <span className="text-amber-400 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
            ✦ Cosmic Guide ✦
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-500/50 max-w-16" />
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold gradient-text-gold mb-4"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ==================== SKELETON LOADER ====================
export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-4 bg-purple-900/40 rounded-full w-3/4" />
      <div className="h-3 bg-purple-900/30 rounded-full w-full" />
      <div className="h-3 bg-purple-900/30 rounded-full w-5/6" />
      <div className="h-3 bg-purple-900/30 rounded-full w-4/5" />
      <div className="flex gap-3 pt-2">
        <div className="h-8 w-24 bg-purple-900/40 rounded-xl" />
        <div className="h-8 w-16 bg-purple-900/30 rounded-xl" />
      </div>
    </div>
  );
}

// ==================== BADGE ====================
export function Badge({ children, variant = 'purple' }) {
  const variants = {
    purple: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
    gold: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
    fire: 'bg-red-900/30 text-red-400 border-red-700/30',
    earth: 'bg-green-900/30 text-green-400 border-green-700/30',
    air: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
    water: 'bg-cyan-900/30 text-cyan-400 border-cyan-700/30',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]}`}
      style={{ fontFamily: 'Cinzel, serif' }}>
      {children}
    </span>
  );
}

// ==================== ZODIAC CARD SMALL ====================
export function ZodiacMini({ sign, selected, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      title={sign.name}
      className={`
        flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-300 cursor-pointer
        ${selected
          ? 'bg-purple-900/50 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
          : 'bg-purple-950/30 border-purple-800/30 hover:bg-purple-900/30 hover:border-purple-600/50'
        }
      `}
    >
      <span className="text-2xl">{sign.symbol}</span>
      <span className="text-xs text-slate-300 font-medium leading-none" style={{ fontFamily: 'Cinzel, serif' }}>
        {sign.name}
      </span>
    </motion.button>
  );
}

// ==================== FADE IN WRAPPER ====================
export function FadeIn({ children, delay = 0, direction = 'up', className = '' }) {
  const directions = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ==================== INFO STAT CARD ====================
export function StatCard({ icon, label, value, color = 'purple' }) {
  const colors = {
    purple: 'text-purple-400 bg-purple-900/30',
    gold: 'text-amber-400 bg-amber-900/20',
    pink: 'text-pink-400 bg-pink-900/20',
    teal: 'text-teal-400 bg-teal-900/20',
  };
  return (
    <div className="flex items-center gap-3 p-4 glass-card">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>{label}</p>
        <p className="text-base font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{value}</p>
      </div>
    </div>
  );
}

// ==================== NEBULA BLOBS ====================
export function NebulaBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="nebula-blob w-96 h-96 bg-purple-700 top-10 -left-20" style={{ opacity: 0.12 }} />
      <div className="nebula-blob w-80 h-80 bg-indigo-600 top-1/3 right-0" style={{ opacity: 0.1 }} />
      <div className="nebula-blob w-72 h-72 bg-violet-800 bottom-20 left-1/4" style={{ opacity: 0.1 }} />
      <div className="nebula-blob w-64 h-64 bg-blue-800 top-2/3 right-1/4" style={{ opacity: 0.08 }} />
    </div>
  );
}

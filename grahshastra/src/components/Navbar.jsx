import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Star } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t, lang, toggleLang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const links = [
    { to: '/', label: t('home') },
    { to: '/horoscope', label: t('horoscope') },
    { to: '/kundli', label: t('kundli') },
    { to: '/zodiac', label: t('zodiac') },
    { to: '/compatibility', label: t('compatibility') },
    { to: '/panchang', label: t('panchang') },
    { to: '/services', label: t('services') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#03020a]/90 backdrop-blur-xl border-b border-purple-900/30 shadow-[0_0_30px_rgba(107,33,168,0.15)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(107,33,168,0.6)]"
              >
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </motion.div>
              <span
                className="text-xl md:text-2xl font-bold gradient-text-gold"
                style={{ fontFamily: 'Cinzel Decorative, serif' }}
              >
                GrahShastra
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    isActive(link.to)
                      ? 'text-amber-400'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {isActive(link.to) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-purple-900/30 border border-purple-700/40 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLang}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-bold hover:bg-amber-500/20 hover:border-amber-400 transition-all duration-300"
                style={{ fontFamily: 'Cinzel, serif' }}
              >
                <span className="text-base">{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
                {lang === 'en' ? 'हिंदी' : 'English'}
              </motion.button>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 text-purple-300 hover:text-white transition-colors"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#070b1a]/95 backdrop-blur-xl border-t border-purple-900/30"
            >
              <div className="px-4 py-4 space-y-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.to)
                          ? 'bg-purple-900/40 text-amber-400 border border-purple-700/40'
                          : 'text-slate-300 hover:bg-purple-900/20 hover:text-amber-300'
                      }`}
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Language toggle in mobile */}
                <motion.button
                  onClick={toggleLang}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 text-sm font-bold"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  <span>{lang === 'en' ? '🇮🇳' : '🇬🇧'}</span>
                  {lang === 'en' ? 'हिंदी में देखें' : 'View in English'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

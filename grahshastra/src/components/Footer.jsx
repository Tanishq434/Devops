import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Moon, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative z-10 border-t border-purple-900/30 bg-[#03020a]/80 backdrop-blur-xl mt-20">
      {/* Top glow line */}
      <div className="cosmic-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </div>
              <span className="text-xl font-bold gradient-text-gold" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                GrahShastra
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {t('footerDesc')}
            </p>
            <div className="flex gap-4 mt-6">
              {[Twitter, Instagram, Youtube, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 rounded-full bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-300 hover:text-amber-400 hover:border-amber-500/50 transition-all duration-300"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: t('home') },
                { to: '/horoscope', label: t('horoscope') },
                { to: '/kundli', label: t('kundli') },
                { to: '/zodiac', label: t('zodiac') },
                { to: '/compatibility', label: t('compatibility') },
                { to: '/panchang', label: t('panchang') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-amber-300 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 group-hover:bg-amber-400 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-amber-400 font-semibold mb-4 text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
              Info
            </h4>
            <ul className="space-y-2">
              {[t('about'), t('contact'), t('privacy'), 'Terms of Use', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-amber-300 text-sm transition-colors duration-200 flex items-center gap-2 group"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  >
                    <span className="w-1 h-1 rounded-full bg-purple-500 group-hover:bg-amber-400 transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cosmic-divider mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>
            © 2024 GrahShastra. All rights reserved. For entertainment purposes only.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Moon size={12} className="text-purple-400" />
            <span style={{ fontFamily: 'Raleway, sans-serif' }}>
              Crafted with cosmic love ✨
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

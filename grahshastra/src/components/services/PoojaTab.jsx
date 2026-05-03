import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Package } from 'lucide-react';
import { GlowButton, FadeIn, Badge } from '../UI';
import { useLang } from '../../context/LanguageContext';

const POOJAS = [
  {
    id: 'griha', categoryKey: 'categoryHome', icon: '🏠',
    nameKey: 'grihaPooja', descKey: 'grihaDesc',
    price: '₹5,100', duration: '3–4 hrs', guests: 'Upto 50',
    items: ['Kalash','Mango leaves','Coconut','Havan samagri','Flowers','Diyas'],
    itemsHi: ['कलश','आम के पत्ते','नारियल','हवन सामग्री','फूल','दीये'],
  },
  {
    id: 'satyanarayan', categoryKey: 'categoryHome', icon: '📿',
    nameKey: 'satyanarayan', descKey: 'satyannarayanDesc',
    price: '₹3,500', duration: '2–3 hrs', guests: 'Upto 100',
    items: ['Panchamrit','Tulsi','Banana','Prasad samagri','Yellow cloth','Incense'],
    itemsHi: ['पंचामृत','तुलसी','केला','प्रसाद सामग्री','पीला कपड़ा','अगरबत्ती'],
  },
  {
    id: 'ganesh', categoryKey: 'categoryHome', icon: '🐘',
    nameKey: 'ganesh', descKey: 'ganeshDesc',
    price: '₹2,100', duration: '1–2 hrs', guests: 'Upto 30',
    items: ['Modak','Red flowers','Durva grass','Ganesh idol','Sindoor','Coconut'],
    itemsHi: ['मोदक','लाल फूल','दूर्वा घास','गणेश मूर्ति','सिंदूर','नारियल'],
  },
  {
    id: 'kalash', categoryKey: 'categoryHome', icon: '🪔',
    nameKey: 'kalash', descKey: 'kalashDesc',
    price: '₹1,500', duration: '1 hr', guests: 'Upto 20',
    items: ['Brass kalash','Mango leaves','Supari','Red thread','Rice','Water'],
    itemsHi: ['पीतल कलश','आम के पत्ते','सुपारी','लाल धागा','चावल','जल'],
  },
  {
    id: 'office', categoryKey: 'categoryOffice', icon: '🏢',
    nameKey: 'officePooja', descKey: 'officeDesc',
    price: '₹4,500', duration: '2–3 hrs', guests: 'Upto 200',
    items: ['Ganesh murti','Lakshmi idol','Havan kund','Flowers','Nariyal','Diyas'],
    itemsHi: ['गणेश मूर्ति','लक्ष्मी मूर्ति','हवन कुंड','फूल','नारियल','दीये'],
  },
  {
    id: 'udyog', categoryKey: 'categoryOffice', icon: '💼',
    nameKey: 'udyogPooja', descKey: 'udyogDesc',
    price: '₹7,100', duration: '3–4 hrs', guests: 'Upto 100',
    items: ['Lakshmi yantra','Kuber yantra','Havan','Gold coins','Red cloth','Panchamrit'],
    itemsHi: ['लक्ष्मी यंत्र','कुबेर यंत्र','हवन','सोने के सिक्के','लाल कपड़ा','पंचामृत'],
  },
  {
    id: 'vastu', categoryKey: 'categoryOffice', icon: '🏛️',
    nameKey: 'vaastuPooja', descKey: 'vaastuDesc',
    price: '₹8,500', duration: '4–5 hrs', guests: 'Upto 50',
    items: ['Navgraha yantra','Copper plate','Havan samagri','Vastu purush','Herbs','Sacred soil'],
    itemsHi: ['नवग्रह यंत्र','तांबे की प्लेट','हवन सामग्री','वास्तु पुरुष','जड़ी-बूटी','पवित्र मिट्टी'],
  },
  {
    id: 'navgraha', categoryKey: 'categoryPlanetary', icon: '🪐',
    nameKey: 'navgraha', descKey: 'navgrahaDesc',
    price: '₹9,000', duration: '4–5 hrs', guests: 'Upto 30',
    items: ['9 coloured cloths','9 grains','9 metals','Havan','Navgraha yantra','Sesame'],
    itemsHi: ['9 रंग के कपड़े','9 अनाज','9 धातु','हवन','नवग्रह यंत्र','तिल'],
  },
  {
    id: 'rudrabhishek', categoryKey: 'categoryPlanetary', icon: '🔱',
    nameKey: 'rudrabhishek', descKey: 'rudrabhishekDesc',
    price: '₹6,100', duration: '3 hrs', guests: 'Upto 50',
    items: ['Belpatra','Milk','Honey','Curd','Ghee','Gangajal','Rudraksha'],
    itemsHi: ['बेलपत्र','दूध','शहद','दही','घी','गंगाजल','रुद्राक्ष'],
  },
  {
    id: 'sudershan', categoryKey: 'categoryPlanetary', icon: '☸️',
    nameKey: 'sudershan', descKey: 'sudershanDesc',
    price: '₹11,000', duration: '5–6 hrs', guests: 'Upto 30',
    items: ['Havan kund','Ghee','Lotus seeds','Vishnu idol','Tulsi','Sacred herbs','Yellow cloth'],
    itemsHi: ['हवन कुंड','घी','कमल बीज','विष्णु मूर्ति','तुलसी','पवित्र जड़ी-बूटी','पीला कपड़ा'],
  },
];

const CATEGORIES = ['categoryHome', 'categoryOffice', 'categoryPlanetary'];

function BookingModal({ pooja, onClose }) {
  const { t, lang } = useLang();
  const [form, setForm] = useState({ name: '', phone: '', date: '', address: '', guests: '', special: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === 'hi' ? 'नाम आवश्यक है' : 'Name required';
    if (!form.phone.trim()) e.phone = lang === 'hi' ? 'फ़ोन आवश्यक है' : 'Phone required';
    if (!form.date) e.date = lang === 'hi' ? 'तिथि चुनें' : 'Date required';
    if (!form.address.trim()) e.address = lang === 'hi' ? 'पता आवश्यक है' : 'Address required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSuccess(true); }, 1800);
  };

  const fields = [
    { key: 'name', label: t('consultName'), type: 'text', placeholder: lang === 'hi' ? 'आपका पूरा नाम' : 'Your full name' },
    { key: 'phone', label: t('consultPhone'), type: 'tel', placeholder: '+91 XXXXXXXXXX' },
    { key: 'date', label: t('poojaDate'), type: 'date', placeholder: '' },
    { key: 'address', label: t('poojaAddress'), type: 'text', placeholder: lang === 'hi' ? 'पूरा पता दर्ज करें' : 'Enter full venue address' },
    { key: 'guests', label: t('poojaGuests'), type: 'number', placeholder: lang === 'hi' ? 'उदाहरण: 25' : 'e.g. 25' },
    { key: 'special', label: t('poojaSpecial'), type: 'text', placeholder: lang === 'hi' ? 'कोई विशेष अनुरोध (वैकल्पिक)' : 'Any special requests (optional)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="relative glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 z-10"
        style={{ background: 'rgba(7,11,26,0.97)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10">
          <X size={15} />
        </button>

        {!success ? (
          <>
            {/* Pooja header */}
            <div className="flex items-center gap-3 mb-5 pr-8">
              <span className="text-3xl">{pooja.icon}</span>
              <div>
                <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{t(pooja.nameKey)}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="gold">{pooja.price}</Badge>
                  <Badge variant="purple">{pooja.duration}</Badge>
                </div>
              </div>
            </div>
            <div className="cosmic-divider mb-5" />

            {/* Form */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {fields.map(f => (
                <div key={f.key} className={f.key === 'address' || f.key === 'special' ? 'col-span-2' : ''}>
                  <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className={`cosmic-input w-full px-3 py-2.5 rounded-xl text-sm ${errors[f.key] ? 'border-red-500/60' : ''}`}
                    style={{ fontFamily: 'Raleway, sans-serif', colorScheme: 'dark' }}
                    min={f.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                  />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-0.5">{errors[f.key]}</p>}
                </div>
              ))}
            </div>

            {/* Samagri included */}
            <div className="glass-card-dark p-3 rounded-xl mb-4">
              <p className="text-xs text-amber-400 font-semibold mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Cinzel, serif' }}>
                <Package size={12} /> {t('poojaItems')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(lang === 'hi' ? pooja.itemsHi : pooja.items).map((item, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/30" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <GlowButton variant="gold" className="w-full py-3" onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">🙏</motion.span>
                    {lang === 'hi' ? 'बुकिंग हो रही है...' : 'Booking...'}
                  </span>
                : `🙏 ${t('poojaSubmit')}`}
            </GlowButton>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="text-6xl mb-4"
            >
              🙏
            </motion.div>
            <h3 className="text-xl font-bold text-amber-400 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>{t('poojaSuccess')}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-2" style={{ fontFamily: 'Raleway, sans-serif' }}>{t('poojaSuccessMsg')}</p>
            <p className="text-purple-300 text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {t(pooja.nameKey)} · {form.date}
            </p>
            <div className="mt-6">
              <GlowButton variant="outline" onClick={onClose}>
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </GlowButton>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function PoojaTab() {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState('categoryHome');
  const [bookingPooja, setBookingPooja] = useState(null);

  const filtered = POOJAS.filter(p => p.categoryKey === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="glass-card-dark p-6 text-center relative overflow-hidden">
          <div className="nebula-blob w-48 h-48 bg-amber-700 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.1 }} />
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-5xl mb-3 inline-block"
            >
              🪔
            </motion.div>
            <h3 className="text-xl font-bold gradient-text-gold mb-1" style={{ fontFamily: 'Cinzel, serif' }}>{t('poojaTitle')}</h3>
            <p className="text-slate-400 text-sm max-w-xl mx-auto" style={{ fontFamily: 'Raleway, sans-serif' }}>{t('poojaSub')}</p>
          </div>
        </div>
      </FadeIn>

      {/* Category tabs */}
      <div>
        <p className="text-xs text-amber-400 font-semibold text-center mb-4 tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
          {t('poojaCategories')}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-amber-700/30 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-slate-700/40 text-slate-400 hover:border-purple-600/50 hover:text-slate-300'
              }`}
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {cat === 'categoryHome' && '🏠 '}
              {cat === 'categoryOffice' && '🏢 '}
              {cat === 'categoryPlanetary' && '🪐 '}
              {t(cat)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pooja Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((pooja, i) => (
            <motion.div
              key={pooja.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card border border-amber-900/20 hover:border-amber-600/40 transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden group"
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700" />

              <div className="p-5">
                {/* Icon + name */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{pooja.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
                      {t(pooja.nameKey)}
                    </h4>
                    <p className="text-xs text-amber-400 font-bold mt-0.5" style={{ fontFamily: 'Cinzel, serif' }}>
                      {t('poojaPrice')}: {pooja.price}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {t(pooja.descKey)}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} className="text-purple-400" />
                    {pooja.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} className="text-purple-400" />
                    {pooja.guests}
                  </span>
                </div>

                {/* Samagri pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {(lang === 'hi' ? pooja.itemsHi : pooja.items).slice(0, 3).map((item, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/20" style={{ fontSize: '10px', fontFamily: 'Raleway, sans-serif' }}>
                      {item}
                    </span>
                  ))}
                  {pooja.items.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-500 border border-slate-700/30" style={{ fontSize: '10px', fontFamily: 'Cinzel, serif' }}>
                      +{pooja.items.length - 3} {lang === 'hi' ? 'और' : 'more'}
                    </span>
                  )}
                </div>

                {/* Book button */}
                <GlowButton
                  variant="gold"
                  className="w-full py-2.5 text-xs"
                  onClick={() => setBookingPooja(pooja)}
                >
                  🙏 {t('bookPooja')}
                </GlowButton>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingPooja && (
          <BookingModal pooja={bookingPooja} onClose={() => setBookingPooja(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

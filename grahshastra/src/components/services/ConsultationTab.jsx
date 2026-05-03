import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Star, User } from 'lucide-react';
import { GlowButton, FadeIn } from '../UI';
import { useLang } from '../../context/LanguageContext';

const CONSULT_TYPES = [
  { key: 'astro', icon: '🪐', priceEn: '₹1,299', priceHi: '₹1,299', durationKey: 'min60', ratingEn: 'Pt. Ramesh Sharma', ratingHi: 'पं. रमेश शर्मा', exp: '25+ yrs' },
  { key: 'num', icon: '🔢', priceEn: '₹899', priceHi: '₹899', durationKey: 'min45', ratingEn: 'Dr. Priya Nair', ratingHi: 'डॉ. प्रिया नायर', exp: '15+ yrs' },
  { key: 'vastu', icon: '🏛️', priceEn: '₹1,999', priceHi: '₹1,999', durationKey: 'min90', ratingEn: 'Ar. Suresh Iyer', ratingHi: 'आर्. सुरेश अय्यर', exp: '20+ yrs' },
  { key: 'kundli', icon: '💍', priceEn: '₹799', priceHi: '₹799', durationKey: 'min45', ratingEn: 'Pt. Meena Devi', ratingHi: 'पं. मीना देवी', exp: '18+ yrs' },
  { key: 'career', icon: '💼', priceEn: '₹999', priceHi: '₹999', durationKey: 'min60', ratingEn: 'Dr. Amit Joshi', ratingHi: 'डॉ. अमित जोशी', exp: '12+ yrs' },
  { key: 'marriage', icon: '💕', priceEn: '₹1,099', priceHi: '₹1,099', durationKey: 'min60', ratingEn: 'Pt. Kamala Bai', ratingHi: 'पं. कमला बाई', exp: '22+ yrs' },
];

const TIMES = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM'];

export default function ConsultationTab() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(1); // 1=type, 2=form, 3=success
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = lang === 'hi' ? 'नाम आवश्यक है' : 'Name required';
    if (!form.phone.trim()) e.phone = lang === 'hi' ? 'फ़ोन आवश्यक है' : 'Phone required';
    if (!form.date) e.date = lang === 'hi' ? 'तिथि चुनें' : 'Date required';
    if (!selectedTime) e.time = lang === 'hi' ? 'समय चुनें' : 'Time required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setStep(3); }, 1800);
  };

  const chosen = selectedType !== null ? CONSULT_TYPES[selectedType] : null;

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[
          { n: 1, label: lang === 'hi' ? 'प्रकार' : 'Type' },
          { n: 2, label: lang === 'hi' ? 'विवरण' : 'Details' },
          { n: 3, label: lang === 'hi' ? 'पुष्टि' : 'Confirm' },
        ].map(({ n, label }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= n ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'
            }`} style={{ fontFamily: 'Cinzel, serif' }}>
              {step > n ? '✓' : n}
            </div>
            <span className={`text-xs ${step >= n ? 'text-amber-400' : 'text-slate-600'}`} style={{ fontFamily: 'Cinzel, serif' }}>{label}</span>
            {n < 3 && <div className={`w-8 h-px ${step > n ? 'bg-amber-500' : 'bg-slate-700'} transition-all duration-500`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Choose type */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h3 className="text-base font-bold text-amber-400 text-center mb-5" style={{ fontFamily: 'Cinzel, serif' }}>
              {t('consultTypes')}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {CONSULT_TYPES.map((ct, i) => (
                <FadeIn key={ct.key} delay={i * 0.06}>
                  <motion.button
                    onClick={() => { setSelectedType(i); setStep(2); }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full glass-card p-5 border border-purple-800/30 hover:border-amber-500/50 text-left group transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{ct.icon}</div>
                    <h4 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
                      {t(`consultTypes_${ct.key}`)}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-amber-400 text-xs font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{ct.priceEn}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>
                        {lang === 'hi' ? ct.ratingHi : ct.ratingEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                      <span className="text-slate-500 text-xs ml-1">{ct.exp}</span>
                    </div>
                  </motion.button>
                </FadeIn>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 — Form */}
        {step === 2 && chosen && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {/* Selected type summary */}
            <div className="glass-card-dark p-4 rounded-2xl mb-6 flex items-center gap-4 border border-amber-800/30">
              <span className="text-3xl">{chosen.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white" style={{ fontFamily: 'Cinzel, serif' }}>{t(`consultTypes_${chosen.key}`)}</p>
                <p className="text-xs text-slate-400" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  {lang === 'hi' ? chosen.ratingHi : chosen.ratingEn} · {chosen.exp} · {chosen.priceEn}
                </p>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-purple-400 hover:text-amber-400 transition-colors" style={{ fontFamily: 'Cinzel, serif' }}>
                {lang === 'hi' ? 'बदलें' : 'Change'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left — personal details */}
              <div className="space-y-4">
                {[
                  { key: 'name', label: t('consultName'), type: 'text', placeholder: lang === 'hi' ? 'पूरा नाम' : 'Full name' },
                  { key: 'phone', label: t('consultPhone'), type: 'tel', placeholder: lang === 'hi' ? '+91 XXXXXXXXXX' : '+91 XXXXXXXXXX' },
                  { key: 'email', label: t('consultEmail'), type: 'email', placeholder: lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (optional)' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className={`cosmic-input w-full px-4 py-2.5 rounded-xl text-sm ${errors[f.key] ? 'border-red-500/60' : ''}`}
                      style={{ fontFamily: 'Raleway, sans-serif' }}
                    />
                    {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{t('consultMessage')}</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder={t('consultMessagePlaceholder')}
                    rows={3}
                    className="cosmic-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                    style={{ fontFamily: 'Raleway, sans-serif' }}
                  />
                </div>
              </div>

              {/* Right — date & time picker */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5" style={{ fontFamily: 'Cinzel, serif' }}>{t('consultDate')}</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                    className={`cosmic-input w-full px-4 py-2.5 rounded-xl text-sm ${errors.date ? 'border-red-500/60' : ''}`}
                    style={{ colorScheme: 'dark' }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                    {t('consultTime')} {errors.time && <span className="text-red-400 ml-2">{errors.time}</span>}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIMES.map(time => (
                      <motion.button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                          selectedTime === time
                            ? 'bg-amber-600/30 border-amber-500/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                            : 'border-slate-700/40 text-slate-400 hover:border-purple-600/50 hover:text-slate-300'
                        }`}
                        style={{ fontFamily: 'Cinzel, serif' }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <GlowButton variant="ghost" onClick={() => setStep(1)} className="flex-shrink-0">
                ← {lang === 'hi' ? 'वापस' : 'Back'}
              </GlowButton>
              <GlowButton variant="gold" className="flex-1 py-3" onClick={handleSubmit} disabled={submitting}>
                {submitting
                  ? <span className="flex items-center justify-center gap-2"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⏳</motion.span>{lang === 'hi' ? 'बुक हो रहा है...' : 'Booking...'}</span>
                  : `✨ ${t('bookConsult')}`}
              </GlowButton>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Success */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-600/40 to-emerald-600/30 border border-green-500/40 flex items-center justify-center mx-auto mb-6 text-4xl"
              style={{ boxShadow: '0 0 30px rgba(34,197,94,0.3)' }}
            >
              🙏
            </motion.div>
            <h3 className="text-2xl font-bold text-green-400 mb-3" style={{ fontFamily: 'Cinzel, serif' }}>{t('bookingSuccess')}</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto mb-2 leading-relaxed" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {t('bookingSuccessMsg')}
            </p>
            {chosen && form.date && selectedTime && (
              <div className="glass-card inline-block px-6 py-3 mt-4 border border-green-800/30">
                <p className="text-xs text-slate-400" style={{ fontFamily: 'Cinzel, serif' }}>
                  {t(`consultTypes_${chosen.key}`)} · {form.date} · {selectedTime}
                </p>
              </div>
            )}
            <div className="mt-8">
              <GlowButton variant="outline" onClick={() => { setStep(1); setSelectedType(null); setForm({ name:'',phone:'',email:'',date:'',message:'' }); setSelectedTime(''); }}>
                {lang === 'hi' ? 'नई बुकिंग करें' : 'Book Another'}
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import HomePage from './pages/HomePage';
import HoroscopePage from './pages/HoroscopePage';
import KundliPage from './pages/KundliPage';
import ZodiacPage from './pages/ZodiacPage';
import CompatibilityPage from './pages/CompatibilityPage';
import PanchangPage from './pages/PanchangPage';
import ServicesPage from './pages/ServicesPage';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/horoscope" element={<HoroscopePage />} />
        <Route path="/kundli" element={<KundliPage />} />
        <Route path="/zodiac" element={<ZodiacPage />} />
        <Route path="/compatibility" element={<CompatibilityPage />} />
        <Route path="/panchang" element={<PanchangPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </LanguageProvider>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import StarField from './StarField';
import { NebulaBg } from './UI';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-cosmic-gradient relative" style={{ background: 'linear-gradient(135deg, #03020a 0%, #070b1a 40%, #0a0f2e 70%, #1a0a2e 100%)' }}>
      <StarField />
      <NebulaBg />
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 pt-16 md:pt-20"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

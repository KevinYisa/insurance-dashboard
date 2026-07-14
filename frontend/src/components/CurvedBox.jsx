import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const CurvedBox = ({ children, className = '' }) => {
  return (
    <TiltCard className={`w-full ${className}`}>
      <motion.div
        className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/20 transition-shadow duration-300"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {children}
      </motion.div>
    </TiltCard>
  );
};

export default CurvedBox;
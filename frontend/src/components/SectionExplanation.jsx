import React from 'react';
import { motion } from 'framer-motion';

const SectionExplanation = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-box w-full"
    >
      <div className="flex items-start gap-3">
        <span className="text-blue-400 text-xl">ℹ️</span>
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider">{title}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SectionExplanation;
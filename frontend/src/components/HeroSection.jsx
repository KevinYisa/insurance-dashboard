import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import TypingText from '../components/TypingText';
import GlassHeading from '../components/GlassHeading';
import heroBg from '../assets/sections/Hero-bg.jpg';

const HeroSection = () => {
  return (
    <SectionBackground imageUrl={heroBg}>
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <GlassHeading className="mx-auto">
            <h1 className="heading text-5xl md:text-7xl lg:text-8xl text-white leading-tight">
              Insurance Dashboard
            </h1>
          </GlassHeading>

          <GlassHeading className="mx-auto">
            <div className="text-2xl md:text-3xl text-blue-400 font-semibold h-16">
              <TypingText
                strings={[
                  'Predict. Analyze. Optimize.',
                  'Smart Insurance Analytics',
                  'AI-Powered Premium Predictions',
                ]}
              />
            </div>
          </GlassHeading>

          <GlassHeading className="mx-auto max-w-3xl">
            <p className="text-gray-300 text-lg leading-relaxed">
              A comprehensive platform for predicting health insurance premiums using advanced machine learning. 
              Enter your details below to get an instant, data-driven estimate of your annual expenses and recommended coverage.
            </p>
          </GlassHeading>

          {/* 🛠️ Tech Stack Table */}
          <div className="glass-box p-6 max-w-5xl mx-auto mt-8 text-left">
            <h3 className="text-white text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <span>⚙️</span> Tech Stack & Architecture
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3 px-4 text-left font-medium text-white/70">Technology</th>
                    <th className="py-3 px-4 text-left font-medium text-white/70">Purpose</th>
                    <th className="py-3 px-4 text-left font-medium text-white/70">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-blue-300">🐘 PostgreSQL</td>
                    <td className="py-3 px-4">Relational Database</td>
                    <td className="py-3 px-4 text-gray-400">Stores user inputs, prediction history, and model metadata.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-green-300">🤖 XGBoost + Random Forest</td>
                    <td className="py-3 px-4">Machine Learning Models</td>
                    <td className="py-3 px-4 text-gray-400">Ensemble of two algorithms for accurate premium prediction.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-purple-300">⚡ Go (Golang)</td>
                    <td className="py-3 px-4">Backend API</td>
                    <td className="py-3 px-4 text-gray-400">Serves predictions, feature importance, and accuracy metrics.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-yellow-300">⚛️ React + Vite</td>
                    <td className="py-3 px-4">Frontend UI</td>
                    <td className="py-3 px-4 text-gray-400">Interactive dashboard with real‑time predictions and sliders.</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-medium text-pink-300">📦 Git & GitHub</td>
                    <td className="py-3 px-4">Version Control</td>
                    <td className="py-3 px-4 text-gray-400">Collaborative development with CI/CD pipelines.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 text-sm mt-6">
            <span className="bg-white/10 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
              ✅ Real-time Predictions
            </span>
            <span className="bg-white/10 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
              ✅ Risk Assessment
            </span>
            <span className="bg-white/10 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
              ✅ Feature Analysis
            </span>
            <span className="bg-white/10 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-sm">
              ✅ Interactive Dashboard
            </span>
          </div>
        </motion.div>
      </div>
    </SectionBackground>
  );
};

export default HeroSection;
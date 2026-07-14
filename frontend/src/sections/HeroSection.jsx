import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import TypingText from '../components/TypingText';
import GlassHeading from '../components/GlassHeading';
import heroBg from '../assets/sections/hero-bg.jpg';

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

          {/* ✨ Modern Tech Stack Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-box p-6 max-w-5xl mx-auto mt-8 text-left relative overflow-hidden"
          >
            {/* Subtle gradient glow behind the table */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

            <h3 className="text-white text-xl font-semibold mb-6 text-center flex items-center justify-center gap-3 relative z-10">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 p-1 rounded-lg text-2xl"></span>
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Tech Stack & Architecture
              </span>
            </h3>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-sm text-gray-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
                    <th className="py-3 px-4 text-left font-semibold text-white/80 tracking-wider">Technology</th>
                    <th className="py-3 px-4 text-left font-semibold text-white/80 tracking-wider">Purpose</th>
                    <th className="py-3 px-4 text-left font-semibold text-white/80 tracking-wider hidden md:table-cell">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl"></span>
                        <span className="text-blue-300 group-hover:text-blue-200 transition-colors">PostgreSQL</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">Relational Database</td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">Stores user inputs, prediction history, and model metadata.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl"></span>
                        <span className="text-green-300 group-hover:text-green-200 transition-colors">XGBoost + RFM</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">Machine Learning Models</td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">Ensemble of two algorithms for accurate premium prediction.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl"></span>
                        <span className="text-purple-300 group-hover:text-purple-200 transition-colors">Go (Golang)</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">Backend API</td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">Serves predictions, feature importance, and accuracy metrics.</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/10 transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl"></span>
                        <span className="text-yellow-300 group-hover:text-yellow-200 transition-colors">React + Vite</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">Frontend UI</td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">Interactive dashboard with real‑time predictions and sliders.</td>
                  </tr>
                  <tr className="hover:bg-white/10 transition-all duration-300 group">
                    <td className="py-3 px-4 font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-xl"></span>
                        <span className="text-pink-300 group-hover:text-pink-200 transition-colors">Git & GitHub</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">Version Control</td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">Collaborative development with CI/CD pipelines.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer note inside table */}
            <div className="mt-4 text-xs text-center text-gray-500 border-t border-white/5 pt-3 relative z-10">
              <span className="bg-white/5 px-3 py-1 rounded-full"> Built with modern tools for speed & scalability</span>
            </div>
          </motion.div>

          {/* Feature badges (unchanged) */}
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
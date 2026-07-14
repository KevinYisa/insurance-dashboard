import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import PredictForm from '../components/PredictForm';
import ResultsCard from '../components/ResultsCard';
import WhatIfSliders from '../components/WhatIfSliders';
import SectionExplanation from '../components/SectionExplanation';
import GlassHeading from '../components/GlassHeading';
import bg2 from '../assets/sections/2.jpg';

const PredictorSection = ({ 
  formData, setFormData, prediction, loading, error, submitPrediction 
}) => {
  const handleSliderSubmit = (data) => submitPrediction(data);

  return (
    <SectionBackground imageUrl={bg2}>
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <GlassHeading className="mx-auto">
            <h2 className="octane-font text-4xl md:text-5xl text-white tracking-wider">
              Premium Predictor
            </h2>
          </GlassHeading>
          <div className="mt-3">
            <GlassHeading className="mx-auto">
              <p className="text-gray-400 text-lg">
                Enter your health profile to get an instant, AI-driven insurance estimate
              </p>
            </GlassHeading>
          </div>
        </motion.div>

        <SectionExplanation
          title="About the Predictor"
          description="Enter your health details to get an instant prediction of your annual insurance expenses. Adjust the sliders to see how different factors affect your premium in real-time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-box h-full">
              <PredictForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={submitPrediction}
                loading={loading}
              />
              {error && (
                <div className="mt-4 text-red-400 bg-red-900/30 p-3 rounded-xl border border-red-500/30">
                  ⚠️ {error}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <div className="glass-box">
                <WhatIfSliders
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSliderSubmit}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="glass-box h-full">
              <ResultsCard prediction={prediction} />
            </div>
          </motion.div>
        </div>
      </div>
    </SectionBackground>
  );
};

export default PredictorSection;
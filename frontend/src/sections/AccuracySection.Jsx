import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import CurvedBox from '../components/CurvedBox';
import AccuracyLineChart from '../components/AccuracyLineChart';
import SectionExplanation from '../components/SectionExplanation';
import GlassHeading from '../components/GlassHeading';
import bg4 from '../assets/sections/4.jpg';

const AccuracySection = ({ accuracyData }) => {
  return (
    <SectionBackground imageUrl={bg4}>
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <GlassHeading className="mx-auto">
            <h2 className="octane-font text-4xl md:text-5xl text-white tracking-wider">
              Model Accuracy
            </h2>
          </GlassHeading>
          <div className="mt-3">
            <GlassHeading className="mx-auto">
              <p className="text-gray-400 text-lg">
                How our predictions stack up against real insurance expenses. 
              </p>
            </GlassHeading>
          </div>
        </motion.div>

        <SectionExplanation
          title="How Accurate Is Our Model?"
          description="The graph plots pretrained multimodle machine learning algorythim; it then compares those to data from a SQL database. This helps you trust the estimates based on realworld statics and Explotory Data Analysis"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CurvedBox className="w-full">
            <AccuracyLineChart data={accuracyData} />
          </CurvedBox>
        </motion.div>

        {/* Legend / Insight Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
        >
          <CurvedBox className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-blue-400"></span>
            <span className="text-gray-300">Actual Expenses (Ground Truth)</span>
          </CurvedBox>
          <CurvedBox className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-green-400"></span>
            <span className="text-gray-300">Predicted Expenses (Model Output)</span>
          </CurvedBox>
        </motion.div>
      </div>
    </SectionBackground>
  );
};

export default AccuracySection;
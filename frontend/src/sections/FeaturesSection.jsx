import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import CurvedBox from '../components/CurvedBox';
import FeatureImportance from '../components/FeatureImportance';
import SectionExplanation from '../components/SectionExplanation';
import GlassHeading from '../components/GlassHeading';
import bg3 from '../assets/sections/3.jpg';

const FeaturesSection = ({ featureImportance }) => {
  return (
    <SectionBackground imageUrl={bg3}>
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
              Feature Importance
            </h2>
          </GlassHeading>
          <div className="mt-3">
            <GlassHeading className="mx-auto">
              <p className="text-gray-400 text-lg">
                Understand exactly what drives your insurance costs.
              </p>
            </GlassHeading>
          </div>
        </motion.div>

        <SectionExplanation
          title="Understanding Feature Importance"
          description="This chart shows the relative importance of each feature in determining your insurance premium. Higher bars indicate stronger influence on the predicted cost."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CurvedBox className="w-full overflow-x-auto">
            <FeatureImportance data={featureImportance} />
          </CurvedBox>
        </motion.div>

        {/* Stats Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
        >
          <CurvedBox className="text-center">
            <div className="text-3xl font-bold text-blue-400">6</div>
            <div className="text-gray-400 text-sm">Core Features</div>
          </CurvedBox>
          <CurvedBox className="text-center">
            <div className="text-3xl font-bold text-green-400">11</div>
            <div className="text-gray-400 text-sm">Total Inputs (Encoded)</div>
          </CurvedBox>
          <CurvedBox className="text-center">
            <div className="text-3xl font-bold text-purple-400">3</div>
            <div className="text-gray-400 text-sm">Engineered Risk Indicators</div>
          </CurvedBox>
        </motion.div>
      </div>
    </SectionBackground>
  );
};

export default FeaturesSection;
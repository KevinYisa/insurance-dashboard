import React from 'react';
import { motion } from 'framer-motion';
import SectionBackground from '../components/SectionBackground';
import CurvedBox from '../components/CurvedBox';
import SectionExplanation from '../components/SectionExplanation';
import GlassHeading from '../components/GlassHeading';
import bg5 from '../assets/sections/5.jpg';

const FutureSection = () => {
  return (
    <SectionBackground imageUrl={bg5}>
      <div className="max-w-4xl mx-auto w-full text-center">
        <SectionExplanation
          title="Coming Soon"
          description="We are constantly improving. Stay tuned for more advanced analytics and reporting features."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CurvedBox className="p-12">
            <div className="text-6xl mb-6">🚀</div>
            <GlassHeading className="mx-auto">
              <h2 className="octane-font text-4xl md:text-5xl text-white tracking-wider">
                More Insights Coming Soon
              </h2>
            </GlassHeading>
            <div className="mt-4">
              <GlassHeading className="mx-auto">
                <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  We are developing advanced features including: Historical Quote Tracking, 
                  PDF Report Exports, and Real-time Anomaly Detection.
                </p>
              </GlassHeading>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="bg-blue-500/20 text-blue-300 px-6 py-2 rounded-full border border-blue-500/30">
                📊 Historical Analytics
              </span>
              <span className="bg-green-500/20 text-green-300 px-6 py-2 rounded-full border border-green-500/30">
                📄 PDF Reports
              </span>
              <span className="bg-purple-500/20 text-purple-300 px-6 py-2 rounded-full border border-purple-500/30">
                ⚡ Anomaly Detection
              </span>
            </div>
          </CurvedBox>
        </motion.div>
      </div>
    </SectionBackground>
  );
};

export default FutureSection;
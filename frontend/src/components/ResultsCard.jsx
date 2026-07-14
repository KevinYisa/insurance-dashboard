import React from 'react';
import { motion } from 'framer-motion';

const ResultsCard = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg">Submit a form to see your prediction</p>
        <p className="text-sm">Fill in your details and click "Predict My Insurance"</p>
      </div>
    );
  }

  const { 
    predicted_expenses_zar, 
    monthly_premium_zar, 
    recommended_annual_budget_zar, 
    risk_profile, 
    engineered_features 
  } = prediction;

  const riskColors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-white octane-font text-center tracking-wider">
        📈 Prediction Results
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Annual Expenses</p>
          <p className="text-2xl font-bold text-blue-400">
            R {predicted_expenses_zar.toFixed(2)}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <p className="text-gray-400 text-xs uppercase tracking-wider">Monthly Premium</p>
          <p className="text-2xl font-bold text-green-400">
            R {monthly_premium_zar.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Recommended Annual Budget</p>
        <p className="text-xl font-bold text-purple-400">
          R {recommended_annual_budget_zar.toFixed(2)}
        </p>
      </div>

      <div className={`rounded-xl p-4 border ${riskColors[risk_profile.category] || 'bg-white/5 border-white/5'}`}>
        <p className="text-xs uppercase tracking-wider opacity-70">Risk Profile</p>
        <p className="text-lg font-bold">{risk_profile.category}</p>
        <p className="text-sm opacity-80 mt-1">{risk_profile.description}</p>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Key Risk Drivers</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Obesity Age Score</span>
            <span className="text-white">{engineered_features.obesity_age_score.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dependency Load</span>
            <span className="text-white">{engineered_features.dependency_load.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Lifestyle Penalty</span>
            <span className="text-white">{engineered_features.lifestyle_penalty.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
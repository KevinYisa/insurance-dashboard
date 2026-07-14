import React from 'react';
import { motion } from 'framer-motion';

const WhatIfSliders = ({ formData, setFormData, onSubmit }) => {
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const numValue = Number(value);
    setFormData((prev) => ({ ...prev, [name]: numValue }));
    
    // Debounced auto-submit
    clearTimeout(window.sliderTimeout);
    window.sliderTimeout = setTimeout(() => {
      const payload = { ...formData, [name]: numValue };
      onSubmit(payload);
    }, 400);
  };

  // Helper to get gradient background for slider
  const getSliderColor = (value, min, max) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white octane-font tracking-wider">
          ⚡ What-If Sliders
        </h3>
        <span className="text-xs text-gray-500">Auto-predicts on change</span>
      </div>
      <p className="text-gray-400 text-sm -mt-2">
        Drag to see how changes affect your premium instantly
      </p>

      {/* Age Slider */}
      <div>
        <div className="flex justify-between items-center">
          <label className="form-label mb-0">Age</label>
          <span className="slider-value">{formData.age}</span>
        </div>
        <input
          type="range"
          name="age"
          min="18"
          max="65"
          value={formData.age}
          onChange={handleSliderChange}
          className="modern-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: getSliderColor(formData.age, 18, 65),
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>18</span>
          <span>65</span>
        </div>
      </div>

      {/* BMI Slider */}
      <div>
        <div className="flex justify-between items-center">
          <label className="form-label mb-0">BMI</label>
          <span className="slider-value">{formData.bmi}</span>
        </div>
        <input
          type="range"
          name="bmi"
          min="16"
          max="50"
          step="0.1"
          value={formData.bmi}
          onChange={handleSliderChange}
          className="modern-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: getSliderColor(formData.bmi, 16, 50),
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>16</span>
          <span>50</span>
        </div>
      </div>

      {/* Children Slider */}
      <div>
        <div className="flex justify-between items-center">
          <label className="form-label mb-0">Children</label>
          <span className="slider-value">{formData.children}</span>
        </div>
        <input
          type="range"
          name="children"
          min="0"
          max="5"
          value={formData.children}
          onChange={handleSliderChange}
          className="modern-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: getSliderColor(formData.children, 0, 5),
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>5</span>
        </div>
      </div>

      {/* Reset Button */}
      <motion.button
        type="button"
        onClick={() => {
          const resetData = { age: 30, bmi: 25, children: 0 };
          setFormData((prev) => ({ ...prev, ...resetData }));
          onSubmit({ ...formData, ...resetData });
        }}
        className="w-full py-2 mt-2 text-sm text-gray-400 border border-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-400 transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ↺ Reset to Defaults
      </motion.button>
    </div>
  );
};

export default WhatIfSliders;
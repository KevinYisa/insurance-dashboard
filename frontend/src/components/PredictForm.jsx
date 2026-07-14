import React from 'react';
import { motion } from 'framer-motion';

const PredictForm = ({ formData, setFormData, onSubmit, loading }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: Number(formData.age),
      bmi: Number(formData.bmi),
      children: Number(formData.children),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-2xl font-semibold text-white octane-font text-center tracking-wider">
        Enter Your Details
      </h3>
      <p className="text-gray-400 text-center text-sm -mt-2">
        Fill in your health profile for an accurate estimate
      </p>

      {/* Age */}
      <div>
        <label className="form-label">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="modern-input"
          min="18"
          max="65"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label className="form-label">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="modern-select"
          required
        >
          <option value="male">👤 Male</option>
          <option value="female">👩 Female</option>
        </select>
      </div>

      {/* BMI */}
      <div>
        <label className="form-label">BMI</label>
        <input
          type="number"
          step="0.1"
          name="bmi"
          value={formData.bmi}
          onChange={handleChange}
          className="modern-input"
          min="16"
          max="50"
          required
        />
      </div>

      {/* Children */}
      <div>
        <label className="form-label">Number of Children</label>
        <input
          type="number"
          name="children"
          value={formData.children}
          onChange={handleChange}
          className="modern-input"
          min="0"
          max="5"
          required
        />
      </div>

      {/* Discount Eligibility - Custom Checkbox */}
      <div>
        <label className="form-label">Discount Eligibility</label>
        <label className="custom-checkbox">
          <input
            type="checkbox"
            name="discount_eligibility"
            checked={formData.discount_eligibility}
            onChange={handleChange}
          />
          <span className="text-gray-300 text-sm">
            {formData.discount_eligibility ? '✅ Eligible' : '❌ Not Eligible'}
          </span>
        </label>
        <p className="text-gray-500 text-xs mt-1">
          Eligible if you have a wellness program or non-smoker status
        </p>
      </div>

      {/* Region */}
      <div>
        <label className="form-label">Region</label>
        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          className="modern-select"
          required
        >
          <option value="northeast">🗽 Northeast</option>
          <option value="southwest">🌵 Southwest</option>
          <option value="southeast">🌴 Southeast</option>
          <option value="northwest">🌲 Northwest</option>
        </select>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="predict-btn relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Calculating...</span>
          </span>
        ) : (
          '🚀 Predict My Insurance'
        )}
      </motion.button>
    </form>
  );
};

export default PredictForm;
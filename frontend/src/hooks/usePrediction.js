import { useState, useEffect } from 'react';
import { predictExpenses, getAccuracyData, getFeatureImportance } from '../api/client';

export const usePrediction = () => {
  const [formData, setFormData] = useState({
    age: 30,
    gender: 'male',
    bmi: 25,
    children: 0,
    discount_eligibility: false,
    region: 'southwest',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracyData, setAccuracyData] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [accRes, fiRes] = await Promise.all([
          getAccuracyData(),
          getFeatureImportance(),
        ]);
        setAccuracyData(accRes.data);
        setFeatureImportance(fiRes.data);
      } catch (err) {
        console.error('Failed to load static data:', err);
      }
    };
    fetchStaticData();
  }, []);

  const submitPrediction = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictExpenses(data);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    prediction,
    loading,
    error,
    submitPrediction,
    accuracyData,
    featureImportance,
  };
};
import React from 'react';
import { usePrediction } from './hooks/usePrediction';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import PredictorSection from './sections/PredictorSection';
import FeaturesSection from './sections/FeaturesSection';
import AccuracySection from './sections/AccuracySection';
import FutureSection from './sections/FutureSection';
import './App.css';

function App() {
  const {
    formData,
    setFormData,
    prediction,
    loading,
    error,
    submitPrediction,
    accuracyData,
    featureImportance,
  } = usePrediction();

  return (
    <div className="App">
      <Navigation />
      <HeroSection />
      <PredictorSection
        formData={formData}
        setFormData={setFormData}
        prediction={prediction}
        loading={loading}
        error={error}
        submitPrediction={submitPrediction}
      />
      <FeaturesSection featureImportance={featureImportance} />
      <AccuracySection accuracyData={accuracyData} />
      <FutureSection />
      <Footer />
    </div>
  );
}

export default App;
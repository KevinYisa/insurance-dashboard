package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

// ---------- Constants ----------
const USD_TO_ZAR = 18.50

// ---------- Request & Response Structs ----------
type PredictRequest struct {
	Age                 int     `json:"age"`
	Gender              string  `json:"gender"`
	Bmi                 float64 `json:"bmi"`
	Children            int     `json:"children"`
	DiscountEligibility bool    `json:"discount_eligibility"`
	Region              string  `json:"region"`
}

type EngineeredFeatures struct {
	ObesityAgeScore  float64 `json:"obesity_age_score"`
	DependencyLoad   float64 `json:"dependency_load"`
	LifestylePenalty float64 `json:"lifestyle_penalty"`
}

type RiskProfile struct {
	Category         string  `json:"category"`
	BudgetMultiplier float64 `json:"budget_multiplier"`
	Description      string  `json:"description"`
}

type PredictResponse struct {
	PredictedExpensesUSD       float64            `json:"predicted_expenses_usd"`
	PredictedExpensesZAR       float64            `json:"predicted_expenses_zar"`
	MonthlyPremiumZAR          float64            `json:"monthly_premium_zar"`
	RecommendedAnnualBudgetZAR float64            `json:"recommended_annual_budget_zar"`
	EngineeredFeatures         EngineeredFeatures `json:"engineered_features"`
	RiskProfile                RiskProfile        `json:"risk_profile"`
	Status                     string             `json:"status"`
}

// ---------- JSON Parameters (from Python) ----------
type PreprocessParams struct {
	NumericFeatures struct {
		Columns []string  `json:"columns"`
		Means   []float64 `json:"means"`
		Stds    []float64 `json:"stds"`
	} `json:"numeric_features"`
	CategoricalFeatures struct {
		Columns    []string   `json:"columns"`
		Categories [][]string `json:"categories"`
	} `json:"categorical_features"`
	BooleanFeatures struct {
		Columns []string `json:"columns"`
	} `json:"boolean_features"`
}

type LinearCoefs struct {
	Intercept    float64   `json:"intercept"`
	Coefficients []float64 `json:"coefficients"`
	FeatureCount int       `json:"feature_count"`
}

// ---------- New Structs for Dashboard Data ----------
type TestPredictions struct {
	Actual    []float64 `json:"actual"`
	Predicted []float64 `json:"predicted"`
}

type FeatureImportance struct {
	Importances []float64 `json:"importances"`
	ModelType   string    `json:"model_type"`
}

// ---------- Global Variables ----------
var (
	preprocessParams  PreprocessParams
	linearCoefs       LinearCoefs
	testPredictions   TestPredictions
	featureImportance FeatureImportance
)

// ---------- Feature Engineering, Scaling, Encoding (unchanged) ----------
func engineerFeatures(req PredictRequest) ([]float64, EngineeredFeatures, float64) {
	discountInt := 0.0
	if req.DiscountEligibility {
		discountInt = 1.0
	}
	ageF := float64(req.Age)
	childrenF := float64(req.Children)

	obesityAgeScore := (ageF * req.Bmi) / 100.0
	dependencyLoad := childrenF * (ageF / 50.0)
	lifestylePenalty := (1.0 - discountInt) * (req.Bmi / 30.0)

	engineered := EngineeredFeatures{
		ObesityAgeScore:  obesityAgeScore,
		DependencyLoad:   dependencyLoad,
		LifestylePenalty: lifestylePenalty,
	}

	numericVec := []float64{
		ageF,
		req.Bmi,
		childrenF,
		obesityAgeScore,
		dependencyLoad,
		lifestylePenalty,
	}
	return numericVec, engineered, discountInt
}

func scaleNumeric(raw []float64) []float64 {
	scaled := make([]float64, len(raw))
	for i := 0; i < len(raw); i++ {
		scaled[i] = (raw[i] - preprocessParams.NumericFeatures.Means[i]) / preprocessParams.NumericFeatures.Stds[i]
	}
	return scaled
}

func encodeGender(gender string) float64 {
	if gender == "male" {
		return 1.0
	}
	return 0.0
}

func encodeRegion(region string) []float64 {
	switch region {
	case "southwest":
		return []float64{1.0, 0.0, 0.0}
	case "southeast":
		return []float64{0.0, 1.0, 0.0}
	case "northwest":
		return []float64{0.0, 0.0, 1.0}
	default:
		return []float64{0.0, 0.0, 0.0}
	}
}

func getRiskProfile(age int, engineered EngineeredFeatures) RiskProfile {
	if engineered.ObesityAgeScore > 25 ||
		engineered.LifestylePenalty > 1.5 ||
		(age > 60 && engineered.DependencyLoad > 3) {
		return RiskProfile{
			Category:         "High",
			BudgetMultiplier: 1.40,
			Description:      "Elevated metabolic or lifestyle risk. Strongly recommend comprehensive coverage.",
		}
	}
	if engineered.ObesityAgeScore > 15 ||
		engineered.LifestylePenalty > 0.8 ||
		(age > 40 && engineered.DependencyLoad > 2) {
		return RiskProfile{
			Category:         "Medium",
			BudgetMultiplier: 1.20,
			Description:      "Moderate risk factors detected. Consider standard coverage with a small buffer.",
		}
	}
	return RiskProfile{
		Category:         "Low",
		BudgetMultiplier: 1.05,
		Description:      "Healthy profile. Standard insurance with minimal buffer recommended.",
	}
}

// ---------- Prediction Handler ----------
func predictHandler(w http.ResponseWriter, r *http.Request) {
	var req PredictRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	rawNumeric, engineered, discountInt := engineerFeatures(req)
	scaledNumeric := scaleNumeric(rawNumeric)
	genderEnc := encodeGender(req.Gender)
	regionEnc := encodeRegion(req.Region)
	boolEnc := []float64{discountInt}

	features := append(scaledNumeric, genderEnc)
	features = append(features, regionEnc...)
	features = append(features, boolEnc...)

	if len(features) != linearCoefs.FeatureCount {
		http.Error(w, fmt.Sprintf(`{"error":"Feature mismatch: expected %d, got %d"}`, linearCoefs.FeatureCount, len(features)), http.StatusInternalServerError)
		return
	}

	predictionUSD := linearCoefs.Intercept
	for i := 0; i < len(features); i++ {
		predictionUSD += features[i] * linearCoefs.Coefficients[i]
	}
	predictionUSD = math.Max(predictionUSD, 0)

	predictionZAR := predictionUSD * USD_TO_ZAR
	monthlyPremiumZAR := (predictionUSD / 100) * USD_TO_ZAR
	riskProfile := getRiskProfile(req.Age, engineered)
	recommendedBudgetZAR := predictionZAR * riskProfile.BudgetMultiplier

	resp := PredictResponse{
		PredictedExpensesUSD:       math.Round(predictionUSD*100) / 100,
		PredictedExpensesZAR:       math.Round(predictionZAR*100) / 100,
		MonthlyPremiumZAR:          math.Round(monthlyPremiumZAR*100) / 100,
		RecommendedAnnualBudgetZAR: math.Round(recommendedBudgetZAR*100) / 100,
		EngineeredFeatures:         engineered,
		RiskProfile:                riskProfile,
		Status:                     "success",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(resp)
}

// ---------- New Handlers for Dashboard Data ----------
func accuracyDataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(testPredictions)
}

func featureImportanceHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(featureImportance)
}

// ---------- Health Check ----------
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"healthy"}`))
}

// ---------- Load All JSON Files ----------
func loadParams() error {
	// 1. Preprocessing params
	ppData, err := os.ReadFile("data/preprocessing_params.json")
	if err != nil {
		return fmt.Errorf("failed to read preprocessing_params.json: %w", err)
	}
	if err := json.Unmarshal(ppData, &preprocessParams); err != nil {
		return fmt.Errorf("failed to parse preprocessing_params.json: %w", err)
	}

	// 2. Linear coefficients
	lcData, err := os.ReadFile("data/linear_coefs.json")
	if err != nil {
		return fmt.Errorf("failed to read linear_coefs.json: %w", err)
	}
	if err := json.Unmarshal(lcData, &linearCoefs); err != nil {
		return fmt.Errorf("failed to parse linear_coefs.json: %w", err)
	}

	// 3. Test predictions (for scatter plot)
	tpData, err := os.ReadFile("data/test_predictions.json")
	if err != nil {
		return fmt.Errorf("failed to read test_predictions.json: %w", err)
	}
	if err := json.Unmarshal(tpData, &testPredictions); err != nil {
		return fmt.Errorf("failed to parse test_predictions.json: %w", err)
	}

	// 4. Feature importances
	fiData, err := os.ReadFile("data/feature_importances.json")
	if err != nil {
		return fmt.Errorf("failed to read feature_importances.json: %w", err)
	}
	if err := json.Unmarshal(fiData, &featureImportance); err != nil {
		return fmt.Errorf("failed to parse feature_importances.json: %w", err)
	}

	log.Println("✅ All parameters loaded successfully.")
	log.Printf("   Numeric features: %d", len(preprocessParams.NumericFeatures.Columns))
	log.Printf("   Coefficient count: %d", linearCoefs.FeatureCount)
	log.Printf("   Test predictions: %d records", len(testPredictions.Actual))
	log.Printf("   Feature importances: %d features", len(featureImportance.Importances))
	return nil
}

// ---------- Main ----------
func main() {
	if err := loadParams(); err != nil {
		log.Fatalf("❌ Startup error: %v", err)
	}

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "https://your-netlify-app.netlify.app"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", healthHandler)
	r.Post("/predict", predictHandler)
	r.Get("/accuracy-data", accuracyDataHandler)           // NEW
	r.Get("/feature-importance", featureImportanceHandler) // NEW

	port := ":8080"
	log.Printf("🚀 Server starting on http://localhost%s", port)
	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}


// Simple thyroid risk prediction model based on lab values
// This is a simplified model for demonstration purposes

type LabResults = {
  tsh?: string;
  t3?: string;
  t4?: string;
  thyroglobulin?: string;
  calcitonin?: string;
};

type SymptomData = {
  neckSwelling: "yes" | "no";
  difficultySwallowing: "yes" | "no";
  voiceChanges: "yes" | "no";
  neckPain: "yes" | "no";
  swollenLymphNodes: "yes" | "no";
};

type MedicalHistoryData = {
  familyHistoryThyroid: "yes" | "no";
  radiationExposure: "yes" | "no";
  previousThyroidIssues: "yes" | "no";
  smoking: string;
};

type PersonalInfoData = {
  age: string;
  gender: "male" | "female";
};

interface PredictionInput {
  labResults: LabResults;
  symptoms: SymptomData;
  medicalHistory: MedicalHistoryData;
  personalInfo: PersonalInfoData;
}

export interface PredictionResult {
  risk: "low" | "moderate" | "high";
  score: number; // 0-100
  factors: string[]; // Key factors that influenced the prediction
  labResultsAnalysis: {
    abnormal: boolean;
    details: string[];
  };
}

// Reference ranges for lab tests
const REFERENCE_RANGES = {
  tsh: { min: 0.4, max: 4.0, unit: "mIU/L" },
  t3: { min: 80, max: 200, unit: "ng/dL" },
  t4: { min: 5.0, max: 12.0, unit: "μg/dL" },
  thyroglobulin: { min: 3, max: 40, unit: "ng/mL" },
  calcitonin: { min: 0, max: 10, unit: "pg/mL" },
};

// Check if a lab value is abnormal
const isAbnormal = (value: string, type: keyof typeof REFERENCE_RANGES): boolean => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return false;
  
  const range = REFERENCE_RANGES[type];
  return numValue < range.min || numValue > range.max;
};

// Generate details for abnormal lab results
const getLabResultDetails = (labResults: LabResults): string[] => {
  const details: string[] = [];
  
  Object.entries(labResults).forEach(([key, value]) => {
    if (!value || value.trim() === "") return;
    
    const testKey = key as keyof typeof REFERENCE_RANGES;
    if (isAbnormal(value, testKey)) {
      const numValue = parseFloat(value);
      const range = REFERENCE_RANGES[testKey];
      
      let message = `${testKey.toUpperCase()}: ${numValue} ${range.unit} is `;
      if (numValue < range.min) {
        message += `below normal range (${range.min}-${range.max} ${range.unit})`;
      } else {
        message += `above normal range (${range.min}-${range.max} ${range.unit})`;
      }
      
      details.push(message);
    }
  });
  
  return details;
};

// Calculate risk factors based on patient data
const calculateRiskFactors = (data: PredictionInput): string[] => {
  const factors: string[] = [];
  
  // Age risk
  const age = parseInt(data.personalInfo.age);
  if (age > 60) {
    factors.push("Age over 60");
  }
  
  // Family history
  if (data.medicalHistory.familyHistoryThyroid === "yes") {
    factors.push("Family history of thyroid disease");
  }
  
  // Radiation exposure
  if (data.medicalHistory.radiationExposure === "yes") {
    factors.push("Prior radiation exposure to neck/head");
  }
  
  // Previous thyroid issues
  if (data.medicalHistory.previousThyroidIssues === "yes") {
    factors.push("Previous thyroid issues");
  }
  
  // Smoking
  if (data.medicalHistory.smoking === "current") {
    factors.push("Current smoker");
  }
  
  // Symptoms
  if (data.symptoms.neckSwelling === "yes") {
    factors.push("Neck swelling or lump");
  }
  
  if (data.symptoms.difficultySwallowing === "yes") {
    factors.push("Difficulty swallowing");
  }
  
  if (data.symptoms.voiceChanges === "yes") {
    factors.push("Voice changes or hoarseness");
  }
  
  if (data.symptoms.neckPain === "yes") {
    factors.push("Neck pain");
  }
  
  if (data.symptoms.swollenLymphNodes === "yes") {
    factors.push("Swollen lymph nodes");
  }
  
  return factors;
};

export const predictThyroidRisk = (data: PredictionInput): PredictionResult => {
  // Analyze lab results
  const labResultDetails = getLabResultDetails(data.labResults);
  const hasAbnormalLabResults = labResultDetails.length > 0;
  
  // Get risk factors
  const factors = calculateRiskFactors(data);
  
  // Calculate score based on risk factors and lab results
  let baseScore = 0;
  
  // Add points for each risk factor
  baseScore += factors.length * 10;
  
  // Add points for abnormal lab results
  if (hasAbnormalLabResults) {
    baseScore += labResultDetails.length * 15;
  }
  
  // Check for severe indicators
  const hasCalcitoninElevation = data.labResults.calcitonin && 
    isAbnormal(data.labResults.calcitonin, "calcitonin") && 
    parseFloat(data.labResults.calcitonin) > 20;
  
  if (hasCalcitoninElevation) {
    baseScore += 30; // Major risk indicator
    factors.push("Significantly elevated calcitonin levels");
  }
  
  // Calculate final score (cap at 100)
  const score = Math.min(Math.round(baseScore), 100);
  
  // Determine risk level
  let risk: "low" | "moderate" | "high";
  if (score < 30) {
    risk = "low";
  } else if (score < 70) {
    risk = "moderate";
  } else {
    risk = "high";
  }
  
  return {
    risk,
    score,
    factors,
    labResultsAnalysis: {
      abnormal: hasAbnormalLabResults,
      details: labResultDetails,
    },
  };
};

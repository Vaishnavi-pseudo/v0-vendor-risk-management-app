export type AssessmentType = 'onboarding' | 'performance' | 'risk';

export interface AssessmentQuestion {
  id: string;
  question: string;
  description?: string;
  type: 'radio' | 'checkbox' | 'select' | 'rating';
  options?: { label: string; value: string; riskScore?: number }[];
  riskWeight: number;
}

export interface AssessmentScore {
  type: AssessmentType;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface VendorAssessment {
  id: string;
  vendorId: string;
  vendorName: string;
  type: AssessmentType;
  questions: AssessmentQuestion[];
  responses: Record<string, string | string[] | number>;
  scores: {
    onboarding?: AssessmentScore;
    performance?: AssessmentScore;
    risk?: AssessmentScore;
  };
  riskScore: number;
  completedDate: string;
  completedBy: string;
  notes?: string;
}

export interface VendorAssessmentHistory {
  vendorId: string;
  assessments: VendorAssessment[];
  latestAssessmentDate?: string;
  currentRiskScore?: number;
}

// Custom weight percentages for combining assessment scores
export const ASSESSMENT_WEIGHTS = {
  onboarding: 0.2, // 20%
  performance: 0.3, // 30%
  risk: 0.5, // 50%
};

// Function to calculate combined risk score from all three assessments
export function calculateCombinedRiskScore(scores: { onboarding?: AssessmentScore; performance?: AssessmentScore; risk?: AssessmentScore }): number {
  let totalScore = 0;
  let totalWeight = 0;

  if (scores.onboarding) {
    totalScore += scores.onboarding.percentage * ASSESSMENT_WEIGHTS.onboarding;
    totalWeight += ASSESSMENT_WEIGHTS.onboarding;
  }

  if (scores.performance) {
    totalScore += scores.performance.percentage * ASSESSMENT_WEIGHTS.performance;
    totalWeight += ASSESSMENT_WEIGHTS.performance;
  }

  if (scores.risk) {
    totalScore += scores.risk.percentage * ASSESSMENT_WEIGHTS.risk;
    totalWeight += ASSESSMENT_WEIGHTS.risk;
  }

  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

// Vendor form configuration with dynamic questions based on type and services

export type VendorType = 'IT/Cloud' | 'Logistics' | 'Legal' | 'Finance' | 'Manufacturing'
export type VendorService = 'SaaS' | 'Infrastructure' | 'Consulting' | 'Transportation' | 'Legal Services' | 'Accounting' | 'Manufacturing' | 'Supply Chain'

export interface FormQuestion {
  id: string
  question: string
  type: 'radio' | 'checkbox' | 'select' | 'text' | 'number'
  options?: { label: string; value: string; riskScore?: number }[]
  riskWeight: number // Weight in final score (0-1)
  mitigationOptions?: { label: string; value: string; riskReduction?: number }[] // For mitigation factors
}

export interface VendorFormTemplate {
  vendorType: VendorType
  services: VendorService[]
  questions: FormQuestion[]
}

// Risk scoring weights for different question categories
export const RISK_CATEGORIES = {
  DATA_SECURITY: 0.25,
  OPERATIONAL_RESILIENCE: 0.2,
  FINANCIAL_STABILITY: 0.15,
  COMPLIANCE: 0.2,
  CERTIFICATIONS: 0.2,
}

// Form templates for each vendor type
export const VENDOR_FORM_TEMPLATES: Record<VendorType, VendorFormTemplate> = {
  'IT/Cloud': {
    vendorType: 'IT/Cloud',
    services: ['SaaS', 'Infrastructure', 'Consulting'],
    questions: [
      {
        id: 'data-sensitivity',
        question: 'What type of data will your organization have access to?',
        type: 'checkbox',
        options: [
          { label: 'No sensitive data', value: 'none', riskScore: 0 },
          { label: 'Non-PII business data', value: 'business', riskScore: 25 },
          { label: 'Customer PII/PCI', value: 'pii', riskScore: 60 },
          { label: 'Financial data', value: 'financial', riskScore: 75 },
          { label: 'Healthcare/HIPAA data', value: 'hipaa', riskScore: 85 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'infrastructure-security',
        question: 'Which security measures are in place?',
        type: 'checkbox',
        options: [
          { label: 'Encryption at rest and in transit', value: 'encryption', riskScore: -10 },
          { label: 'Multi-factor authentication', value: 'mfa', riskScore: -10 },
          { label: 'Regular security audits', value: 'audits', riskScore: -8 },
          { label: 'Vulnerability scanning', value: 'scanning', riskScore: -8 },
          { label: 'Incident response plan', value: 'incident', riskScore: -7 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'uptime-sla',
        question: 'What is your guaranteed uptime SLA?',
        type: 'select',
        options: [
          { label: 'No SLA', value: 'none', riskScore: 70 },
          { label: '95%', value: '95', riskScore: 50 },
          { label: '99%', value: '99', riskScore: 30 },
          { label: '99.5%', value: '99.5', riskScore: 20 },
          { label: '99.9%', value: '99.9', riskScore: 10 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'disaster-recovery',
        question: 'Do you have a disaster recovery plan?',
        type: 'radio',
        options: [
          { label: 'Yes, tested quarterly', value: 'tested', riskScore: 10 },
          { label: 'Yes, but not regularly tested', value: 'untested', riskScore: 30 },
          { label: 'No', value: 'none', riskScore: 60 },
        ],
        riskWeight: 0.15,
      },
      {
        id: 'certifications',
        question: 'Which certifications do you hold?',
        type: 'checkbox',
        options: [
          { label: 'ISO 27001', value: 'iso27001', riskScore: -15 },
          { label: 'SOC 2 Type II', value: 'soc2', riskScore: -15 },
          { label: 'GDPR certified', value: 'gdpr', riskScore: -12 },
          { label: 'HIPAA compliant', value: 'hipaa', riskScore: -15 },
          { label: 'None', value: 'none', riskScore: 0 },
        ],
        riskWeight: 0.2,
      },
    ],
  },
  Logistics: {
    vendorType: 'Logistics',
    services: ['Transportation', 'Supply Chain'],
    questions: [
      {
        id: 'operational-scale',
        question: 'What percentage of your operations are critical to our supply chain?',
        type: 'radio',
        options: [
          { label: '0-25%', value: 'low', riskScore: 20 },
          { label: '25-50%', value: 'medium', riskScore: 40 },
          { label: '50-75%', value: 'high', riskScore: 60 },
          { label: '75-100%', value: 'critical', riskScore: 80 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'financial-stability',
        question: 'What is your company revenue range?',
        type: 'select',
        options: [
          { label: 'Under $1M', value: 'micro', riskScore: 70 },
          { label: '$1M - $10M', value: 'small', riskScore: 50 },
          { label: '$10M - $100M', value: 'medium', riskScore: 30 },
          { label: '$100M+', value: 'large', riskScore: 15 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'backup-capacity',
        question: 'Do you have backup capacity for surge demand?',
        type: 'radio',
        options: [
          { label: 'Yes, 50%+ extra capacity', value: 'high', riskScore: 10 },
          { label: 'Yes, 25-50% extra', value: 'medium', riskScore: 25 },
          { label: 'Limited backup capacity', value: 'low', riskScore: 50 },
          { label: 'No', value: 'none', riskScore: 70 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'track-record',
        question: 'How long have you been in business?',
        type: 'select',
        options: [
          { label: 'Less than 1 year', value: 'new', riskScore: 70 },
          { label: '1-3 years', value: 'early', riskScore: 50 },
          { label: '3-10 years', value: 'established', riskScore: 30 },
          { label: '10+ years', value: 'mature', riskScore: 15 },
        ],
        riskWeight: 0.15,
      },
      {
        id: 'compliance-certifications',
        question: 'Which compliance/safety certifications do you hold?',
        type: 'checkbox',
        options: [
          { label: 'ISO 9001', value: 'iso9001', riskScore: -12 },
          { label: 'DOT certified', value: 'dot', riskScore: -12 },
          { label: 'Insurance coverage', value: 'insurance', riskScore: -10 },
          { label: 'Safety audits', value: 'safety', riskScore: -10 },
        ],
        riskWeight: 0.2,
      },
    ],
  },
  Legal: {
    vendorType: 'Legal',
    services: ['Legal Services'],
    questions: [
      {
        id: 'confidentiality-handling',
        question: 'How do you handle client confidential information?',
        type: 'checkbox',
        options: [
          { label: 'Encrypted storage', value: 'encrypted', riskScore: -10 },
          { label: 'Access controls', value: 'access', riskScore: -10 },
          { label: 'Regular audits', value: 'audits', riskScore: -8 },
          { label: 'No specific measures', value: 'none', riskScore: 60 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'professional-standing',
        question: 'What is your professional standing?',
        type: 'radio',
        options: [
          { label: 'Law firm with 50+ attorneys', value: 'large', riskScore: 10 },
          { label: 'Established firm (10-50 attorneys)', value: 'medium', riskScore: 25 },
          { label: 'Small firm (1-10 attorneys)', value: 'small', riskScore: 40 },
          { label: 'Solo practitioner', value: 'solo', riskScore: 60 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'malpractice-insurance',
        question: 'Do you have malpractice insurance?',
        type: 'radio',
        options: [
          { label: 'Yes, $5M+ coverage', value: 'high', riskScore: 10 },
          { label: 'Yes, $1M-$5M', value: 'medium', riskScore: 20 },
          { label: 'Yes, under $1M', value: 'low', riskScore: 35 },
          { label: 'No', value: 'none', riskScore: 70 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'experience-area',
        question: 'Years of experience in your practice area?',
        type: 'select',
        options: [
          { label: '0-2 years', value: 'new', riskScore: 60 },
          { label: '2-5 years', value: 'developing', riskScore: 40 },
          { label: '5-10 years', value: 'experienced', riskScore: 25 },
          { label: '10+ years', value: 'expert', riskScore: 10 },
        ],
        riskWeight: 0.15,
      },
      {
        id: 'compliance-certifications',
        question: 'Professional credentials and certifications?',
        type: 'checkbox',
        options: [
          { label: 'Bar admission in relevant states', value: 'bar', riskScore: -10 },
          { label: 'Specialized certifications', value: 'specialized', riskScore: -8 },
          { label: 'Industry recognition', value: 'recognition', riskScore: -7 },
        ],
        riskWeight: 0.2,
      },
    ],
  },
  Finance: {
    vendorType: 'Finance',
    services: ['Accounting'],
    questions: [
      {
        id: 'financial-data-security',
        question: 'How is financial data protected?',
        type: 'checkbox',
        options: [
          { label: 'Bank-level encryption', value: 'encryption', riskScore: -15 },
          { label: 'Multi-factor authentication', value: 'mfa', riskScore: -10 },
          { label: 'Segregated systems', value: 'segregated', riskScore: -8 },
          { label: 'Basic password protection', value: 'basic', riskScore: 50 },
        ],
        riskWeight: 0.3,
      },
      {
        id: 'audit-capability',
        question: 'Can you provide audit trails and compliance reports?',
        type: 'radio',
        options: [
          { label: 'Yes, automated real-time', value: 'real-time', riskScore: 10 },
          { label: 'Yes, manual audit trails', value: 'manual', riskScore: 25 },
          { label: 'Limited capability', value: 'limited', riskScore: 45 },
          { label: 'No', value: 'none', riskScore: 70 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'regulatory-compliance',
        question: 'What regulatory compliance do you maintain?',
        type: 'checkbox',
        options: [
          { label: 'SOX compliant', value: 'sox', riskScore: -15 },
          { label: 'SEC registered', value: 'sec', riskScore: -12 },
          { label: 'FINRA member', value: 'finra', riskScore: -12 },
          { label: 'No specific compliance', value: 'none', riskScore: 50 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'financial-stability',
        question: 'What is your credit rating?',
        type: 'select',
        options: [
          { label: 'Investment grade (BBB+ and above)', value: 'investment', riskScore: 10 },
          { label: 'Speculative (BB-BBB)', value: 'speculative', riskScore: 35 },
          { label: 'High yield (B and below)', value: 'high-yield', riskScore: 60 },
          { label: 'Not rated', value: 'unrated', riskScore: 50 },
        ],
        riskWeight: 0.2,
      },
    ],
  },
  Manufacturing: {
    vendorType: 'Manufacturing',
    services: ['Manufacturing'],
    questions: [
      {
        id: 'quality-control',
        question: 'What quality control measures are in place?',
        type: 'checkbox',
        options: [
          { label: 'Six Sigma certification', value: 'sixsigma', riskScore: -15 },
          { label: 'ISO 9001 certified', value: 'iso9001', riskScore: -12 },
          { label: 'Regular third-party audits', value: 'audits', riskScore: -10 },
          { label: 'Internal QA only', value: 'internal', riskScore: 30 },
          { label: 'No formal QC program', value: 'none', riskScore: 70 },
        ],
        riskWeight: 0.25,
      },
      {
        id: 'production-capacity',
        question: 'What percentage of your capacity are we using?',
        type: 'radio',
        options: [
          { label: '0-10%', value: 'low', riskScore: 15 },
          { label: '10-25%', value: 'medium-low', riskScore: 20 },
          { label: '25-50%', value: 'medium', riskScore: 35 },
          { label: '50%+', value: 'high', riskScore: 55 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'supply-chain-resilience',
        question: 'How resilient is your supply chain?',
        type: 'radio',
        options: [
          { label: 'Multiple suppliers, diversified geography', value: 'high', riskScore: 15 },
          { label: 'Some supplier redundancy', value: 'medium', riskScore: 35 },
          { label: 'Limited backup suppliers', value: 'low', riskScore: 55 },
          { label: 'Single-source dependencies', value: 'critical', riskScore: 75 },
        ],
        riskWeight: 0.2,
      },
      {
        id: 'facility-security',
        question: 'What physical security measures are in place?',
        type: 'checkbox',
        options: [
          { label: '24/7 security monitoring', value: 'monitoring', riskScore: -10 },
          { label: 'Access control systems', value: 'access', riskScore: -8 },
          { label: 'Surveillance cameras', value: 'cameras', riskScore: -6 },
          { label: 'Basic locks and keys', value: 'basic', riskScore: 30 },
        ],
        riskWeight: 0.15,
      },
      {
        id: 'compliance-certifications',
        question: 'Industry and safety certifications?',
        type: 'checkbox',
        options: [
          { label: 'OSHA certified', value: 'osha', riskScore: -10 },
          { label: 'Environmental certifications', value: 'environmental', riskScore: -8 },
          { label: 'Industry-specific standards', value: 'industry', riskScore: -7 },
        ],
        riskWeight: 0.2,
      },
    ],
  },
}

// Function to calculate risk score from form responses
export function calculateRiskScore(
  vendorType: VendorType,
  responses: Record<string, string | string[]>
): number {
  const template = VENDOR_FORM_TEMPLATES[vendorType]
  let totalScore = 0
  let totalWeight = 0

  template.questions.forEach((question) => {
    const response = responses[question.id]
    if (!response) return

    let questionScore = 0
    const responseValues = Array.isArray(response) ? response : [response]

    // For checkbox questions, average all selected options
    if (question.type === 'checkbox') {
      const scores = responseValues
        .map((val) => {
          const option = question.options?.find((opt) => opt.value === val)
          return option?.riskScore || 0
        })
        .filter((score) => score !== undefined)
      questionScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    } else {
      // For radio/select, use the single value
      const option = question.options?.find((opt) => opt.value === responseValues[0])
      questionScore = option?.riskScore || 0
    }

    totalScore += questionScore * question.riskWeight
    totalWeight += question.riskWeight
  })

  // Normalize to 0-100 scale
  const normalizedScore = totalWeight > 0 ? totalScore / totalWeight + 50 : 50
  return Math.max(0, Math.min(100, normalizedScore))
}

// Function to get risk level based on score
export function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (score < 25) return 'Low'
  if (score < 50) return 'Medium'
  if (score < 75) return 'High'
  return 'Critical'
}

export const DOCUMENT_RISK_WEIGHTS = {
  'SOC 2 Type II': { weight: -20, category: 'Compliance' },
  'ITDR Certification': { weight: -20, category: 'Disaster Recovery' },
  'BCP (Business Continuity Plan)': { weight: -18, category: 'Business Continuity' },
  'Crisis Management Plan': { weight: -15, category: 'Business Continuity' },
  'SOC Monitoring Plan': { weight: -15, category: 'Monitoring' },
  'Cyber Insurance Certificate': { weight: -12, category: 'Insurance' },
  'Insurance Certificate': { weight: -12, category: 'Insurance' },
  'SLA (Service Level Agreement)': { weight: -10, category: 'Agreements' },
  'NDA (Non-Disclosure Agreement)': { weight: -8, category: 'Legal' },
  'GDPR DPA (Data Processing Agreement)': { weight: -8, category: 'Legal' },
  'ISO 27001 Certification': { weight: -18, category: 'Security' },
  'HIPAA Compliance': { weight: -15, category: 'Compliance' },
  'PCI DSS Certification': { weight: -15, category: 'Compliance' },
}

export const DOCUMENT_WEIGHT_PERCENTAGES = {
  documentWeight: 0.2, // Documents contribute 20% to final score
  questionWeight: 0.8, // Questions contribute 80% to final score
}

export function getDocumentRiskWeight(documentType: string): number {
  return DOCUMENT_RISK_WEIGHTS[documentType as keyof typeof DOCUMENT_RISK_WEIGHTS]?.weight || -5
}

export function getDocumentCategory(documentType: string): string {
  return DOCUMENT_RISK_WEIGHTS[documentType as keyof typeof DOCUMENT_RISK_WEIGHTS]?.category || 'Other'
}

export function calculateDocumentRiskReduction(
  documents: Array<{ documentType: string; status: 'Valid' | 'Validated' | 'Expired' | 'Expiring' }>
): number {
  // Only count valid/validated documents for risk reduction
  const validDocs = documents.filter((d) => d.status === 'Valid' || d.status === 'Validated')
  return validDocs.reduce((total, doc) => total + getDocumentRiskWeight(doc.documentType), 0)
}

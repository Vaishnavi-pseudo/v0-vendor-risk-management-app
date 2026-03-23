// Mock llamaparse document parser for demo
// In production, this would call the real LlamaParse API

export interface DocumentAnalysis {
  documentType: string
  fileName: string
  extractedText: string
  keyFindings: string[]
  suggestedQuestions: Array<{
    question: string
    category: string
    riskLevel: string
  }>
  complianceKeywords: string[]
  certifications: string[]
}

// Mock vendor documents and their analysis
const MOCK_DOCUMENTS: Record<string, DocumentAnalysis> = {
  'NDA.pdf': {
    documentType: 'Non-Disclosure Agreement',
    fileName: 'NDA.pdf',
    extractedText: `Non-Disclosure Agreement
    
This Agreement between Company ABC and VendorLens outlines confidentiality terms...
Confidential information includes: customer data, financial records, proprietary methods...
Duration: 5 years post-termination
Permitted disclosure: Only on need-to-know basis to authorized personnel
Data protection: Must maintain industry-standard security measures
Breach notification: Vendor must notify within 48 hours of any unauthorized access`,
    keyFindings: [
      'Covers PII and financial data',
      '5-year confidentiality obligation',
      'Requires 48-hour breach notification',
      'Data protection standards required',
      'Limited disclosure permitted',
    ],
    suggestedQuestions: [
      {
        question: 'Do you have documented data protection procedures for confidential information?',
        category: 'Data Security',
        riskLevel: 'High',
      },
      {
        question: 'What is your incident response time for security breaches?',
        category: 'Operational Resilience',
        riskLevel: 'High',
      },
      {
        question: 'How do you train employees on confidentiality obligations?',
        category: 'Compliance',
        riskLevel: 'Medium',
      },
    ],
    complianceKeywords: ['confidentiality', 'breach notification', 'data protection', 'authorized personnel'],
    certifications: ['None mentioned'],
  },
  'SOC2_Report.pdf': {
    documentType: 'SOC 2 Type II Report',
    fileName: 'SOC2_Report.pdf',
    extractedText: `SOC 2 Type II Audit Report
    
Auditor: Deloitte
Audit Period: January 1, 2023 - December 31, 2023

Trust Service Criteria Met:
- Security (CC): All controls operating effectively
- Availability (A): 99.95% uptime achieved
- Confidentiality (C): Encryption standards met
- Integrity (I): Change management procedures effective
- Privacy (P): PII handling compliant

Exceptions: None noted
Recommendations: Implement automated patch management

Conclusion: The organization maintains effective internal controls over security, availability, confidentiality, and integrity.`,
    keyFindings: [
      'SOC 2 Type II certified by Deloitte',
      '99.95% uptime SLA met',
      'All trust service criteria met',
      'No audit exceptions',
      'Strong encryption and confidentiality controls',
    ],
    suggestedQuestions: [
      {
        question: 'How frequently are security patches applied?',
        category: 'Data Security',
        riskLevel: 'Medium',
      },
      {
        question: 'What is your change management process?',
        category: 'Operational Resilience',
        riskLevel: 'Low',
      },
    ],
    complianceKeywords: ['SOC 2', 'encryption', 'uptime', 'security controls', 'confidentiality'],
    certifications: ['SOC 2 Type II', 'Audited by Deloitte'],
  },
  'SLA.pdf': {
    documentType: 'Service Level Agreement',
    fileName: 'SLA.pdf',
    extractedText: `Service Level Agreement
    
Service Provider: TechVendor Corp
Service: Cloud Infrastructure
Effective Date: January 1, 2024

Service Level Commitments:
- Uptime: 99.99% monthly availability
- Response Time: Critical issues within 1 hour, High priority within 4 hours
- Backup: Daily with 24-hour recovery RTO
- Disaster Recovery: 4-hour RPO

Penalties for Non-Compliance:
- 99.9-99.99%: 10% service credit
- 99.0-99.9%: 25% service credit
- Below 99.0%: 50% service credit

Support: 24/7/365 with dedicated account manager`,
    keyFindings: [
      '99.99% uptime SLA',
      '1-hour critical response time',
      'Daily backups with 24-hour RTO',
      '4-hour RPO for disaster recovery',
      'Service credits for SLA violations',
      '24/7 dedicated support',
    ],
    suggestedQuestions: [
      {
        question: 'How do you test and maintain your disaster recovery procedures?',
        category: 'Operational Resilience',
        riskLevel: 'High',
      },
      {
        question: 'What is your backup retention policy?',
        category: 'Operational Resilience',
        riskLevel: 'Medium',
      },
      {
        question: 'How is your support team trained for critical incidents?',
        category: 'Compliance',
        riskLevel: 'Medium',
      },
    ],
    complianceKeywords: ['uptime', 'SLA', 'disaster recovery', 'backup', 'response time'],
    certifications: ['None mentioned'],
  },
  'Insurance_Certificate.pdf': {
    documentType: 'Insurance Certificate',
    fileName: 'Insurance_Certificate.pdf',
    extractedText: `Insurance Certificate of Insurance
    
Policyholder: VendorTech Solutions
Insurance Carrier: Lloyd's of London
Certificate Date: January 1, 2024
Expiration: December 31, 2024

Coverage Types and Limits:
- General Liability: $2,000,000
- Professional Liability: $3,000,000
- Cyber Liability: $5,000,000
- Directors & Officers: $10,000,000

Key Inclusions:
- Network security liability
- Privacy liability
- Data breach response costs
- Regulatory defense costs

Insured loss history: No claims in past 3 years`,
    keyFindings: [
      '$5M cyber liability coverage',
      '$3M professional liability',
      'No claims in past 3 years',
      'Covers privacy and data breach costs',
      'Lloyd\'s of London carrier (A+ rated)',
    ],
    suggestedQuestions: [
      {
        question: 'What is your cyber insurance coverage amount and exclusions?',
        category: 'Financial Stability',
        riskLevel: 'Medium',
      },
      {
        question: 'How long is the tail coverage extended post-contract?',
        category: 'Financial Stability',
        riskLevel: 'Low',
      },
    ],
    complianceKeywords: ['cyber liability', 'insurance', 'coverage', 'claim history'],
    certifications: ['Lloyd\'s of London A+ rated'],
  },
  'GDPR_Data_Processing_Agreement.pdf': {
    documentType: 'GDPR Data Processing Agreement',
    fileName: 'GDPR_Data_Processing_Agreement.pdf',
    extractedText: `Data Processing Agreement (DPA) - GDPR Compliant
    
Data Controller: Our Company
Data Processor: Vendor Solutions Ltd
Effective: January 1, 2024

Subject Matter: Processing of personal data for customer management services

Processing Details:
- Categories of data: Names, emails, usage data
- Purpose: Service delivery and analytics
- Duration: Contract term plus 30 days
- Location: EU data centers (Frankfurt, Amsterdam)
- Sub-processors: Approved list attached

Security Measures:
- Encryption at rest and in transit
- Access controls and authentication
- Regular security assessments
- Incident response procedures

Data Subject Rights:
- Right to access, correction, deletion
- Data portability supported
- Breach notification within 72 hours

Standard Contractual Clauses: Included and current`,
    keyFindings: [
      'GDPR compliant DPA in place',
      'EU data residency guaranteed',
      'SCCs (Standard Contractual Clauses) included',
      '72-hour breach notification commitment',
      'Supports all data subject rights',
      'Encryption and access controls implemented',
    ],
    suggestedQuestions: [
      {
        question: 'How do you handle cross-border data transfers?',
        category: 'Compliance',
        riskLevel: 'High',
      },
      {
        question: 'What is your process for data deletion requests?',
        category: 'Data Security',
        riskLevel: 'Medium',
      },
      {
        question: 'How frequently do you audit GDPR compliance?',
        category: 'Compliance',
        riskLevel: 'Medium',
      },
    ],
    complianceKeywords: ['GDPR', 'data processor', 'encryption', 'breach notification', 'data portability'],
    certifications: ['GDPR compliant', 'SCCs included'],
  },
}

export async function parseDocument(fileName: string, _fileContent: ArrayBuffer): Promise<DocumentAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // For demo, return mock analysis based on file name
  const documentKey = Object.keys(MOCK_DOCUMENTS).find((key) => key.toLowerCase() === fileName.toLowerCase())

  if (documentKey) {
    return MOCK_DOCUMENTS[documentKey]
  }

  // Return generic analysis for unknown documents
  return {
    documentType: 'Unknown Document',
    fileName,
    extractedText: 'Document content extraction failed or unsupported format',
    keyFindings: [],
    suggestedQuestions: [],
    complianceKeywords: [],
    certifications: [],
  }
}

export function getDocumentTypeIcon(docType: string): string {
  if (docType.includes('NDA')) return '🔒'
  if (docType.includes('SOC')) return '✓'
  if (docType.includes('SLA')) return '📋'
  if (docType.includes('Insurance')) return '🛡️'
  if (docType.includes('GDPR')) return '⚖️'
  return '📄'
}

export function extractQuestionsFromDocument(analysis: DocumentAnalysis) {
  return analysis.suggestedQuestions
}

// Sample vendor documents for demo with NDA.pdf, SOC2.pdf, SLA.pdf, Insurance.pdf, GDPR.pdf
// These are mock documents that will be analyzed by llamaparse

export const SAMPLE_VENDOR_DOCUMENTS = [
  {
    fileName: 'NDA.pdf',
    vendorName: 'ACME Tech Solutions',
    category: 'IT/Cloud',
  },
  {
    fileName: 'SOC2_Report.pdf',
    vendorName: 'ACME Tech Solutions',
    category: 'IT/Cloud',
  },
  {
    fileName: 'SLA.pdf',
    vendorName: 'ACME Tech Solutions',
    category: 'IT/Cloud',
  },
  {
    fileName: 'Insurance_Certificate.pdf',
    vendorName: 'TechVendor Corp',
    category: 'IT/Cloud',
  },
  {
    fileName: 'GDPR_Data_Processing_Agreement.pdf',
    vendorName: 'TechVendor Corp',
    category: 'IT/Cloud',
  },
]

export function initializeSampleDocuments() {
  // This would be called to populate demo data
  const vendorEmail = 'acme@techsolutions.com'
  
  const savedDocs = [
    { fileName: 'NDA.pdf', documentType: 'Non-Disclosure Agreement', keyFindings: ['Covers PII and financial data', '5-year confidentiality obligation'] },
    { fileName: 'SOC2_Report.pdf', documentType: 'SOC 2 Type II Report', keyFindings: ['SOC 2 Type II certified', '99.95% uptime SLA met'] },
    { fileName: 'SLA.pdf', documentType: 'Service Level Agreement', keyFindings: ['99.99% uptime SLA', '1-hour critical response time'] },
  ]

  localStorage.setItem(`vendor_documents_${vendorEmail}`, JSON.stringify(savedDocs))
}

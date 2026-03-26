export interface VendorDocument {
  id: string
  vendorEmail: string
  fileName: string
  documentType: string
  uploadDate: Date
  expirationDate?: Date
  status: 'Validated' | 'Expired' | 'Expiring' | 'Valid'
  analysis: {
    keyFindings: string[]
    certifications: string[]
    riskScoreImpact: number
  }
}

export interface VendorDocumentRepository {
  [vendorEmail: string]: VendorDocument[]
}

const REPOSITORY_KEY = 'vendor_document_repository'

export const documentRepository = {
  // Get all documents for a vendor
  getVendorDocuments: (vendorEmail: string): VendorDocument[] => {
    const repo = JSON.parse(localStorage.getItem(REPOSITORY_KEY) || '{}') as VendorDocumentRepository
    return repo[vendorEmail] || []
  },

  // Add a document to vendor repository
  addDocument: (vendorEmail: string, document: VendorDocument): void => {
    const repo = JSON.parse(localStorage.getItem(REPOSITORY_KEY) || '{}') as VendorDocumentRepository
    
    if (!repo[vendorEmail]) {
      repo[vendorEmail] = []
    }
    
    repo[vendorEmail].push(document)
    localStorage.setItem(REPOSITORY_KEY, JSON.stringify(repo))
  },

  // Get documents by type for a vendor
  getDocumentsByType: (vendorEmail: string, documentType: string): VendorDocument[] => {
    const documents = documentRepository.getVendorDocuments(vendorEmail)
    return documents.filter((doc) => doc.documentType === documentType)
  },

  // Get documents by status
  getDocumentsByStatus: (vendorEmail: string, status: string): VendorDocument[] => {
    const documents = documentRepository.getVendorDocuments(vendorEmail)
    return documents.filter((doc) => doc.status === status)
  },

  // Update document status
  updateDocumentStatus: (vendorEmail: string, documentId: string, newStatus: 'Validated' | 'Expired' | 'Expiring' | 'Valid'): void => {
    const repo = JSON.parse(localStorage.getItem(REPOSITORY_KEY) || '{}') as VendorDocumentRepository
    
    if (repo[vendorEmail]) {
      const doc = repo[vendorEmail].find((d) => d.id === documentId)
      if (doc) {
        doc.status = newStatus
        localStorage.setItem(REPOSITORY_KEY, JSON.stringify(repo))
      }
    }
  },

  // Remove a document
  removeDocument: (vendorEmail: string, documentId: string): void => {
    const repo = JSON.parse(localStorage.getItem(REPOSITORY_KEY) || '{}') as VendorDocumentRepository
    
    if (repo[vendorEmail]) {
      repo[vendorEmail] = repo[vendorEmail].filter((d) => d.id !== documentId)
      localStorage.setItem(REPOSITORY_KEY, JSON.stringify(repo))
    }
  },

  // Get all documents across all vendors
  getAllDocuments: (): VendorDocument[] => {
    const repo = JSON.parse(localStorage.getItem(REPOSITORY_KEY) || '{}') as VendorDocumentRepository
    const allDocs: VendorDocument[] = []
    
    Object.values(repo).forEach((docs) => {
      allDocs.push(...docs)
    })
    
    return allDocs
  },

  // Calculate document compliance score impact for a vendor
  calculateDocumentScoreImpact: (vendorEmail: string): number => {
    const documents = documentRepository.getVendorDocuments(vendorEmail)
    const validDocuments = documents.filter((doc) => doc.status === 'Valid' || doc.status === 'Validated')
    
    return validDocuments.reduce((total, doc) => total + doc.analysis.riskScoreImpact, 0)
  },

  // Get document expiration summary
  getExpirationSummary: (vendorEmail: string): { expired: number; expiring: number; valid: number } => {
    const documents = documentRepository.getVendorDocuments(vendorEmail)
    
    return {
      expired: documents.filter((doc) => doc.status === 'Expired').length,
      expiring: documents.filter((doc) => doc.status === 'Expiring').length,
      valid: documents.filter((doc) => doc.status === 'Valid' || doc.status === 'Validated').length,
    }
  },
}

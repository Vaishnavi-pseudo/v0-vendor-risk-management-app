import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, CheckCircle2, AlertTriangle, Trash2, Download } from 'lucide-react'
import { VendorDocument, documentRepository } from '@/lib/vendor-document-repository'

interface DocumentUploadQuestionProps {
  question: {
    id: string
    question: string
    requiredDocumentType: string
    riskWeight: number
  }
  vendorEmail: string
  onDocumentUploaded: (document: VendorDocument) => void
  existingDocuments: VendorDocument[]
}

export function DocumentUploadQuestion({
  question,
  vendorEmail,
  onDocumentUploaded,
  existingDocuments,
}: DocumentUploadQuestionProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<VendorDocument[]>(
    existingDocuments.filter((d) => d.documentType === question.requiredDocumentType)
  )

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file processing
    setTimeout(() => {
      const newDoc: VendorDocument = {
        id: `doc_${Date.now()}`,
        vendorEmail,
        fileName: file.name,
        documentType: question.requiredDocumentType,
        uploadDate: new Date(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        status: 'Validated',
        analysis: {
          keyFindings: ['Document uploaded and validated', 'Ready for review'],
          certifications: [question.requiredDocumentType],
          riskScoreImpact: question.riskWeight,
        },
      }

      documentRepository.addDocument(vendorEmail, newDoc)
      setUploadedDocs((prev) => [...prev, newDoc])
      onDocumentUploaded(newDoc)
      setIsUploading(false)
    }, 1000)
  }

  const handleRemoveDocument = (docId: string) => {
    documentRepository.removeDocument(vendorEmail, docId)
    setUploadedDocs((prev) => prev.filter((d) => d.id !== docId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Expired':
        return 'bg-red-900/20 text-red-400 border-red-500/20'
      case 'Expiring':
        return 'bg-amber-900/20 text-amber-400 border-amber-500/20'
      case 'Valid':
      case 'Validated':
        return 'bg-green-900/20 text-green-400 border-green-500/20'
      default:
        return 'bg-blue-900/20 text-blue-400 border-blue-500/20'
    }
  }

  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">{question.question}</Label>
        <p className="text-xs text-muted-foreground">
          Type: {question.requiredDocumentType} • Risk Weight: {question.riskWeight} points
        </p>
      </div>

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Uploaded Documents:</p>
          <div className="space-y-2">
            {uploadedDocs.map((doc) => {
              const daysUntilExpiry = Math.floor(
                (new Date(doc.expirationDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <div key={doc.id} className="p-3 rounded-lg bg-muted/50 border border-border flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                      <Badge variant="outline" className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                      {doc.expirationDate && (
                        <span className={daysUntilExpiry < 30 ? 'text-amber-400 font-medium' : ''}>
                          Expires: {new Date(doc.expirationDate).toLocaleDateString()}
                          {daysUntilExpiry < 30 && ` (${daysUntilExpiry} days)`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          id={`file_${question.id}`}
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          accept=".pdf,.doc,.docx,.xlsx,.pptx"
        />
        <label htmlFor={`file_${question.id}`}>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="cursor-pointer gap-2"
          >
            <span>
              {isUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Document
                </>
              )}
            </span>
          </Button>
        </label>
      </div>

      {/* Info Alert */}
      {uploadedDocs.length > 0 && (
        <Alert className="border-green-500/30 bg-green-900/10">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400 text-xs">
            Document verified and stored. Risk score reduced by {question.riskWeight} points.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

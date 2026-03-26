'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { parseDocument, getDocumentTypeIcon, extractQuestionsFromDocument, DocumentAnalysis } from '@/lib/document-parser'
import { Upload, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react'

interface DocumentUploadProps {
  onDocumentAnalyzed?: (analysis: DocumentAnalysis) => void
  vendorEmail?: string
}

export function DocumentUpload({ onDocumentAnalyzed, vendorEmail }: DocumentUploadProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentAnalysis[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setIsLoading(true)
    setError(null)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('word')) {
        setError(`${file.name}: Only PDF, Word, and document files are supported`)
        continue
      }

      try {
        const fileBuffer = await file.arrayBuffer()
        const analysis = await parseDocument(file.name, fileBuffer)
        
        setUploadedDocuments((prev) => [...prev, analysis])

        // Save to localStorage
        if (vendorEmail) {
          const savedDocs = JSON.parse(localStorage.getItem(`vendor_documents_${vendorEmail}`) || '[]')
          savedDocs.push(analysis)
          localStorage.setItem(`vendor_documents_${vendorEmail}`, JSON.stringify(savedDocs))
        }

        if (onDocumentAnalyzed) {
          onDocumentAnalyzed(analysis)
        }
      } catch (err) {
        setError(`Failed to parse ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    setIsLoading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeDocument = (fileName: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.fileName !== fileName))
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Compliance Documents</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload NDA, SOC 2, SLA, Insurance, or GDPR agreements for automated analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-lg p-8 hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
                <p className="text-sm font-medium text-foreground">Analyzing document...</p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Upload compliance documents</p>
                <p className="text-xs text-muted-foreground">PDF, Word, or document files supported</p>
              </>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-500/50 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Uploaded Documents */}
        {uploadedDocuments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Analyzed Documents</h3>
            {uploadedDocuments.map((doc) => (
              <div key={doc.fileName} className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getDocumentTypeIcon(doc.documentType)}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.documentType}</p>
                        <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                      </div>
                    </div>

                    {/* Key Findings */}
                    {doc.keyFindings.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <p className="text-xs font-medium text-foreground">Key Findings:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {doc.keyFindings.slice(0, 3).map((finding, idx) => (
                            <li key={idx} className="flex gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-400 mt-0.5 shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Certifications */}
                    {doc.certifications.length > 0 && doc.certifications[0] !== 'None mentioned' && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {doc.certifications.map((cert, idx) => (
                          <span key={idx} className="inline-block text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-500/20">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Suggested Questions */}
                    {doc.suggestedQuestions.length > 0 && (
                      <div className="mt-3 p-2 rounded bg-blue-900/10 border border-blue-500/20">
                        <p className="text-xs font-medium text-blue-400 mb-1">Generated Risk Questions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {doc.suggestedQuestions.map((q, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="text-blue-400">•</span>
                              <span>{q.question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => removeDocument(doc.fileName)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadedDocuments.length === 0 && !error && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No documents uploaded yet
          </p>
        )}
      </CardContent>
    </Card>
  )
}

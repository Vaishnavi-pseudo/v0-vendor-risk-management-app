import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { documentRepository } from '@/lib/vendor-document-repository'

interface VendorDocComplianceProps {
  vendorEmail: string
  vendorName: string
}

export function DocumentComplianceSection({ vendorEmail, vendorName }: VendorDocComplianceProps) {
  const documents = documentRepository.getVendorDocuments(vendorEmail)
  const summary = documentRepository.getExpirationSummary(vendorEmail)

  if (documents.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No documents uploaded by this vendor</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Expired':
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case 'Expiring':
        return <Clock className="h-4 w-4 text-amber-400" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
    }
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
    <div className="space-y-4">
      {/* Compliance Summary */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="bg-green-900/10 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-400">Valid Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{summary.valid}</div>
          </CardContent>
        </Card>

        <Card className="bg-amber-900/10 border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-400">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{summary.expiring}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/10 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-400">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{summary.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm">Document Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {documents.map((doc) => {
              const daysUntilExpiry = doc.expirationDate
                ? Math.floor((new Date(doc.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <div key={doc.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doc.status)}
                        <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <p>Type: {doc.documentType}</p>
                        <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        {doc.expirationDate && (
                          <p className={daysUntilExpiry !== null && daysUntilExpiry < 30 ? 'text-amber-400 font-medium' : ''}>
                            Expires: {new Date(doc.expirationDate).toLocaleDateString()}
                            {daysUntilExpiry !== null && daysUntilExpiry < 30 && ` (${daysUntilExpiry} days)`}
                          </p>
                        )}
                        <p>Risk Impact: <span className="text-green-400 font-medium">{doc.analysis.riskScoreImpact} points</span></p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts for issues */}
      {(summary.expired > 0 || summary.expiring > 0) && (
        <Alert className={summary.expired > 0 ? 'border-red-500/30 bg-red-900/10' : 'border-amber-500/30 bg-amber-900/10'}>
          <AlertTriangle className={`h-4 w-4 ${summary.expired > 0 ? 'text-red-400' : 'text-amber-400'}`} />
          <AlertDescription className={summary.expired > 0 ? 'text-red-400' : 'text-amber-400'}>
            {summary.expired > 0 && `${summary.expired} document(s) expired. `}
            {summary.expiring > 0 && `${summary.expiring} document(s) expiring within 30 days.`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

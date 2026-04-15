'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { vendors, documents, type Vendor } from '@/lib/mock-data'
import { RiskBadge, StatusBadge } from '@/components/risk-badge'
import { ChevronLeft, AlertTriangle, CheckCircle2, FileText, Users, BarChart3, Shield, ExternalLink, ClipboardList } from 'lucide-react'

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false)
  const [isBackupOpen, setIsBackupOpen] = useState(false)

  const vendorId = params.id as string
  const vendor = vendors.find((v) => v.id === vendorId)

  if (!vendor) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vendor not found</p>
        </div>
      </AppLayout>
    )
  }

  const vendorDocs = documents.filter((d) => d.vendorId === vendor.id)
  const expiredDocs = vendorDocs.filter((d) => d.status === 'Expired')
  const expiringDocs = vendorDocs.filter((d) => d.status === 'Uploaded' && d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

  const backupVendorsForCategory = vendors.filter((v) => v.category === vendor.category && v.id !== vendor.id && v.status === 'Active')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const daysUntilReview = Math.floor((new Date().getTime() - new Date(vendor.lastReviewDate).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Vendors
          </Button>
        </div>

        {/* Page Title and Overview */}
        <div className="border-b border-border pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{vendor.name}</h1>
              <p className="text-sm text-muted-foreground mt-2">{vendor.website}</p>
            </div>
            <StatusBadge status={vendor.status} />
          </div>
        </div>

        {/* Alerts */}
        {(expiredDocs.length > 0 || expiringDocs.length > 0) && (
          <Alert className="border-amber-500/50 bg-amber-900/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-300">
              {expiredDocs.length > 0 && <p>{expiredDocs.length} document(s) expired</p>}
              {expiringDocs.length > 0 && <p>{expiringDocs.length} document(s) expiring within 30 days</p>}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Key Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Overview Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Vendor Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Category</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{vendor.category}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Country</p>
                    <p className="text-sm font-semibold text-foreground mt-1">{vendor.country}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Inherent Risk</p>
                    <div className="mt-1">
                      <RiskBadge level={vendor.inherentRisk} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase">Residual Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            vendor.residualRiskScore >= 70
                              ? 'bg-risk-critical'
                              : vendor.residualRiskScore >= 50
                              ? 'bg-risk-high'
                              : vendor.residualRiskScore >= 30
                              ? 'bg-risk-medium'
                              : 'bg-risk-low'
                          }`}
                          style={{ width: `${vendor.residualRiskScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{vendor.residualRiskScore}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Data Access</p>
                      <p className="text-sm text-foreground mt-1">{vendor.dataAccess}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Financial Exposure</p>
                      <p className="text-sm text-foreground mt-1">{vendor.financialExposure}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Operational Dependency</p>
                      <p className="text-sm text-foreground mt-1">{vendor.operationalDependency}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment Section */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Last Risk Assessment
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Assessment history and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Assessment Date</p>
                      <p className="text-lg font-semibold text-foreground mt-1">{formatDate(vendor.lastReviewDate)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{daysUntilReview} days ago</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Review Timeline</p>
                  <div className="space-y-3">
                    {vendor.reviewHistory.map((event, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{event.event}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                            <span>{formatDate(event.date)}</span>
                            <span>by {event.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Dialog open={isAssessmentOpen} onOpenChange={setIsAssessmentOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Perform Risk Assessment / Performance Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start Risk Assessment</DialogTitle>
                        <DialogDescription>
                          Initiate a comprehensive risk assessment and performance review for {vendor.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/50 border border-border">
                          <p className="text-sm text-foreground">
                            This will generate a detailed questionnaire based on the vendor&apos;s category ({vendor.category}) and current risk profile.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Assessment will evaluate:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>✓ Current security posture and compliance status</li>
                            <li>✓ Document expiration and validity</li>
                            <li>✓ Operational performance metrics</li>
                            <li>✓ Incident history and risk score changes</li>
                            <li>✓ Contract terms and service level agreements</li>
                          </ul>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsAssessmentOpen(false)}>
                            Cancel
                          </Button>
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Start Assessment
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Documents ({vendorDocs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendorDocs.length > 0 ? (
                    vendorDocs.map((doc) => (
                      <div key={doc.id} className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.status === 'Uploaded' && doc.uploadedDate && `Uploaded ${formatDate(doc.uploadedDate)}`}
                            {doc.status === 'Pending' && 'Pending upload'}
                            {doc.status === 'Expired' && `Expired ${doc.expiryDate ? formatDate(doc.expiryDate) : 'N/A'}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === 'Expired' && <Badge className="bg-red-600">Expired</Badge>}
                          {doc.status === 'Uploaded' && doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                            <Badge className="bg-amber-600">Expiring Soon</Badge>
                          )}
                          {doc.status === 'Uploaded' && (!doc.expiryDate || new Date(doc.expiryDate) >= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) && (
                            <Badge className="bg-green-600">Valid</Badge>
                          )}
                          {doc.status === 'Pending' && <Badge className="bg-slate-600">Pending</Badge>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No documents uploaded</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Primary Contact</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{vendor.contactName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Email</p>
                  <p className="text-sm text-blue-400 mt-1 break-all">{vendor.contactEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Phone</p>
                  <p className="text-sm text-foreground mt-1">{vendor.contactPhone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Reviewer */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Assigned Reviewer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm font-semibold text-foreground">{vendor.assignedReviewer}</p>
                  <p className="text-xs text-muted-foreground mt-1">Primary risk assessment owner</p>
                </div>
              </CardContent>
            </Card>

            {/* Backup Vendors */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Backup Vendors
                </CardTitle>
                <CardDescription className="text-xs">Available alternatives in {vendor.category}</CardDescription>
              </CardHeader>
              <CardContent>
                {backupVendorsForCategory.length > 0 ? (
                  <Dialog open={isBackupOpen} onOpenChange={setIsBackupOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        View {backupVendorsForCategory.length} Backup Vendor{backupVendorsForCategory.length !== 1 ? 's' : ''}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Backup Vendors for {vendor.category}</DialogTitle>
                        <DialogDescription>
                          Alternative vendors available if {vendor.name} becomes unavailable
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {backupVendorsForCategory.map((backupVendor) => (
                          <div key={backupVendor.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{backupVendor.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{backupVendor.country}</p>
                              </div>
                              <RiskBadge level={backupVendor.inherentRisk} />
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Risk Score:</span>
                                <span className="text-sm font-semibold text-foreground">{backupVendor.residualRiskScore}</span>
                              </div>
                              <StatusBadge status={backupVendor.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      No other active vendors in this category
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Edit Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

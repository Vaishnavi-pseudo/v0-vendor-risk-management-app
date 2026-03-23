'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LogOut, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import { getRiskLevel } from '@/lib/vendor-form-config'

interface VendorSubmission {
  email: string
  vendorName: string
  riskScore: number
  timestamp: string
  responses: Record<string, string | string[]>
}

export default function DashboardPage() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<any>(null)
  const [vendorSubmissions, setVendorSubmissions] = useState<VendorSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession')
    if (!adminSession) {
      router.push('/auth/admin/login')
      return
    }

    const data = JSON.parse(adminSession)
    setAdminData(data)

    // Load all vendor submissions
    const allSubmissions = JSON.parse(localStorage.getItem('all_vendor_submissions') || '{}')
    const submissions: VendorSubmission[] = []
    
    Object.entries(allSubmissions).forEach(([email, submission]: [string, any]) => {
      submissions.push({
        email,
        vendorName: email.split('@')[0],
        riskScore: submission.riskScore,
        timestamp: submission.timestamp,
        responses: submission.responses,
      })
    })

    setVendorSubmissions(submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminSession')
    router.push('/auth/admin/login')
  }

  const riskStats = {
    critical: vendorSubmissions.filter((v) => v.riskScore >= 75).length,
    high: vendorSubmissions.filter((v) => v.riskScore >= 50 && v.riskScore < 75).length,
    medium: vendorSubmissions.filter((v) => v.riskScore >= 25 && v.riskScore < 50).length,
    low: vendorSubmissions.filter((v) => v.riskScore < 25).length,
  }

  if (isLoading) {
    return (
      <AppLayout>
        <p className="text-muted-foreground">Loading...</p>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Vendor Risk Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and track vendor risk submissions
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Risk Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Critical Risk"
            value={riskStats.critical}
            color="bg-red-900/20"
            textColor="text-red-400"
            borderColor="border-red-500/20"
          />
          <StatCard
            title="High Risk"
            value={riskStats.high}
            color="bg-amber-900/20"
            textColor="text-amber-400"
            borderColor="border-amber-500/20"
          />
          <StatCard
            title="Medium Risk"
            value={riskStats.medium}
            color="bg-blue-900/20"
            textColor="text-blue-400"
            borderColor="border-blue-500/20"
          />
          <StatCard
            title="Low Risk"
            value={riskStats.low}
            color="bg-green-900/20"
            textColor="text-green-400"
            borderColor="border-green-500/20"
          />
        </div>

        {/* Vendor Submissions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Vendor Risk Assessments</CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time vendor submissions and their calculated risk scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {vendorSubmissions.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No vendor submissions yet</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Vendors will appear here as they complete their assessments
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Risk Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vendorSubmissions.map((submission) => {
                      const riskLevel = getRiskLevel(submission.riskScore)
                      const date = new Date(submission.timestamp)
                      const timeAgo = formatTimeAgo(date)

                      return (
                        <tr key={submission.email} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {submission.vendorName}
                              </p>
                              <p className="text-xs text-muted-foreground">{submission.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    submission.riskScore >= 75
                                      ? 'bg-red-500'
                                      : submission.riskScore >= 50
                                      ? 'bg-amber-500'
                                      : submission.riskScore >= 25
                                      ? 'bg-blue-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${submission.riskScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-foreground">
                                {Math.round(submission.riskScore)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                riskLevel === 'Critical'
                                  ? 'bg-red-900/20 text-red-400 border-red-500/20'
                                  : riskLevel === 'High'
                                  ? 'bg-amber-900/20 text-amber-400 border-amber-500/20'
                                  : riskLevel === 'Medium'
                                  ? 'bg-blue-900/20 text-blue-400 border-blue-500/20'
                                  : 'bg-green-900/20 text-green-400 border-green-500/20'
                              }
                              variant="outline"
                            >
                              {riskLevel}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {timeAgo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/vendor-details/${submission.email}`)}
                            >
                              Review
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions Feed */}
        {vendorSubmissions.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {vendorSubmissions.slice(0, 10).map((submission) => {
                  const date = new Date(submission.timestamp)
                  const riskLevel = getRiskLevel(submission.riskScore)

                  return (
                    <div
                      key={submission.email}
                      className="flex gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={`h-2 w-2 mt-2 rounded-full ${
                        riskLevel === 'Critical'
                          ? 'bg-red-500'
                          : riskLevel === 'High'
                          ? 'bg-amber-500'
                          : riskLevel === 'Medium'
                          ? 'bg-blue-500'
                          : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{submission.vendorName}</span> submitted a risk assessment
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Risk Score: <span className="font-semibold">{Math.round(submission.riskScore)}</span> ({riskLevel})
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {date.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

interface StatCardProps {
  title: string
  value: number
  color: string
  textColor: string
  borderColor: string
}

function StatCard({ title, value, color, textColor, borderColor }: StatCardProps) {
  return (
    <Card className={`border ${borderColor} ${color}`}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

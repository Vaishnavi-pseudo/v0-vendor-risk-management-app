'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { LogOut, TrendingUp, AlertTriangle, CheckCircle2, Clock, BarChart3, TrendingDown } from 'lucide-react'
import { AppLayout } from '@/components/app-layout'
import { getRiskLevel } from '@/lib/vendor-form-config'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

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
        vendorName: submission.vendorName || email.split('@')[0],
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

  // Analytics calculations
  const riskStats = {
    critical: vendorSubmissions.filter((v) => v.riskScore >= 75).length,
    high: vendorSubmissions.filter((v) => v.riskScore >= 50 && v.riskScore < 75).length,
    medium: vendorSubmissions.filter((v) => v.riskScore >= 25 && v.riskScore < 50).length,
    low: vendorSubmissions.filter((v) => v.riskScore < 25).length,
  }

  const avgRiskScore = vendorSubmissions.length > 0
    ? Math.round(vendorSubmissions.reduce((sum, v) => sum + v.riskScore, 0) / vendorSubmissions.length)
    : 0

  const riskTrend = vendorSubmissions.slice(-10).map((v) => ({
    vendor: v.vendorName.substring(0, 8),
    score: Math.round(v.riskScore),
    date: new Date(v.timestamp).toLocaleDateString().substring(0, 5),
  }))

  const riskDistribution = [
    { name: 'Critical', value: riskStats.critical, color: '#EF4444' },
    { name: 'High', value: riskStats.high, color: '#F59E0B' },
    { name: 'Medium', value: riskStats.medium, color: '#3B82F6' },
    { name: 'Low', value: riskStats.low, color: '#10B981' },
  ].filter((item) => item.value > 0)

  const timelineData = vendorSubmissions.slice(-7).reverse().map((v) => ({
    date: new Date(v.timestamp).toLocaleDateString(),
    submissions: vendorSubmissions.filter((sub) => new Date(sub.timestamp).toLocaleDateString() === new Date(v.timestamp).toLocaleDateString()).length,
  }))

  const uniqueDates = new Set<string>()
  const submissionTimeline = vendorSubmissions.slice(-7).reduce((acc, v) => {
    const date = new Date(v.timestamp).toLocaleDateString()
    uniqueDates.add(date)
    return acc
  }, [] as VendorSubmission[])

  const timelineChartData = Array.from(uniqueDates).map((date) => ({
    date,
    submissions: vendorSubmissions.filter((v) => new Date(v.timestamp).toLocaleDateString() === date).length,
  }))

  // Alerts for high-risk vendors
  const criticalVendors = vendorSubmissions.filter((v) => v.riskScore >= 75)
  const highRiskVendors = vendorSubmissions.filter((v) => v.riskScore >= 50 && v.riskScore < 75)

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
            <h1 className="text-2xl font-semibold text-foreground">Vendor Risk Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive vendor risk assessment and compliance monitoring
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-5">
          <MetricCard
            title="Total Vendors"
            value={vendorSubmissions.length}
            subtitle="Active assessments"
            icon={CheckCircle2}
            color="text-blue-400"
            bgColor="bg-blue-900/20"
          />
          <MetricCard
            title="Avg Risk Score"
            value={avgRiskScore}
            subtitle="Portfolio average"
            icon={TrendingUp}
            color={avgRiskScore > 60 ? 'text-red-400' : avgRiskScore > 40 ? 'text-amber-400' : 'text-green-400'}
            bgColor={avgRiskScore > 60 ? 'bg-red-900/20' : avgRiskScore > 40 ? 'bg-amber-900/20' : 'bg-green-900/20'}
          />
          <MetricCard
            title="Critical Risk"
            value={riskStats.critical}
            subtitle="Require immediate action"
            icon={AlertTriangle}
            color="text-red-400"
            bgColor="bg-red-900/20"
          />
          <MetricCard
            title="High Risk"
            value={riskStats.high}
            subtitle="Close monitoring needed"
            icon={AlertTriangle}
            color="text-amber-400"
            bgColor="bg-amber-900/20"
          />
          <MetricCard
            title="Low Risk"
            value={riskStats.low}
            subtitle="Good compliance standing"
            icon={CheckCircle2}
            color="text-green-400"
            bgColor="bg-green-900/20"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Risk Distribution */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Risk Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">
                Vendor breakdown by risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No vendor data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Risk Scores */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Risk Scores</CardTitle>
              <CardDescription className="text-muted-foreground">
                Last 10 vendor assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {riskTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={riskTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="vendor" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                      }}
                    />
                    <Bar dataKey="score" fill="var(--risk-high)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submission Timeline */}
        {timelineChartData.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Submission Timeline</CardTitle>
              <CardDescription className="text-muted-foreground">
                Number of vendor assessments over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke="var(--primary)"
                    dot={{ fill: 'var(--primary)', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Critical Alerts */}
        {(criticalVendors.length > 0 || highRiskVendors.length > 0) && (
          <Card className="border-red-500/50 bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-400">Active Risk Alerts</CardTitle>
              <CardDescription className="text-red-300/70">
                Vendors requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {criticalVendors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-400 mb-2">Critical Risk ({criticalVendors.length})</p>
                  <div className="space-y-2">
                    {criticalVendors.map((vendor) => (
                      <div key={vendor.email} className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-red-300">{vendor.vendorName}</p>
                          <p className="text-xs text-red-300/60">Risk Score: {Math.round(vendor.riskScore)}</p>
                        </div>
                        <Badge className="bg-red-600 text-white">CRITICAL</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {highRiskVendors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-amber-400 mb-2">High Risk ({highRiskVendors.length})</p>
                  <div className="space-y-2">
                    {highRiskVendors.map((vendor) => (
                      <div key={vendor.email} className="p-3 rounded-lg bg-amber-900/20 border border-amber-500/30 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-amber-300">{vendor.vendorName}</p>
                          <p className="text-xs text-amber-300/60">Risk Score: {Math.round(vendor.riskScore)}</p>
                        </div>
                        <Badge className="bg-amber-600 text-white">HIGH</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vendor Submissions Table */}
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

        {/* Recent Activity Feed */}
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

interface MetricCardProps {
  title: string
  value: number
  subtitle: string
  icon: React.ElementType
  color: string
  bgColor: string
}

function MetricCard({ title, value, subtitle, icon: Icon, color, bgColor }: MetricCardProps) {
  return (
    <Card className={`border-border ${bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-2xl font-bold text-foreground mt-2">{value}</div>
            <CardDescription className="text-xs mt-1">{subtitle}</CardDescription>
          </div>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </CardHeader>
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

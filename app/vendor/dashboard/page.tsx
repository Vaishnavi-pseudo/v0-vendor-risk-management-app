'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Building2, LogOut, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react'
import { VENDOR_FORM_TEMPLATES, VendorType, calculateRiskScore, getRiskLevel } from '@/lib/vendor-form-config'

interface VendorSession {
  email: string
  vendorName: string
  vendorType?: VendorType
  services?: string[]
}

interface Submission {
  id: string
  timestamp: string
  riskScore: number
  responses: Record<string, string | string[]>
}

export default function VendorDashboard() {
  const router = useRouter()
  const [vendorData, setVendorData] = useState<VendorSession | null>(null)
  const [vendorType, setVendorType] = useState<VendorType | null>(null)
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const vendorSession = localStorage.getItem('vendorSession')
    if (!vendorSession) {
      router.push('/auth/vendor/login')
      return
    }

    const data = JSON.parse(vendorSession) as VendorSession
    setVendorData(data)
    setVendorType((data.vendorType as VendorType) || null)

    // Load previous submissions (from localStorage for demo)
    const savedSubmissions = localStorage.getItem(`vendor_submissions_${data.email}`)
    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions))
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('vendorSession')
    router.push('/auth/vendor/login')
  }

  const handleVendorTypeSelect = (type: VendorType) => {
    setVendorType(type)
    setResponses({})
    setShowSuccess(false)
  }

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = () => {
    if (!vendorType) return

    const riskScore = calculateRiskScore(vendorType, responses)
    const submission: Submission = {
      id: `sub_${Date.now()}`,
      timestamp: new Date().toISOString(),
      riskScore,
      responses,
    }

    const updated = [...submissions, submission]
    setSubmissions(updated)
    localStorage.setItem(`vendor_submissions_${vendorData?.email}`, JSON.stringify(updated))

    // Also update admin dashboard data
    if (vendorData) {
      const allVendorSubmissions = JSON.parse(localStorage.getItem('all_vendor_submissions') || '{}')
      allVendorSubmissions[vendorData.email] = submission
      localStorage.setItem('all_vendor_submissions', JSON.stringify(allVendorSubmissions))
    }

    setShowSuccess(true)
    setResponses({})
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const riskScore = vendorType ? calculateRiskScore(vendorType, responses) : 0
  const riskLevel = getRiskLevel(riskScore)
  const template = vendorType ? VENDOR_FORM_TEMPLATES[vendorType] : null
  const completedQuestions = Object.keys(responses).length
  const totalQuestions = template?.questions.length || 0
  const isFormComplete = completedQuestions === totalQuestions

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-amber-600/10">
              <Building2 className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Vendor Portal</h1>
              <p className="text-xs text-muted-foreground">{vendorData?.vendorName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Type Selection */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Assessment Form</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Complete our risk assessment questionnaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-foreground mb-3 block font-medium">
                    Your Organization Type
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(VENDOR_FORM_TEMPLATES).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleVendorTypeSelect(type as VendorType)}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          vendorType === type
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-muted/30 hover:border-primary/50'
                        }`}
                      >
                        <p className="text-sm font-medium text-foreground">{type}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Questions */}
            {template && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-base">Assessment Questions</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Answer all questions to complete the assessment
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground">
                        Progress: {completedQuestions}/{totalQuestions}
                      </span>
                      <span className="text-foreground font-medium">
                        {Math.round((completedQuestions / totalQuestions) * 100)}%
                      </span>
                    </div>
                    <Progress value={(completedQuestions / totalQuestions) * 100} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-8">
                  {template.questions.map((question) => (
                    <div key={question.id} className="space-y-3">
                      <Label className="text-foreground font-medium">{question.question}</Label>

                      {question.type === 'radio' && (
                        <RadioGroup
                          value={responses[question.id] as string || ''}
                          onValueChange={(value) => handleResponseChange(question.id, value)}
                        >
                          <div className="space-y-2">
                            {question.options?.map((option) => (
                              <div key={option.value} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.value} id={`${question.id}_${option.value}`} />
                                <Label htmlFor={`${question.id}_${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}

                      {question.type === 'checkbox' && (
                        <div className="space-y-2">
                          {question.options?.map((option) => {
                            const isChecked = (responses[question.id] as string[] || []).includes(option.value)
                            return (
                              <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${question.id}_${option.value}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    const current = (responses[question.id] as string[] || [])
                                    if (checked) {
                                      handleResponseChange(question.id, [...current, option.value])
                                    } else {
                                      handleResponseChange(question.id, current.filter((v) => v !== option.value))
                                    }
                                  }}
                                />
                                <Label htmlFor={`${question.id}_${option.value}`} className="text-sm text-muted-foreground cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {question.type === 'select' && (
                        <Select
                          value={responses[question.id] as string || ''}
                          onValueChange={(value) => handleResponseChange(question.id, value)}
                        >
                          <SelectTrigger className="bg-muted border-border">
                            <SelectValue placeholder="Select an option..." />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))}

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormComplete}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Submit Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Real-time Risk Score */}
            {vendorType && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground text-sm">Real-time Risk Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold text-foreground">{Math.round(riskScore)}</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        riskLevel === 'Critical' ? 'bg-red-900/20 text-red-400' :
                        riskLevel === 'High' ? 'bg-amber-900/20 text-amber-400' :
                        riskLevel === 'Medium' ? 'bg-blue-900/20 text-blue-400' :
                        'bg-green-900/20 text-green-400'
                      }`}>
                        {riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Updated as you answer questions
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Alert */}
            {showSuccess && (
              <Alert className="border-green-500/50 bg-green-900/20">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-400 text-sm">
                  Assessment submitted successfully! Your risk score has been sent to the compliance team.
                </AlertDescription>
              </Alert>
            )}

            {/* Previous Submissions */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Previous Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No submissions yet</p>
                ) : (
                  <div className="space-y-2">
                    {submissions.slice(-5).reverse().map((submission) => {
                      const date = new Date(submission.timestamp)
                      return (
                        <div key={submission.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-xs font-medium text-foreground">
                                Risk Score: <span className="text-amber-400">{Math.round(submission.riskScore)}</span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {date.toLocaleDateString()} {date.toLocaleTimeString()}
                              </p>
                            </div>
                            <CheckCircle2 className="h-4 w-4 text-green-400 mt-1" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="border-border bg-muted/30">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>Contact your assigned compliance officer or email support@vendorlens.io</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

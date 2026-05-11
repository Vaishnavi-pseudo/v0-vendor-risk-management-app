'use client'
import { useState } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { ASSESSMENT_WEIGHTS } from '@/lib/assessment-types'

const VENDOR_SAMPLE = {
  id: '1',
  name: 'ACME Tech Solutions',
  category: 'IT/Cloud Services',
}

const ASSESSMENT_QUESTIONS = {
  onboarding: [
    { id: 'o1', q: 'Is vendor legally compliant?', opts: ['Yes', 'Partial', 'No'] },
    { id: 'o2', q: 'Has required certifications?', opts: ['ISO 27001', 'SOC 2', 'None'] },
  ],
  performance: [
    { id: 'p1', q: 'Service uptime?', opts: ['99.9%+', '99%', '<99%'] },
    { id: 'p2', q: 'Incident response?', opts: ['<1hr', '1-4hrs', '>4hrs'] },
  ],
  risk: [
    { id: 'r1', q: 'Data security practices?', opts: ['Excellent', 'Good', 'Poor'] },
    { id: 'r2', q: 'Disaster recovery plan?', opts: ['Tested', 'Exists', 'None'] },
  ],
}

export default function VendorAssessmentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'onboarding' | 'performance' | 'risk'>('overview')
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const calculateScore = (type: string) => {
    const q = ASSESSMENT_QUESTIONS[type as keyof typeof ASSESSMENT_QUESTIONS]
    const answered = q.filter(item => responses[item.id]).length
    return Math.round((answered / q.length) * 100)
  }

  const handleSubmit = (type: string) => {
    setSubmitted(prev => ({ ...prev, [type]: true }))
  }

  const renderAssessment = (type: 'onboarding' | 'performance' | 'risk', title: string) => {
    const questions = ASSESSMENT_QUESTIONS[type]
    const isSubmitted = submitted[type]
    const score = calculateScore(type)

    if (isSubmitted) {
      return (
        <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-8 md:py-12">
          <CheckCircle2 className="h-12 md:h-16 w-12 md:w-16 text-green-400 mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">{title} Complete</h3>
          <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">{score}</div>
          <p className="text-xs md:text-sm text-muted-foreground">Assessment Score</p>
        </CardContent>
        </Card>
      )
    }

    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-foreground">{title}</CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground">{VENDOR_SAMPLE.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <Progress value={score} className="h-2" />
          <div className="space-y-4 md:space-y-6">
            {questions.map(q => (
              <div key={q.id} className="space-y-2 md:space-y-3 pb-4 border-b border-border last:border-0">
                <Label className="text-sm md:text-base text-foreground font-medium">{q.q}</Label>
                <RadioGroup value={responses[q.id] || ''} onValueChange={val => setResponses(prev => ({ ...prev, [q.id]: val }))}>
                  <div className="space-y-2">
                    {q.opts.map(opt => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} id={`${q.id}_${opt}`} />
                        <Label htmlFor={`${q.id}_${opt}`} className="text-xs md:text-sm text-muted-foreground cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="flex gap-2 md:gap-3 pt-4">
            <Button variant="outline" onClick={() => setResponses({})} className="text-xs md:text-sm">Clear</Button>
            <Button onClick={() => handleSubmit(type)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs md:text-sm">Submit</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Vendor Assessment</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Sample Assessment for {VENDOR_SAMPLE.name}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="onboarding" className="text-xs md:text-sm">Onboarding</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs md:text-sm hidden md:inline-flex">Performance</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs md:text-sm hidden md:inline-flex">Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">{VENDOR_SAMPLE.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{VENDOR_SAMPLE.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {['onboarding', 'performance', 'risk'].map(type => {
                    const score = calculateScore(type)
                    return (
                      <Card key={type} className="border-border bg-muted/30">
                        <CardContent className="pt-6">
                          <p className="text-xs md:text-sm text-muted-foreground mb-2 capitalize">{type}</p>
                          <div className="text-2xl md:text-3xl font-bold text-blue-400">{score}%</div>
                          <Badge variant="outline" className="mt-3 text-xs">
                            {submitted[type] ? 'Completed' : 'Pending'}
                          </Badge>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">Weight Distribution</h3>
                  <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <p>Onboarding: {Math.round(ASSESSMENT_WEIGHTS.onboarding * 100)}%</p>
                    <p>Performance: {Math.round(ASSESSMENT_WEIGHTS.performance * 100)}%</p>
                    <p>Risk: {Math.round(ASSESSMENT_WEIGHTS.risk * 100)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="onboarding">{renderAssessment('onboarding', 'Onboarding Assessment')}</TabsContent>
          <TabsContent value="performance">{renderAssessment('performance', 'Performance Review')}</TabsContent>
          <TabsContent value="risk">{renderAssessment('risk', 'Risk Assessment')}</TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

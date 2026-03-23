'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Building2, Shield, ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">VendorLens</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Third-Party Risk Management Platform
          </p>
          <p className="text-sm text-muted-foreground">
            Select your role to continue
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin/Compliance Login */}
          <Card className="p-8 border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => router.push('/auth/admin/login')}>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Risk & Compliance Team
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Access the vendor dashboard, risk assessments, and compliance monitoring tools
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6 group/btn"
              >
                Admin Login
                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Vendor Login */}
          <Card className="p-8 border-border bg-card hover:border-primary/50 transition-colors cursor-pointer group"
            onClick={() => router.push('/auth/vendor/login')}>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-amber-600/10 group-hover:bg-amber-600/20 transition-colors">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Vendor Portal
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Submit compliance information and respond to risk assessments
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-6 group/btn"
              >
                Vendor Login
                <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>Protected platform • All communications encrypted • GDPR & SOC 2 compliant</p>
        </div>
      </div>
    </div>
  )
}

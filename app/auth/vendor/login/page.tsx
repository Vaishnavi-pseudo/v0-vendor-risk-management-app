'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, AlertCircle, ChevronLeft } from 'lucide-react'

export default function VendorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // For demo: Accept any email/password combination for vendor login
    if (!email || !password) {
      setError('Please enter both email and password')
      setIsLoading(false)
      return
    }

    // Simulate auth delay
    setTimeout(() => {
      // Store vendor session in localStorage (demo only)
      localStorage.setItem('vendorSession', JSON.stringify({
        email,
        vendorName: email.split('@')[0],
        type: 'vendor',
        loginTime: new Date().toISOString()
      }))
      
      router.push('/vendor/dashboard')
    }, 600)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      localStorage.setItem('vendorSession', JSON.stringify({
        email: 'acme-tech@acme.com',
        vendorName: 'ACME Tech Solutions',
        type: 'vendor',
        vendorType: 'IT/Cloud',
        services: ['SaaS', 'Infrastructure'],
        loginTime: new Date().toISOString()
      }))
      
      router.push('/vendor/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Link href="/auth">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Back to Auth
          </Button>
        </Link>

        {/* Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-amber-600/10">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <CardTitle className="text-white text-center">Vendor Portal</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to access your assessment forms
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Company Email
                </Label>
                <Input
                  id="email"
                  placeholder="your-company@vendor.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo</span>
              </div>
            </div>

            {/* Demo Login */}
            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Try Demo (ACME Tech)'}
            </Button>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center">
              Need help? Contact your compliance team at{' '}
              <span className="text-foreground font-medium">support@vendorlens.io</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

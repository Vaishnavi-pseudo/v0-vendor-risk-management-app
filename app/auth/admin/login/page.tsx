'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertCircle, ChevronLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email || !password) {
      setError('Please enter both email and password')
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem('adminSession', JSON.stringify({
        email,
        name: 'Compliance Officer',
        role: 'admin',
        type: 'admin',
        loginTime: new Date().toISOString()
      }))
      
      router.push('/dashboard')
    }, 600)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      localStorage.setItem('adminSession', JSON.stringify({
        email: 'compliance@company.com',
        name: 'Sarah Chen',
        role: 'Compliance Lead',
        type: 'admin',
        loginTime: new Date().toISOString()
      }))
      
      router.push('/dashboard')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link href="/auth">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Back to Auth
          </Button>
        </Link>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-white text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to access risk management and compliance tools
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  placeholder="your-email@company.com"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? 'Loading...' : 'Try Demo (Sarah Chen)'}
            </Button>

            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Demo credentials:</span><br />
                Email: any email<br />
                Password: any password<br />
                Or use the demo button above
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

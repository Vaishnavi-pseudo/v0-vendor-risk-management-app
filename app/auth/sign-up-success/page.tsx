'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">VendorLens</h1>
          <p className="text-slate-400">Third-Party Risk Management Platform</p>
        </div>

        {/* Success Card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-white text-center text-2xl">
              Account Created
            </CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Your account has been successfully created
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h3 className="text-slate-300 font-medium mb-2">Next steps:</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  Verify your email address
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  Return to sign in
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  Access your dashboard
                </li>
              </ul>
            </div>

            <Link href="/auth/login" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2">
                Return to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2026 VendorLens. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is logged in
    const adminSession = typeof window !== 'undefined' ? localStorage.getItem('adminSession') : null
    const vendorSession = typeof window !== 'undefined' ? localStorage.getItem('vendorSession') : null

    if (adminSession) {
      router.push('/dashboard')
    } else if (vendorSession) {
      router.push('/vendor/dashboard')
    } else {
      router.push('/auth')
    }
  }, [router])

  return null
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminPage() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to the dashboard
      router.push('/admin/dashboard')
    } else if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="w-full h-full border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">ASSAB Admin</h2>
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </div>
    </div>
  )
}
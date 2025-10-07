'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ContentIndexPage() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to the main content management page
      router.push('/admin/content-management')
    } else if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  // Loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600">Redirecting to Content Management...</p>
      </div>
    </div>
  )
}
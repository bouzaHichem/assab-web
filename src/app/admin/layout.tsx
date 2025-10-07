'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { usePathname } from 'next/navigation'
import '@/styles/globals.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return (
      <html lang="en">
        <head>
          <title>ASSAB Admin Panel</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <SessionProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #334155',
                  },
                }}
              />
            </div>
          </SessionProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <title>ASSAB Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <SessionProvider>
          <div className="h-screen flex overflow-hidden bg-slate-50">
            <AdminSidebar />
            <div className="flex flex-col flex-1 overflow-hidden lg:ml-72">
              <AdminHeader />
              <main className="flex-1 relative overflow-y-auto focus:outline-none">
                <div className="py-6 lg:py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  borderRadius: '0.75rem',
                  border: '1px solid #334155',
                },
                success: {
                  style: {
                    background: '#059669',
                    color: '#f0fdf4',
                  },
                },
                error: {
                  style: {
                    background: '#dc2626',
                    color: '#fef2f2',
                  },
                },
              }}
            />
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}

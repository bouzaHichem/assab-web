'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ChartBarIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  EyeIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const statCards = [
    {
      name: 'Total Pages',
      stat: 5,
      icon: DocumentTextIcon,
      color: 'bg-blue-500',
      href: '/admin/content/pages'
    },
    {
      name: 'Services',
      stat: 12,
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      href: '/admin/services'
    },
    {
      name: 'Media Files',
      stat: 48,
      icon: PhotoIcon,
      color: 'bg-purple-500',
      href: '/admin/media'
    },
    {
      name: 'New Leads',
      stat: 8,
      icon: EnvelopeIcon,
      color: 'bg-yellow-500',
      href: '/admin/leads'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user?.name?.split(' ')[0] || 'Admin'}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Here's your website overview for today.
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center text-indigo-100">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-sm font-medium">System Status: Active</span>
              </div>
              <div className="flex items-center text-indigo-100">
                <span className="text-sm">Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8">
            <button
              type="button"
              onClick={() => window.open('/', '_blank')}
              className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-all duration-200"
            >
              <EyeIcon className="-ml-1 mr-2 h-5 w-5" />
              View Live Site
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
          <span className="text-sm text-slate-500">Last 30 days</span>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.name}
                onClick={() => router.push(item.href)}
                className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">
                      {item.name}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">{item.stat}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <Icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                    +12% from last month
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/content/pages/new')}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">New Page</h3>
              <p className="text-xs text-slate-500">Create content page</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/services/new')}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-green-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Add Service</h3>
              <p className="text-xs text-slate-500">New service offering</p>
            </button>
            
            <button
              onClick={() => router.push('/admin/media')}
              className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <PhotoIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Upload Media</h3>
              <p className="text-xs text-slate-500">Add images & files</p>
            </button>
          </div>
        </div>
        
        {/* Recent Activity Sidebar */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Homepage updated</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">New service added</p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Media files uploaded</p>
                  <p className="text-xs text-slate-500">2 days ago</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              View all activity
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MapPinIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  overview: {
    totalVisitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: number
    conversionRate: number
  }
  traffic: {
    date: string
    visitors: number
    pageViews: number
  }[]
  topPages: {
    page: string
    views: number
    percentage: number
  }[]
  devices: {
    device: string
    users: number
    percentage: number
  }[]
  sources: {
    source: string
    users: number
    percentage: number
  }[]
  countries: {
    country: string
    users: number
    percentage: number
  }[]
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchAnalytics()
    }
  }, [session, dateRange])

  const fetchAnalytics = async () => {
    try {
      // Fetch real analytics data from API
      const response = await fetch(`/api/analytics?dateRange=${dateRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }
      
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: {
    title: string
    value: number
    change?: number
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    format?: 'number' | 'percentage' | 'duration'
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'percentage':
          return `${val.toFixed(1)}%`
        case 'duration':
          return formatDuration(val)
        default:
          return val.toLocaleString()
      }
    }

    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-slate-900 mb-1">
          {formatValue(value)}
        </div>
        <div className="text-sm text-slate-600">{title}</div>
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return <div>Failed to load analytics data</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track your website performance and user behavior
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Visitors"
          value={analyticsData.overview.totalVisitors}
          change={12.5}
          icon={UserGroupIcon}
        />
        <StatCard
          title="Page Views"
          value={analyticsData.overview.pageViews}
          change={8.3}
          icon={EyeIcon}
        />
        <StatCard
          title="Bounce Rate"
          value={analyticsData.overview.bounceRate}
          change={-3.2}
          icon={ArrowTrendingDownIcon}
          format="percentage"
        />
        <StatCard
          title="Avg. Session Duration"
          value={analyticsData.overview.avgSessionDuration}
          change={5.7}
          icon={ClockIcon}
          format="duration"
        />
        <StatCard
          title="Conversion Rate"
          value={analyticsData.overview.conversionRate}
          change={15.4}
          icon={ArrowTrendingUpIcon}
          format="percentage"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Traffic Overview</h3>
            <ChartBarIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {analyticsData.traffic.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-900">{day.visitors} visitors</div>
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${(day.visitors / Math.max(...analyticsData.traffic.map(d => d.visitors))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Top Pages</h3>
            <GlobeAltIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">{page.page}</div>
                  <div className="text-sm text-slate-500">{page.views.toLocaleString()} views</div>
                </div>
                <div className="text-sm text-slate-600">{page.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Devices</h3>
            <DevicePhoneMobileIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {device.device === 'Desktop' && <ComputerDesktopIcon className="w-4 h-4 text-slate-400" />}
                  {device.device === 'Mobile' && <DevicePhoneMobileIcon className="w-4 h-4 text-slate-400" />}
                  {device.device === 'Tablet' && <ComputerDesktopIcon className="w-4 h-4 text-slate-400" />}
                  <span className="text-slate-900">{device.device}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{device.users.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{device.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Traffic Sources</h3>
            <GlobeAltIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {analyticsData.sources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-slate-900">{source.source}</div>
                <div className="text-right">
                  <div className="font-medium text-slate-900">{source.users.toLocaleString()}</div>
                  <div className="text-sm text-slate-500">{source.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Top Countries</h3>
          <GlobeAltIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {analyticsData.countries.map((country, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="font-medium text-slate-900 mb-1">{country.country}</div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {country.users.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500">{country.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Growth Opportunity</span>
            </div>
            <p className="text-sm text-green-700">
              Mobile traffic increased by 23% this month. Consider optimizing mobile experience.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Attention Needed</span>
            </div>
            <p className="text-sm text-yellow-700">
              Page load time on /services is 15% slower than average. Optimize images and scripts.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Top Performer</span>
            </div>
            <p className="text-sm text-blue-700">
              Homepage conversion rate improved by 18% after recent updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
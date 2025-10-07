import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, hasRole } from '@/lib/auth'
import {
  getAnalyticsOverview,
  getTrafficData,
  getTopPages,
  getDeviceData,
  getSourceData,
  getCountryData
} from '@/lib/analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'VIEWER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '30d'
    
    // Parse date range
    const days = parseInt(dateRange.replace('d', '')) || 30

    // Fetch all analytics data concurrently
    const [
      overview,
      traffic,
      topPages,
      devices,
      sources,
      countries
    ] = await Promise.all([
      getAnalyticsOverview(days),
      getTrafficData(Math.min(days, 30)), // Limit traffic data to 30 days max
      getTopPages(),
      getDeviceData(),
      getSourceData(),
      getCountryData()
    ])

    const analyticsData = {
      overview,
      traffic,
      topPages,
      devices,
      sources,
      countries
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    
    // Return fallback mock data if real data fails
    const mockData = {
      overview: {
        totalVisitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        conversionRate: 0
      },
      traffic: [],
      topPages: [],
      devices: [],
      sources: [],
      countries: []
    }

    return NextResponse.json(mockData)
  }
}
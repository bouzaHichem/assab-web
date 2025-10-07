import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Initialize the Analytics Data client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.GOOGLE_PROJECT_ID,
})

const GA_PROPERTY_ID = process.env.GA_PROPERTY_ID

export interface AnalyticsOverview {
  totalVisitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
}

export interface TrafficData {
  date: string
  visitors: number
  pageViews: number
}

export interface PageData {
  page: string
  views: number
  percentage: number
}

export interface DeviceData {
  device: string
  users: number
  percentage: number
}

export interface SourceData {
  source: string
  users: number
  percentage: number
}

export interface CountryData {
  country: string
  users: number
  percentage: number
}

export async function getAnalyticsOverview(days: number = 30): Promise<AnalyticsOverview> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'userEngagementDuration' },
        { name: 'conversions' },
      ],
    })

    const row = response.rows?.[0]
    if (!row) {
      throw new Error('No analytics data found')
    }

    const totalUsers = parseInt(row.metricValues?.[0]?.value || '0')
    const pageViews = parseInt(row.metricValues?.[1]?.value || '0')
    const bounceRate = parseFloat(row.metricValues?.[2]?.value || '0') * 100
    const engagementDuration = parseFloat(row.metricValues?.[3]?.value || '0')
    const conversions = parseInt(row.metricValues?.[4]?.value || '0')

    return {
      totalVisitors: totalUsers,
      pageViews,
      bounceRate,
      avgSessionDuration: Math.round(engagementDuration / totalUsers),
      conversionRate: totalUsers > 0 ? (conversions / totalUsers) * 100 : 0,
    }
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    // Return fallback data if API fails
    return {
      totalVisitors: 0,
      pageViews: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      conversionRate: 0,
    }
  }
}

export async function getTrafficData(days: number = 7): Promise<TrafficData[]> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    })

    return (
      response.rows?.map(row => ({
        date: row.dimensionValues?.[0]?.value || '',
        visitors: parseInt(row.metricValues?.[0]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[1]?.value || '0'),
      })) || []
    )
  } catch (error) {
    console.error('Error fetching traffic data:', error)
    return []
  }
}

export async function getTopPages(): Promise<PageData[]> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    })

    const totalViews = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 1

    return (
      response.rows?.map(row => {
        const views = parseInt(row.metricValues?.[0]?.value || '0')
        return {
          page: row.dimensionValues?.[0]?.value || '',
          views,
          percentage: (views / totalViews) * 100,
        }
      }) || []
    )
  } catch (error) {
    console.error('Error fetching top pages:', error)
    return []
  }
}

export async function getDeviceData(): Promise<DeviceData[]> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'totalUsers' }],
    })

    const totalUsers = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 1

    return (
      response.rows?.map(row => {
        const users = parseInt(row.metricValues?.[0]?.value || '0')
        const device = row.dimensionValues?.[0]?.value || ''
        return {
          device: device.charAt(0).toUpperCase() + device.slice(1),
          users,
          percentage: (users / totalUsers) * 100,
        }
      }) || []
    )
  } catch (error) {
    console.error('Error fetching device data:', error)
    return []
  }
}

export async function getSourceData(): Promise<SourceData[]> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 10,
    })

    const totalUsers = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 1

    return (
      response.rows?.map(row => {
        const users = parseInt(row.metricValues?.[0]?.value || '0')
        return {
          source: row.dimensionValues?.[0]?.value || '',
          users,
          percentage: (users / totalUsers) * 100,
        }
      }) || []
    )
  } catch (error) {
    console.error('Error fetching source data:', error)
    return []
  }
}

export async function getCountryData(): Promise<CountryData[]> {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'totalUsers' }],
      orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 10,
    })

    const totalUsers = response.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || '0'),
      0
    ) || 1

    return (
      response.rows?.map(row => {
        const users = parseInt(row.metricValues?.[0]?.value || '0')
        return {
          country: row.dimensionValues?.[0]?.value || '',
          users,
          percentage: (users / totalUsers) * 100,
        }
      }) || []
    )
  } catch (error) {
    console.error('Error fetching country data:', error)
    return []
  }
}
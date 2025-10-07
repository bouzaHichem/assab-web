import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth-utils'

// GET /api/admin/settings - Get all settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group') || ''

    const where: any = {}
    if (group) {
      where.group = group
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }]
    })

    // Parse JSON fields and group by category
    const formattedSettings = settings.reduce((acc, setting) => {
      const group = setting.group || 'general'
      if (!acc[group]) {
        acc[group] = []
      }

      acc[group].push({
        ...setting,
        value: JSON.parse(setting.value),
        label: JSON.parse(setting.label),
        description: setting.description ? JSON.parse(setting.description) : null
      })

      return acc
    }, {} as any)

    return NextResponse.json({ settings: formattedSettings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update multiple settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { settings } = await request.json()

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      )
    }

    const updates = []

    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.setting.upsert({
          where: { key },
          update: {
            value: JSON.stringify(value)
          },
          create: {
            key,
            value: JSON.stringify(value),
            type: 'TEXT',
            group: 'general',
            label: JSON.stringify({ en: key, fr: key, ar: key })
          }
        })
      )
    }

    await Promise.all(updates)

    // Log activity
    await logActivity(
      session.user.id,
      'UPDATE',
      'SETTINGS',
      undefined,
      { settingsCount: Object.keys(settings).length }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
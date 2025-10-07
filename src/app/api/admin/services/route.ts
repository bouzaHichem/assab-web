import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth-utils'

// GET /api/admin/services - List all services
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search } }
      ]
    }
    if (status) {
      where.status = status
    }
    if (category) {
      where.category = category
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          createdBy: { select: { name: true, email: true } },
          updatedBy: { select: { name: true, email: true } }
        },
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ])

    // Parse JSON fields for response
    const formattedServices = services.map(service => ({
      ...service,
      title: JSON.parse(service.title),
      description: JSON.parse(service.description),
      shortDesc: service.shortDesc ? JSON.parse(service.shortDesc) : null,
      features: service.features ? JSON.parse(service.features) : null,
      pricing: service.pricing ? JSON.parse(service.pricing) : null,
      gallery: service.gallery ? JSON.parse(service.gallery) : null
    }))

    return NextResponse.json({
      services: formattedServices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      slug,
      title,
      description,
      shortDesc,
      features,
      pricing,
      category,
      status = 'ACTIVE',
      featuredImage,
      gallery,
      sortOrder = 0
    } = data

    // Validate required fields
    if (!slug || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Slug, title, description, and category are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        slug,
        title: JSON.stringify(title),
        description: JSON.stringify(description),
        shortDesc: shortDesc ? JSON.stringify(shortDesc) : null,
        features: features ? JSON.stringify(features) : null,
        pricing: pricing ? JSON.stringify(pricing) : null,
        category,
        status,
        featuredImage,
        gallery: gallery ? JSON.stringify(gallery) : null,
        sortOrder,
        createdById: session.user.id,
        updatedById: session.user.id
      },
      include: {
        createdBy: { select: { name: true, email: true } },
        updatedBy: { select: { name: true, email: true } }
      }
    })

    // Log activity
    await logActivity(
      session.user.id,
      'CREATE',
      'SERVICE',
      service.id,
      { slug, title, category, status }
    )

    // Parse JSON fields for response
    const formattedService = {
      ...service,
      title: JSON.parse(service.title),
      description: JSON.parse(service.description),
      shortDesc: service.shortDesc ? JSON.parse(service.shortDesc) : null,
      features: service.features ? JSON.parse(service.features) : null,
      pricing: service.pricing ? JSON.parse(service.pricing) : null,
      gallery: service.gallery ? JSON.parse(service.gallery) : null
    }

    return NextResponse.json(formattedService, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
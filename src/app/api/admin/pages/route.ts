import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth-utils'

// GET /api/admin/pages - List all pages
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

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        include: {
          createdBy: { select: { name: true, email: true } },
          updatedBy: { select: { name: true, email: true } }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.page.count({ where })
    ])

    // Parse JSON fields for response
    const formattedPages = pages.map(page => ({
      ...page,
      title: JSON.parse(page.title),
      content: JSON.parse(page.content),
      excerpt: page.excerpt ? JSON.parse(page.excerpt) : null,
      metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
      metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
    }))

    return NextResponse.json({
      pages: formattedPages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/pages - Create new page
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
      content,
      excerpt,
      metaTitle,
      metaDesc,
      status = 'DRAFT'
    } = data

    // Validate required fields
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    })

    if (existingPage) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title: JSON.stringify(title),
        content: JSON.stringify(content),
        excerpt: excerpt ? JSON.stringify(excerpt) : null,
        metaTitle: metaTitle ? JSON.stringify(metaTitle) : null,
        metaDesc: metaDesc ? JSON.stringify(metaDesc) : null,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
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
      'PAGE',
      page.id,
      { slug, title, status }
    )

    // Parse JSON fields for response
    const formattedPage = {
      ...page,
      title: JSON.parse(page.title),
      content: JSON.parse(page.content),
      excerpt: page.excerpt ? JSON.parse(page.excerpt) : null,
      metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
      metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
    }

    return NextResponse.json(formattedPage, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
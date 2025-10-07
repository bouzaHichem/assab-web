import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logActivity } from '@/lib/auth-utils'

// GET /api/admin/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true, email: true } },
        updatedBy: { select: { name: true, email: true } }
      }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Parse JSON fields for response
    const formattedPage = {
      ...page,
      title: JSON.parse(page.title),
      content: JSON.parse(page.content),
      excerpt: page.excerpt ? JSON.parse(page.excerpt) : null,
      metaTitle: page.metaTitle ? JSON.parse(page.metaTitle) : null,
      metaDesc: page.metaDesc ? JSON.parse(page.metaDesc) : null
    }

    return NextResponse.json(formattedPage)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/pages/[id] - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
      status
    } = data

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id }
    })

    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Check if slug is being changed and if it conflicts
    if (slug && slug !== existingPage.slug) {
      const slugConflict = await prisma.page.findUnique({
        where: { slug }
      })

      if (slugConflict) {
        return NextResponse.json(
          { error: 'A page with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      updatedById: session.user.id
    }

    if (slug) updateData.slug = slug
    if (title) updateData.title = JSON.stringify(title)
    if (content) updateData.content = JSON.stringify(content)
    if (excerpt !== undefined) updateData.excerpt = excerpt ? JSON.stringify(excerpt) : null
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle ? JSON.stringify(metaTitle) : null
    if (metaDesc !== undefined) updateData.metaDesc = metaDesc ? JSON.stringify(metaDesc) : null

    // Handle status change
    if (status && status !== existingPage.status) {
      updateData.status = status
      if (status === 'PUBLISHED' && !existingPage.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: { select: { name: true, email: true } },
        updatedBy: { select: { name: true, email: true } }
      }
    })

    // Log activity
    await logActivity(
      session.user.id,
      'UPDATE',
      'PAGE',
      page.id,
      { slug: page.slug, status: page.status }
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

    return NextResponse.json(formattedPage)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { id }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    await prisma.page.delete({
      where: { id }
    })

    // Log activity
    await logActivity(
      session.user.id,
      'DELETE',
      'PAGE',
      id,
      { slug: page.slug }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
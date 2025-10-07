import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, hasRole } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const milestones = await prisma.timeline.findMany({
      orderBy: {
        order: 'asc'
      }
    })
    
    return NextResponse.json({ milestones })
  } catch (error) {
    console.error('Error fetching milestones:', error)
    return NextResponse.json({ error: 'Failed to fetch milestones', milestones: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { year, title, description, order, isActive } = body

    const milestone = await prisma.timeline.create({
      data: {
        year,
        title: JSON.stringify({ en: title, fr: title, ar: title }), // For now, same title in all languages
        description: JSON.stringify({ en: description, fr: description, ar: description }),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({ milestone, success: true })
  } catch (error) {
    console.error('Error creating milestone:', error)
    return NextResponse.json({ error: 'Failed to create milestone' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, year, title, description, order, isActive } = body

    const milestone = await prisma.timeline.update({
      where: { id },
      data: {
        year,
        title: JSON.stringify({ en: title, fr: title, ar: title }),
        description: JSON.stringify({ en: description, fr: description, ar: description }),
        order,
        isActive
      }
    })

    return NextResponse.json({ milestone, success: true })
  } catch (error) {
    console.error('Error updating milestone:', error)
    return NextResponse.json({ error: 'Failed to update milestone' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Milestone ID is required' }, { status: 400 })
    }

    await prisma.timeline.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting milestone:', error)
    return NextResponse.json({ error: 'Failed to delete milestone' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, hasRole } from '@/lib/auth'
import { fetchEmailLeads, EmailLead } from '@/lib/email'
import { syncEmailLeadsWithDb, updateLeadStatusInDb, addLeadNoteInDb, updateLeadPriorityInDb } from '@/lib/db-leads'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'VIEWER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Fetch fresh email leads and sync with database
    const emailLeads = await fetchEmailLeads(limit)
    const allLeads = await syncEmailLeadsWithDb(emailLeads)
    
    return NextResponse.json({ leads: allLeads })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads', leads: [] }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !hasRole(session.user?.role || '', 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, leadId, status, note, priority } = body

    if (action === 'updateStatus') {
      const success = await updateLeadStatusInDb(leadId, status)
      return NextResponse.json({ success })
    }

    if (action === 'addNote') {
      const success = await addLeadNoteInDb(leadId, note)
      return NextResponse.json({ success })
    }

    if (action === 'updatePriority') {
      const success = await updateLeadPriorityInDb(leadId, priority)
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

import { PrismaClient } from '@prisma/client'
import { EmailLead } from './email'

const prisma = new PrismaClient()

// Convert database enum values to our interface types
function mapDbLeadToEmailLead(dbLead: any): EmailLead {
  return {
    id: dbLead.id,
    name: dbLead.name,
    email: dbLead.email,
    subject: dbLead.subject,
    message: dbLead.message,
    company: dbLead.company || undefined,
    phone: dbLead.phone || undefined,
    source: dbLead.source.toLowerCase() as EmailLead['source'],
    status: dbLead.status.toLowerCase() as EmailLead['status'],
    priority: dbLead.priority.toLowerCase() as EmailLead['priority'],
    assignedTo: dbLead.assignedTo || undefined,
    tags: dbLead.tags ? JSON.parse(dbLead.tags) : undefined,
    notes: dbLead.notes || undefined,
    receivedAt: dbLead.receivedAt.toISOString(),
    updatedAt: dbLead.updatedAt.toISOString(),
  }
}

// Convert our interface types to database enum values
function mapEmailLeadToDbLead(emailLead: EmailLead) {
  return {
    emailId: emailLead.id.startsWith('email-') ? emailLead.id.replace('email-', '') : null,
    name: emailLead.name,
    email: emailLead.email,
    subject: emailLead.subject,
    message: emailLead.message,
    company: emailLead.company,
    phone: emailLead.phone,
    source: emailLead.source.toUpperCase(),
    status: emailLead.status.toUpperCase(),
    priority: emailLead.priority.toUpperCase(),
    assignedTo: emailLead.assignedTo,
    tags: emailLead.tags ? JSON.stringify(emailLead.tags) : null,
    notes: emailLead.notes,
    receivedAt: new Date(emailLead.receivedAt),
  }
}

export async function saveEmailLeads(leads: EmailLead[]): Promise<void> {
  try {
    const operations = leads.map(lead => {
      const dbLead = mapEmailLeadToDbLead(lead)
      
      return prisma.lead.upsert({
        where: {
          id: lead.id
        },
        update: {
          emailId: dbLead.emailId,
          name: dbLead.name,
          email: dbLead.email,
          subject: dbLead.subject,
          message: dbLead.message,
          company: dbLead.company,
          phone: dbLead.phone,
          assignedTo: dbLead.assignedTo,
          tags: dbLead.tags,
          notes: dbLead.notes,
          receivedAt: dbLead.receivedAt,
          updatedAt: new Date(),
        },
        create: {
          id: lead.id,
          emailId: dbLead.emailId,
          name: dbLead.name,
          email: dbLead.email,
          subject: dbLead.subject,
          message: dbLead.message,
          company: dbLead.company,
          phone: dbLead.phone,
          assignedTo: dbLead.assignedTo,
          tags: dbLead.tags,
          notes: dbLead.notes,
          receivedAt: dbLead.receivedAt,
        },
      })
    })

    await Promise.all(operations)
    console.log(`Saved ${leads.length} leads to database`)
  } catch (error) {
    console.error('Error saving email leads to database:', error)
    throw error
  }
}

export async function getLeadsFromDb(limit: number = 100): Promise<EmailLead[]> {
  try {
    const dbLeads = await prisma.lead.findMany({
      take: limit,
      orderBy: {
        receivedAt: 'desc'
      }
    })

    return dbLeads.map(mapDbLeadToEmailLead)
  } catch (error) {
    console.error('Error fetching leads from database:', error)
    return []
  }
}

export async function updateLeadStatusInDb(leadId: string, status: EmailLead['status']): Promise<boolean> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        status: status.toUpperCase() as any,
        updatedAt: new Date()
      }
    })
    return true
  } catch (error) {
    console.error('Error updating lead status in database:', error)
    return false
  }
}

export async function addLeadNoteInDb(leadId: string, note: string): Promise<boolean> {
  try {
    // Get current notes
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { notes: true }
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    // Append new note with timestamp
    const timestamp = new Date().toISOString()
    const newNote = `[${timestamp}] ${note}`
    const updatedNotes = lead.notes ? `${lead.notes}\n${newNote}` : newNote

    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        notes: updatedNotes,
        updatedAt: new Date()
      }
    })
    
    return true
  } catch (error) {
    console.error('Error adding lead note to database:', error)
    return false
  }
}

export async function updateLeadPriorityInDb(leadId: string, priority: EmailLead['priority']): Promise<boolean> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { 
        priority: priority.toUpperCase() as any,
        updatedAt: new Date()
      }
    })
    return true
  } catch (error) {
    console.error('Error updating lead priority in database:', error)
    return false
  }
}

// Function to sync email leads with database
export async function syncEmailLeadsWithDb(emailLeads: EmailLead[]): Promise<EmailLead[]> {
  try {
    // Save new email leads to database
    if (emailLeads.length > 0) {
      await saveEmailLeads(emailLeads)
    }

    // Get all leads from database (includes both email and manual leads)
    const allLeads = await getLeadsFromDb()
    return allLeads
  } catch (error) {
    console.error('Error syncing email leads with database:', error)
    // Return email leads if database sync fails
    return emailLeads
  }
}
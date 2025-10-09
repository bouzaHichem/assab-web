import imaps from 'imap-simple'
import { simpleParser, ParsedMail } from 'mailparser'

export interface EmailLead {
  id: string
  name: string
  email: string
  subject: string
  message: string
  company?: string
  phone?: string
  source: 'website' | 'direct' | 'referral'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  tags?: string[]
  notes?: string
  receivedAt: string
  updatedAt: string
}

interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
  secure: boolean
}

const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'imap.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '993'),
  user: process.env.EMAIL_USER || 'info@assabenggroup.com',
  password: process.env.EMAIL_PASSWORD || '',
  secure: process.env.EMAIL_SECURE === 'true',
}

export async function fetchEmailLeads(limit: number = 100): Promise<EmailLead[]> {
  if (!emailConfig.password) {
    console.warn('Email password not configured, returning empty leads')
    return []
  }

  try {
    const connection = await imaps.connect({
      imap: {
        user: emailConfig.user,
        password: emailConfig.password,
        host: emailConfig.host,
        port: emailConfig.port,
        tls: emailConfig.secure,
        authTimeout: 3000,
      },
    })

    await connection.openBox('INBOX')

    // Fetch recent emails (last 30 days)
    const searchCriteria = ['SINCE', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)]
    const fetchOptions = {
      bodies: '',
      markSeen: false,
    }

    const messages = await connection.search(searchCriteria, fetchOptions)
    const leads: EmailLead[] = []

    for (const message of messages.slice(-limit)) {
      try {
        const parsed = await simpleParser(message.body)
        const lead = await parseEmailToLead(parsed, message.attributes.uid.toString())
        if (lead) {
          leads.push(lead)
        }
      } catch (error) {
        console.error('Error parsing email:', error)
      }
    }

    connection.end()
    return leads.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
  } catch (error) {
    console.error('Error fetching email leads:', error)
    return []
  }
}

async function parseEmailToLead(email: ParsedMail, uid: string): Promise<EmailLead | null> {
  try {
    const fromAddress = Array.isArray(email.from) ? email.from[0] : email.from
    if (!fromAddress?.value) return null

    const senderEmail = fromAddress.value[0]?.address || ''
    const senderName = fromAddress.value[0]?.name || senderEmail.split('@')[0]

    // Skip emails from known non-lead sources
    if (isSystemEmail(senderEmail)) {
      return null
    }

    const subject = email.subject || 'No Subject'
    const textContent = email.text || email.html?.replace(/<[^>]*>/g, '') || ''

    // Extract structured data from email content
    const extractedData = extractLeadData(textContent, subject)

    // Determine lead source
    const source = determineLeadSource(textContent, subject, senderEmail)

    // Determine priority based on keywords and content
    const priority = determinePriority(textContent, subject)

    return {
      id: `email-${uid}`,
      name: senderName,
      email: senderEmail,
      subject,
      message: textContent.trim(),
      company: extractedData.company,
      phone: extractedData.phone,
      source,
      status: 'new',
      priority,
      tags: extractTags(textContent, subject),
      receivedAt: email.date?.toISOString() || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error parsing email to lead:', error)
    return null
  }
}

function isSystemEmail(email: string): boolean {
  const systemDomains = [
    'noreply',
    'no-reply',
    'mailer-daemon',
    'postmaster',
    'support',
    'notification',
    'automated',
    'system',
  ]
  
  const emailLower = email.toLowerCase()
  return systemDomains.some(domain => emailLower.includes(domain))
}

function extractLeadData(content: string, subject: string): {
  company?: string
  phone?: string
} {
  const data: { company?: string; phone?: string } = {}

  // Extract phone numbers
  const phoneRegex = /(?:\+?[\d\s\-\(\)]{10,})/g
  const phoneMatches = content.match(phoneRegex)
  if (phoneMatches) {
    data.phone = phoneMatches[0].trim()
  }

  // Extract company name from common patterns
  const companyPatterns = [
    /company:?\s*([^\n\r]+)/i,
    /organization:?\s*([^\n\r]+)/i,
    /from\s+([A-Z][A-Za-z\s&]+(?:Ltd|Inc|Corp|LLC|Company))/i,
    /representing\s+([A-Z][A-Za-z\s&]+)/i,
  ]

  for (const pattern of companyPatterns) {
    const match = content.match(pattern)
    if (match) {
      data.company = match[1].trim()
      break
    }
  }

  return data
}

function determineLeadSource(content: string, subject: string, email: string): EmailLead['source'] {
  const contentLower = content.toLowerCase()
  const subjectLower = subject.toLowerCase()

  // Check for website form submissions
  if (contentLower.includes('contact form') || 
      contentLower.includes('website') ||
      subjectLower.includes('website inquiry') ||
      subjectLower.includes('contact form')) {
    return 'website'
  }

  // Check for referrals
  if (contentLower.includes('referred') || 
      contentLower.includes('referral') ||
      contentLower.includes('recommended')) {
    return 'referral'
  }

  return 'direct'
}

function determinePriority(content: string, subject: string): EmailLead['priority'] {
  const contentLower = content.toLowerCase()
  const subjectLower = subject.toLowerCase()

  const highPriorityKeywords = [
    'urgent', 'asap', 'emergency', 'critical', 'immediate',
    'large project', 'enterprise', 'major', 'significant investment'
  ]

  const mediumPriorityKeywords = [
    'quote', 'proposal', 'budget', 'timeline', 'interested',
    'project', 'service', 'partnership'
  ]

  for (const keyword of highPriorityKeywords) {
    if (contentLower.includes(keyword) || subjectLower.includes(keyword)) {
      return 'high'
    }
  }

  for (const keyword of mediumPriorityKeywords) {
    if (contentLower.includes(keyword) || subjectLower.includes(keyword)) {
      return 'medium'
    }
  }

  return 'low'
}

function extractTags(content: string, subject: string): string[] {
  const tags: string[] = []
  const contentLower = content.toLowerCase()
  const subjectLower = subject.toLowerCase()

  const tagKeywords = {
    'telecom': ['telecom', 'telecommunications', 'network', 'infrastructure'],
    'energy': ['energy', 'solar', 'renewable', 'power', 'electrical'],
    'quote': ['quote', 'pricing', 'cost', 'budget', 'price'],
    'partnership': ['partnership', 'collaboration', 'joint venture'],
    'support': ['support', 'help', 'assistance', 'question'],
    'consultation': ['consultation', 'meeting', 'discuss', 'advice'],
  }

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    for (const keyword of keywords) {
      if (contentLower.includes(keyword) || subjectLower.includes(keyword)) {
        tags.push(tag)
        break
      }
    }
  }

  return Array.from(new Set(tags)) // Remove duplicates
}

export async function updateLeadStatus(leadId: string, status: EmailLead['status']): Promise<boolean> {
  // This would typically update a database
  // For now, we'll implement a simple in-memory storage or file-based system
  try {
    // Implementation would go here to persist lead status updates
    console.log(`Lead ${leadId} status updated to ${status}`)
    return true
  } catch (error) {
    console.error('Error updating lead status:', error)
    return false
  }
}

export async function addLeadNote(leadId: string, note: string): Promise<boolean> {
  try {
    // Implementation would go here to persist lead notes
    console.log(`Note added to lead ${leadId}: ${note}`)
    return true
  } catch (error) {
    console.error('Error adding lead note:', error)
    return false
  }
}
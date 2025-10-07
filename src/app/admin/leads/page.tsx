'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Lead {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  priority: 'low' | 'medium' | 'high'
  source: 'website' | 'direct' | 'referral'
  assignedTo?: string
  tags?: string[]
  notes?: string
  receivedAt: string
  updatedAt: string
}
export default function LeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'priority'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchLeads()
    }
  }, [session])

  const fetchLeads = async () => {
    try {
      // Fetch real leads from email API
      const response = await fetch('/api/leads', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      toast.error('Failed to fetch leads')
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStatus',
          leadId,
          status: newStatus
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update lead status')
      }
      
      // Update local state
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, status: newStatus, updatedAt: new Date().toISOString() }
            : lead
        )
      )
      toast.success('Lead status updated!')
    } catch (error) {
      toast.error('Failed to update lead status')
      console.error('Error updating lead:', error)
    }
  }

  const handleUpdateLeadPriority = async (leadId: string, newPriority: Lead['priority']) => {
    try {
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, priority: newPriority, updatedAt: new Date().toISOString() }
            : lead
        )
      )
      toast.success('Lead priority updated!')
    } catch (error) {
      toast.error('Failed to update lead priority')
      console.error('Error updating lead:', error)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
      if (selectedLead?.id === leadId) {
        setSelectedLead(null)
      }
      toast.success('Lead deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete lead')
      console.error('Error deleting lead:', error)
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-purple-100 text-purple-800'
      case 'proposal':
        return 'bg-orange-100 text-orange-800'
      case 'closed':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredAndSortedLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
                           lead.email.toLowerCase().includes(search.toLowerCase()) ||
                           lead.company?.toLowerCase().includes(search.toLowerCase()) ||
                           lead.subject.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || lead.status === statusFilter
      const matchesPriority = !priorityFilter || lead.priority === priorityFilter
      const matchesSource = !sourceFilter || lead.source === sourceFilter
      return matchesSearch && matchesStatus && matchesPriority && matchesSource
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const getStatusStats = () => {
    const stats = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return stats
  }

  const stats = getStatusStats()

  const LeadDetailModal = ({ lead, isOpen, onClose }: {
    lead: Lead | null
    isOpen: boolean
    onClose: () => void
  }) => {
    if (!isOpen || !lead) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
                <p className="text-sm text-slate-600">{lead.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-900">{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-900">{lead.phone}</span>
                      </div>
                    )}
                    {lead.company && (
                      <div className="flex items-center space-x-3">
                        <BuildingOfficeIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-900">{lead.company}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Lead Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Status:</span>
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="closed">Closed</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Priority:</span>
                      <select
                        value={lead.priority}
                        onChange={(e) => handleUpdateLeadPriority(lead.id, e.target.value as Lead['priority'])}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Source:</span>
                      <span className="text-slate-900 capitalize">{lead.source}</span>
                    </div>
                    {lead.assignedTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Assigned to:</span>
                        <span className="text-slate-900">{lead.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Created:</span>
                      <span className="text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Inquiry Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <p className="text-slate-900 p-3 bg-slate-50 rounded-lg">{lead.subject}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <p className="text-slate-900 p-3 bg-slate-50 rounded-lg whitespace-pre-wrap">{lead.message}</p>
                    </div>
                  </div>
                </div>

                {lead.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Notes</h3>
                    <p className="text-slate-900 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      {lead.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Send Email
              </button>
              {lead.phone && (
                <button className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call
                </button>
              )}
            </div>
            <button
              onClick={() => handleDeleteLead(lead.id)}
              className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete Lead
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Track and manage your sales leads and inquiries
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-lg">
            <EnvelopeIcon className="w-4 h-4 mr-2" />
            {leads.length} Total Leads
          </span>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.new || 0}</div>
          <div className="text-sm text-slate-600">New</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.contacted || 0}</div>
          <div className="text-sm text-slate-600">Contacted</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.qualified || 0}</div>
          <div className="text-sm text-slate-600">Qualified</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">{stats.proposal || 0}</div>
          <div className="text-sm text-slate-600">Proposal</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.closed || 0}</div>
          <div className="text-sm text-slate-600">Closed</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{stats.lost || 0}</div>
          <div className="text-sm text-slate-600">Lost</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="closed">Closed</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="other">Other</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy as 'date' | 'name' | 'priority')
              setSortOrder(newSortOrder as 'asc' | 'desc')
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="priority-desc">High Priority</option>
            <option value="priority-asc">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {filteredAndSortedLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{lead.email}</p>
                    {lead.company && <p className="text-sm text-slate-500">{lead.company}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900">{lead.subject}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString()} • {lead.source}
                  </div>
                  {lead.assignedTo && (
                    <div className="text-xs text-slate-600 mt-1">
                      Assigned to: {lead.assignedTo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedLeads.length === 0 && (
          <div className="text-center py-12">
            <EnvelopeIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No leads found</h3>
            <p className="text-slate-500">
              {search || statusFilter || priorityFilter || sourceFilter
                ? 'Try adjusting your search or filters.'
                : 'Leads from your website contact form will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  )
}
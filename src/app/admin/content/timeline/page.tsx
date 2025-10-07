'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Milestone {
  id: string
  year: string
  title: string
  description: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function TimelineManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [showAddMilestone, setShowAddMilestone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchMilestones()
    }
  }, [session])

  const fetchMilestones = async () => {
    try {
      const response = await fetch('/api/timeline')
      
      if (!response.ok) {
        throw new Error('Failed to fetch milestones')
      }
      
      const data = await response.json()
      const processedMilestones = data.milestones.map((milestone: any) => ({
        id: milestone.id,
        year: milestone.year,
        title: milestone.title ? JSON.parse(milestone.title).en : '',
        description: milestone.description ? JSON.parse(milestone.description).en : '',
        order: milestone.order,
        isActive: milestone.isActive,
        createdAt: milestone.createdAt,
        updatedAt: milestone.updatedAt
      }))
      
      setMilestones(processedMilestones.sort((a: Milestone, b: Milestone) => a.order - b.order))
    } catch (error) {
      toast.error('Failed to fetch milestones')
      console.error('Error fetching milestones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMilestone = async (milestone: Milestone) => {
    try {
      let response
      
      if (editingMilestone) {
        // Update existing milestone
        response = await fetch('/api/timeline', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: milestone.id,
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
            order: milestone.order,
            isActive: milestone.isActive
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update milestone')
        }
        
        toast.success('Milestone updated successfully!')
      } else {
        // Create new milestone
        response = await fetch('/api/timeline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
            order: milestones.length + 1,
            isActive: milestone.isActive
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to create milestone')
        }
        
        toast.success('Milestone created successfully!')
      }
      
      // Refresh milestones from server
      await fetchMilestones()
      setEditingMilestone(null)
      setShowAddMilestone(false)
    } catch (error) {
      toast.error('Failed to save milestone')
      console.error('Error saving milestone:', error)
    }
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return

    try {
      const response = await fetch(`/api/timeline?id=${milestoneId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete milestone')
      }
      
      await fetchMilestones()
      toast.success('Milestone deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete milestone')
      console.error('Error deleting milestone:', error)
    }
  }

  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId)
      if (!milestone) return
      
      const response = await fetch('/api/timeline', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: milestoneId,
          year: milestone.year,
          title: milestone.title,
          description: milestone.description,
          order: milestone.order,
          isActive: !milestone.isActive
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update milestone')
      }
      
      await fetchMilestones()
      toast.success('Milestone status updated!')
    } catch (error) {
      toast.error('Failed to update milestone')
      console.error('Error updating milestone:', error)
    }
  }

  const handleMoveUp = (milestoneId: string) => {
    const index = milestones.findIndex(m => m.id === milestoneId)
    if (index > 0) {
      const newMilestones = [...milestones]
      const temp = newMilestones[index].order
      newMilestones[index].order = newMilestones[index - 1].order
      newMilestones[index - 1].order = temp
      setMilestones(newMilestones.sort((a, b) => a.order - b.order))
      toast.success('Milestone moved up!')
    }
  }

  const handleMoveDown = (milestoneId: string) => {
    const index = milestones.findIndex(m => m.id === milestoneId)
    if (index < milestones.length - 1) {
      const newMilestones = [...milestones]
      const temp = newMilestones[index].order
      newMilestones[index].order = newMilestones[index + 1].order
      newMilestones[index + 1].order = temp
      setMilestones(newMilestones.sort((a, b) => a.order - b.order))
      toast.success('Milestone moved down!')
    }
  }

  const MilestoneModal = ({ milestone, isOpen, onClose, onSave, isEdit }: {
    milestone: Milestone | null
    isOpen: boolean
    onClose: () => void
    onSave: (milestone: Milestone) => void
    isEdit: boolean
  }) => {
    const [formData, setFormData] = useState<Milestone>(
      milestone || {
        id: '',
        year: new Date().getFullYear().toString(),
        title: '',
        description: '',
        order: 0,
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
    )

    useEffect(() => {
      if (milestone) {
        setFormData(milestone)
      }
    }, [milestone])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Milestone' : 'Add New Milestone'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="2024"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-slate-700">
                  Show on timeline
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Milestone Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter milestone title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y"
                placeholder="Describe this milestone achievement..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isEdit ? 'Update Milestone' : 'Create Milestone'}
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
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-slate-900">Company Timeline</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your company's milestones and journey timeline
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <a
            href="/#timeline"
            target="_blank"
            className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Timeline
          </a>
          <button
            onClick={() => setShowAddMilestone(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Milestone
          </button>
        </div>
      </div>

      {/* Timeline Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Timeline Preview</h3>
        
        {milestones.length > 0 ? (
          <div className="space-y-6">
            {milestones.filter(m => m.isActive).map((milestone, index) => (
              <div key={milestone.id} className="flex items-start">
                {/* Timeline Line */}
                <div className="flex flex-col items-center mr-6">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white shadow-lg"></div>
                  {index < milestones.filter(m => m.isActive).length - 1 && (
                    <div className="w-px h-16 bg-slate-300 mt-2"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-2xl font-bold text-indigo-600 mb-2">{milestone.year}</div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">{milestone.title}</h4>
                        <p className="text-slate-600">{milestone.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={() => handleMoveUp(milestone.id)}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <ArrowUpIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(milestone.id)}
                          disabled={index === milestones.filter(m => m.isActive).length - 1}
                          className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <ArrowDownIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingMilestone(milestone)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit milestone"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleMilestone(milestone.id)}
                          className={`p-1 rounded transition-colors ${
                            milestone.isActive ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600'
                          }`}
                          title={milestone.isActive ? 'Hide from timeline' : 'Show on timeline'}
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete milestone"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h4 className="text-lg font-medium text-slate-900 mb-2">No milestones yet</h4>
            <p className="text-slate-500 mb-6">Create your first milestone to start building your company timeline.</p>
            <button
              onClick={() => setShowAddMilestone(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add First Milestone
            </button>
          </div>
        )}
      </div>

      {/* All Milestones Management */}
      {milestones.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">All Milestones</h3>
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  milestone.isActive 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-slate-200 bg-slate-50 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${milestone.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-indigo-600">{milestone.year}</span>
                      <span className="font-medium text-slate-900">{milestone.title}</span>
                      {!milestone.isActive && (
                        <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">Hidden</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingMilestone(milestone)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Edit milestone"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleMilestone(milestone.id)}
                    className={`p-2 rounded transition-colors ${
                      milestone.isActive ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={milestone.isActive ? 'Hide from timeline' : 'Show on timeline'}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete milestone"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <MilestoneModal
        milestone={editingMilestone}
        isOpen={!!editingMilestone}
        onClose={() => setEditingMilestone(null)}
        onSave={handleSaveMilestone}
        isEdit={true}
      />

      <MilestoneModal
        milestone={null}
        isOpen={showAddMilestone}
        onClose={() => setShowAddMilestone(false)}
        onSave={handleSaveMilestone}
        isEdit={false}
      />
    </div>
  )
}
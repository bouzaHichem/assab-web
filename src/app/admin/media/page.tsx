'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PhotoIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  DocumentIcon,
  FilmIcon,
  SpeakerWaveIcon,
  XMarkIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface MediaFile {
  id: string
  name: string
  originalName: string
  type: 'image' | 'video' | 'audio' | 'document'
  url: string
  size: number
  dimensions?: { width: number; height: number }
  duration?: number // for video/audio files
  createdAt: string
  updatedAt: string
  tags: string[]
  alt?: string
  description?: string
}

export default function MediaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchMedia()
    }
  }, [session])

  const fetchMedia = async () => {
    try {
      // Mock media data
      const mockMedia: MediaFile[] = [
        {
          id: '1',
          name: 'hero-background.jpg',
          originalName: 'company-hero-bg.jpg',
          type: 'image',
          url: '/images/hero-bg.jpg',
          size: 2048000,
          dimensions: { width: 1920, height: 1080 },
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          tags: ['hero', 'background', 'homepage'],
          alt: 'ASSAB company headquarters at sunset',
          description: 'Main hero background image for homepage'
        },
        {
          id: '2',
          name: 'fiber-optic-installation.mp4',
          originalName: 'project-fiber-install.mp4',
          type: 'video',
          url: '/videos/fiber-optic.mp4',
          size: 15360000,
          dimensions: { width: 1280, height: 720 },
          duration: 120,
          createdAt: '2024-01-14T15:30:00Z',
          updatedAt: '2024-01-14T15:30:00Z',
          tags: ['project', 'fiber-optic', 'installation'],
          description: 'Time-lapse of fiber optic cable installation project'
        },
        {
          id: '3',
          name: 'company-brochure.pdf',
          originalName: 'ASSAB-Services-Brochure-2024.pdf',
          type: 'document',
          url: '/documents/brochure.pdf',
          size: 5120000,
          createdAt: '2024-01-12T09:00:00Z',
          updatedAt: '2024-01-12T09:00:00Z',
          tags: ['brochure', 'marketing', 'services'],
          description: 'Company services brochure 2024 edition'
        },
        {
          id: '4',
          name: 'solar-panel-array.jpg',
          originalName: 'solar-installation-ouargla.jpg',
          type: 'image',
          url: '/images/solar-panels.jpg',
          size: 1536000,
          dimensions: { width: 1600, height: 900 },
          createdAt: '2024-01-10T14:20:00Z',
          updatedAt: '2024-01-10T14:20:00Z',
          tags: ['solar', 'energy', 'project', 'ouargla'],
          alt: 'Solar panel installation in Ouargla',
          description: 'Completed solar power installation project'
        },
        {
          id: '5',
          name: 'team-interview.mp3',
          originalName: 'ceo-interview-radio.mp3',
          type: 'audio',
          url: '/audio/ceo-interview.mp3',
          size: 8192000,
          duration: 1800,
          createdAt: '2024-01-08T11:45:00Z',
          updatedAt: '2024-01-08T11:45:00Z',
          tags: ['interview', 'ceo', 'radio'],
          description: 'CEO interview about company growth and future plans'
        },
        {
          id: '6',
          name: 'network-diagram.png',
          originalName: 'telecom-network-architecture.png',
          type: 'image',
          url: '/images/network-diagram.png',
          size: 768000,
          dimensions: { width: 1024, height: 768 },
          createdAt: '2024-01-05T16:10:00Z',
          updatedAt: '2024-01-05T16:10:00Z',
          tags: ['network', 'diagram', 'technical', 'telecom'],
          alt: 'Network architecture diagram',
          description: 'Technical diagram showing network infrastructure'
        }
      ]
      setMediaFiles(mockMedia)
    } catch (error) {
      toast.error('Failed to fetch media files')
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        // Mock upload - In real implementation, this would upload to your storage
        const newMediaFile: MediaFile = {
          id: Date.now().toString() + i,
          name: `uploaded-${file.name}`,
          originalName: file.name,
          type: file.type.startsWith('image/') ? 'image' :
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          url: URL.createObjectURL(file),
          size: file.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          description: `Uploaded file: ${file.name}`
        }

        setMediaFiles(prev => [newMediaFile, ...prev])
        toast.success(`${file.name} uploaded successfully!`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
        console.error('Upload error:', error)
      }
    }
  }

  const handleDeleteFiles = async (fileIds: string[]) => {
    if (!confirm(`Delete ${fileIds.length} file${fileIds.length > 1 ? 's' : ''}?`)) return

    try {
      setMediaFiles(prev => prev.filter(file => !fileIds.includes(file.id)))
      setSelectedFiles([])
      toast.success('Files deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete files')
      console.error('Delete error:', error)
    }
  }

  const handleUpdateFile = async (updatedFile: MediaFile) => {
    try {
      setMediaFiles(prev =>
        prev.map(file =>
          file.id === updatedFile.id
            ? { ...updatedFile, updatedAt: new Date().toISOString() }
            : file
        )
      )
      setEditingFile(null)
      toast.success('File updated successfully!')
    } catch (error) {
      toast.error('Failed to update file')
      console.error('Update error:', error)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTypeIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image':
        return <PhotoIcon className="w-5 h-5" />
      case 'video':
        return <FilmIcon className="w-5 h-5" />
      case 'audio':
        return <SpeakerWaveIcon className="w-5 h-5" />
      case 'document':
        return <DocumentIcon className="w-5 h-5" />
      default:
        return <DocumentIcon className="w-5 h-5" />
    }
  }

  const filteredAndSortedFiles = mediaFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase()) ||
                           file.originalName.toLowerCase().includes(search.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      const matchesType = !typeFilter || file.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'date':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const EditFileModal = ({ file, isOpen, onClose, onSave }: {
    file: MediaFile | null
    isOpen: boolean
    onClose: () => void
    onSave: (file: MediaFile) => void
  }) => {
    const [formData, setFormData] = useState<MediaFile>(
      file || {
        id: '', name: '', originalName: '', type: 'image', url: '', size: 0,
        createdAt: '', updatedAt: '', tags: [], description: ''
      }
    )

    useEffect(() => {
      if (file) {
        setFormData(file)
      }
    }, [file])

    if (!isOpen) return null

    const handleTagsChange = (tagsString: string) => {
      const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
      setFormData({ ...formData, tags })
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Edit Media File</h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                File Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {formData.type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt || ''}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Alt text for accessibility"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                placeholder="File description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tag1, tag2, tag3"
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
              Save Changes
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your images, videos, documents, and other media files
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={() => handleDeleteFiles(selectedFiles)}
              className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete ({selectedFiles.length})
            </button>
          )}
          <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
            <CloudArrowUpIcon className="w-4 h-4 mr-2" />
            Upload Files
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            />
          </label>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-')
              setSortBy(newSortBy as 'date' | 'name' | 'size')
              setSortOrder(newSortOrder as 'asc' | 'desc')
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>

          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600">
              {filteredAndSortedFiles.length} file{filteredAndSortedFiles.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredAndSortedFiles.map((file) => (
          <div
            key={file.id}
            className={`bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
              selectedFiles.includes(file.id) ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
            }`}
          >
            <div className="relative p-3">
              <div
                className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(prev => prev.filter(id => id !== file.id))
                  } else {
                    setSelectedFiles(prev => [...prev, file.id])
                  }
                }}
              >
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.alt || file.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-slate-400 text-2xl">
                    {getTypeIcon(file.type)}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xs font-medium text-slate-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{formatFileSize(file.size)}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="p-1 hover:text-indigo-600 transition-colors"
                      title="Copy URL"
                    >
                      <ClipboardDocumentIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingFile(file)}
                      className="p-1 hover:text-indigo-600 transition-colors"
                      title="Edit file"
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteFiles([file.id])}
                      className="p-1 hover:text-red-600 transition-colors"
                      title="Delete file"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {file.dimensions && (
                  <div className="text-xs text-slate-400">
                    {file.dimensions.width} × {file.dimensions.height}
                  </div>
                )}
                {file.duration && (
                  <div className="text-xs text-slate-400">
                    {formatDuration(file.duration)}
                  </div>
                )}
                {file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {file.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex px-1 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="text-xs text-slate-400">
                        +{file.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedFiles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <PhotoIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No files found</h3>
          <p className="text-slate-500 mb-4">
            {search || typeFilter ? 'Try adjusting your search or filters.' : 'Upload your first media file to get started.'}
          </p>
          {!search && !typeFilter && (
            <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
              <CloudArrowUpIcon className="w-4 h-4 mr-2" />
              Upload Files
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
            </label>
          )}
        </div>
      )}

      {/* Edit File Modal */}
      <EditFileModal
        file={editingFile}
        isOpen={!!editingFile}
        onClose={() => setEditingFile(null)}
        onSave={handleUpdateFile}
      />
    </div>
  )
}
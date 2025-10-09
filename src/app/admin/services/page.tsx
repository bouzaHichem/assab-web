'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CogIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Service {
  id: string
  name: string
  category: 'telecom' | 'energy' | 'engineering'
  description: string
  features: string[]
  benefits: string[]
  pricing: {
    type: 'fixed' | 'hourly' | 'project'
    amount: number
    currency: string
  }
  status: 'active' | 'inactive' | 'draft'
  icon: string
  image: string
  createdAt: string
  updatedAt: string
}

export default function ServicesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchServices()
    }
  }, [session])

  const fetchServices = async () => {
    try {
      // Mock services data
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Fiber Optic Network Installation',
          category: 'telecom',
          description: 'Complete fiber optic network design, installation, and maintenance services for telecommunications infrastructure.',
          features: ['High-speed connectivity', 'Scalable infrastructure', 'Future-proof technology', '24/7 monitoring'],
          benefits: ['99.9% uptime', 'Ultra-low latency', 'Unlimited bandwidth', 'Cost-effective'],
          pricing: { type: 'project', amount: 50000, currency: 'USD' },
          status: 'active',
          icon: '📡',
          image: '/images/services/fiber-optic.jpg',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z'
        },
        {
          id: '2',
          name: 'Solar Power System Installation',
          category: 'energy',
          description: 'Complete solar power system design, installation, and maintenance for residential and commercial applications.',
          features: ['Grid-tied systems', 'Battery storage', 'Smart monitoring', 'Maintenance included'],
          benefits: ['70% cost reduction', 'Zero emissions', 'Energy independence', '25-year warranty'],
          pricing: { type: 'fixed', amount: 15000, currency: 'USD' },
          status: 'active',
          icon: '☀️',
          image: '/images/services/solar-power.jpg',
          createdAt: '2024-01-10T09:00:00Z',
          updatedAt: '2024-01-18T14:20:00Z'
        },
        {
          id: '3',
          name: 'Smart City Integration',
          category: 'engineering',
          description: 'End-to-end smart city solutions including IoT sensors, traffic management, and urban infrastructure integration.',
          features: ['IoT sensor networks', 'Traffic optimization', 'Smart lighting', 'Data analytics'],
          benefits: ['30% energy savings', 'Improved traffic flow', 'Enhanced safety', 'Real-time insights'],
          pricing: { type: 'hourly', amount: 150, currency: 'USD' },
          status: 'active',
          icon: '🏙️',
          image: '/images/services/smart-city.jpg',
          createdAt: '2024-01-05T11:00:00Z',
          updatedAt: '2024-01-22T16:45:00Z'
        },
        {
          id: '4',
          name: '5G Tower Infrastructure',
          category: 'telecom',
          description: 'Complete 5G tower installation, optimization, and maintenance services for next-generation mobile networks.',
          features: ['5G technology', 'High capacity', 'Low latency', 'Network optimization'],
          benefits: ['10x faster speeds', '95% coverage', 'Enhanced capacity', 'Future-ready'],
          pricing: { type: 'project', amount: 75000, currency: 'USD' },
          status: 'draft',
          icon: '📶',
          image: '/images/services/5g-tower.jpg',
          createdAt: '2024-01-12T13:00:00Z',
          updatedAt: '2024-01-19T10:15:00Z'
        }
      ]
      setServices(mockServices)
    } catch (error) {
      toast.error('Failed to fetch services')
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveService = async (service: Service) => {
    try {
      if (editingService) {
        // Update existing service
        const updatedServices = services.map(s =>
          s.id === service.id ? { ...service, updatedAt: new Date().toISOString() } : s
        )
        setServices(updatedServices)
        toast.success('Service updated successfully!')
      } else {
        // Add new service
        const newService = {
          ...service,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setServices([...services, newService])
        toast.success('Service created successfully!')
      }
      setEditingService(null)
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to save service')
      console.error('Error saving service:', error)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const updatedServices = services.filter(s => s.id !== serviceId)
      setServices(updatedServices)
      toast.success('Service deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete service')
      console.error('Error deleting service:', error)
    }
  }

  const handleToggleStatus = async (serviceId: string) => {
    try {
      const updatedServices = services.map(service =>
        service.id === serviceId
          ? { ...service, status: (service.status === 'active' ? 'inactive' : 'active') as Service['status'] }
          : service
      )
      setServices(updatedServices)
      toast.success('Service status updated!')
    } catch (error) {
      toast.error('Failed to update service status')
      console.error('Error updating service status:', error)
    }
  }

  const getStatusColor = (status: Service['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: Service['category']) => {
    switch (category) {
      case 'telecom':
        return 'bg-blue-100 text-blue-800'
      case 'energy':
        return 'bg-green-100 text-green-800'
      case 'engineering':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
                         service.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !categoryFilter || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const ServiceModal = ({ service, isOpen, onClose, onSave }: {
    service: Service | null
    isOpen: boolean
    onClose: () => void
    onSave: (service: Service) => void
  }) => {
    const [formData, setFormData] = useState<Service>(
      service || {
        id: '',
        name: '',
        category: 'telecom',
        description: '',
        features: [''],
        benefits: [''],
        pricing: { type: 'project', amount: 0, currency: 'USD' },
        status: 'draft',
        icon: '🔧',
        image: '',
        createdAt: '',
        updatedAt: ''
      }
    )

    useEffect(() => {
      if (service) {
        setFormData(service)
      }
    }, [service])

    if (!isOpen) return null

    const addFeature = () => {
      setFormData({ ...formData, features: [...formData.features, ''] })
    }

    const removeFeature = (index: number) => {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index)
      })
    }

    const updateFeature = (index: number, value: string) => {
      const newFeatures = [...formData.features]
      newFeatures[index] = value
      setFormData({ ...formData, features: newFeatures })
    }

    const addBenefit = () => {
      setFormData({ ...formData, benefits: [...formData.benefits, ''] })
    }

    const removeBenefit = (index: number) => {
      setFormData({
        ...formData,
        benefits: formData.benefits.filter((_, i) => i !== index)
      })
    }

    const updateBenefit = (index: number, value: string) => {
      const newBenefits = [...formData.benefits]
      newBenefits[index] = value
      setFormData({ ...formData, benefits: newBenefits })
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Service['category'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="telecom">Telecommunications</option>
                  <option value="energy">Energy Systems</option>
                  <option value="engineering">Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                placeholder="Service description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Service icon (emoji)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Service['status'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Features
              </label>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Feature ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add Feature
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Benefits
              </label>
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`Benefit ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBenefit}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                + Add Benefit
              </button>
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
              {service ? 'Update Service' : 'Create Service'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-slate-900">Services Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your company's services and offerings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Categories</option>
            <option value="telecom">Telecommunications</option>
            <option value="energy">Energy Systems</option>
            <option value="engineering">Engineering</option>
          </select>
          <div className="flex items-center space-x-2">
            <BuildingOffice2Icon className="w-5 h-5 text-slate-400" />
            <span className="text-sm text-slate-600">
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{service.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 truncate">{service.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 line-clamp-3">{service.description}</p>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-slate-500">Features ({service.features.length})</div>
              <div className="text-xs text-slate-500">Benefits ({service.benefits.length})</div>
              <div className="text-xs text-slate-500">
                Pricing: {service.pricing.type} - {service.pricing.currency} {service.pricing.amount}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Updated: {new Date(service.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleToggleStatus(service.id)}
                  className={`p-1 rounded transition-colors ${
                    service.status === 'active' 
                      ? 'text-green-600 hover:text-green-700' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={service.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingService(service)}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Edit service"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete service"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <CogIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">No services found</h3>
          <p className="text-slate-500 mb-4">
            {search || categoryFilter ? 'Try adjusting your search or filters.' : 'Get started by adding your first service.'}
          </p>
          {!search && !categoryFilter && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Service
            </button>
          )}
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        service={editingService}
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        onSave={handleSaveService}
      />

      <ServiceModal
        service={null}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveService}
      />
    </div>
  )
}
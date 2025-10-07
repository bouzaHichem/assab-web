'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Bars3Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  LinkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface NavigationItem {
  id: string
  name: string
  href: string
  order: number
  isActive: boolean
  hasDropdown: boolean
  dropdownItems?: {
    id: string
    name: string
    href: string
    order: number
  }[]
}

export default function NavigationManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchNavigation()
    }
  }, [session])

  const fetchNavigation = async () => {
    try {
      // Mock navigation data - In real implementation, this would fetch from your API
      const mockNavigation: NavigationItem[] = [
        {
          id: '1',
          name: 'Home',
          href: '#home',
          order: 1,
          isActive: true,
          hasDropdown: false
        },
        {
          id: '2',
          name: 'About',
          href: '#about',
          order: 2,
          isActive: true,
          hasDropdown: false
        },
        {
          id: '3',
          name: 'Solutions',
          href: '#solutions',
          order: 3,
          isActive: true,
          hasDropdown: true,
          dropdownItems: [
            { id: '3a', name: 'Telecom Infrastructure', href: '#telecom', order: 1 },
            { id: '3b', name: 'Energy Systems', href: '#energy', order: 2 },
            { id: '3c', name: 'Engineering Integration', href: '#engineering', order: 3 }
          ]
        },
        {
          id: '4',
          name: 'Industries',
          href: '#industries',
          order: 4,
          isActive: true,
          hasDropdown: false
        },
        {
          id: '5',
          name: 'Projects',
          href: '#projects',
          order: 5,
          isActive: true,
          hasDropdown: false
        },
        {
          id: '6',
          name: 'Team',
          href: '#team',
          order: 6,
          isActive: false,
          hasDropdown: false
        },
        {
          id: '7',
          name: 'Contact',
          href: '#contact',
          order: 7,
          isActive: true,
          hasDropdown: false
        }
      ]

      setNavigationItems(mockNavigation.sort((a, b) => a.order - b.order))
    } catch (error) {
      toast.error('Failed to fetch navigation')
      console.error('Error fetching navigation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async (item: NavigationItem) => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItems = navigationItems.map(navItem =>
          navItem.id === item.id ? item : navItem
        )
        setNavigationItems(updatedItems)
        toast.success('Navigation item updated successfully!')
      } else {
        // Add new item
        const newItem = {
          ...item,
          id: Date.now().toString(),
          order: navigationItems.length + 1
        }
        setNavigationItems([...navigationItems, newItem].sort((a, b) => a.order - b.order))
        toast.success('Navigation item added successfully!')
      }
      setEditingItem(null)
      setShowAddModal(false)
    } catch (error) {
      toast.error('Failed to save navigation item')
      console.error('Error saving navigation item:', error)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) {
      return
    }

    try {
      const updatedItems = navigationItems.filter(item => item.id !== itemId)
      setNavigationItems(updatedItems)
      toast.success('Navigation item deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete navigation item')
      console.error('Error deleting navigation item:', error)
    }
  }

  const handleToggleActive = async (itemId: string) => {
    try {
      const updatedItems = navigationItems.map(item =>
        item.id === itemId ? { ...item, isActive: !item.isActive } : item
      )
      setNavigationItems(updatedItems)
      toast.success('Navigation item updated!')
    } catch (error) {
      toast.error('Failed to update navigation item')
      console.error('Error updating navigation item:', error)
    }
  }

  const handleReorder = async (itemId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = navigationItems.findIndex(item => item.id === itemId)
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === navigationItems.length - 1)
      ) {
        return
      }

      const newItems = [...navigationItems]
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      // Swap items
      const temp = newItems[currentIndex]
      newItems[currentIndex] = newItems[targetIndex]
      newItems[targetIndex] = temp
      
      // Update order numbers
      newItems.forEach((item, index) => {
        item.order = index + 1
      })

      setNavigationItems(newItems)
      toast.success('Navigation order updated!')
    } catch (error) {
      toast.error('Failed to reorder navigation')
      console.error('Error reordering navigation:', error)
    }
  }

  const NavigationItemModal = ({ 
    item, 
    isOpen, 
    onClose, 
    onSave 
  }: { 
    item: NavigationItem | null
    isOpen: boolean
    onClose: () => void
    onSave: (item: NavigationItem) => void 
  }) => {
    const [formData, setFormData] = useState<NavigationItem>(
      item || {
        id: '',
        name: '',
        href: '',
        order: navigationItems.length + 1,
        isActive: true,
        hasDropdown: false,
        dropdownItems: []
      }
    )

    useEffect(() => {
      if (item) {
        setFormData(item)
      }
    }, [item])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {item ? 'Edit' : 'Add'} Navigation Item
            </h2>
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
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Navigation item name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link (href)
              </label>
              <input
                type="text"
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="#section or /page-url"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-slate-700">Active</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasDropdown}
                  onChange={(e) => setFormData({ ...formData, hasDropdown: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-slate-700">Has Dropdown</span>
              </label>
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
              {item ? 'Update' : 'Add'} Item
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
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-slate-900">Navigation Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage website navigation menu items and their order
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Live Navigation
          </a>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Navigation Item
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Bars3Icon className="w-5 h-5 mr-2" />
            Navigation Items
          </h3>
        </div>

        <div className="divide-y divide-slate-200">
          {navigationItems.map((item, index) => (
            <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-slate-500 font-mono">
                    #{item.order}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <div className="font-medium text-slate-900 flex items-center">
                        {item.name}
                        {item.hasDropdown && (
                          <ChevronDownIcon className="w-4 h-4 ml-1 text-slate-400" />
                        )}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        {item.href}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Reorder buttons */}
                  <button
                    onClick={() => handleReorder(item.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(item.id, 'down')}
                    disabled={index === navigationItems.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>

                  {/* Toggle active */}
                  <button
                    onClick={() => handleToggleActive(item.id)}
                    className={`p-1 transition-colors ${
                      item.isActive 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title={item.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Edit item"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete item"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dropdown items */}
              {item.hasDropdown && item.dropdownItems && item.dropdownItems.length > 0 && (
                <div className="mt-4 ml-8 pl-4 border-l-2 border-slate-200">
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                    Dropdown Items
                  </div>
                  <div className="space-y-2">
                    {item.dropdownItems.map((dropdownItem) => (
                      <div key={dropdownItem.id} className="flex items-center text-sm text-slate-600">
                        <LinkIcon className="w-3 h-3 mr-2" />
                        {dropdownItem.name} → {dropdownItem.href}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {navigationItems.length === 0 && (
          <div className="text-center py-12">
            <Bars3Icon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">No navigation items</h3>
            <p className="text-slate-500 mb-4">Get started by adding your first navigation item.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Navigation Item
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <NavigationItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
      />

      <NavigationItemModal
        item={null}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveItem}
      />
    </div>
  )
}
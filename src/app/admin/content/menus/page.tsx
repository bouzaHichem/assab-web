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
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface MenuItem {
  id: string
  title: {
    en: string
    fr: string
    ar: string
  }
  slug: string
  url?: string
  target: '_self' | '_blank'
  isActive: boolean
  order: number
  parentId?: string
  children?: MenuItem[]
  type: 'page' | 'custom' | 'external'
}

interface Menu {
  id: string
  name: string
  slug: string
  location: 'header' | 'footer' | 'sidebar'
  isActive: boolean
  items: MenuItem[]
  createdAt: string
  updatedAt: string
}

export default function MenusPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddMenuItem, setShowAddMenuItem] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchMenus()
    }
  }, [session])

  const fetchMenus = async () => {
    try {
      // Mock menus data
      const mockMenus: Menu[] = [
        {
          id: '1',
          name: 'Main Navigation',
          slug: 'main-nav',
          location: 'header',
          isActive: true,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-15T14:30:00Z',
          items: [
            {
              id: '1-1',
              title: { en: 'Home', fr: 'Accueil', ar: 'الرئيسية' },
              slug: 'home',
              url: '/',
              target: '_self',
              isActive: true,
              order: 1,
              type: 'page'
            },
            {
              id: '1-2',
              title: { en: 'About', fr: 'À Propos', ar: 'حول' },
              slug: 'about',
              url: '/about',
              target: '_self',
              isActive: true,
              order: 2,
              type: 'page'
            },
            {
              id: '1-3',
              title: { en: 'Services', fr: 'Services', ar: 'الخدمات' },
              slug: 'services',
              url: '/services',
              target: '_self',
              isActive: true,
              order: 3,
              type: 'page',
              children: [
                {
                  id: '1-3-1',
                  title: { en: 'Telecom Infrastructure', fr: 'Infrastructure Télécom', ar: 'البنية التحتية للاتصالات' },
                  slug: 'telecom',
                  url: '/services/telecom',
                  target: '_self',
                  isActive: true,
                  order: 1,
                  parentId: '1-3',
                  type: 'page'
                },
                {
                  id: '1-3-2',
                  title: { en: 'Energy Solutions', fr: 'Solutions Énergétiques', ar: 'حلول الطاقة' },
                  slug: 'energy',
                  url: '/services/energy',
                  target: '_self',
                  isActive: true,
                  order: 2,
                  parentId: '1-3',
                  type: 'page'
                }
              ]
            },
            {
              id: '1-4',
              title: { en: 'Projects', fr: 'Projets', ar: 'المشاريع' },
              slug: 'projects',
              url: '/projects',
              target: '_self',
              isActive: true,
              order: 4,
              type: 'page'
            },
            {
              id: '1-5',
              title: { en: 'Contact', fr: 'Contact', ar: 'اتصل بنا' },
              slug: 'contact',
              url: '/contact',
              target: '_self',
              isActive: true,
              order: 5,
              type: 'page'
            }
          ]
        },
        {
          id: '2',
          name: 'Footer Navigation',
          slug: 'footer-nav',
          location: 'footer',
          isActive: true,
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-12T16:20:00Z',
          items: [
            {
              id: '2-1',
              title: { en: 'Privacy Policy', fr: 'Politique de Confidentialité', ar: 'سياسة الخصوصية' },
              slug: 'privacy',
              url: '/privacy',
              target: '_self',
              isActive: true,
              order: 1,
              type: 'page'
            },
            {
              id: '2-2',
              title: { en: 'Terms of Service', fr: 'Conditions d\'Utilisation', ar: 'شروط الخدمة' },
              slug: 'terms',
              url: '/terms',
              target: '_self',
              isActive: true,
              order: 2,
              type: 'page'
            },
            {
              id: '2-3',
              title: { en: 'LinkedIn', fr: 'LinkedIn', ar: 'لينكدإن' },
              slug: 'linkedin',
              url: 'https://linkedin.com/company/assab',
              target: '_blank',
              isActive: true,
              order: 3,
              type: 'external'
            }
          ]
        }
      ]
      setMenus(mockMenus)
      if (mockMenus.length > 0) {
        setSelectedMenu(mockMenus[0])
      }
    } catch (error) {
      toast.error('Failed to fetch menus')
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMenu = async (menu: Menu) => {
    try {
      if (editingMenu) {
        // Update existing menu
        const updatedMenus = menus.map(m =>
          m.id === menu.id ? { ...menu, updatedAt: new Date().toISOString() } : m
        )
        setMenus(updatedMenus)
        toast.success('Menu updated successfully!')
      } else {
        // Add new menu
        const newMenu = {
          ...menu,
          id: Date.now().toString(),
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setMenus([...menus, newMenu])
        toast.success('Menu created successfully!')
      }
      setEditingMenu(null)
      setShowAddMenu(false)
    } catch (error) {
      toast.error('Failed to save menu')
      console.error('Error saving menu:', error)
    }
  }

  const handleDeleteMenu = async (menuId: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return

    try {
      const updatedMenus = menus.filter(m => m.id !== menuId)
      setMenus(updatedMenus)
      if (selectedMenu?.id === menuId) {
        setSelectedMenu(updatedMenus.length > 0 ? updatedMenus[0] : null)
      }
      toast.success('Menu deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete menu')
      console.error('Error deleting menu:', error)
    }
  }

  const handleSaveMenuItem = async (menuItem: MenuItem) => {
    if (!selectedMenu) return

    try {
      const updatedMenu = { ...selectedMenu }
      
      if (editingMenuItem) {
        // Update existing item
        const updateItemInArray = (items: MenuItem[]): MenuItem[] => {
          return items.map(item => {
            if (item.id === menuItem.id) {
              return menuItem
            }
            if (item.children) {
              return { ...item, children: updateItemInArray(item.children) }
            }
            return item
          })
        }
        updatedMenu.items = updateItemInArray(updatedMenu.items)
      } else {
        // Add new item
        const newItem = {
          ...menuItem,
          id: Date.now().toString(),
          order: updatedMenu.items.length + 1
        }
        updatedMenu.items = [...updatedMenu.items, newItem]
      }

      updatedMenu.updatedAt = new Date().toISOString()
      
      setMenus(prev => prev.map(m => m.id === selectedMenu.id ? updatedMenu : m))
      setSelectedMenu(updatedMenu)
      setEditingMenuItem(null)
      setShowAddMenuItem(false)
      toast.success('Menu item saved successfully!')
    } catch (error) {
      toast.error('Failed to save menu item')
      console.error('Error saving menu item:', error)
    }
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!selectedMenu || !confirm('Are you sure you want to delete this menu item?')) return

    try {
      const updatedMenu = { ...selectedMenu }
      const filterItems = (items: MenuItem[]): MenuItem[] => {
        return items.filter(item => item.id !== itemId).map(item => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined
        }))
      }
      
      updatedMenu.items = filterItems(updatedMenu.items)
      updatedMenu.updatedAt = new Date().toISOString()

      setMenus(prev => prev.map(m => m.id === selectedMenu.id ? updatedMenu : m))
      setSelectedMenu(updatedMenu)
      toast.success('Menu item deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete menu item')
      console.error('Error deleting menu item:', error)
    }
  }

  const handleToggleMenuItem = async (itemId: string) => {
    if (!selectedMenu) return

    try {
      const updatedMenu = { ...selectedMenu }
      const toggleItem = (items: MenuItem[]): MenuItem[] => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, isActive: !item.isActive }
          }
          if (item.children) {
            return { ...item, children: toggleItem(item.children) }
          }
          return item
        })
      }

      updatedMenu.items = toggleItem(updatedMenu.items)
      updatedMenu.updatedAt = new Date().toISOString()

      setMenus(prev => prev.map(m => m.id === selectedMenu.id ? updatedMenu : m))
      setSelectedMenu(updatedMenu)
      toast.success('Menu item updated!')
    } catch (error) {
      toast.error('Failed to update menu item')
      console.error('Error updating menu item:', error)
    }
  }

  const MenuModal = ({ menu, isOpen, onClose, onSave, isEdit }: {
    menu: Menu | null
    isOpen: boolean
    onClose: () => void
    onSave: (menu: Menu) => void
    isEdit: boolean
  }) => {
    const [formData, setFormData] = useState<Menu>(
      menu || {
        id: '',
        name: '',
        slug: '',
        location: 'header',
        isActive: true,
        items: [],
        createdAt: '',
        updatedAt: ''
      }
    )

    useEffect(() => {
      if (menu) {
        setFormData(menu)
      }
    }, [menu])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Menu' : 'Create New Menu'}
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
                Menu Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter menu name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="menu-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value as Menu['location'] })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="sidebar">Sidebar</option>
              </select>
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
                Active
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
              {isEdit ? 'Update Menu' : 'Create Menu'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const MenuItemModal = ({ menuItem, isOpen, onClose, onSave, isEdit }: {
    menuItem: MenuItem | null
    isOpen: boolean
    onClose: () => void
    onSave: (menuItem: MenuItem) => void
    isEdit: boolean
  }) => {
    const [formData, setFormData] = useState<MenuItem>(
      menuItem || {
        id: '',
        title: { en: '', fr: '', ar: '' },
        slug: '',
        url: '',
        target: '_self',
        isActive: true,
        order: 0,
        type: 'page'
      }
    )

    useEffect(() => {
      if (menuItem) {
        setFormData(menuItem)
      }
    }, [menuItem])

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="English title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title (French)
                </label>
                <input
                  type="text"
                  value={formData.title.fr}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, fr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="French title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title (Arabic)
                </label>
                <input
                  type="text"
                  value={formData.title.ar}
                  onChange={(e) => setFormData({
                    ...formData,
                    title: { ...formData.title, ar: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Arabic title"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="item-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL
                </label>
                <input
                  type="text"
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="/page-url or https://external.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as MenuItem['type'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="page">Page</option>
                  <option value="custom">Custom</option>
                  <option value="external">External</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Target
                </label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value as MenuItem['target'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="_self">Same Window</option>
                  <option value="_blank">New Window</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="menuItemActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="menuItemActive" className="ml-2 text-sm text-slate-700">
                  Active
                </label>
              </div>
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
              {isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    return (
      <div key={item.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-slate-200 pl-4' : ''}`}>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-2">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div>
              <div className="font-medium text-slate-900">{item.title.en}</div>
              <div className="text-sm text-slate-500">{item.url}</div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleToggleMenuItem(item.id)}
              className={`p-1 rounded transition-colors ${
                item.isActive ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={item.isActive ? 'Deactivate' : 'Activate'}
            >
              <CheckIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditingMenuItem(item)}
              className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Edit item"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteMenuItem(item.id)}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              title="Delete item"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {item.children?.map(child => renderMenuItem(child, depth + 1))}
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Menu Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and manage navigation menus for your website
          </p>
        </div>
        <button
          onClick={() => setShowAddMenu(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Menu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menus List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Menus</h3>
          {menus.map((menu) => (
            <div
              key={menu.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedMenu?.id === menu.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSelectedMenu(menu)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">{menu.name}</h4>
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full ${menu.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingMenu(menu)
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Edit menu"
                  >
                    <PencilIcon className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteMenu(menu.id)
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete menu"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-sm text-slate-500 capitalize">{menu.location}</div>
              <div className="text-xs text-slate-400 mt-1">{menu.items.length} items</div>
            </div>
          ))}

          {menus.length === 0 && (
            <div className="text-center py-8">
              <Bars3Icon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No menus created yet.</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2">
          {selectedMenu ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedMenu.name}</h3>
                  <p className="text-sm text-slate-500 capitalize">{selectedMenu.location} menu</p>
                </div>
                <button
                  onClick={() => setShowAddMenuItem(true)}
                  className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Item
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                {selectedMenu.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMenu.items.map(item => renderMenuItem(item))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LinkIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h4 className="text-lg font-medium text-slate-900 mb-2">No menu items</h4>
                    <p className="text-slate-500 mb-4">Add your first menu item to get started.</p>
                    <button
                      onClick={() => setShowAddMenuItem(true)}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Bars3Icon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">Select a Menu</h4>
              <p className="text-slate-500">Choose a menu from the left to view and manage its items.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MenuModal
        menu={editingMenu}
        isOpen={!!editingMenu}
        onClose={() => setEditingMenu(null)}
        onSave={handleSaveMenu}
        isEdit={true}
      />

      <MenuModal
        menu={null}
        isOpen={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onSave={handleSaveMenu}
        isEdit={false}
      />

      <MenuItemModal
        menuItem={editingMenuItem}
        isOpen={!!editingMenuItem}
        onClose={() => setEditingMenuItem(null)}
        onSave={handleSaveMenuItem}
        isEdit={true}
      />

      <MenuItemModal
        menuItem={null}
        isOpen={showAddMenuItem}
        onClose={() => setShowAddMenuItem(false)}
        onSave={handleSaveMenuItem}
        isEdit={false}
      />
    </div>
  )
}
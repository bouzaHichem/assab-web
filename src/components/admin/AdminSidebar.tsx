'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon,
  DocumentTextIcon,
  CogIcon,
  PhotoIcon,
  ChartBarIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ListBulletIcon,
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { hasRole } from '@/lib/auth'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  requiredRole?: string
  children?: NavigationItem[]
  badge?: number
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Content',
    href: '/admin/content',
    icon: DocumentTextIcon,
    requiredRole: 'EDITOR',
    children: [
      { name: 'Website Content', href: '/admin/content-management', icon: DocumentTextIcon },
      { name: 'Timeline', href: '/admin/content/timeline', icon: ClockIcon },
      { name: 'Navigation', href: '/admin/navigation', icon: ListBulletIcon },
      { name: 'Pages', href: '/admin/content/pages', icon: DocumentTextIcon },
      { name: 'Menus', href: '/admin/content/menus', icon: ListBulletIcon },
    ]
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: BuildingOfficeIcon,
    requiredRole: 'EDITOR',
  },
  {
    name: 'Media',
    href: '/admin/media',
    icon: PhotoIcon,
    requiredRole: 'EDITOR',
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Leads',
    href: '/admin/leads',
    icon: EnvelopeIcon,
    badge: 3
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon,
    requiredRole: 'ADMIN',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: CogIcon,
    requiredRole: 'ADMIN',
  },
]

export default function AdminSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Content'])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href))
  }

  const canAccessItem = (item: NavigationItem) => {
    if (!item.requiredRole) return true
    return session?.user?.role && hasRole(session.user.role, item.requiredRole)
  }

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    if (!canAccessItem(item)) return null

    const active = isActive(item.href)
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.name)

    if (hasChildren) {
      return (
        <div key={item.name} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`${
              active
                ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            } group flex w-full items-center rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-150`}
          >
            <item.icon
              className={`${
                active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
              } mr-3 h-4 w-4 flex-shrink-0`}
              aria-hidden="true"
            />
            <span className="flex-1 text-left">{item.name}</span>
            <ChevronRightIcon
              className={`${
                isExpanded ? 'rotate-90' : ''
              } ml-2 h-3.5 w-3.5 transition-transform duration-200 text-slate-400`}
            />
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
              {item.children?.map((child) => renderNavigationItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`${
          active
            ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        } ${isChild ? 'py-2 px-3' : 'py-2.5 px-3'} group flex items-center rounded-lg text-sm font-medium transition-all duration-150 mb-1 relative`}
      >
        <item.icon
          className={`${
            active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
          } mr-3 h-4 w-4 flex-shrink-0`}
          aria-hidden="true"
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-50 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-slate-900 bg-opacity-75 backdrop-blur-sm transition-opacity ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transition transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-6 pb-4 overflow-y-auto">
            {/* Mobile Logo */}
            <div className="flex-shrink-0 flex items-center px-6 mb-8">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-slate-900">ASSAB</span>
                <p className="text-sm text-slate-500">Admin Panel</p>
              </div>
            </div>
            <nav className="px-4 space-y-2">
              {navigation.map((item) => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            {/* Desktop Logo */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-slate-900">ASSAB</span>
                <p className="text-sm text-slate-500">Admin Panel</p>
              </div>
            </div>
            
            {/* User Info Card */}
            <div className="mx-4 mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                  <span className="text-slate-600 text-sm font-medium">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {session?.user?.role?.toLowerCase() || 'viewer'}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => renderNavigationItem(item))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
          <button
            type="button"
            className="-ml-1 -mt-1 h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex items-center">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="ml-2 font-semibold text-slate-900">ASSAB Admin</span>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </div>
    </>
  )
}
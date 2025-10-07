'use client'

import { useState, Fragment } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, Transition } from '@headlessui/react'
import { BellIcon, ChevronDownIcon, UserIcon, CogIcon, EyeIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

export default function AdminHeader() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [notifications] = useState([
    { id: 1, message: 'New contact form submission', time: '2 minutes ago', type: 'lead' },
    { id: 2, message: 'Website backup completed', time: '1 hour ago', type: 'system' },
    { id: 3, message: 'New user registration', time: '3 hours ago', type: 'user' },
  ])

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length <= 2) return 'Dashboard'
    
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'content': 'Content Management',
      'pages': 'Pages',
      'menus': 'Menu Management', 
      'services': 'Services',
      'media': 'Media Library',
      'analytics': 'Analytics',
      'leads': 'Lead Management',
      'users': 'User Management',
      'settings': 'Settings'
    }
    
    return titles[pathSegments[pathSegments.length - 1]] || 'Admin Panel'
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  if (status === 'loading') {
    return (
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1" />
          <div className="ml-4 flex items-center md:ml-6 space-x-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/80 px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Left side - Page title and breadcrumbs */}
        <div className="flex-1 flex items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 hidden sm:block">
              {getPageTitle()}
            </h1>
            <div className="flex items-center space-x-1 text-sm text-slate-500 mt-0.5 hidden sm:flex">
              <span>Admin</span>
              <span>/</span>
              <span className="text-slate-700 font-medium">{getPageTitle()}</span>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-4 flex items-center space-x-2">
          {/* Quick Actions */}
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="hidden md:inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <EyeIcon className="-ml-0.5 mr-2 h-4 w-4 text-slate-500" />
            View Site
          </button>

          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" aria-hidden="true" />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
                  {notifications.length}
                </span>
              )}
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-slate-200 focus:outline-none overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    <span className="text-xs text-slate-500">{notifications.length} new</span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={`${
                              active ? 'bg-slate-50' : ''
                            } px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'lead' ? 'bg-green-500' :
                                notification.type === 'system' ? 'bg-blue-500' :
                                'bg-yellow-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 font-medium">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">
                      <BellIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                  <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    View all notifications
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* User menu */}
          <Menu as="div" className="relative ml-2">
            <div>
              <Menu.Button className="flex items-center p-1.5 rounded-lg bg-white hover:bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
                <span className="sr-only">Open user menu</span>
                <div className="flex items-center space-x-3">
                  {session?.user?.avatar ? (
                    <Image
                      className="h-8 w-8 rounded-lg object-cover"
                      src={session.user.avatar}
                      alt="User avatar"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-slate-700">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {session?.user?.role?.toLowerCase() || 'viewer'}
                    </p>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-slate-400 hidden lg:block" />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-slate-200 focus:outline-none overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500">{session?.user?.email}</p>
                </div>
                
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/admin/profile"
                        className={`${
                          active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
                        } block px-4 py-2 text-sm hover:bg-slate-50 transition-colors`}
                      >
                        <UserIcon className="w-4 h-4 inline-block mr-3 text-slate-400" />
                        Your Profile
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/admin/settings"
                        className={`${
                          active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
                        } block px-4 py-2 text-sm hover:bg-slate-50 transition-colors`}
                      >
                        <CogIcon className="w-4 h-4 inline-block mr-3 text-slate-400" />
                        Settings
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/"
                        target="_blank"
                        className={`${
                          active ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
                        } block px-4 py-2 text-sm hover:bg-slate-50 transition-colors`}
                      >
                        <EyeIcon className="w-4 h-4 inline-block mr-3 text-slate-400" />
                        View Website
                      </a>
                    )}
                  </Menu.Item>
                </div>
                
                <div className="border-t border-slate-200 py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-red-50 text-red-700' : 'text-red-600'
                        } block w-full text-left px-4 py-2 text-sm hover:bg-red-50 transition-colors`}
                      >
                        <ArrowLeftOnRectangleIcon className="w-4 h-4 inline-block mr-3" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
}

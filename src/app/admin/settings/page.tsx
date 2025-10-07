'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  CogIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Settings {
  [group: string]: Array<{
    id: string
    key: string
    value: any
    type: string
    label: {
      en: string
      fr: string
      ar: string
    }
    description?: {
      en: string
      fr: string
      ar: string
    }
  }>
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState<{[key: string]: any}>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchSettings()
    }
  }, [session])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        
        // Initialize form data
        const initialFormData: {[key: string]: any} = {}
        Object.values(data.settings).flat().forEach((setting: any) => {
          initialFormData[setting.key] = setting.value
        })
        setFormData(initialFormData)
      } else {
        toast.error('Failed to fetch settings')
      }
    } catch (error) {
      toast.error('Error fetching settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: formData })
      })

      if (response.ok) {
        toast.success('Settings saved successfully')
        fetchSettings() // Refresh settings
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'contact', label: 'Contact', icon: PhoneIcon },
    { id: 'company', label: 'Company', icon: BuildingOfficeIcon },
    { id: 'social', label: 'Social Media', icon: GlobeAltIcon }
  ]

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure your website settings and preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const hasSettings = settings[tab.id] && settings[tab.id].length > 0
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } ${!hasSettings ? 'opacity-50' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {settings[activeTab] && settings[activeTab].length > 0 ? (
            <div className="space-y-6">
              {settings[activeTab].map((setting) => (
                <div key={setting.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {setting.label.en}
                    {setting.description && (
                      <span className="block text-xs text-slate-500 font-normal mt-1">
                        {setting.description.en}
                      </span>
                    )}
                  </label>
                  
                  {setting.type === 'TEXT' && (
                    <input
                      type="text"
                      value={formData[setting.key] || ''}
                      onChange={(e) => updateFormData(setting.key, e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}

                  {setting.type === 'TEXTAREA' && (
                    <textarea
                      value={formData[setting.key] || ''}
                      onChange={(e) => updateFormData(setting.key, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}

                  {setting.type === 'BOOLEAN' && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData[setting.key] || false}
                        onChange={(e) => updateFormData(setting.key, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                      <label className="ml-2 text-sm text-slate-700">
                        Enable this feature
                      </label>
                    </div>
                  )}

                  {setting.type === 'NUMBER' && (
                    <input
                      type="number"
                      value={formData[setting.key] || ''}
                      onChange={(e) => updateFormData(setting.key, parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <CogIcon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No settings available</h3>
              <p className="text-slate-500">
                Settings for this category will appear here when configured.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-slate-900">Company Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData['site_name'] || 'ASSAB'}
                onChange={(e) => updateFormData('site_name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData['site_description'] || 'Telecom & Energy Solutions'}
                onChange={(e) => updateFormData('site_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-slate-900">Contact Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData['contact_email'] || 'contact@assab.com'}
                onChange={(e) => updateFormData('contact_email', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData['contact_phone'] || '+213 xxx xxx xxx'}
                onChange={(e) => updateFormData('contact_phone', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-slate-900">Website Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Homepage Title
              </label>
              <input
                type="text"
                value={formData['homepage_title'] || 'Welcome to ASSAB'}
                onChange={(e) => updateFormData('homepage_title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Meta Description
              </label>
              <textarea
                value={formData['meta_description'] || 'Professional telecom and energy solutions'}
                onChange={(e) => updateFormData('meta_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex justify-end pt-6 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving Changes...
            </>
          ) : (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Save All Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}
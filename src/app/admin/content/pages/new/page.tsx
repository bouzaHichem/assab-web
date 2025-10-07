'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  EyeIcon,
  DocumentIcon,
  GlobeAltIcon,
  TagIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function NewPagePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [activeLanguage, setActiveLanguage] = useState('en')

  const [formData, setFormData] = useState({
    slug: '',
    title: {
      en: '',
      fr: '',
      ar: ''
    },
    content: {
      en: '',
      fr: '',
      ar: ''
    },
    excerpt: {
      en: '',
      fr: '',
      ar: ''
    },
    metaTitle: {
      en: '',
      fr: '',
      ar: ''
    },
    metaDesc: {
      en: '',
      fr: '',
      ar: ''
    },
    status: 'DRAFT'
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      title: { ...prev.title, [lang]: value }
    }))

    // Auto-generate slug from English title
    if (lang === 'en' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('Page created successfully')
        router.push('/admin/content/pages')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create page')
      }
    } catch (error) {
      toast.error('Error creating page')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'content', label: 'Content', icon: DocumentIcon },
    { id: 'seo', label: 'SEO', icon: GlobeAltIcon }
  ]

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/content/pages"
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Page</h1>
            <p className="text-sm text-slate-600">Create a new page for your website</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              formData.status === 'DRAFT'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, status: 'PUBLISHED' }))}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              formData.status === 'PUBLISHED'
                ? 'bg-green-100 text-green-800'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Publish
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Page Slug (URL)
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm rounded-l-lg">
                    /
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="page-url"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  URL-friendly version of the page title
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Language Selector */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">Language:</span>
              <div className="flex space-x-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActiveLanguage(lang.code)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeLanguage === lang.code
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title ({languages.find(l => l.code === activeLanguage)?.label})
                  </label>
                  <input
                    type="text"
                    value={formData.title[activeLanguage as keyof typeof formData.title]}
                    onChange={(e) => handleTitleChange(activeLanguage, e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                    placeholder="Enter page title..."
                    required={activeLanguage === 'en'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Excerpt ({languages.find(l => l.code === activeLanguage)?.label})
                  </label>
                  <textarea
                    value={formData.excerpt[activeLanguage as keyof typeof formData.excerpt]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excerpt: { ...prev.excerpt, [activeLanguage]: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description of the page..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content ({languages.find(l => l.code === activeLanguage)?.label})
                  </label>
                  <textarea
                    value={formData.content[activeLanguage as keyof typeof formData.content]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, [activeLanguage]: e.target.value }
                    }))}
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                    placeholder="Enter your content here... (HTML supported)"
                    required={activeLanguage === 'en'}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    HTML tags are supported. Use proper HTML structure for best results.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meta Title ({languages.find(l => l.code === activeLanguage)?.label})
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle[activeLanguage as keyof typeof formData.metaTitle]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metaTitle: { ...prev.metaTitle, [activeLanguage]: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="SEO title for search engines..."
                    maxLength={60}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Recommended: 50-60 characters. Leave empty to use page title.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Meta Description ({languages.find(l => l.code === activeLanguage)?.label})
                  </label>
                  <textarea
                    value={formData.metaDesc[activeLanguage as keyof typeof formData.metaDesc]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metaDesc: { ...prev.metaDesc, [activeLanguage]: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description for search engines..."
                    maxLength={160}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Recommended: 150-160 characters. This appears in search results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Link
            href="/admin/content/pages"
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Create Page
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
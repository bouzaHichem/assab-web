'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EyeIcon,
  XMarkIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline'

interface ContentSection {
  id: string
  name: string
  fields: {
    id: string
    type: 'text' | 'textarea' | 'image' | 'array' | 'object'
    label: string
    value: any
  }[]
}

interface ContentPreviewProps {
  section: ContentSection
  isOpen: boolean
  onClose: () => void
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

export default function ContentPreview({ section, isOpen, onClose }: ContentPreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Generate preview content based on section data
  const generatePreviewContent = () => {
    const fields = section.fields.reduce((acc, field) => {
      acc[field.id] = field.value
      return acc
    }, {} as Record<string, any>)

    switch (section.id) {
      case 'hero':
        return (
          <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/90 font-medium">{fields.badge_text || 'Badge Text'}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {fields.main_headline || 'Main Headline'}
                {fields.highlight_text && (
                  <span className="block text-gradient bg-gradient-to-r from-primary-300 to-green-400 bg-clip-text text-transparent">
                    {fields.highlight_text}
                  </span>
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
                {fields.description || 'Description text goes here...'}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12">
                <div className="flex items-center space-x-2 text-white/90">
                  <span className="text-primary-300">📡</span>
                  <span className="font-medium">{fields.feature_1_label || 'Feature 1'}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <span className="text-primary-300">⚡</span>
                  <span className="font-medium">{fields.feature_2_label || 'Feature 2'}</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <span className="text-primary-300">⚙️</span>
                  <span className="font-medium">{fields.feature_3_label || 'Feature 3'}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
                  {fields.cta_primary || 'Primary CTA'}
                </button>
                <button className="px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors">
                  {fields.cta_secondary || 'Secondary CTA'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {fields.stat_1_number || '0'}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {fields.stat_1_label || 'Stat 1'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {fields.stat_2_number || '0'}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {fields.stat_2_label || 'Stat 2'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {fields.stat_3_number || '0'}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {fields.stat_3_label || 'Stat 3'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {fields.stat_4_number || '0'}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">
                    {fields.stat_4_label || 'Stat 4'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <span>👥</span>
                  <span>{fields.badge_text || 'About Us'}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {fields.section_title || 'Section Title'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {fields.section_description || 'Section description goes here...'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-indigo-600 text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{fields.mission_title || 'Our Mission'}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {fields.mission || 'Mission statement goes here...'}
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-green-600 text-2xl">👁️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{fields.vision_title || 'Our Vision'}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {fields.vision || 'Vision statement goes here...'}
                  </p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-blue-600 text-2xl">❤️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{fields.values_title || 'Our Values'}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {fields.values || 'Values statement goes here...'}
                  </p>
                </div>
              </div>
              
              <div className="mb-20">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{fields.core_values_title || 'What Drives Us'}</h3>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {fields.core_values_description || 'Our core values description...'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-indigo-600 text-2xl">🏆</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{fields.value_1_title || 'Value 1'}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{fields.value_1_description || 'Value description...'}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-2xl">🛡️</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{fields.value_2_title || 'Value 2'}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{fields.value_2_description || 'Value description...'}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 text-2xl">💡</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{fields.value_3_title || 'Value 3'}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{fields.value_3_description || 'Value description...'}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-purple-600 text-2xl">🌍</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{fields.value_4_title || 'Value 4'}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{fields.value_4_description || 'Value description...'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{fields.journey_title || 'Our Journey'}</h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {fields.journey_description || 'Journey description...'}
                </p>
              </div>
            </div>
          </div>
        )

      case 'solutions':
        return (
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {fields.section_title || 'Section Title'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {fields.section_description || 'Section description goes here...'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl p-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-white text-3xl">📡</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {fields.telecom_title || 'Telecom Title'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {fields.telecom_description || 'Telecom description goes here...'}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8">
                  <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-white text-3xl">⚡</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {fields.energy_title || 'Energy Title'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {fields.energy_description || 'Energy description goes here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {fields.section_title || 'Section Title'}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {fields.section_description || 'Section description goes here...'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600">✉️</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-600">{fields.email || 'email@example.com'}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600">📞</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                  <p className="text-gray-600">{fields.phone || '+1 (555) 000-0000'}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600">📍</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Address</h4>
                  <p className="text-gray-600">{fields.address || 'City, Country'}</p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {fields.section_title || section.name}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {fields.section_description || 'Content preview will be displayed here.'}
              </p>
            </div>
          </div>
        )
    }
  }

  const getDeviceClass = () => {
    switch (selectedDevice) {
      case 'mobile':
        return 'w-[375px] h-[667px]'
      case 'tablet':
        return 'w-[768px] h-[1024px]'
      case 'desktop':
      default:
        return 'w-full h-full'
    }
  }

  const getDeviceScale = () => {
    if (isFullscreen) return 'scale-100'
    
    switch (selectedDevice) {
      case 'mobile':
        return 'scale-75'
      case 'tablet':
        return 'scale-60'
      case 'desktop':
      default:
        return 'scale-50'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${
            isFullscreen ? 'w-full h-full' : 'w-[95vw] h-[95vh] max-w-7xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <EyeIcon className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Content Preview</h3>
                <p className="text-sm text-gray-600">{section.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Device switcher */}
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setSelectedDevice('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'desktop'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Desktop view"
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'tablet'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Tablet view"
                >
                  <DeviceTabletIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDevice('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    selectedDevice === 'mobile'
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Mobile view"
                >
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="w-5 h-5" />
                ) : (
                  <ArrowsPointingOutIcon className="w-5 h-5" />
                )}
              </button>

              {/* Close button */}
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close preview"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center p-8">
              <motion.div
                key={selectedDevice}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-white shadow-2xl overflow-hidden ${getDeviceClass()} ${getDeviceScale()} origin-center`}
                style={{
                  borderRadius: selectedDevice === 'mobile' ? '2rem' : selectedDevice === 'tablet' ? '1.5rem' : '0.5rem'
                }}
              >
                <div className="w-full h-full overflow-y-auto">
                  {generatePreviewContent()}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>Preview Mode: {selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)}</span>
                <span>•</span>
                <span>Real-time Updates</span>
              </div>
              <div className="text-xs">
                Changes are automatically reflected in the preview
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
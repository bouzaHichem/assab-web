'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    {
      name: 'Solutions',
      href: '#solutions',
      dropdown: [
        { name: 'Telecom Infrastructure', href: '#telecom' },
        { name: 'Energy Systems', href: '#energy' },
        { name: 'Engineering & Integration', href: '#engineering' },
      ]
    },
    { name: 'Industries', href: '#industries' },
    { name: 'Projects', href: '#projects' },
    { name: 'Team', href: '#team' },
    { name: 'Contact', href: '#contact' },
  ]

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
    
    // Smooth scroll to section
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link href="#home" onClick={() => handleLinkClick('#home')}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-blue rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <div className={`font-heading font-bold text-2xl transition-colors ${
                    isScrolled ? 'text-navy-900' : 'text-white'
                  }`}>
                    ASSAB
                  </div>
                  <div className={`text-xs font-medium -mt-1 transition-colors ${
                    isScrolled ? 'text-primary-600' : 'text-primary-300'
                  }`}>
                    Telecom & Energy
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isScrolled
                          ? 'text-navy-700 hover:text-primary-600 hover:bg-primary-50'
                          : 'text-white hover:text-primary-300'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown size={16} className="transition-transform duration-200" />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              onClick={() => handleLinkClick(dropdownItem.href)}
                              className="block px-6 py-4 text-navy-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isScrolled
                        ? 'text-navy-700 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-white hover:text-primary-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#contact"
                onClick={() => handleLinkClick('#contact')}
                className="btn-primary"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} className={isScrolled ? 'text-navy-900' : 'text-white'} />
            ) : (
              <Menu size={24} className={isScrolled ? 'text-navy-900' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-lg rounded-2xl mt-4 border border-gray-100"
            >
              <div className="py-6 space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button
                          className="w-full text-left px-6 py-3 text-navy-700 hover:bg-primary-50 transition-colors duration-200 flex items-center justify-between"
                          onClick={() => setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          )}
                        >
                          <span className="font-medium">{item.name}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${
                              activeDropdown === item.name ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-gray-50"
                            >
                              {item.dropdown.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.name}
                                  href={dropdownItem.href}
                                  onClick={() => handleLinkClick(dropdownItem.href)}
                                  className="block px-10 py-3 text-navy-600 hover:text-primary-600 transition-colors duration-200"
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="block px-6 py-3 text-navy-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="px-6 pt-4">
                  <Link
                    href="#contact"
                    onClick={() => handleLinkClick('#contact')}
                    className="btn-primary w-full text-center"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

export default Header
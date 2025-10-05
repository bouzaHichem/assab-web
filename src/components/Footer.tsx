'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook,
  ArrowUp
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    solutions: [
      { name: 'Telecom Infrastructure', href: '#telecom' },
      { name: 'Energy Systems', href: '#energy' },
      { name: 'Engineering & Integration', href: '#engineering' },
    ],
    industries: [
      { name: 'Telecom Operators', href: '#industries' },
      { name: 'Energy Providers', href: '#industries' },
      { name: 'Government', href: '#industries' },
      { name: 'Enterprises', href: '#industries' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#team' },
      { name: 'Projects', href: '#projects' },
      { name: 'Careers', href: '/careers' },
    ],
    resources: [
      { name: 'News & Insights', href: '/blog' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Support', href: '/support' },
    ]
  }

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      title: 'Email Us',
      content: 'info@assab.com',
      link: 'mailto:info@assab.com'
    },
    {
      icon: <Phone size={20} />,
      title: 'Call Us',
      content: '+213 XXX XXX XXX',
      link: 'tel:+213XXXXXXXXX'
    },
    {
      icon: <MapPin size={20} />,
      title: 'Visit Us',
      content: 'Algiers, Algeria',
      link: '#contact'
    }
  ]

  const socialLinks = [
    {
      icon: <Linkedin size={20} />,
      href: 'https://linkedin.com/company/assab',
      label: 'LinkedIn'
    },
    {
      icon: <Twitter size={20} />,
      href: 'https://twitter.com/assab_official',
      label: 'Twitter'
    },
    {
      icon: <Facebook size={20} />,
      href: 'https://facebook.com/assab.official',
      label: 'Facebook'
    }
  ]

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-network-pattern opacity-10"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="section-padding border-b border-navy-800">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  {/* Logo */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-blue rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">A</span>
                    </div>
                    <div>
                      <div className="font-heading font-bold text-2xl text-white">
                        ASSAB
                      </div>
                      <div className="text-primary-300 text-sm font-medium -mt-1">
                        Telecom & Energy
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Powering the future of connectivity and energy across Africa and beyond. 
                    We deliver advanced telecommunications infrastructure and sustainable energy solutions.
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    {contactInfo.map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <Link
                          href={item.link}
                          className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group"
                        >
                          <div className="text-primary-400 group-hover:text-primary-300 transition-colors">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.title}</div>
                            <div className="text-sm">{item.content}</div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Links */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Solutions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-heading font-semibold text-lg mb-6 text-white">
                      Solutions
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.solutions.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Industries */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-heading font-semibold text-lg mb-6 text-white">
                      Industries
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.industries.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Company */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-heading font-semibold text-lg mb-6 text-white">
                      Company
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                © {currentYear} ASSAB. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-navy-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 z-50"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <ArrowUp size={20} className="text-white" />
        </motion.button>
      </div>
    </footer>
  )
}

export default Footer
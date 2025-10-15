'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRight,
  Play,
  Zap,
  Radio,
  Settings
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchSettingsMap, SettingsMap } from '@/lib/content'

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [settings, setSettings] = useState<SettingsMap>({})

  useEffect(() => {
    fetchSettingsMap().then(setSettings)
  }, [])

  const handleScrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToSolutions = () => {
    const element = document.querySelector('#solutions')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const floatingIcons = [
    { icon: <Zap size={24} />, delay: 0, position: { top: '20%', left: '10%' } },
    { icon: <Radio size={28} />, delay: 1, position: { top: '60%', left: '15%' } },
    { icon: <Settings size={20} />, delay: 2, position: { top: '40%', right: '20%' } },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Network Grid Pattern */}
        <div className="absolute inset-0 bg-network-pattern opacity-20"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Circles */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-to-r from-primary-500/10 to-accent-blue/10 rounded-full"
            style={{ top: '10%', right: '-10%' }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute w-64 h-64 bg-gradient-to-l from-accent-green/10 to-primary-600/10 rounded-full"
            style={{ bottom: '20%', left: '-5%' }}
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Floating Tech Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-white/20"
              style={item.position}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut"
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <motion.div
          ref={ref}
          variants={staggerChildren}
          initial="initial"
          animate={inView ? "animate" : "initial"}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8"
          >
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
            <span className="text-white/90 font-medium">{settings.hero_badge_text ?? 'Leading Innovation in Africa'}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-white font-heading mb-6 text-shadow-lg"
          >
            {(settings.hero_main_headline ?? 'Powering the Future of')}{' '}
            <span className="text-gradient bg-gradient-to-r from-primary-300 to-accent-green bg-clip-text text-transparent">
              {settings.hero_highlight_text ?? 'Connectivity & Energy'}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            {settings.hero_description ?? 'Advanced telecommunications infrastructure, sustainable energy systems, and engineering excellence. Building smart connectivity across Africa and beyond.'}
          </motion.p>

          {/* Key Features */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12"
          >
            {[
              { icon: <Radio size={20} />, label: 'Telecom Infrastructure' },
              { icon: <Zap size={20} />, label: 'Energy Solutions' },
              { icon: <Settings size={20} />, label: 'Engineering Excellence' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/90">
                <div className="text-primary-300">{feature.icon}</div>
                <span className="font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              onClick={handleScrollToContact}
              className="btn-primary flex items-center space-x-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{settings.hero_cta_primary ?? 'Discover Our Solutions'}</span>
              <ArrowRight 
                size={18} 
                className="group-hover:translate-x-1 transition-transform duration-200" 
              />
            </motion.button>
            
            <motion.button
              onClick={handleScrollToSolutions}
              className="btn-outline flex items-center space-x-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={16} className="group-hover:scale-110 transition-transform duration-200" />
              <span>{settings.hero_cta_secondary ?? 'Watch Demo'}</span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {[
              { number: '20+', label: 'Successful Projects' },
              { number: '10MW', label: 'Power Installed' },
              { number: '50+', label: 'Network Deployments' },
              { number: '99.9%', label: 'System Reliability' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Radio, 
  Zap, 
  Settings, 
  Antenna,
  Sun,
  Cpu,
  Network,
  Battery,
  Wrench,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const SolutionsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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

  const solutions = [
    {
      id: 'telecom',
      icon: <Radio size={40} />,
      title: 'Telecom Infrastructure',
      subtitle: 'Next-Generation Connectivity',
      description: 'Comprehensive telecommunications solutions including fiber optics, tower deployment, and network optimization for seamless connectivity.',
      features: [
        'Fiber Optic Networks',
        'Tower Construction & Maintenance',
        'Network Planning & Design',
        '5G Infrastructure',
        'Microwave & Satellite Links',
        'Network Security Solutions'
      ],
      benefits: [
        '99.9% Network Uptime',
        'Ultra-Low Latency',
        'Scalable Architecture',
        '24/7 Monitoring'
      ],
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      id: 'energy',
      icon: <Zap size={40} />,
      title: 'Energy Systems',
      subtitle: 'Sustainable Power Solutions',
      description: 'Innovative energy systems including solar installations, smart grids, and backup power solutions for reliable, sustainable energy.',
      features: [
        'Solar Power Systems',
        'Smart Grid Technology',
        'Battery Storage Solutions',
        'Hybrid Power Systems',
        'Energy Management Software',
        'Grid Integration Services'
      ],
      benefits: [
        'Up to 70% Cost Reduction',
        'Zero Carbon Emissions',
        'Energy Independence',
        'Smart Monitoring'
      ],
      gradient: 'from-accent-green to-primary-500'
    },
    {
      id: 'engineering',
      icon: <Settings size={40} />,
      title: 'Engineering & Integration',
      subtitle: 'Complete System Solutions',
      description: 'End-to-end engineering services from design and installation to maintenance, ensuring optimal performance and reliability.',
      features: [
        'System Design & Planning',
        'Project Management',
        'Installation & Commissioning',
        'System Integration',
        'Preventive Maintenance',
        'Technical Support'
      ],
      benefits: [
        'Reduced Deployment Time',
        'Seamless Integration',
        'Proactive Maintenance',
        'Expert Support'
      ],
      gradient: 'from-accent-blue to-primary-600'
    }
  ]

  const serviceIcons = [
    { icon: <Antenna size={24} />, label: 'Tower Solutions' },
    { icon: <Network size={24} />, label: 'Network Design' },
    { icon: <Sun size={24} />, label: 'Solar Systems' },
    { icon: <Battery size={24} />, label: 'Energy Storage' },
    { icon: <Cpu size={24} />, label: 'Smart Systems' },
    { icon: <Wrench size={24} />, label: 'Maintenance' }
  ]

  return (
    <section id="solutions" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          variants={staggerChildren}
          initial="initial"
          animate={inView ? "animate" : "initial"}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center space-x-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Settings size={16} />
              <span>Our Solutions</span>
            </motion.div>
            
            <motion.h2
              variants={fadeInUp}
              className="text-navy-900 font-heading mb-6"
            >
              Complete Infrastructure Solutions
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed"
            >
              From telecommunications infrastructure to sustainable energy systems, 
              we deliver integrated solutions that power your digital transformation.
            </motion.p>
          </div>

          {/* Service Icons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-8 mb-20"
          >
            {serviceIcons.map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl hover:bg-primary-50 transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 transition-colors duration-300 shadow-sm">
                  <div className="text-primary-500 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-navy-700 group-hover:text-primary-600">
                  {service.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Solutions Grid */}
          <div className="space-y-20">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.id}
                variants={fadeInUp}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${solution.gradient} mb-6`}>
                      <div className="text-white">
                        {solution.icon}
                      </div>
                    </div>
                    
                    <div className="text-primary-600 font-medium mb-2">{solution.subtitle}</div>
                    <h3 className="text-3xl font-heading text-navy-900 mb-4">{solution.title}</h3>
                    <p className="text-lg text-navy-600 leading-relaxed mb-8">
                      {solution.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {solution.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle size={20} className="text-accent-green flex-shrink-0" />
                        <span className="text-navy-700 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => {
                      const element = document.querySelector('#contact')
                      if (element) element.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="btn-primary flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight size={18} />
                  </motion.button>
                </div>

                {/* Features Card */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl"
                  >
                    <h4 className="text-2xl font-heading text-navy-900 mb-6">Key Features</h4>
                    <div className="space-y-4">
                      {solution.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-navy-700 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="text-center mt-20 bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-12 text-white relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-network-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-heading mb-4">Need a Custom Solution?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Our expert team can design and implement tailored solutions to meet your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  onClick={() => {
                    const element = document.querySelector('#contact')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-outline border-white text-white hover:bg-white hover:text-navy-900"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Discuss Your Project
                </motion.button>
                <motion.button
                  onClick={() => {
                    const element = document.querySelector('#projects')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="bg-white text-navy-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Our Projects
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default SolutionsSection
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Building2,
  Factory,
  Shield,
  Zap,
  Radio,
  Building,
  Truck,
  GraduationCap
} from 'lucide-react'

const IndustriesSection = () => {
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
        staggerChildren: 0.1
      }
    }
  }

  const industries = [
    {
      icon: <Radio size={48} />,
      title: 'Telecom Operators',
      description: 'Comprehensive infrastructure solutions for mobile network operators, ISPs, and telecommunications companies.',
      services: ['Network Expansion', '5G Deployment', 'Fiber Infrastructure', 'Site Optimization'],
      stats: '50+ Networks',
      gradient: 'from-primary-500 to-primary-600'
    },
    {
      icon: <Zap size={48} />,
      title: 'Energy Providers',
      description: 'Sustainable energy solutions for utilities, renewable energy companies, and power generation facilities.',
      services: ['Solar Installations', 'Grid Integration', 'Energy Storage', 'Smart Grid Solutions'],
      stats: '10MW+ Installed',
      gradient: 'from-accent-green to-primary-500'
    },
    {
      icon: <Shield size={48} />,
      title: 'Government',
      description: 'Secure and reliable infrastructure solutions for government agencies and public sector organizations.',
      services: ['Public Networks', 'Emergency Systems', 'Smart City Solutions', 'Security Infrastructure'],
      stats: '15+ Agencies',
      gradient: 'from-accent-blue to-primary-600'
    },
    {
      icon: <Building2 size={48} />,
      title: 'Enterprises',
      description: 'Custom telecommunications and energy solutions for large corporations and business campuses.',
      services: ['Private Networks', 'Data Centers', 'Backup Power', 'Building Automation'],
      stats: '100+ Companies',
      gradient: 'from-purple-500 to-primary-600'
    },
    {
      icon: <Factory size={48} />,
      title: 'Manufacturing',
      description: 'Industrial-grade connectivity and power solutions for manufacturing and production facilities.',
      services: ['Industrial IoT', 'Automation Networks', 'Power Systems', 'Monitoring Solutions'],
      stats: '25+ Facilities',
      gradient: 'from-orange-500 to-primary-600'
    },
    {
      icon: <GraduationCap size={48} />,
      title: 'Education',
      description: 'Reliable connectivity and sustainable energy solutions for educational institutions.',
      services: ['Campus Networks', 'Digital Infrastructure', 'Solar Power', 'Learning Technology'],
      stats: '30+ Institutions',
      gradient: 'from-indigo-500 to-primary-600'
    }
  ]

  return (
    <section id="industries" className="section-padding bg-section-gradient">
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
              <Building2 size={16} />
              <span>Industries We Serve</span>
            </motion.div>
            
            <motion.h2
              variants={fadeInUp}
              className="text-navy-900 font-heading mb-6"
            >
              Powering Growth Across Industries
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed"
            >
              From telecommunications to energy, government to enterprise, 
              we deliver specialized solutions tailored to each industry's unique requirements.
            </motion.p>
          </div>

          {/* Industries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {industry.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-heading text-navy-900">{industry.title}</h3>
                      <div className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                        {industry.stats}
                      </div>
                    </div>
                    <p className="text-navy-600 leading-relaxed mb-6">
                      {industry.description}
                    </p>
                  </div>

                  {/* Services */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-navy-900 mb-3">Key Services:</h4>
                    {industry.services.map((service, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                        <span className="text-navy-700 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { number: '200+', label: 'Projects Delivered' },
              { number: '15', label: 'Industries Served' },
              { number: '5', label: 'Countries Active' },
              { number: '99.9%', label: 'Client Satisfaction' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-navy-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100"
          >
            <h3 className="text-3xl font-heading text-navy-900 mb-4">
              Don't See Your Industry?
            </h3>
            <p className="text-xl text-navy-600 mb-8 max-w-2xl mx-auto">
              We work with organizations across many sectors. Let's discuss how our solutions 
              can be tailored to meet your specific industry requirements.
            </p>
            <motion.button
              onClick={() => {
                const element = document.querySelector('#contact')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Discuss Your Needs
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default IndustriesSection
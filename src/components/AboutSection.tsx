'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  Target, 
  Eye, 
  Heart, 
  Award,
  Users,
  Globe,
  TrendingUp,
  Shield
} from 'lucide-react'

const AboutSection = () => {
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

  const values = [
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'We strive for the highest standards in every project, delivering solutions that exceed expectations and set industry benchmarks.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Reliability',
      description: 'Our systems are built to last, ensuring 99.9% uptime and consistent performance you can depend on, day and night.'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and forward-thinking approaches to solve complex telecommunications and energy challenges.'
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Impact',
      description: 'Our solutions connect communities and power progress across Africa and beyond, creating lasting positive change.'
    }
  ]

  const milestones = [
    { year: '2020', event: 'Company Founded', description: 'ASSAB established with vision to transform telecom & energy landscape' },
    { year: '2021', event: 'First Major Project', description: 'Successful deployment of 50+ telecom towers across Algeria' },
    { year: '2022', event: '10MW Milestone', description: 'Reached 10MW of installed renewable energy capacity' },
    { year: '2023', event: 'Regional Expansion', description: 'Extended operations to 5 countries across North and West Africa' },
    { year: '2024', event: 'Innovation Hub', description: 'Launched R&D center for next-generation connectivity solutions' }
  ]

  return (
    <section id="about" className="section-padding bg-section-gradient">
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
              <Users size={16} />
              <span>About ASSAB</span>
            </motion.div>
            
            <motion.h2
              variants={fadeInUp}
              className="text-navy-900 font-heading mb-6"
            >
              Transforming Africa's Digital Future
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed"
            >
              We are pioneering the next generation of telecommunications infrastructure and sustainable energy solutions, 
              connecting communities and powering progress across Africa and beyond.
            </motion.p>
          </div>

          {/* Mission, Vision, Values */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Mission */}
            <motion.div
              variants={fadeInUp}
              className="card-gradient p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-heading text-navy-900 mb-4">Our Mission</h3>
              <p className="text-navy-600 leading-relaxed">
                To deliver world-class telecommunications infrastructure and sustainable energy solutions 
                that empower communities, drive economic growth, and create a connected, sustainable future for all.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={fadeInUp}
              className="card-gradient p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-green to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-heading text-navy-900 mb-4">Our Vision</h3>
              <p className="text-navy-600 leading-relaxed">
                To be Africa's leading provider of integrated telecommunications and energy solutions, 
                setting the standard for innovation, reliability, and sustainable development across the continent.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              variants={fadeInUp}
              className="card-gradient p-8 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-heading text-navy-900 mb-4">Our Values</h3>
              <p className="text-navy-600 leading-relaxed">
                Excellence, integrity, innovation, and sustainability guide everything we do. 
                We believe in building lasting relationships and creating value for all stakeholders.
              </p>
            </motion.div>
          </div>

          {/* Core Values Grid */}
          <motion.div
            variants={fadeInUp}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading text-navy-900 mb-4">What Drives Us</h3>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                Our core values shape our culture and guide our decisions in every project we undertake.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-500 group-hover:to-primary-600 transition-all duration-300">
                    <div className="text-primary-600 group-hover:text-white transition-colors duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-heading text-navy-900 mb-3">{value.title}</h4>
                  <p className="text-navy-600 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Company Timeline */}
          <motion.div
            variants={fadeInUp}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading text-navy-900 mb-4">Our Journey</h3>
              <p className="text-lg text-navy-600 max-w-2xl mx-auto">
                From startup to industry leader, discover the key milestones that have shaped ASSAB's growth.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-600"></div>

              {/* Timeline Items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                        <h4 className="text-xl font-heading text-navy-900 mb-2">{milestone.event}</h4>
                        <p className="text-navy-600">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={fadeInUp}
            className="text-center bg-gradient-to-r from-primary-600 to-accent-blue rounded-3xl p-12 text-white"
          >
            <h3 className="text-3xl font-heading mb-4">Ready to Transform Your Infrastructure?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the growing number of organizations that trust ASSAB for their telecommunications and energy needs.
            </p>
            <motion.button
              onClick={() => {
                const element = document.querySelector('#contact')
                if (element) element.scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
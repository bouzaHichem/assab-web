'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { 
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Zap,
  Radio,
  Settings,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { fetchSettingsMap, SettingsMap } from '@/lib/content'

interface Project {
  id: number
  title: string
  category: string
  location: string
  year: string
  client: string
  description: string
  image: string
  stats: string[]
  technologies: string[]
  results: string[]
  gallery: string[]
}

const ProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [settings, setSettings] = useState<SettingsMap>({})
  useEffect(() => { fetchSettingsMap().then(setSettings) }, [])

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

  const defaultProjects = [
    {
      id: 1,
      title: 'Algeria National Fiber Network',
      category: 'telecom',
      location: 'Algiers, Algeria',
      year: '2024',
      client: 'Algeria Telecom',
      description: 'Comprehensive fiber optic network deployment covering 500+ km across major cities.',
      image: '/images/project1.jpg',
      stats: ['500+ KM', '50 Cities', '1M+ Users'],
      technologies: ['Fiber Optic', '5G Ready', 'Smart Grid'],
      results: [
        'Increased network capacity by 300%',
        'Reduced latency by 50%',
        'Improved rural connectivity'
      ],
      gallery: ['/images/project1-1.jpg', '/images/project1-2.jpg', '/images/project1-3.jpg']
    },
    {
      id: 2,
      title: 'Solar Power Plant Installation',
      category: 'energy',
      location: 'Ouargla, Algeria',
      year: '2023',
      client: 'SKTM Solar',
      description: '10MW solar power plant with advanced energy storage and grid integration.',
      image: '/images/project2.jpg',
      stats: ['10MW', '25 Years', '15K Homes'],
      technologies: ['Solar Panels', 'Battery Storage', 'Grid Integration'],
      results: [
        '10MW clean energy generation',
        '15,000 homes powered',
        '25,000 tons CO2 saved annually'
      ],
      gallery: ['/images/project2-1.jpg', '/images/project2-2.jpg', '/images/project2-3.jpg']
    },
    {
      id: 3,
      title: 'Smart City Infrastructure',
      category: 'engineering',
      location: 'Oran, Algeria',
      year: '2024',
      client: 'Oran Municipality',
      description: 'Complete smart city infrastructure with IoT sensors, smart lighting, and traffic management.',
      image: '/images/project3.jpg',
      stats: ['200+ Sensors', '50KM Coverage', '500K Citizens'],
      technologies: ['IoT Sensors', 'Smart Lighting', 'Traffic Systems'],
      results: [
        '30% reduction in energy consumption',
        'Improved traffic flow by 25%',
        'Enhanced public safety'
      ],
      gallery: ['/images/project3-1.jpg', '/images/project3-2.jpg', '/images/project3-3.jpg']
    },
    {
      id: 4,
      title: '5G Tower Network Expansion',
      category: 'telecom',
      location: 'Constantine, Algeria',
      year: '2023',
      client: 'Mobilis',
      description: 'Strategic deployment of 5G towers for enhanced mobile connectivity and coverage.',
      image: '/images/project4.jpg',
      stats: ['100+ Towers', '95% Coverage', '2M+ Users'],
      technologies: ['5G Technology', 'Microwave Links', 'Smart Antennas'],
      results: [
        '10x faster data speeds',
        '95% city coverage achieved',
        'Ultra-low latency network'
      ],
      gallery: ['/images/project4-1.jpg', '/images/project4-2.jpg', '/images/project4-3.jpg']
    },
    {
      id: 5,
      title: 'Hybrid Energy System',
      category: 'energy',
      location: 'Tamanrasset, Algeria',
      year: '2023',
      client: 'Sonelgaz',
      description: 'Hybrid solar-diesel power system for remote area electrification.',
      image: '/images/project5.jpg',
      stats: ['5MW Solar', '3MW Diesel', '10K People'],
      technologies: ['Hybrid System', 'Battery Bank', 'Remote Monitoring'],
      results: [
        '70% renewable energy share',
        'Reliable 24/7 power supply',
        'Reduced operational costs by 40%'
      ],
      gallery: ['/images/project5-1.jpg', '/images/project5-2.jpg', '/images/project5-3.jpg']
    },
    {
      id: 6,
      title: 'Data Center Infrastructure',
      category: 'engineering',
      location: 'Blida, Algeria',
      year: '2024',
      client: 'ATM Mobilis',
      description: 'Tier III data center with redundant power, cooling, and connectivity systems.',
      image: '/images/project6.jpg',
      stats: ['Tier III', '99.9% Uptime', '500 Racks'],
      technologies: ['Redundant Power', 'Precision Cooling', 'Fiber Backbone'],
      results: [
        '99.9% uptime guaranteed',
        '50% energy efficiency improvement',
        'Enhanced data security'
      ],
      gallery: ['/images/project6-1.jpg', '/images/project6-2.jpg', '/images/project6-3.jpg']
    }
  ]

  const projects: any[] = (settings.projects_items ?? defaultProjects)

  const categories = Array.from(new Set(projects.map(p => p.category)))
  const filters = [
    { id: 'all', label: 'All Projects', icon: <Settings size={16} /> },
    ...categories.map((c: string) => ({ id: c, label: c.charAt(0).toUpperCase()+c.slice(1), icon: c==='telecom'? <Radio size={16}/> : c==='energy'? <Zap size={16}/> : <Settings size={16}/> }))
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <section id="projects" className="section-padding bg-white">
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
              <span>{settings.projects_badge_text ?? 'Our Projects'}</span>
            </motion.div>
            
            <motion.h2
              variants={fadeInUp}
              className="text-navy-900 font-heading mb-6"
            >
              {settings.projects_section_title ?? 'Transforming Infrastructure Across Africa'}
            </motion.h2>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed"
            >
              {settings.projects_section_description ?? 'Discover our portfolio of successful projects that have revolutionized telecommunications and energy infrastructure across the continent.'}
            </motion.p>
          </div>

          {/* Filter Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-navy-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  {/* Project Image */}
                  <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        {project.category === 'telecom' && <Radio size={32} className="text-white" />}
                        {project.category === 'energy' && <Zap size={32} className="text-white" />}
                        {project.category === 'engineering' && <Settings size={32} className="text-white" />}
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                    >
                      <ExternalLink size={20} className="text-white" />
                    </motion.div>
                  </div>

                  {/* Project Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-primary-600">
                        <Calendar size={16} />
                        <span>{project.year}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-navy-500">
                        <MapPin size={16} />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-heading text-navy-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-navy-600 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {(project.stats as string[]).map((stat: string, idx: number) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-bold text-primary-600">{stat}</div>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies as string[]).slice(0, 2).map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="px-3 py-1 bg-gray-100 text-navy-600 text-xs font-medium rounded-full">
                          +{project.technologies.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="text-center mt-16 bg-gradient-to-r from-primary-600 to-accent-blue rounded-3xl p-12 text-white"
          >
            <h3 className="text-3xl font-heading mb-4">Ready to Start Your Project?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Let's discuss how we can bring your vision to life with our proven expertise and innovative solutions.
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
              Start Your Project
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-heading text-navy-900 mb-2">{selectedProject.title}</h3>
                  <div className="flex items-center space-x-4 text-navy-600">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{selectedProject.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>{selectedProject.client}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-navy-600" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Project Details */}
                <div>
                  <h4 className="text-xl font-heading text-navy-900 mb-4">Project Overview</h4>
                  <p className="text-navy-600 leading-relaxed mb-8">{selectedProject.description}</p>

                  <h4 className="text-xl font-heading text-navy-900 mb-4">Key Results</h4>
                  <ul className="space-y-3 mb-8">
                    {selectedProject.results.map((result: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                        <span className="text-navy-600">{result}</span>
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-xl font-heading text-navy-900 mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project Stats */}
                <div>
                  <h4 className="text-xl font-heading text-navy-900 mb-4">Project Stats</h4>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {selectedProject.stats.map((stat: string, idx: number) => (
                      <div key={idx} className="text-center p-4 bg-gray-50 rounded-2xl">
                        <div className="text-2xl font-bold text-primary-600 mb-1">{stat}</div>
                      </div>
                    ))}
                  </div>

                  {/* Image Placeholder */}
                  <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl h-64 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      {selectedProject.category === 'telecom' && <Radio size={32} className="text-white" />}
                      {selectedProject.category === 'energy' && <Zap size={32} className="text-white" />}
                      {selectedProject.category === 'engineering' && <Settings size={32} className="text-white" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

export default ProjectsSection
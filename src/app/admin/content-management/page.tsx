'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  UserGroupIcon,
  CogIcon,
  BuildingOffice2Icon,
  BriefcaseIcon,
  PhoneIcon,
  EyeIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import ContentPreview from '@/components/admin/ContentPreview'

interface ContentSection {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description: string
  lastModified: string
  status: 'live' | 'draft' | 'modified'
  fields: {
    id: string
    type: 'text' | 'textarea' | 'image' | 'array' | 'object'
    label: string
    value: any
  }[]
}

export default function ContentManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sections, setSections] = useState<ContentSection[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewSection, setPreviewSection] = useState<ContentSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchContent()
    }
  }, [session])

  const fetchContent = async () => {
    try {
      // Mock data - In real implementation, this would fetch from your CMS API
      const mockSections: ContentSection[] = [
        {
          id: 'hero',
          name: 'Hero Section',
          icon: HomeIcon,
          description: 'Main landing section with company headline and call-to-action',
          lastModified: '2024-01-15T10:30:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'Leading Innovation in Africa' },
            { id: 'main_headline', type: 'text', label: 'Main Headline', value: 'Powering the Future of Connectivity & Energy' },
            { id: 'highlight_text', type: 'text', label: 'Highlight Text (Gradient)', value: 'Connectivity & Energy' },
            { id: 'description', type: 'textarea', label: 'Description', value: 'Advanced telecommunications infrastructure, sustainable energy systems, and engineering excellence. Building smart connectivity across Africa and beyond.' },
            { id: 'cta_primary', type: 'text', label: 'Primary CTA', value: 'Discover Our Solutions' },
            { id: 'cta_secondary', type: 'text', label: 'Secondary CTA', value: 'Watch Demo' },
            { id: 'feature_1_icon', type: 'text', label: 'Feature 1 Icon', value: 'Radio' },
            { id: 'feature_1_label', type: 'text', label: 'Feature 1 Label', value: 'Telecom Infrastructure' },
            { id: 'feature_2_icon', type: 'text', label: 'Feature 2 Icon', value: 'Zap' },
            { id: 'feature_2_label', type: 'text', label: 'Feature 2 Label', value: 'Energy Solutions' },
            { id: 'feature_3_icon', type: 'text', label: 'Feature 3 Icon', value: 'Settings' },
            { id: 'feature_3_label', type: 'text', label: 'Feature 3 Label', value: 'Engineering Excellence' },
            { id: 'stat_1_number', type: 'text', label: 'Stat 1 Number', value: '20+' },
            { id: 'stat_1_label', type: 'text', label: 'Stat 1 Label', value: 'Successful Projects' },
            { id: 'stat_2_number', type: 'text', label: 'Stat 2 Number', value: '10MW' },
            { id: 'stat_2_label', type: 'text', label: 'Stat 2 Label', value: 'Power Installed' },
            { id: 'stat_3_number', type: 'text', label: 'Stat 3 Number', value: '50+' },
            { id: 'stat_3_label', type: 'text', label: 'Stat 3 Label', value: 'Network Deployments' },
            { id: 'stat_4_number', type: 'text', label: 'Stat 4 Number', value: '99.9%' },
            { id: 'stat_4_label', type: 'text', label: 'Stat 4 Label', value: 'System Reliability' },
            { id: 'background_image', type: 'image', label: 'Background Image', value: '/images/hero-bg.jpg' }
          ]
        },
        {
          id: 'about',
          name: 'About Section',
          icon: UserGroupIcon,
          description: 'Company information, mission, vision, and values',
          lastModified: '2024-01-14T16:45:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'About ASSAB' },
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Transforming Africa\'s Digital Future' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'We are pioneering the next generation of telecommunications infrastructure and sustainable energy solutions, connecting communities and powering progress across Africa and beyond.' },
            { id: 'mission_title', type: 'text', label: 'Mission Title', value: 'Our Mission' },
            { id: 'mission', type: 'textarea', label: 'Mission Statement', value: 'To deliver world-class telecommunications infrastructure and sustainable energy solutions that empower communities, drive economic growth, and create a connected, sustainable future for all.' },
            { id: 'vision_title', type: 'text', label: 'Vision Title', value: 'Our Vision' },
            { id: 'vision', type: 'textarea', label: 'Vision Statement', value: 'To be Africa\'s leading provider of integrated telecommunications and energy solutions, setting the standard for innovation, reliability, and sustainable development across the continent.' },
            { id: 'values_title', type: 'text', label: 'Values Title', value: 'Our Values' },
            { id: 'values', type: 'textarea', label: 'Values Statement', value: 'Excellence, integrity, innovation, and sustainability guide everything we do. We believe in building lasting relationships and creating value for all stakeholders.' },
            { id: 'core_values_title', type: 'text', label: 'Core Values Section Title', value: 'What Drives Us' },
            { id: 'core_values_description', type: 'text', label: 'Core Values Description', value: 'Our core values shape our culture and guide our decisions in every project we undertake.' },
            { id: 'value_1_title', type: 'text', label: 'Value 1 Title', value: 'Excellence' },
            { id: 'value_1_description', type: 'textarea', label: 'Value 1 Description', value: 'We strive for the highest standards in every project, delivering solutions that exceed expectations and set industry benchmarks.' },
            { id: 'value_2_title', type: 'text', label: 'Value 2 Title', value: 'Reliability' },
            { id: 'value_2_description', type: 'textarea', label: 'Value 2 Description', value: 'Our systems are built to last, ensuring 99.9% uptime and consistent performance you can depend on, day and night.' },
            { id: 'value_3_title', type: 'text', label: 'Value 3 Title', value: 'Innovation' },
            { id: 'value_3_description', type: 'textarea', label: 'Value 3 Description', value: 'We embrace cutting-edge technologies and forward-thinking approaches to solve complex telecommunications and energy challenges.' },
            { id: 'value_4_title', type: 'text', label: 'Value 4 Title', value: 'Global Impact' },
            { id: 'value_4_description', type: 'textarea', label: 'Value 4 Description', value: 'Our solutions connect communities and power progress across Africa and beyond, creating lasting positive change.' },
            { id: 'journey_title', type: 'text', label: 'Journey Section Title', value: 'Our Journey' },
            { id: 'journey_description', type: 'text', label: 'Journey Description', value: 'From startup to industry leader, discover the key milestones that have shaped ASSAB\'s growth.' }
          ]
        },
        {
          id: 'solutions',
          name: 'Solutions Section',
          icon: CogIcon,
          description: 'Services and solutions offered by the company',
          lastModified: '2024-01-13T09:20:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'Our Solutions' },
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Complete Infrastructure Solutions' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'From telecommunications infrastructure to sustainable energy systems, we deliver integrated solutions that power your digital transformation.' },
            { id: 'service_1_label', type: 'text', label: 'Service 1 Label', value: 'Tower Solutions' },
            { id: 'service_2_label', type: 'text', label: 'Service 2 Label', value: 'Network Design' },
            { id: 'service_3_label', type: 'text', label: 'Service 3 Label', value: 'Solar Systems' },
            { id: 'service_4_label', type: 'text', label: 'Service 4 Label', value: 'Energy Storage' },
            { id: 'service_5_label', type: 'text', label: 'Service 5 Label', value: 'Smart Systems' },
            { id: 'service_6_label', type: 'text', label: 'Service 6 Label', value: 'Maintenance' },
            { id: 'telecom_title', type: 'text', label: 'Telecom Solution Title', value: 'Telecom Infrastructure' },
            { id: 'telecom_subtitle', type: 'text', label: 'Telecom Subtitle', value: 'Next-Generation Connectivity' },
            { id: 'telecom_description', type: 'textarea', label: 'Telecom Description', value: 'Comprehensive telecommunications solutions including fiber optics, tower deployment, and network optimization for seamless connectivity.' },
            { id: 'telecom_feature_1', type: 'text', label: 'Telecom Feature 1', value: 'Fiber Optic Networks' },
            { id: 'telecom_feature_2', type: 'text', label: 'Telecom Feature 2', value: 'Tower Construction & Maintenance' },
            { id: 'telecom_feature_3', type: 'text', label: 'Telecom Feature 3', value: 'Network Planning & Design' },
            { id: 'telecom_feature_4', type: 'text', label: 'Telecom Feature 4', value: '5G Infrastructure' },
            { id: 'telecom_feature_5', type: 'text', label: 'Telecom Feature 5', value: 'Microwave & Satellite Links' },
            { id: 'telecom_feature_6', type: 'text', label: 'Telecom Feature 6', value: 'Network Security Solutions' },
            { id: 'telecom_benefit_1', type: 'text', label: 'Telecom Benefit 1', value: '99.9% Network Uptime' },
            { id: 'telecom_benefit_2', type: 'text', label: 'Telecom Benefit 2', value: 'Ultra-Low Latency' },
            { id: 'telecom_benefit_3', type: 'text', label: 'Telecom Benefit 3', value: 'Scalable Architecture' },
            { id: 'telecom_benefit_4', type: 'text', label: 'Telecom Benefit 4', value: '24/7 Monitoring' },
            { id: 'energy_title', type: 'text', label: 'Energy Solution Title', value: 'Energy Systems' },
            { id: 'energy_subtitle', type: 'text', label: 'Energy Subtitle', value: 'Sustainable Power Solutions' },
            { id: 'energy_description', type: 'textarea', label: 'Energy Description', value: 'Innovative energy systems including solar installations, smart grids, and backup power solutions for reliable, sustainable energy.' },
            { id: 'energy_feature_1', type: 'text', label: 'Energy Feature 1', value: 'Solar Power Systems' },
            { id: 'energy_feature_2', type: 'text', label: 'Energy Feature 2', value: 'Smart Grid Technology' },
            { id: 'energy_feature_3', type: 'text', label: 'Energy Feature 3', value: 'Battery Storage Solutions' },
            { id: 'energy_feature_4', type: 'text', label: 'Energy Feature 4', value: 'Hybrid Power Systems' },
            { id: 'energy_feature_5', type: 'text', label: 'Energy Feature 5', value: 'Energy Management Software' },
            { id: 'energy_feature_6', type: 'text', label: 'Energy Feature 6', value: 'Grid Integration Services' },
            { id: 'energy_benefit_1', type: 'text', label: 'Energy Benefit 1', value: 'Up to 70% Cost Reduction' },
            { id: 'energy_benefit_2', type: 'text', label: 'Energy Benefit 2', value: 'Zero Carbon Emissions' },
            { id: 'energy_benefit_3', type: 'text', label: 'Energy Benefit 3', value: 'Energy Independence' },
            { id: 'energy_benefit_4', type: 'text', label: 'Energy Benefit 4', value: 'Smart Monitoring' },
            { id: 'engineering_title', type: 'text', label: 'Engineering Solution Title', value: 'Engineering & Integration' },
            { id: 'engineering_subtitle', type: 'text', label: 'Engineering Subtitle', value: 'Complete System Solutions' },
            { id: 'engineering_description', type: 'textarea', label: 'Engineering Description', value: 'End-to-end engineering services from design and installation to maintenance, ensuring optimal performance and reliability.' },
            { id: 'engineering_feature_1', type: 'text', label: 'Engineering Feature 1', value: 'System Design & Planning' },
            { id: 'engineering_feature_2', type: 'text', label: 'Engineering Feature 2', value: 'Project Management' },
            { id: 'engineering_feature_3', type: 'text', label: 'Engineering Feature 3', value: 'Installation & Commissioning' },
            { id: 'engineering_feature_4', type: 'text', label: 'Engineering Feature 4', value: 'System Integration' },
            { id: 'engineering_feature_5', type: 'text', label: 'Engineering Feature 5', value: 'Preventive Maintenance' },
            { id: 'engineering_feature_6', type: 'text', label: 'Engineering Feature 6', value: 'Technical Support' },
            { id: 'engineering_benefit_1', type: 'text', label: 'Engineering Benefit 1', value: 'Reduced Deployment Time' },
            { id: 'engineering_benefit_2', type: 'text', label: 'Engineering Benefit 2', value: 'Seamless Integration' },
            { id: 'engineering_benefit_3', type: 'text', label: 'Engineering Benefit 3', value: 'Proactive Maintenance' },
            { id: 'engineering_benefit_4', type: 'text', label: 'Engineering Benefit 4', value: 'Expert Support' }
          ]
        },
        {
          id: 'industries',
          name: 'Industries Section',
          icon: BuildingOffice2Icon,
          description: 'Industries and sectors served',
          lastModified: '2024-01-12T14:15:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'Industries We Serve' },
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Powering Growth Across Industries' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'From telecommunications to energy, government to enterprise, we deliver specialized solutions tailored to each industry\'s unique requirements.' },
            { id: 'industry_1_title', type: 'text', label: 'Industry 1 Title', value: 'Telecom Operators' },
            { id: 'industry_1_description', type: 'textarea', label: 'Industry 1 Description', value: 'Comprehensive infrastructure solutions for mobile network operators, ISPs, and telecommunications companies.' },
            { id: 'industry_1_stats', type: 'text', label: 'Industry 1 Stats', value: '50+ Networks' },
            { id: 'industry_2_title', type: 'text', label: 'Industry 2 Title', value: 'Energy Providers' },
            { id: 'industry_2_description', type: 'textarea', label: 'Industry 2 Description', value: 'Sustainable energy solutions for utilities, renewable energy companies, and power generation facilities.' },
            { id: 'industry_2_stats', type: 'text', label: 'Industry 2 Stats', value: '10MW+ Installed' },
            { id: 'industry_3_title', type: 'text', label: 'Industry 3 Title', value: 'Government' },
            { id: 'industry_3_description', type: 'textarea', label: 'Industry 3 Description', value: 'Secure and reliable infrastructure solutions for government agencies and public sector organizations.' },
            { id: 'industry_3_stats', type: 'text', label: 'Industry 3 Stats', value: '15+ Agencies' },
            { id: 'industry_4_title', type: 'text', label: 'Industry 4 Title', value: 'Enterprises' },
            { id: 'industry_4_description', type: 'textarea', label: 'Industry 4 Description', value: 'Custom telecommunications and energy solutions for large corporations and business campuses.' },
            { id: 'industry_4_stats', type: 'text', label: 'Industry 4 Stats', value: '100+ Companies' },
            { id: 'industry_5_title', type: 'text', label: 'Industry 5 Title', value: 'Manufacturing' },
            { id: 'industry_5_description', type: 'textarea', label: 'Industry 5 Description', value: 'Industrial-grade connectivity and power solutions for manufacturing and production facilities.' },
            { id: 'industry_5_stats', type: 'text', label: 'Industry 5 Stats', value: '25+ Facilities' },
            { id: 'industry_6_title', type: 'text', label: 'Industry 6 Title', value: 'Education' },
            { id: 'industry_6_description', type: 'textarea', label: 'Industry 6 Description', value: 'Reliable connectivity and sustainable energy solutions for educational institutions.' },
            { id: 'industry_6_stats', type: 'text', label: 'Industry 6 Stats', value: '30+ Institutions' },
            { id: 'stat_1_number', type: 'text', label: 'Overall Stat 1 Number', value: '200+' },
            { id: 'stat_1_label', type: 'text', label: 'Overall Stat 1 Label', value: 'Projects Delivered' },
            { id: 'stat_2_number', type: 'text', label: 'Overall Stat 2 Number', value: '15' },
            { id: 'stat_2_label', type: 'text', label: 'Overall Stat 2 Label', value: 'Industries Served' },
            { id: 'stat_3_number', type: 'text', label: 'Overall Stat 3 Number', value: '5' },
            { id: 'stat_3_label', type: 'text', label: 'Overall Stat 3 Label', value: 'Countries Active' },
            { id: 'stat_4_number', type: 'text', label: 'Overall Stat 4 Number', value: '99.9%' },
            { id: 'stat_4_label', type: 'text', label: 'Overall Stat 4 Label', value: 'Client Satisfaction' },
            { id: 'cta_title', type: 'text', label: 'CTA Section Title', value: 'Ready to Transform Your Industry?' },
            { id: 'cta_description', type: 'textarea', label: 'CTA Description', value: 'Join the leaders who trust ASSAB to power their digital transformation and sustainable growth.' },
            { id: 'cta_button', type: 'text', label: 'CTA Button Text', value: 'Start Your Project' }
          ]
        },
        {
          id: 'projects',
          name: 'Projects Section',
          icon: BriefcaseIcon,
          description: 'Showcase of completed projects and case studies',
          lastModified: '2024-01-11T11:00:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'Our Projects' },
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Proven Excellence in Execution' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'Explore our portfolio of successful projects across telecommunications, energy, and engineering sectors throughout Africa.' },
            { id: 'filter_all', type: 'text', label: 'Filter All Label', value: 'All Projects' },
            { id: 'filter_telecom', type: 'text', label: 'Filter Telecom Label', value: 'Telecom' },
            { id: 'filter_energy', type: 'text', label: 'Filter Energy Label', value: 'Energy' },
            { id: 'filter_engineering', type: 'text', label: 'Filter Engineering Label', value: 'Engineering' },
            { id: 'project_1_title', type: 'text', label: 'Project 1 Title', value: 'Algeria National Fiber Network' },
            { id: 'project_1_category', type: 'text', label: 'Project 1 Category', value: 'telecom' },
            { id: 'project_1_location', type: 'text', label: 'Project 1 Location', value: 'Algiers, Algeria' },
            { id: 'project_1_year', type: 'text', label: 'Project 1 Year', value: '2024' },
            { id: 'project_1_client', type: 'text', label: 'Project 1 Client', value: 'Algeria Telecom' },
            { id: 'project_1_description', type: 'textarea', label: 'Project 1 Description', value: 'Comprehensive fiber optic network deployment covering 500+ km across major cities.' },
            { id: 'project_1_stat_1', type: 'text', label: 'Project 1 Stat 1', value: '500+ KM' },
            { id: 'project_1_stat_2', type: 'text', label: 'Project 1 Stat 2', value: '50 Cities' },
            { id: 'project_1_stat_3', type: 'text', label: 'Project 1 Stat 3', value: '1M+ Users' },
            { id: 'project_2_title', type: 'text', label: 'Project 2 Title', value: 'Solar Power Plant Installation' },
            { id: 'project_2_category', type: 'text', label: 'Project 2 Category', value: 'energy' },
            { id: 'project_2_location', type: 'text', label: 'Project 2 Location', value: 'Ouargla, Algeria' },
            { id: 'project_2_year', type: 'text', label: 'Project 2 Year', value: '2023' },
            { id: 'project_2_client', type: 'text', label: 'Project 2 Client', value: 'SKTM Solar' },
            { id: 'project_2_description', type: 'textarea', label: 'Project 2 Description', value: '10MW solar power plant with advanced energy storage and grid integration.' },
            { id: 'project_2_stat_1', type: 'text', label: 'Project 2 Stat 1', value: '10MW' },
            { id: 'project_2_stat_2', type: 'text', label: 'Project 2 Stat 2', value: '25 Years' },
            { id: 'project_2_stat_3', type: 'text', label: 'Project 2 Stat 3', value: '15K Homes' },
            { id: 'project_3_title', type: 'text', label: 'Project 3 Title', value: 'Smart City Infrastructure' },
            { id: 'project_3_category', type: 'text', label: 'Project 3 Category', value: 'engineering' },
            { id: 'project_3_location', type: 'text', label: 'Project 3 Location', value: 'Oran, Algeria' },
            { id: 'project_3_year', type: 'text', label: 'Project 3 Year', value: '2024' },
            { id: 'project_3_client', type: 'text', label: 'Project 3 Client', value: 'Oran Municipality' },
            { id: 'project_3_description', type: 'textarea', label: 'Project 3 Description', value: 'Complete smart city infrastructure with IoT sensors, smart lighting, and traffic management.' },
            { id: 'project_3_stat_1', type: 'text', label: 'Project 3 Stat 1', value: '200+ Sensors' },
            { id: 'project_3_stat_2', type: 'text', label: 'Project 3 Stat 2', value: '50KM Coverage' },
            { id: 'project_3_stat_3', type: 'text', label: 'Project 3 Stat 3', value: '500K Citizens' }
          ]
        },
        {
          id: 'timeline',
          name: 'Company Timeline',
          icon: DocumentTextIcon,
          description: 'Company milestones and journey timeline',
          lastModified: '2024-01-16T09:00:00Z',
          status: 'live',
          fields: [
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Our Journey' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'From startup to industry leader, discover the key milestones that have shaped ASSAB\'s growth.' },
            { id: 'milestone_1_year', type: 'text', label: 'Milestone 1 Year', value: '2020' },
            { id: 'milestone_1_title', type: 'text', label: 'Milestone 1 Title', value: 'Company Founded' },
            { id: 'milestone_1_description', type: 'textarea', label: 'Milestone 1 Description', value: 'ASSAB established with vision to transform telecom & energy landscape' },
            { id: 'milestone_2_year', type: 'text', label: 'Milestone 2 Year', value: '2021' },
            { id: 'milestone_2_title', type: 'text', label: 'Milestone 2 Title', value: 'First Major Project' },
            { id: 'milestone_2_description', type: 'textarea', label: 'Milestone 2 Description', value: 'Successful deployment of 50+ telecom towers across Algeria' },
            { id: 'milestone_3_year', type: 'text', label: 'Milestone 3 Year', value: '2022' },
            { id: 'milestone_3_title', type: 'text', label: 'Milestone 3 Title', value: '10MW Milestone' },
            { id: 'milestone_3_description', type: 'textarea', label: 'Milestone 3 Description', value: 'Reached 10MW of installed renewable energy capacity' },
            { id: 'milestone_4_year', type: 'text', label: 'Milestone 4 Year', value: '2023' },
            { id: 'milestone_4_title', type: 'text', label: 'Milestone 4 Title', value: 'Regional Expansion' },
            { id: 'milestone_4_description', type: 'textarea', label: 'Milestone 4 Description', value: 'Extended operations to 5 countries across North and West Africa' },
            { id: 'milestone_5_year', type: 'text', label: 'Milestone 5 Year', value: '2024' },
            { id: 'milestone_5_title', type: 'text', label: 'Milestone 5 Title', value: 'Innovation Hub' },
            { id: 'milestone_5_description', type: 'textarea', label: 'Milestone 5 Description', value: 'Established R&D center and launched smart city solutions' }
          ]
        },
        {
          id: 'contact',
          name: 'Contact Section',
          icon: PhoneIcon,
          description: 'Contact information and contact form',
          lastModified: '2024-01-10T13:30:00Z',
          status: 'live',
          fields: [
            { id: 'badge_text', type: 'text', label: 'Badge Text', value: 'Contact Us' },
            { id: 'section_title', type: 'text', label: 'Section Title', value: 'Let\'s Build the Future Together' },
            { id: 'section_description', type: 'textarea', label: 'Section Description', value: 'Ready to transform your infrastructure? Get in touch with our experts to discuss your telecommunications and energy requirements.' },
            { id: 'email_title', type: 'text', label: 'Email Card Title', value: 'Email Us' },
            { id: 'email_primary', type: 'text', label: 'Primary Email', value: 'info@assab.com' },
            { id: 'email_secondary', type: 'text', label: 'Secondary Email', value: 'support@assab.com' },
            { id: 'phone_title', type: 'text', label: 'Phone Card Title', value: 'Call Us' },
            { id: 'phone_primary', type: 'text', label: 'Primary Phone', value: '+213 XXX XXX XXX' },
            { id: 'phone_secondary', type: 'text', label: 'Secondary Phone', value: '+213 XXX XXX XXX' },
            { id: 'address_title', type: 'text', label: 'Address Card Title', value: 'Visit Us' },
            { id: 'address_primary', type: 'text', label: 'Address', value: 'Algiers, Algeria' },
            { id: 'address_secondary', type: 'text', label: 'Address Subtitle', value: 'North Africa Headquarters' },
            { id: 'hours_title', type: 'text', label: 'Working Hours Title', value: 'Working Hours' },
            { id: 'hours_weekdays', type: 'text', label: 'Weekday Hours', value: 'Mon - Fri: 8AM - 6PM' },
            { id: 'hours_weekend', type: 'text', label: 'Weekend Hours', value: 'Saturday: 9AM - 2PM' },
            { id: 'form_name_placeholder', type: 'text', label: 'Name Field Placeholder', value: 'Your Name' },
            { id: 'form_email_placeholder', type: 'text', label: 'Email Field Placeholder', value: 'Your Email' },
            { id: 'form_company_placeholder', type: 'text', label: 'Company Field Placeholder', value: 'Company Name' },
            { id: 'form_phone_placeholder', type: 'text', label: 'Phone Field Placeholder', value: 'Phone Number' },
            { id: 'form_subject_placeholder', type: 'text', label: 'Subject Field Placeholder', value: 'Subject' },
            { id: 'form_message_placeholder', type: 'text', label: 'Message Field Placeholder', value: 'Tell us about your project...' },
            { id: 'form_submit_button', type: 'text', label: 'Submit Button Text', value: 'Send Message' },
            { id: 'success_title', type: 'text', label: 'Success Message Title', value: 'Thank You!' },
            { id: 'success_message', type: 'textarea', label: 'Success Message Text', value: 'Your message has been sent successfully. Our team will get back to you within 24 hours.' },
            { id: 'success_button', type: 'text', label: 'Success Button Text', value: 'Send Another Message' }
          ]
        }
      ]

      setSections(mockSections)
    } catch (error) {
      toast.error('Failed to fetch content')
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditSection = (section: ContentSection) => {
    setEditingSection({ ...section })
    setSelectedSection(section.id)
  }

  const handleSaveSection = async () => {
    if (!editingSection) return

    try {
      // Mock save - In real implementation, this would save to your CMS API
      const updatedSections = sections.map(section => 
        section.id === editingSection.id 
          ? { ...editingSection, status: 'modified' as const, lastModified: new Date().toISOString() }
          : section
      )
      setSections(updatedSections)
      setEditingSection(null)
      setSelectedSection(null)
      toast.success('Content saved successfully!')
    } catch (error) {
      toast.error('Failed to save content')
      console.error('Error saving content:', error)
    }
  }

  const handlePublishSection = async (sectionId: string) => {
    try {
      // Mock publish - In real implementation, this would publish to live site
      const updatedSections = sections.map(section => 
        section.id === sectionId 
          ? { ...section, status: 'live' as const, lastModified: new Date().toISOString() }
          : section
      )
      setSections(updatedSections)
      toast.success('Section published successfully!')
    } catch (error) {
      toast.error('Failed to publish section')
      console.error('Error publishing section:', error)
    }
  }

  const handlePreviewSection = (section: ContentSection) => {
    setPreviewSection(section)
  }

  const closePreview = () => {
    setPreviewSection(null)
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    if (!editingSection) return

    setEditingSection({
      ...editingSection,
      fields: editingSection.fields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    })
  }

  const getStatusColor = (status: ContentSection['status']) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'modified':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderField = (field: ContentSection['fields'][0]) => {
    const baseClasses = "w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseClasses}
            placeholder={field.label}
          />
        )
      case 'textarea':
        return (
          <textarea
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`${baseClasses} min-h-[100px] resize-y`}
            placeholder={field.label}
            rows={4}
          />
        )
      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={field.value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={baseClasses}
              placeholder="Image URL"
            />
            {field.value && (
              <div className="text-sm text-slate-500">
                Current: {field.value}
              </div>
            )}
          </div>
        )
      default:
        return (
          <input
            type="text"
            value={field.value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseClasses}
          />
        )
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
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
          <h1 className="text-2xl font-bold text-slate-900">Website Content Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage content for all sections of your website
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {previewSection && (
            <div className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg">
              <EyeIcon className="w-4 h-4 mr-2" />
              Previewing: {previewSection.name}
            </div>
          )}
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Live Site
          </a>
          <button
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Refresh Content
          </button>
        </div>
      </div>

      {/* Content Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-3">
                  <section.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{section.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(section.status)}`}>
                    {section.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4">{section.description}</p>

            <div className="text-xs text-slate-500 mb-4">
              Last modified: {new Date(section.lastModified).toLocaleDateString()}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePreviewSection(section)}
                  className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                  title="Preview section"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditSection(section)}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Edit section"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.open(`/#${section.id}`, '_blank')}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="View live"
                >
                  <DocumentTextIcon className="w-4 h-4" />
                </button>
              </div>
              
              {section.status !== 'live' && (
                <button
                  onClick={() => handlePublishSection(section.id)}
                  className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckIcon className="w-3 h-3 mr-1" />
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center">
                <editingSection.icon className="w-6 h-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-bold text-slate-900">
                  Edit {editingSection.name}
                </h2>
              </div>
              <button
                onClick={() => {
                  setEditingSection(null)
                  setSelectedSection(null)
                }}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {editingSection.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => handlePreviewSection(editingSection)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Preview Changes
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setEditingSection(null)
                    setSelectedSection(null)
                  }}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSection}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Preview */}
      {previewSection && (
        <ContentPreview
          section={editingSection && editingSection.id === previewSection.id ? editingSection : previewSection}
          isOpen={!!previewSection}
          onClose={closePreview}
        />
      )}
    </div>
  )
}

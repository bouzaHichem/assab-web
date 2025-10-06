import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SolutionsSection from '@/components/SolutionsSection'
import IndustriesSection from '@/components/IndustriesSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactSection from '@/components/ContactSection'

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <HeroSection />
      <AboutSection />
      <SolutionsSection />
      <IndustriesSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}

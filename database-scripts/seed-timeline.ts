#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🕒 Seeding timeline milestones...')

  // Check if any milestones already exist
  const existingMilestones = await prisma.timeline.count()

  if (existingMilestones === 0) {
    // Create default timeline milestones
    const milestones = [
      {
        year: '2020',
        title: JSON.stringify({
          en: 'Company Founded',
          fr: 'Fondation de l\'Entreprise',
          ar: 'تأسيس الشركة'
        }),
        description: JSON.stringify({
          en: 'ASSAB established with vision to transform telecom & energy landscape',
          fr: 'ASSAB établi avec la vision de transformer le paysage des télécommunications et de l\'énergie',
          ar: 'تأسست أساب برؤية تحويل مشهد الاتصالات والطاقة'
        }),
        order: 1,
        isActive: true
      },
      {
        year: '2021',
        title: JSON.stringify({
          en: 'First Major Project',
          fr: 'Premier Grand Projet',
          ar: 'أول مشروع كبير'
        }),
        description: JSON.stringify({
          en: 'Successful deployment of 50+ telecom towers across Algeria',
          fr: 'Déploiement réussi de plus de 50 tours de télécommunication à travers l\'Algérie',
          ar: 'النشر الناجح لأكثر من 50 برج اتصالات عبر الجزائر'
        }),
        order: 2,
        isActive: true
      },
      {
        year: '2022',
        title: JSON.stringify({
          en: '10MW Milestone',
          fr: 'Étape de 10MW',
          ar: 'معلم 10 ميجاوات'
        }),
        description: JSON.stringify({
          en: 'Reached 10MW of installed renewable energy capacity',
          fr: 'Atteint 10MW de capacité d\'énergie renouvelable installée',
          ar: 'وصل إلى 10 ميجاوات من قدرة الطاقة المتجددة المثبتة'
        }),
        order: 3,
        isActive: true
      },
      {
        year: '2023',
        title: JSON.stringify({
          en: 'Regional Expansion',
          fr: 'Expansion Régionale',
          ar: 'التوسع الإقليمي'
        }),
        description: JSON.stringify({
          en: 'Extended operations to 5 countries across North and West Africa',
          fr: 'Étendu les opérations à 5 pays à travers l\'Afrique du Nord et de l\'Ouest',
          ar: 'توسيع العمليات إلى 5 دول عبر شمال وغرب أفريقيا'
        }),
        order: 4,
        isActive: true
      }
    ]

    for (const milestone of milestones) {
      await prisma.timeline.create({
        data: milestone
      })
    }

    console.log(`✅ Created ${milestones.length} timeline milestones`)
  } else {
    console.log(`✅ ${existingMilestones} timeline milestones already exist`)
  }

  console.log('🎉 Timeline seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding timeline:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
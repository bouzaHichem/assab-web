#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!existingAdmin) {
    // Create default admin user
    const hashedPassword = await hashPassword('admin123')
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@assab.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('✅ Created admin user:', admin.email)
  } else {
    console.log('✅ Admin user already exists')
  }

  // Create some default settings
  const settings = [
    {
      key: 'site_name',
      value: JSON.stringify('ASSAB'),
      type: 'TEXT',
      group: 'general',
      label: JSON.stringify({
        en: 'Site Name',
        fr: 'Nom du site',
        ar: 'اسم الموقع'
      }),
      description: JSON.stringify({
        en: 'The name of your website',
        fr: 'Le nom de votre site web',
        ar: 'اسم موقعك الإلكتروني'
      })
    },
    {
      key: 'site_description',
      value: JSON.stringify('Telecom & Energy Solutions'),
      type: 'TEXTAREA',
      group: 'general',
      label: JSON.stringify({
        en: 'Site Description',
        fr: 'Description du site',
        ar: 'وصف الموقع'
      })
    },
    {
      key: 'contact_email',
      value: JSON.stringify('contact@assab.com'),
      type: 'TEXT',
      group: 'contact',
      label: JSON.stringify({
        en: 'Contact Email',
        fr: 'Email de contact',
        ar: 'البريد الإلكتروني للاتصال'
      })
    },
    {
      key: 'contact_phone',
      value: JSON.stringify('+213 xxx xxx xxx'),
      type: 'TEXT',
      group: 'contact',
      label: JSON.stringify({
        en: 'Contact Phone',
        fr: 'Téléphone de contact',
        ar: 'هاتف الاتصال'
      })
    }
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('✅ Created default settings')
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
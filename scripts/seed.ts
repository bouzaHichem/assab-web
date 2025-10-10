#!/usr/bin/env tsx

import { PrismaClient, SettingType } from '@prisma/client'
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

  // Create some default settings with explicit type casting
  const settings: any[] = [
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
      }),
      description: JSON.stringify({
        en: 'A brief description of your website',
        fr: 'Une brève description de votre site web',
        ar: 'وصف مختصر لموقعك الإلكتروني'
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
      }),
      description: JSON.stringify({
        en: 'Primary contact email address',
        fr: 'Adresse email de contact principal',
        ar: 'عنوان البريد الإلكتروني للاتصال الرئيسي'
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
      }),
      description: JSON.stringify({
        en: 'Primary contact phone number',
        fr: 'Numéro de téléphone de contact principal',
        ar: 'رقم هاتف الاتصال الرئيسي'
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
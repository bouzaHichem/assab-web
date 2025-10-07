import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const createDefaultAdmin = async () => {
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminExists) {
    const hashedPassword = await hashPassword('admin123')
    
    await prisma.user.create({
      data: {
        email: 'admin@assab.com',
        name: 'System Administrator',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    })

    console.log('Default admin user created: admin@assab.com / admin123')
  }
}

export const logActivity = async (
  userId: string,
  action: string,
  resource: string,
  resourceId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent
      }
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}
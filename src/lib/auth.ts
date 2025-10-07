import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user || !user.isActive) {
          throw new Error('Invalid credentials')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Invalid credentials')
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        // Log login activity
        await prisma.activity.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            resource: 'AUTH',
            details: JSON.stringify({ method: 'credentials' })
          }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role
        token.avatar = user.avatar
      }
      
      // Refresh user data on session update
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub }
        })
        if (dbUser) {
          token.role = dbUser.role
          token.name = dbUser.name
          token.avatar = dbUser.avatar
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    signOut: '/admin/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}

// Helper functions for role-based access
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = {
    VIEWER: 1,
    EDITOR: 2,
    ADMIN: 3
  }
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
         roleHierarchy[requiredRole as keyof typeof roleHierarchy]
}

export const requireAuth = async (requiredRole: string = 'VIEWER') => {
  const { getServerSession } = await import('next-auth')
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  
  if (!hasRole(session.user.role, requiredRole)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}
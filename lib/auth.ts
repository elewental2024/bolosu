import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { validateCPF } from './utils'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        whatsapp: { label: 'WhatsApp', type: 'text' },
        cpf: { label: 'CPF', type: 'text' },
        isLogin: { label: 'Is Login', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.whatsapp || !credentials?.cpf) {
          throw new Error('WhatsApp e CPF são obrigatórios')
        }

        const whatsapp = credentials.whatsapp.replace(/[^\d]/g, '')
        const cpf = credentials.cpf.replace(/[^\d]/g, '')

        if (!validateCPF(cpf)) {
          throw new Error('CPF inválido')
        }

        const isLogin = credentials.isLogin === 'true'

        if (isLogin) {
          // Login
          const user = await prisma.user.findFirst({
            where: { whatsapp, cpf },
          })

          if (!user) {
            throw new Error('Usuário não encontrado')
          }

          return {
            id: user.id,
            name: user.name,
            whatsapp: user.whatsapp,
            cpf: user.cpf,
            role: user.role,
          }
        } else {
          // Register
          if (!credentials.name) {
            throw new Error('Nome é obrigatório')
          }

          // Check if user already exists
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [{ whatsapp }, { cpf }],
            },
          })

          if (existingUser) {
            throw new Error('WhatsApp ou CPF já cadastrado')
          }

          // Create new user
          const newUser = await prisma.user.create({
            data: {
              name: credentials.name,
              whatsapp,
              cpf,
              role: 'client',
            },
          })

          return {
            id: newUser.id,
            name: newUser.name,
            whatsapp: newUser.whatsapp,
            cpf: newUser.cpf,
            role: newUser.role,
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.whatsapp = user.whatsapp
        token.cpf = user.cpf
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.whatsapp = token.whatsapp as string
        session.user.cpf = token.cpf as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

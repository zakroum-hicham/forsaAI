import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.password) return null
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        return isValid ? user : null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GitHubProvider({
      id: 'github-candidat',
      clientId: process.env.GITHUB_CANDIDATE_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CANDIDATE_CLIENT_SECRET!
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && (account.provider === 'google' || account.provider.includes('github'))) {
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email ?? '' },
          });

  if (!existingUser) {
    // Split the name and use the first part as firstName
    const firstName = user.name?.split(' ')[0] || '';
    const role = account.provider.includes('candidat') ? 'candidat' : 'recruiter';
    existingUser = await prisma.user.create({
      data: {
        email: user.email!,
        name: user.name || '',
        firstName: firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        image: user.image || '',
        role: role,
      }
    });
  }
}


      return true; // Allow login
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.name = token.name as string
        session.user.role = token.role as string;
      }
      return session
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      // On first login, user is available
      if (user) {
        // Fetch user from DB to get full info (e.g., role)
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (dbUser) {
          token.sub = dbUser.id
          token.name = dbUser.name
          token.role = dbUser.role
        }
      }

      return token
    }
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login',  // Redirect to login if unauthorized
    // newUser: '/job/create' // it does not work maybe because i redirect auth user to dashboard

  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


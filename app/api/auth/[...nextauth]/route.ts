import NextAuth, { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          )

          const data = await res.json()

          if (!res.ok || !data?.data?.accessToken) return null

          const role = String(data.data.user.role ?? '').toUpperCase()

          if (role !== 'ADMIN') {
            throw new Error('Admin access only')
          }

          return {
            id: data.data.user.id,
            email: data.data.user.email,
            role,
            accessToken: data.data.accessToken,
            profileImage: data.data.user.profileImage,
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const role = String(user.role ?? '').toUpperCase()
        token.id = user.id
        token.email = user.email
        token.role = role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.profileImage = user.profileImage
      }

      if (trigger === 'update') {
        if (session?.user?.profileImage) {
          token.profileImage = session.user.profileImage
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: String(token.role ?? '').toUpperCase(),
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
        profileImage: token.profileImage as string,
      }
      return session
    },
  },

  pages: {
    signIn: '/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// ✅ ONLY export HTTP methods
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

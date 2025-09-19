import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { UserTier, TransactionType } from "@prisma/client"
import { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      credits: number
      tier: UserTier
    }
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    credits: number
    tier: UserTier
    githubId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    credits: number
    tier: UserTier
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile: Record<string, unknown>) {
        return {
          id: String(profile.id),
          name: (profile.name as string) || (profile.login as string),
          email: profile.email as string,
          image: profile.avatar_url as string,
          githubId: String(profile.id),
          credits: 100,
          tier: UserTier.FREE,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                githubId: String((profile as Record<string, unknown>).id),
                credits: 100,
                tier: UserTier.FREE,
              },
            })

            await prisma.creditTransaction.create({
              data: {
                userId: newUser.id,
                amount: 100,
                type: TransactionType.ADD,
                description: "Initial signup bonus",
                balance: 100,
              },
            })
          }

          return true
        } catch (error) {
          console.error("Error during sign in:", error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }

      // Always fetch fresh user data from database
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            credits: true,
            tier: true,
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.name = dbUser.name
          token.email = dbUser.email
          token.image = dbUser.image
          token.credits = dbUser.credits
          token.tier = dbUser.tier
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string | null
        session.user.email = token.email as string | null
        session.user.image = token.image as string | null
        session.user.credits = token.credits as number
        session.user.tier = token.tier as UserTier
      }

      return session
    },
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, it starts with "/". Make sure it's relative to baseUrl
      if (url.startsWith("/")) {
        // Allow explicit redirects to login page (for sign out)
        if (url === "/login") return `${baseUrl}/login`
        // If user is being redirected to root after sign in, send to dashboard instead
        if (url === "/") return `${baseUrl}/dashboard`
        return `${baseUrl}${url}`
      }
      // If it's the same origin as base URL, allow it
      else if (new URL(url).origin === baseUrl) {
        const pathname = new URL(url).pathname
        // Allow explicit redirects to login page (for sign out)
        if (pathname === "/login") return url
        // If it's the root URL, redirect to dashboard
        if (pathname === "/") return `${baseUrl}/dashboard`
        return url
      }
      // Otherwise redirect to dashboard
      return `${baseUrl}/dashboard`
    },
  },
}
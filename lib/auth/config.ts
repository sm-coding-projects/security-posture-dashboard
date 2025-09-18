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
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
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
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
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
          session.user = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
            credits: dbUser.credits,
            tier: dbUser.tier,
          }
        }
      }

      return session
    },
  },
}
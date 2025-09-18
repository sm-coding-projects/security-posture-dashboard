import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image: string
      credits: number
      tier: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image: string
    credits: number
    tier: string
    githubId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    credits: number
    tier: string
  }
}
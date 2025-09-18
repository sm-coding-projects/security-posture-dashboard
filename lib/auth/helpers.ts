import { getServerSession } from "next-auth/next"
import { authOptions } from "./config"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"
import type { Session } from "next-auth"

export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}

export async function requireAuth() {
  const session = await getSession()

  if (!session || !session.user) {
    redirect("/login")
  }

  return session
}

export async function requireAuthAPI() {
  const session = await getSession()

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  return session
}
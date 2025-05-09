import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          const sql = neon(process.env.DATABASE_URL!)

          console.log(`Attempting to find user with email: ${credentials.email}`)

          const users = await sql`
            SELECT id, email, password_hash, first_name, last_name, role
            FROM users
            WHERE email = ${credentials.email}
          `

          console.log(`Found ${users.length} users`)

          if (users.length === 0) {
            console.log("No user found with that email")
            return null
          }

          const user = users[0]
          console.log(`User found: ${user.email}, role: ${user.role}`)
          console.log(`Stored hash: ${user.password_hash.substring(0, 10)}...`)

          const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash)
          console.log(`Password match: ${passwordMatch}`)

          if (!passwordMatch) {
            console.log("Password does not match")
            return null
          }

          console.log("Authentication successful")
          return {
            id: user.id.toString(),
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
}

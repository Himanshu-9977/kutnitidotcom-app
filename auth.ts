import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import Database from "better-sqlite3"
import { z } from "zod"

// Database connection
const db = new Database("./auth.db")

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    emailVerified INTEGER,
    image TEXT,
    password TEXT,
    createdAt INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    providerAccountId TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(provider, providerAccountId)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    sessionToken TEXT UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    expires INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verificationTokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires INTEGER NOT NULL,
    PRIMARY KEY (identifier, token)
  );
`)

// Simple SQLite adapter (manual implementation)
const adapter = {
  async createUser(user: any) {
    const id = crypto.randomUUID()
    const stmt = db.prepare(
      "INSERT INTO users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)"
    )
    stmt.run(id, user.name, user.email, user.emailVerified ? Date.now() : null, user.image || null)
    return { id, ...user, emailVerified: user.emailVerified || null }
  },

  async getUser(id: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?")
    const user = stmt.get(id) as any
    if (!user) return null
    return {
      ...user,
      emailVerified: user.emailVerified ? new Date(user.emailVerified * 1000) : null
    }
  },

  async getUserByEmail(email: string) {
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?")
    const user = stmt.get(email) as any
    if (!user) return null
    return {
      ...user,
      emailVerified: user.emailVerified ? new Date(user.emailVerified * 1000) : null
    }
  },

  async getUserByAccount({ providerAccountId, provider }: any) {
    const stmt = db.prepare(
      "SELECT u.* FROM users u JOIN accounts a ON u.id = a.userId WHERE a.provider = ? AND a.providerAccountId = ?"
    )
    const user = stmt.get(provider, providerAccountId) as any
    if (!user) return null
    return {
      ...user,
      emailVerified: user.emailVerified ? new Date(user.emailVerified * 1000) : null
    }
  },

  async updateUser(user: any) {
    const stmt = db.prepare(
      "UPDATE users SET name = ?, email = ?, emailVerified = ?, image = ? WHERE id = ?"
    )
    stmt.run(user.name, user.email, user.emailVerified ? Math.floor(user.emailVerified.getTime() / 1000) : null, user.image, user.id)
    return user
  },

  async deleteUser(userId: string) {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?")
    stmt.run(userId)
  },

  async linkAccount(account: any) {
    const id = crypto.randomUUID()
    const stmt = db.prepare(
      "INSERT INTO accounts (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    stmt.run(
      id,
      account.userId,
      account.type,
      account.provider,
      account.providerAccountId,
      account.refresh_token || null,
      account.access_token || null,
      account.expires_at || null,
      account.token_type || null,
      account.scope || null,
      account.id_token || null,
      account.session_state || null
    )
    return account
  },

  async unlinkAccount({ providerAccountId, provider }: any) {
    const stmt = db.prepare("DELETE FROM accounts WHERE provider = ? AND providerAccountId = ?")
    stmt.run(provider, providerAccountId)
  },

  async createSession({ sessionToken, userId, expires }: any) {
    const id = crypto.randomUUID()
    const stmt = db.prepare(
      "INSERT INTO sessions (id, sessionToken, userId, expires) VALUES (?, ?, ?, ?)"
    )
    stmt.run(id, sessionToken, userId, Math.floor(expires.getTime() / 1000))
    return { sessionToken, userId, expires }
  },

  async getSessionAndUser(sessionToken: string) {
    const stmt = db.prepare(
      "SELECT s.*, u.* FROM sessions s JOIN users u ON s.userId = u.id WHERE s.sessionToken = ?"
    )
    const row = stmt.get(sessionToken) as any
    if (!row) return null

    const session = {
      sessionToken: row.sessionToken,
      userId: row.userId,
      expires: new Date(row.expires * 1000)
    }

    const user = {
      id: row.userId,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified ? new Date(row.emailVerified * 1000) : null,
      image: row.image
    }

    return { session, user }
  },

  async updateSession({ sessionToken, ...session }: any) {
    const stmt = db.prepare(
      "UPDATE sessions SET userId = ?, expires = ? WHERE sessionToken = ?"
    )
    stmt.run(session.userId, Math.floor(session.expires.getTime() / 1000), sessionToken)
    return { sessionToken, ...session }
  },

  async deleteSession(sessionToken: string) {
    const stmt = db.prepare("DELETE FROM sessions WHERE sessionToken = ?")
    stmt.run(sessionToken)
  },

  async createVerificationToken({ identifier, expires, token }: any) {
    const stmt = db.prepare(
      "INSERT INTO verificationTokens (identifier, token, expires) VALUES (?, ?, ?)"
    )
    stmt.run(identifier, token, Math.floor(expires.getTime() / 1000))
    return { identifier, token, expires }
  },

  async useVerificationToken({ identifier, token }: any) {
    const stmt = db.prepare(
      "SELECT * FROM verificationTokens WHERE identifier = ? AND token = ?"
    )
    const verificationToken = stmt.get(identifier, token) as any
    if (!verificationToken) return null

    const deleteStmt = db.prepare(
      "DELETE FROM verificationTokens WHERE identifier = ? AND token = ?"
    )
    deleteStmt.run(identifier, token)

    return {
      identifier: verificationToken.identifier,
      token: verificationToken.token,
      expires: new Date(verificationToken.expires * 1000)
    }
  }
}

// Login validation schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          // Find user by email
          const stmt = db.prepare("SELECT * FROM users WHERE email = ?")
          const user = stmt.get(email) as any

          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isPasswordValid = await compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch {
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})

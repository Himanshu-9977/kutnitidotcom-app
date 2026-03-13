import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { Pool } from "pg"
import { z } from "zod"

// Database connection
const pool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Initialize database tables for PostgreSQL
const initDb = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        "emailVerified" TIMESTAMP,
        image TEXT,
        password TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(provider, "providerAccountId")
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        "sessionToken" TEXT UNIQUE NOT NULL,
        "userId" TEXT NOT NULL,
        expires TIMESTAMP NOT NULL,
        CONSTRAINT fk_user_session FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "verificationTokens" (
        identifier TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires TIMESTAMP NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `)
  } catch (err) {
    console.error("Failed to initialize auth tables:", err)
  } finally {
    client.release()
  }
}

// Trigger initialization
initDb()

// Simple PostgreSQL adapter
const adapter = {
  async createUser(user: any) {
    const id = crypto.randomUUID()
    const query = 'INSERT INTO users (id, name, email, "emailVerified", image) VALUES ($1, $2, $3, $4, $5)'
    await pool.query(query, [id, user.name, user.email, user.emailVerified || null, user.image || null])
    return { id, ...user, emailVerified: user.emailVerified || null }
  },

  async getUser(id: string) {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    const user = res.rows[0]
    if (!user) return null
    return user
  },

  async getUserByEmail(email: string) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = res.rows[0]
    if (!user) return null
    return user
  },

  async getUserByAccount({ providerAccountId, provider }: any) {
    const query = `
      SELECT u.* 
      FROM users u 
      JOIN accounts a ON u.id = a."userId" 
      WHERE a.provider = $1 AND a."providerAccountId" = $2
    `
    const res = await pool.query(query, [provider, providerAccountId])
    const user = res.rows[0]
    if (!user) return null
    return user
  },

  async updateUser(user: any) {
    const query = 'UPDATE users SET name = $1, email = $2, "emailVerified" = $3, image = $4 WHERE id = $5'
    await pool.query(query, [user.name, user.email, user.emailVerified || null, user.image, user.id])
    return user
  },

  async deleteUser(userId: string) {
    await pool.query('DELETE FROM users WHERE id = $1', [userId])
  },

  async linkAccount(account: any) {
    const id = crypto.randomUUID()
    const query = `
      INSERT INTO accounts (
        id, "userId", type, provider, "providerAccountId", 
        refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `
    await pool.query(query, [
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
    ])
    return account
  },

  async unlinkAccount({ providerAccountId, provider }: any) {
    await pool.query('DELETE FROM accounts WHERE provider = $1 AND "providerAccountId" = $2', [provider, providerAccountId])
  },

  async createSession({ sessionToken, userId, expires }: any) {
    const id = crypto.randomUUID()
    const query = 'INSERT INTO sessions (id, "sessionToken", "userId", expires) VALUES ($1, $2, $3, $4)'
    await pool.query(query, [id, sessionToken, userId, expires])
    return { sessionToken, userId, expires }
  },

  async getSessionAndUser(sessionToken: string) {
    const query = `
      SELECT s.*, u.id as "uId", u.name, u.email, u."emailVerified", u.image, u.password
      FROM sessions s 
      JOIN users u ON s."userId" = u.id 
      WHERE s."sessionToken" = $1
    `
    const res = await pool.query(query, [sessionToken])
    const row = res.rows[0]
    if (!row) return null

    const session = {
      sessionToken: row.sessionToken,
      userId: row.userId,
      expires: row.expires
    }

    const user = {
      id: row.uId,
      name: row.name,
      email: row.email,
      emailVerified: row.emailVerified,
      image: row.image
    }

    return { session, user }
  },

  async updateSession({ sessionToken, ...session }: any) {
    const query = 'UPDATE sessions SET "userId" = $1, expires = $2 WHERE "sessionToken" = $3'
    await pool.query(query, [session.userId, session.expires, sessionToken])
    return { sessionToken, ...session }
  },

  async deleteSession(sessionToken: string) {
    await pool.query('DELETE FROM sessions WHERE "sessionToken" = $1', [sessionToken])
  },

  async createVerificationToken({ identifier, expires, token }: any) {
    const query = 'INSERT INTO "verificationTokens" (identifier, token, expires) VALUES ($1, $2, $3)'
    await pool.query(query, [identifier, token, expires])
    return { identifier, token, expires }
  },

  async useVerificationToken({ identifier, token }: any) {
    const selectQuery = 'SELECT * FROM "verificationTokens" WHERE identifier = $1 AND token = $2'
    const res = await pool.query(selectQuery, [identifier, token])
    const verificationToken = res.rows[0]
    if (!verificationToken) return null

    const deleteQuery = 'DELETE FROM "verificationTokens" WHERE identifier = $1 AND token = $2'
    await pool.query(deleteQuery, [identifier, token])

    return verificationToken
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
          const res = await pool.query("SELECT * FROM users WHERE email = $1", [email])
          const user = res.rows[0]

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

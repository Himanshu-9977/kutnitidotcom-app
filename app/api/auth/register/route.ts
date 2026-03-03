import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import Database from "better-sqlite3"

const db = new Database("./auth.db")

// Registration validation schema
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUserStmt = db.prepare("SELECT * FROM users WHERE email = ?")
    const existingUser = existingUserStmt.get(validatedData.email)
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hash(validatedData.password, 12)
    
    // Create user
    const id = crypto.randomUUID()
    const stmt = db.prepare(
      "INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)"
    )
    
    stmt.run(
      id,
      validatedData.name,
      validatedData.email,
      hashedPassword,
      Math.floor(Date.now() / 1000)
    )
    
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id,
          name: validatedData.name,
          email: validatedData.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, LogOut } from "lucide-react"
import { signOut } from "@/auth"

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { name, email, image } = session.user

  // Get initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container max-w-4xl py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details and account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={image || undefined} alt={name || "User"} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-2xl font-semibold">{name || "User"}</h3>
                <p className="text-sm text-muted-foreground">Member since {new Date().getFullYear()}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            {/* Account Created */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your session and account</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <Button 
                type="submit" 
                variant="destructive"
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

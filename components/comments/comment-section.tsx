"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { CommentForm } from "./comment-form"
import { CommentList } from "./comment-list"
import { getComments } from "@/app/actions/comments"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

interface Comment {
  id: string
  content: string
  userName: string
  userEmail: string
  userId: string
  documentId: string
  createdAt: string
  updatedAt: string
}

interface CommentSectionProps {
  articleId: string
  initialComments?: Comment[]
}

export function CommentSection({ articleId, initialComments = [] }: CommentSectionProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isLoading, setIsLoading] = useState(false)

  const fetchComments = async () => {
    try {
      const result = await getComments(articleId)
      if (result.error) {
        console.error("Error fetching comments:", result.error)
      } else {
        setComments(result.data as Comment[])
      }
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [articleId])

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev])
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId && c.documentId !== commentId))
  }

  const handleCommentUpdated = (commentId: string, content: string) => {
    setComments(prev => prev.map(c =>
      (c.id === commentId || c.documentId === commentId) ? { ...c, content } : c
    ))
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {session ? (
        <CommentForm
          articleId={articleId}
          onCommentAdded={fetchComments} // Fallback for safety or keep for final sync
          onCommentOptimistic={handleCommentAdded}
          user={{
            name: session.user?.name || "Anonymous",
            email: session.user?.email || ""
          }}
        />
      ) : (
        <Card className="p-6 mb-6 text-center bg-muted/30">
          <p className="text-muted-foreground mb-4">
            Please sign in to leave a comment
          </p>
          <Button asChild>
            <Link prefetch={false} href={"/login?callbackUrl=" + encodeURIComponent(pathname || "")}>
              Sign In to Comment
            </Link>
          </Button>
        </Card>
      )}

      {/* Comments List */}
      <CommentList
        comments={comments}
        isLoading={isLoading}
        currentUserId={session?.user?.id}
        onCommentDeleted={handleCommentDeleted}
        onCommentUpdated={handleCommentUpdated}
      />
    </div>
  )
}

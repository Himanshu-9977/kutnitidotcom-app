"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { createComment } from "@/app/actions/comments"

interface CommentFormProps {
  articleId: string
  onCommentAdded: () => void
  onCommentOptimistic?: (comment: any) => void
  user?: {
    name: string
    email: string
  }
}

export function CommentForm({
  articleId,
  onCommentAdded,
  onCommentOptimistic,
  user
}: CommentFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    // Optimistic Update
    if (onCommentOptimistic && user) {
      const tempId = `temp-${Date.now()}`
      onCommentOptimistic({
        id: tempId,
        documentId: tempId,
        content: content.trim(),
        userName: user.name,
        userEmail: user.email,
        userId: "temp-user-id", // Not strictly needed for display
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setContent("")
    }

    try {
      const result = await createComment(articleId, content.trim())

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("Comment posted successfully!")
      setContent("")
      onCommentAdded()
    } catch (error) {
      toast.error("Failed to post comment")
      console.error("Error posting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const remainingChars = 1000 - content.length

  return (
    <Card className="p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={4}
            disabled={isSubmitting}
            className="resize-none"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{remainingChars} characters remaining</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

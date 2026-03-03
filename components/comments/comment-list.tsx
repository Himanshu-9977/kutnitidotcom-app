"use client"

import { CommentItem } from "./comment-item"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface Comment {
  id: string
  content: string
  userName: string
  userEmail: string
  userId: string
  createdAt: string
  updatedAt: string
  documentId: string
}


interface CommentListProps {
  comments: Comment[]
  isLoading: boolean
  currentUserId?: string
  onCommentDeleted: () => void
}

export function CommentList({
  comments,
  isLoading,
  currentUserId,
  onCommentDeleted,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // console.log(comments);

  if (comments.length === 0) {
    return (
      <Card className="p-8 text-center bg-muted/30">
        <p className="text-muted-foreground">
          No comments yet. Be the first to comment!
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={currentUserId === comment.userId}
          onDeleted={onCommentDeleted}
        />
      ))}
    </div>
  )
}

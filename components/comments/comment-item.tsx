"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { Trash2, Edit2, X, Check, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { deleteComment, updateComment } from "@/app/actions/comments"

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



interface CommentItemProps {
  comment: Comment
  isOwner: boolean
  onDeleted: () => void
}

export function CommentItem({ comment, isOwner, onDeleted }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // console.log(comment);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteComment(comment.documentId)

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("Comment deleted")
      onDeleted()
    } catch (error) {
      toast.error("Failed to delete comment")
      console.error("Error deleting comment:", error)
      setIsDeleting(false)
    }
  }

  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error("Comment cannot be empty")
      return
    }

    setIsSaving(true)

    try {
      const result = await updateComment(comment.documentId, editContent.trim())

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("Comment updated")
      setIsEditing(false)
      comment.content = editContent.trim()
    } catch (error) {
      toast.error("Failed to update comment")
      console.error("Error updating comment:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditContent(comment.content)
    setIsEditing(false)
  }

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-linear-to-br from-purple-500 to-blue-500 text-white">
            {getInitials(comment.userName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold">{comment.userName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
                {comment.updatedAt !== comment.createdAt && " (edited)"}
              </p>
            </div>

            {isOwner && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  disabled={isDeleting}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={1000}
                rows={3}
                disabled={isSaving}
                className="resize-none"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

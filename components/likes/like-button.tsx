"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getLikeStatus, toggleLike } from "@/app/actions/likes"

interface LikeButtonProps {
  articleId: string
  className?: string
  showCount?: boolean
  initialLikes?: number
  initialLiked?: boolean
}

export function LikeButton({
  articleId,
  className,
  showCount = true,
  initialLikes = 0,
  initialLiked = false
}: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  // Fetch initial like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const data = await getLikeStatus(articleId)
        if (data.error) {
          console.error("Error fetching like status:", data.error)
        } else {
          setLiked(data.userHasLiked)
          setLikeCount(data.likeCount)
        }
      } catch (error) {
        console.error("Error fetching like status:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchLikeStatus()
  }, [articleId])

  const handleLike = async () => {
    if (!session) {
      toast.error("Please sign in to like articles")
      router.push("/login?callbackUrl=" + encodeURIComponent(pathname || ""))
      return
    }

    setIsLoading(true)

    // Optimistic update
    const previousLiked = liked
    const previousCount = likeCount
    setLiked(!liked)
    setLikeCount(prev => liked ? prev - 1 : prev + 1)

    try {
      const result = await toggleLike(articleId)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.liked) {
        toast.success("Article liked!")
      } else {
        toast.success("Article unliked")
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(previousLiked)
      setLikeCount(previousCount)
      toast.error("Failed to update like")
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("gap-2", className)}
        disabled
      >
        <Heart className="h-4 w-4" />
        {showCount && <span className="text-sm">...</span>}
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "gap-2 transition-all",
        liked && "text-red-500 hover:text-red-600",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          liked && "fill-current"
        )}
      />
      {showCount && (
        <span className="text-sm font-medium">
          {likeCount}
        </span>
      )}
    </Button>
  )
}

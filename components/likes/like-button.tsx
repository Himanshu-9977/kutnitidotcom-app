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
  /** Like count pre-fetched server-side — shown immediately, no client fetch needed */
  initialLikes?: number
  /** Only meaningful when passed from a server that confirmed the user's liked state */
  initialLiked?: boolean
}

export function LikeButton({
  articleId,
  className,
  showCount = true,
  initialLikes = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)
  // Only true while fetching user-specific liked status for authenticated users.
  // Guests never enter this state — initialLiked = false is already correct for them.
  const [isCheckingUserLike, setIsCheckingUserLike] = useState(false)

  // ==========================================================================
  // Fetch user-specific liked status ONLY when a session is confirmed.
  // Guests: no fetch, no edge request — initialLiked (false) is used as-is.
  // Authenticated users: 1 edge request to get their personal liked state.
  // The like COUNT is already accurate from initialLikes (server-fetched, ISR).
  // ==========================================================================
  useEffect(() => {
    if (!session?.user?.id) return // guests: skip entirely

    let cancelled = false
    setIsCheckingUserLike(true)

    getLikeStatus(articleId).then((data) => {
      if (cancelled) return
      if (!data.error) {
        setLiked(data.userHasLiked)
        // Keep count from initialLikes unless the server returns something more
        // current (e.g. article was liked by others since ISR was last revalidated)
        setLikeCount(data.likeCount)
      }
    }).catch(() => {
      // Non-fatal: button still works, just shows initialLiked = false
    }).finally(() => {
      if (!cancelled) setIsCheckingUserLike(false)
    })

    return () => { cancelled = true }
  }, [articleId, session?.user?.id])

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

  // Show a subtle loading state only while fetching the user's liked status.
  // The like count (from initialLikes) is always shown immediately — no blank flash.
  if (isCheckingUserLike) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("gap-2", className)}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {showCount && <span className="text-sm">{likeCount}</span>}
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

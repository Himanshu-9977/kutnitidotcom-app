"use server"

import { auth } from "@/auth"
import { revalidatePath, revalidateTag } from "next/cache"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function getLikeStatus(articleId: string) {
  console.log("getLikeStatus called for:", articleId)
  const session = await auth()
  console.log("Session:", session?.user?.email)

  try {
    // Get total like count for the article
    console.log("Fetching like count from:", `${STRAPI_URL}/api/likes?filters[article][id][$eq]=${articleId}&pagination[pageSize]=0`)
    const countResponse = await fetch(
      `${STRAPI_URL}/api/likes?filters[article][id][$eq]=${articleId}&pagination[pageSize]=0`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        next: { tags: [`likes-${articleId}`] },
      }
    )

    if (!countResponse.ok) {
      const errorText = await countResponse.text()
      console.error("Failed to fetch like count:", countResponse.status, errorText)
      throw new Error("Failed to fetch like count")
    }

    const countData = await countResponse.json()
    const likeCount = countData.meta.pagination.total

    // If user is logged in, check if they've liked this article
    let userHasLiked = false
    if (session?.user?.id) {
      const userLikeResponse = await fetch(
        `${STRAPI_URL}/api/likes?filters[article][id][$eq]=${articleId}&filters[userId][$eq]=${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
          next: { tags: [`user-like-${session.user.id}-${articleId}`] },
        }
      )

      if (userLikeResponse.ok) {
        const userLikeData = await userLikeResponse.json()
        userHasLiked = userLikeData.data.length > 0
      }
    }

    return {
      likeCount,
      userHasLiked,
      isAuthenticated: !!session?.user,
    }
  } catch (error) {
    console.error("Error fetching like status:", error)
    return {
      error: "Failed to fetch like status",
      likeCount: 0,
      userHasLiked: false,
      isAuthenticated: !!session?.user,
    }
  }
}

export async function toggleLike(articleId: string) {
  console.log("toggleLike called for:", articleId)
  const session = await auth()

  if (!session?.user) {
    console.log("Unauthorized toggleLike attempt")
    return { error: "Unauthorized" }
  }

  try {
    // Check if user has already liked this article
    const existingLikeResponse = await fetch(
      `${STRAPI_URL}/api/likes?filters[article][id][$eq]=${articleId}&filters[userId][$eq]=${session.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        cache: "no-store",
      }
    )

    if (!existingLikeResponse.ok) {
      console.error("Failed to check existing like:", existingLikeResponse.status)
      throw new Error("Failed to check existing like")
    }

    const existingLikeData = await existingLikeResponse.json()
    console.log("Existing like data:", existingLikeData)

    // Toggle: if like exists, delete it; otherwise, create it
    if (existingLikeData.data.length > 0) {
      // Unlike: delete the existing like
      const likeId = existingLikeData.data[0].id
      console.log("Deleting like:", likeId)
      const deleteResponse = await fetch(`${STRAPI_URL}/api/likes/${likeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
      })

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text()
        console.error("Failed to unlike:", deleteResponse.status, errorText)
        throw new Error("Failed to unlike")
      }

      revalidateTag(`likes-${articleId}`, "max")
      revalidateTag(`user-like-${session.user.id}-${articleId}`, "max")
      return { liked: false }
    } else {
      // Like: create a new like
      console.log("Creating new like")
      const createResponse = await fetch(`${STRAPI_URL}/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            article: articleId,
            userId: session.user.id,
            userEmail: session.user.email,
          },
        }),
      })

      if (!createResponse.ok) {
        const errorText = await createResponse.text()
        console.error("Failed to like:", createResponse.status, errorText)
        throw new Error("Failed to like")
      }

      revalidateTag(`likes-${articleId}`, "max")
      revalidateTag(`user-like-${session.user.id}-${articleId}`, "max")
      return { liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return { error: "Failed to toggle like" }
  }
}

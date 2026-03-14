"use server"

import { auth } from "@/auth"
import { revalidatePath, revalidateTag } from "next/cache"

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export async function getComments(articleId: string) {
  if (!articleId) {
    return { error: "Article ID is required", data: [] }
  }

  try {
    const response = await fetch(
      `${STRAPI_URL}/api/comments?filters[article][documentId][$eq]=${articleId}&sort=createdAt:desc&pagination[pageSize]=100`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        next: { tags: [`comments-${articleId}`] },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch comments")
    }

    const data = await response.json()
    const comments = data.data?.map((item: any) => {
      // Handle both flat and nested structure
      if (item.attributes) {
        return {
          id: item.documentId || item.id,
          ...item.attributes,
        }
      }
      // For flat structure, use documentId if valid, otherwise fallback to id
      return {
        ...item,
        id: item.documentId || item.id
      }
    }) || []

    return { data: comments }
  } catch (error) {
    console.error("Error fetching comments:", error)
    return { error: "Failed to fetch comments", data: [] }
  }
}

export async function createComment(articleId: string, content: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  if (!content || !articleId) {
    return { error: "Content and article ID are required" }
  }

  if (content.length > 1000) {
    return { error: "Comment is too long (max 1000 characters)" }
  }

  try {
    const response = await fetch(`${STRAPI_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          content,
          article: articleId,
          userId: session.user.id,
          userEmail: session.user.email,
          userName: session.user.name || session.user.email,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create comment")
    }

    revalidateTag(`comments-${articleId}`, "max")
    return { success: true }
  } catch (error) {
    console.error("Error creating comment:", error)
    return { error: "Failed to create comment" }
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  try {
    console.log(`Attempting to delete comment: ${commentId}`)
    // First, fetch the comment to verify ownership
    const url = `${STRAPI_URL}/api/comments/${commentId}?populate=article`
    console.log(`Fetching comment from: ${url}`)

    const getResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!getResponse.ok) {
      console.error(`Fetch failed for ${url}: ${getResponse.status} ${getResponse.statusText}`)
      const text = await getResponse.text()
      console.error(`Response body: ${text}`)
      return { error: "Comment not found" }
    }

    const commentData = await getResponse.json()
    const comment = commentData.data

    // Normalize comment data (handle active/nested structure)
    const userId = comment.userId || comment.attributes?.userId
    const articleId = comment.article?.documentId || comment.article?.id || comment.attributes?.article?.data?.documentId || comment.attributes?.article?.data?.id

    // Check if the user owns this comment
    if (userId !== session.user.id) {
      return { error: "Forbidden: You can only delete your own comments" }
    }

    // Delete the comment
    const deleteResponse = await fetch(`${STRAPI_URL}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    })

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete comment")
    }

    if (articleId) {
      revalidateTag(`comments-${articleId}`, "max")
    }
    return { success: true }
  } catch (error) {
    console.error("Error deleting comment:", error)
    return { error: "Failed to delete comment" }
  }
}

export async function updateComment(commentId: string, content: string) {
  const session = await auth()

  if (!session?.user) {
    return { error: "Unauthorized" }
  }

  if (!content || content.length === 0) {
    return { error: "Content is required" }
  }

  if (content.length > 1000) {
    return { error: "Comment is too long (max 1000 characters)" }
  }

  try {
    // First, fetch the comment to verify ownership
    const getResponse = await fetch(`${STRAPI_URL}/api/comments/${commentId}?populate=article`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: "no-store",
    })

    if (!getResponse.ok) {
      return { error: "Comment not found" }
    }

    const commentData = await getResponse.json()
    const comment = commentData.data

    // Normalize comment data
    const userId = comment.userId || comment.attributes?.userId
    const articleId = comment.article?.documentId || comment.article?.id || comment.attributes?.article?.data?.documentId || comment.attributes?.article?.data?.id

    // Check if the user owns this comment
    if (userId !== session.user.id) {
      return { error: "Forbidden: You can only edit your own comments" }
    }

    // Update the comment
    const updateResponse = await fetch(`${STRAPI_URL}/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          content,
        },
      }),
    })

    if (!updateResponse.ok) {
      throw new Error("Failed to update comment")
    }

    if (articleId) {
      revalidateTag(`comments-${articleId}`, "max")
    }
    return { success: true }
  } catch (error) {
    console.error("Error updating comment:", error)
    return { error: "Failed to update comment" }
  }
}

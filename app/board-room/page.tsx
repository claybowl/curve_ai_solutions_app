"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Send,
  Pin,
  Lightbulb,
  HelpCircle,
  Megaphone,
  MoreVertical,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/supabase-client"
import { useBoardRoom } from "@/hooks/use-realtime"
import {
  getBoardRoomPosts,
  createBoardRoomPost,
  togglePostLike,
  deleteBoardRoomPost,
  getPostReplies,
} from "@/app/actions/boardroom-actions"
import type { BoardRoomPostWithAuthor, UserPresence } from "@/types/consultations"

type PostType = "text" | "announcement" | "question" | "tip"

export default function BoardRoomPage() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [posts, setPosts] = useState<BoardRoomPostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPost, setNewPost] = useState("")
  const [postType, setPostType] = useState<PostType>("text")
  const [submitting, setSubmitting] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [repliesMap, setRepliesMap] = useState<Record<string, BoardRoomPostWithAuthor[]>>({})

  // Load user
  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  // Real-time hook
  const { isConnected, onlineUsers } = useBoardRoom({
    userId: user?.id ?? "",
    userPresence: user ? {
      user_id: user.id,
      status: "online",
      current_page: "/board-room",
    } : undefined,
    onPost: (post, eventType) => {
      if (eventType === "INSERT") {
        if (post.reply_to_id) {
          // It's a reply
          setRepliesMap((prev) => ({
            ...prev,
            [post.reply_to_id!]: [...(prev[post.reply_to_id!] || []), post as BoardRoomPostWithAuthor],
          }))
        } else {
          // It's a top-level post
          setPosts((prev) => [post as BoardRoomPostWithAuthor, ...prev])
        }
      } else if (eventType === "DELETE") {
        setPosts((prev) => prev.filter((p) => p.id !== post.id))
      }
    },
  })

  // Load posts
  useEffect(() => {
    async function loadPosts() {
      setLoading(true)
      const result = await getBoardRoomPosts()
      if (result.success && result.posts) {
        setPosts(result.posts)
      } else {
        setError(result.error ?? "Failed to load posts")
      }
      setLoading(false)
    }
    loadPosts()
  }, [])

  // Create post
  const handleCreatePost = async () => {
    if (!newPost.trim() || submitting) return

    setSubmitting(true)
    const result = await createBoardRoomPost({
      content: newPost.trim(),
      content_type: postType,
    })

    if (result.success) {
      setNewPost("")
      setPostType("text")
    } else {
      setError(result.error ?? "Failed to create post")
    }
    setSubmitting(false)
  }

  // Reply to post
  const handleReply = async (postId: string) => {
    if (!replyContent.trim() || submitting) return

    setSubmitting(true)
    const result = await createBoardRoomPost({
      content: replyContent.trim(),
      reply_to_id: postId,
    })

    if (result.success) {
      setReplyContent("")
      setReplyingTo(null)
    } else {
      setError(result.error ?? "Failed to post reply")
    }
    setSubmitting(false)
  }

  // Toggle like
  const handleLike = async (postId: string) => {
    const result = await togglePostLike(postId)
    if (result.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                user_has_liked: result.liked,
                like_count: p.like_count + (result.liked ? 1 : -1),
              }
            : p
        )
      )
    }
  }

  // Delete post
  const handleDelete = async (postId: string) => {
    const result = await deleteBoardRoomPost(postId)
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    }
  }

  // Load replies
  const toggleReplies = async (postId: string) => {
    if (expandedReplies.has(postId)) {
      setExpandedReplies((prev) => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    } else {
      if (!repliesMap[postId]) {
        const result = await getPostReplies(postId)
        if (result.success && result.replies) {
          setRepliesMap((prev) => ({ ...prev, [postId]: result.replies! }))
        }
      }
      setExpandedReplies((prev) => new Set([...prev, postId]))
    }
  }

  // Get post type icon
  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      case "question":
        return <HelpCircle className="h-4 w-4" />
      case "tip":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  // Get post type color
  const getPostTypeColor = (type: PostType) => {
    switch (type) {
      case "announcement":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30"
      case "question":
        return "bg-violet-500/10 text-violet-400 border-violet-500/30"
      case "tip":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      default:
        return "bg-sky-500/10 text-sky-400 border-sky-500/30"
    }
  }

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  // Get initials
  const getInitials = (author?: BoardRoomPostWithAuthor["author"]) => {
    if (!author) return "?"
    if (author.first_name && author.last_name) {
      return `${author.first_name[0]}${author.last_name[0]}`.toUpperCase()
    }
    if (author.email) {
      return author.email[0].toUpperCase()
    }
    return "?"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="container max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-50">Board Room</h1>
                <p className="text-sm text-slate-400">Community waiting room</p>
              </div>
            </div>
            
            {/* Online Users */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-emerald-400" : "bg-red-400"
              )} />
              <span className="text-sm text-slate-400">
                {onlineUsers.length} online
              </span>
              {onlineUsers.length > 0 && (
                <div className="flex -space-x-2">
                  {onlineUsers.slice(0, 5).map((presence, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-[#030712]">
                      <AvatarFallback className="text-xs bg-indigo-500">
                        {presence.user_id?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {onlineUsers.length > 5 && (
                    <div className="h-8 w-8 rounded-full bg-slate-700 border-2 border-[#030712] flex items-center justify-center text-xs text-slate-300">
                      +{onlineUsers.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="neon-line" />
        </div>

        {/* Compose Area */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <div className="flex gap-2 mb-4">
            {(["text", "question", "tip"] as PostType[]).map((type) => (
              <Button
                key={type}
                variant={postType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setPostType(type)}
                className={postType === type ? "bg-sky-500 hover:bg-sky-400" : ""}
              >
                {getPostTypeIcon(type)}
                <span className="ml-1.5 capitalize">{type}</span>
              </Button>
            ))}
          </div>
          
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={
              postType === "question"
                ? "Ask a question to the community..."
                : postType === "tip"
                ? "Share a helpful tip..."
                : "Share something with the community..."
            }
            className="min-h-[100px] bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-500 mb-4"
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleCreatePost}
              disabled={!newPost.trim() || submitting}
              className="bg-sky-500 hover:bg-sky-400"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post
            </Button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 glass-panel rounded-xl border-red-500/30 bg-red-500/5">
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="text-red-400 p-0 h-auto mt-1"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-6 rounded-xl">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author?.avatar_url} />
                    <AvatarFallback className="bg-indigo-500">
                      {getInitials(post.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-50">
                        {post.author?.first_name ?? post.author?.email ?? "Anonymous"}
                      </span>
                      {post.is_pinned && (
                        <Pin className="h-3 w-3 text-amber-400" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {getRelativeTime(post.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getPostTypeColor(post.content_type))}
                  >
                    {getPostTypeIcon(post.content_type)}
                    <span className="ml-1 capitalize">{post.content_type}</span>
                  </Badge>

                  {post.author_id === user?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <p className="text-slate-200 whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleLike(post.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm transition-colors",
                    post.user_has_liked
                      ? "text-pink-400"
                      : "text-slate-400 hover:text-pink-400"
                  )}
                >
                  <Heart
                    className={cn("h-4 w-4", post.user_has_liked && "fill-current")}
                  />
                  {post.like_count}
                </button>

                <button
                  onClick={() => toggleReplies(post.id)}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  {post.reply_count} {post.reply_count === 1 ? "reply" : "replies"}
                  {expandedReplies.has(post.id) ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                <button
                  onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  className="text-sm text-slate-400 hover:text-sky-400 transition-colors"
                >
                  Reply
                </button>
              </div>

              {/* Reply Input */}
              {replyingTo === post.id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="min-h-[80px] bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-500 mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleReply(post.id)}
                      disabled={!replyContent.trim() || submitting}
                      className="bg-sky-500 hover:bg-sky-400"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Reply"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {expandedReplies.has(post.id) && repliesMap[post.id] && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                  {repliesMap[post.id].map((reply) => (
                    <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-white/10">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={reply.author?.avatar_url} />
                        <AvatarFallback className="text-xs bg-sky-500">
                          {getInitials(reply.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-slate-50">
                            {reply.author?.first_name ?? reply.author?.email ?? "Anonymous"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getRelativeTime(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{reply.content}</p>
                        <button
                          onClick={() => handleLike(reply.id)}
                          className={cn(
                            "flex items-center gap-1 text-xs mt-2 transition-colors",
                            reply.user_has_liked
                              ? "text-pink-400"
                              : "text-slate-500 hover:text-pink-400"
                          )}
                        >
                          <Heart
                            className={cn("h-3 w-3", reply.user_has_liked && "fill-current")}
                          />
                          {reply.like_count}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="glass-panel p-12 rounded-xl text-center">
              <div className="h-20 w-20 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">
                Welcome to the Board Room
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                This is the community waiting room. Share thoughts, ask questions, or give tips while waiting for your consultation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

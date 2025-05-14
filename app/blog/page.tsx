import { Metadata } from "next"
import { BlogHero } from "@/components/blog/blog-hero"
import { BlogPosts } from "@/components/blog/blog-posts"

export const metadata: Metadata = {
  title: "Blog | Curve AI Solutions",
  description: "Insights, updates, and thought leadership on AI agent infrastructure and development.",
}

export default async function BlogPage() {
  return (
    <div className="min-h-screen">
      <BlogHero />
      <div className="container py-12">
        <BlogPosts />
      </div>
    </div>
  )
} 
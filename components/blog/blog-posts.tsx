import Link from "next/link"
import { getBlogPosts } from "@/lib/notion"
import { formatDate } from "@/lib/utils"

export async function BlogPosts() {
  try {
    const posts = await getBlogPosts()
    
    // If no posts are returned, show placeholder posts
    if (!posts || posts.length === 0) {
      return <FallbackBlogPosts />
    }

    return (
      <div className="space-y-16">
        {posts.map((post: any) => {
          const properties = post.properties
          const title = properties.Title?.title[0]?.plain_text || "Untitled"
          const description = properties.Description?.rich_text[0]?.plain_text || ""
          const date = properties.Date?.date?.start
          const slug = properties.Slug?.rich_text[0]?.plain_text || post.id

          return (
            <article key={post.id} className="flex flex-col items-start">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={date} className="text-gray-500">
                  {formatDate(date)}
                </time>
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-blue-600">
                  <Link href={`/blog/${slug}`}>
                    <span className="absolute inset-0" />
                    {title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return <FallbackBlogPosts />
  }
}

// Fallback component with placeholder posts when Notion API fails
function FallbackBlogPosts() {
  const placeholderPosts = [
    {
      id: "placeholder-1",
      title: "Getting Started with Curve AI",
      description: "Learn how to implement AI agents into your business workflow with Curve AI's platform.",
      date: new Date().toISOString(),
      slug: "getting-started-with-curve-ai"
    },
    {
      id: "placeholder-2",
      title: "The Future of AI Infrastructure",
      description: "Explore how modern AI infrastructure is evolving and what it means for your organization.",
      date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      slug: "future-of-ai-infrastructure"
    }
  ]
  
  return (
    <div className="space-y-16">
      {placeholderPosts.map(post => (
        <article key={post.id} className="flex flex-col items-start">
          <div className="flex items-center gap-x-4 text-xs">
            <time dateTime={post.date} className="text-gray-500">
              {formatDate(post.date)}
            </time>
          </div>
          <div className="group relative">
            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-blue-600">
              <Link href={`/blog/${post.slug}`}>
                <span className="absolute inset-0" />
                {post.title}
              </Link>
            </h3>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {post.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
} 
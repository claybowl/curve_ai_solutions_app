import { notFound } from "next/navigation"
import { getBlogPost, getRichContent } from "@/lib/notion"
import { NotionRenderer } from "@/components/blog/notion-renderer"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Fix for Next.js params warning - ensure params is fully resolved
  const slug = params?.slug;
  if (!slug) {
    return notFound();
  }
  
  try {
    // For placeholder posts defined in the FallbackBlogPosts component
    if (slug === "getting-started-with-curve-ai" || slug === "future-of-ai-infrastructure") {
      return <PlaceholderBlogPost slug={slug} />
    }
    
    const { page, blocks } = await getBlogPost(slug)
    const richContent = await getRichContent(slug)
    
    const title = page.properties.Title?.title[0]?.plain_text || "Untitled"
    const date = page.properties.Date?.date?.start
    
    return (
      <article className="container py-12 max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
          {date && (
            <time className="mt-2 text-gray-500" dateTime={date}>
              {new Date(date).toLocaleDateString()}
            </time>
          )}
        </header>
        
        <div className="prose dark:prose-invert max-w-none">
          {richContent && <NotionRenderer recordMap={richContent} />}
        </div>
      </article>
    )
  } catch (error) {
    console.error("Error fetching blog post:", error)
    
    // If it's one of our placeholder slugs, show placeholder content
    if (slug === "getting-started-with-curve-ai" || slug === "future-of-ai-infrastructure") {
      return <PlaceholderBlogPost slug={slug} />
    }
    
    notFound()
  }
}

function PlaceholderBlogPost({ slug }: { slug: string }) {
  const posts = {
    "getting-started-with-curve-ai": {
      title: "Getting Started with Curve AI",
      date: new Date().toISOString(),
      content: `
        <h2>Introduction to Curve AI</h2>
        <p>
          Welcome to Curve AI, the cutting-edge platform for AI agent infrastructure and development. This guide will walk you through the basics of getting started with our platform.
        </p>
        
        <h2>Why Choose Curve AI?</h2>
        <p>
          Curve AI offers a comprehensive suite of tools designed to help businesses implement AI solutions quickly and efficiently. Our platform provides:
        </p>
        <ul>
          <li>Simplified agent development workflows</li>
          <li>Scalable infrastructure for AI deployment</li>
          <li>Integration with popular AI models and frameworks</li>
          <li>Robust monitoring and analytics</li>
        </ul>
        
        <h2>Setting Up Your First Project</h2>
        <p>
          Getting started with Curve AI is easy. Simply create an account, define your project parameters, and you're ready to begin building your AI solution.
        </p>
      `
    },
    "future-of-ai-infrastructure": {
      title: "The Future of AI Infrastructure",
      date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      content: `
        <h2>Evolution of AI Infrastructure</h2>
        <p>
          As AI becomes increasingly central to business operations, the infrastructure supporting these systems must evolve to meet new demands for scalability, reliability, and performance.
        </p>
        
        <h2>Key Trends Shaping AI Infrastructure</h2>
        <p>
          Several important trends are emerging in the AI infrastructure landscape:
        </p>
        <ul>
          <li>Distributed computing architectures optimized for AI workloads</li>
          <li>Edge computing to reduce latency and improve real-time processing</li>
          <li>Specialized hardware accelerators for AI model training and inference</li>
          <li>Containerization and orchestration for flexible deployment</li>
        </ul>
        
        <h2>Preparing for the Future</h2>
        <p>
          Organizations looking to stay competitive in the AI space should invest in flexible, scalable infrastructure that can adapt to rapidly evolving technologies and use cases.
        </p>
      `
    }
  }
  
  const post = posts[slug as keyof typeof posts]
  
  if (!post) {
    notFound()
  }
  
  return (
    <article className="container py-12 max-w-3xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {post.title}
        </h1>
        <time className="mt-2 text-gray-500" dateTime={post.date}>
          {new Date(post.date).toLocaleDateString()}
        </time>
      </header>
      
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
} 
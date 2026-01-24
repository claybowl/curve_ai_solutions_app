import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Beaker, Bot, ShoppingCart, Music, Sparkles, BookOpen, Image, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Labs - Experimental Projects | Donjon Systems",
  description: "Explore experimental AI agents, creative tools, and innovative applications from Donjon Labs.",
}

const aiAgents = [
  {
    name: "Taygency",
    description: "Multi-agent AI system for complex task orchestration and autonomous workflows.",
    status: "In Development",
    icon: Bot,
  },
  {
    name: "Alfie",
    description: "AI business assistant with personality-driven interactions for customer engagement.",
    status: "Beta",
    icon: Bot,
  },
  {
    name: "Know-Defeat",
    description: "Competitive intelligence AI that analyzes market trends and competitor strategies.",
    status: "Alpha",
    icon: Bot,
  },
  {
    name: "Amazon Listing Enhancer",
    description: "AI-powered tool for optimizing Amazon product listings with SEO and conversion focus.",
    status: "Beta",
    icon: ShoppingCart,
  },
]

const creativeProjects = [
  {
    name: "Womp Womp Factory",
    description: "Claybowl's playful creative experiment - because sometimes you just need some womp womp.",
    url: "https://clay-loves-the-womp-womp.vercel.app/",
    icon: Sparkles,
  },
  {
    name: "Spotify Taste Classifier",
    description: "Analyze your Spotify listening habits and discover your music personality profile.",
    url: "https://spotify-classifier.vercel.app/",
    icon: Music,
  },
  {
    name: "Velvet Willow Moodboard",
    description: "Visual inspiration and moodboard creation tool with aesthetic curation.",
    url: "https://velvet-willow-moodboard.vercel.app/",
    icon: Image,
  },
  {
    name: "Ancient Tarot Wisdom",
    description: "Digital tarot and I Ching readings combining ancient wisdom with modern interfaces.",
    url: "https://ancient-tarot-wisdom.vercel.app/",
    icon: BookOpen,
  },
  {
    name: "Knotty by Nature",
    description: "Full-featured e-commerce store demonstrating modern online retail capabilities.",
    url: "https://knottybynature.vercel.app/",
    icon: ShoppingCart,
  },
  {
    name: "Clayton Christian Portfolio",
    description: "Personal portfolio showcasing development work, projects, and professional experience.",
    url: "https://clayton-christian.vercel.app/",
    icon: User,
  },
]

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-[#030712]">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 ambient-bg opacity-30" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 mb-6">
              <Beaker className="h-4 w-4 text-sky-400" />
              <span className="text-sm font-mono text-sky-400">EXPERIMENTAL</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6">
              Donjon Labs
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
              Where ideas become experiments. Explore AI agents in development, creative side projects,
              and innovative tools pushing the boundaries of what's possible.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Bot className="h-6 w-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-slate-50">AI Agents in Development</h2>
            <div className="neon-line flex-1" />
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {aiAgents.map((agent) => (
              <Card key={agent.name} className="glass-panel border-white/10 hover:border-sky-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                    <agent.icon className="h-6 w-6 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-sky-400">{agent.name}</CardTitle>
                      <span className="text-xs font-mono px-2 py-1 rounded-full bg-sky-500/10 text-sky-400">
                        {agent.status}
                      </span>
                    </div>
                    <CardContent className="text-slate-400 p-0">
                      {agent.description}
                    </CardContent>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="h-6 w-6 text-sky-400" />
            <h2 className="text-2xl font-bold text-slate-50">Creative Projects & Demos</h2>
            <div className="neon-line flex-1" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creativeProjects.map((project) => (
              <Card key={project.name} className="glass-panel border-white/10 hover:border-sky-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <project.icon className="h-6 w-6 text-sky-400" />
                  </div>
                  <CardTitle className="text-sky-400 mb-2">{project.name}</CardTitle>
                  <CardContent className="text-slate-400 p-0 mb-4">
                    {project.description}
                  </CardContent>
                  <Button
                    variant="outline"
                    className="w-full border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                    asChild
                  >
                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/20 to-transparent">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-50 mb-4">Have an Idea?</h2>
          <p className="text-xl text-slate-400 mb-8">
            Labs is where experimentation happens. If you have an interesting project concept,
            let's explore it together.
          </p>
          <Button
            size="lg"
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold"
            asChild
          >
            <Link href="/consultation">Start a Conversation</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

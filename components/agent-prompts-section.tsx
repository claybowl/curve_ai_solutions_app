"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AgentPromptsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-4">Explore Agent Prompts</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover a variety of AI agent prompts designed to streamline your workflows and enhance productivity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">Task Decomposition Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Breaks down complex project requirements into manageable subtasks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">Schema Design Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Generates complete ZenStack/Prisma schemas with access policies.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">API Integration Expert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Designs tRPC router implementations with React Query hooks.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
            <Link href="/solutions/prompts">View All Prompts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

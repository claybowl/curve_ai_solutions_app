"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TradingPromptsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1A365D] dark:text-white mb-4">Algorithmic Trading Prompts</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Specialized prompts for developing and optimizing algorithmic trading systems.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">Capital Allocation Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Optimize how trading capital is distributed among algorithms to maximize returns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">Risk Management System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Add safeguards to prevent excessive losses during adverse market conditions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-[#0076FF]/50 transition-all">
            <CardHeader>
              <CardTitle className="dark:text-gray-900 font-bold">Backtesting Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-700">
                Enable historical simulation of trading strategies before deploying capital.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
            <Link href="/solutions/prompts">View All Trading Prompts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

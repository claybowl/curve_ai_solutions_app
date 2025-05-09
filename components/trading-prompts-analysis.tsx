"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/custom-card"

export function TradingPromptsAnalysis() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1A365D] dark:text-white">Algorithmic Trading Prompts Analysis</h2>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="dark:text-white dark:border-gray-600"
        >
          {isExpanded ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-6 mt-4">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This analysis examines 10 high-value prompts designed for algorithmic trading system development. Each
              prompt addresses a key aspect of trading system architecture, from strategy implementation to risk
              management. The prompts have been generalized to be applicable to any algorithmic trading framework,
              regardless of specific implementation details.
            </p>
            <p>Each prompt is scored on a scale of 1-10 across four dimensions:</p>
            <ul>
              <li>
                <strong>Specificity</strong>: How precisely the prompt targets a defined problem area
              </li>
              <li>
                <strong>Complexity</strong>: The technical depth of the solution being requested
              </li>
              <li>
                <strong>Usefulness</strong>: Practical utility for trading system developers
              </li>
              <li>
                <strong>Impact</strong>: Potential to improve system performance or functionality
              </li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold dark:text-white mt-6">Prompt Analysis</h3>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">1. Implementing a New Trading Strategy</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 8.75/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 8/10</div>
                  <div>Usefulness: 10/10</div>
                  <div>Impact: 9/10</div>
                </div>
                <p className="mt-3">
                  This prompt addresses the fundamental need for expanding a trading system's repertoire of strategies.
                  By focusing on both technical implementation and operational needs, it produces well-structured,
                  maintainable strategy implementations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">2. Performance Metrics Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 9.0/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 9/10</div>
                  <div>Complexity: 8/10</div>
                  <div>Usefulness: 9/10</div>
                  <div>Impact: 10/10</div>
                </div>
                <p className="mt-3">
                  Performance measurement is crucial for algorithmic trading systems. This prompt focuses on expanding
                  evaluation capabilities beyond standard metrics, enabling more nuanced assessment of trading
                  strategies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">3. Market Data Integration</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 8.5/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 9/10</div>
                  <div>Usefulness: 9/10</div>
                  <div>Impact: 8/10</div>
                </div>
                <p className="mt-3">
                  Quality and breadth of market data are foundational to algorithmic trading success. This prompt
                  addresses the complete workflow of integrating new data sources: acquisition, processing, storage, and
                  error handling.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">4. Capital Allocation Strategy</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 9.25/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 9/10</div>
                  <div>Usefulness: 10/10</div>
                  <div>Impact: 10/10</div>
                </div>
                <p className="mt-3">
                  This prompt addresses the critical question of how to distribute limited capital across multiple
                  strategies. The capital allocation decision directly impacts overall system returns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">5. Algorithm Selection Framework</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 9.25/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 7/10</div>
                  <div>Complexity: 10/10</div>
                  <div>Usefulness: 10/10</div>
                  <div>Impact: 10/10</div>
                </div>
                <p className="mt-3">
                  Not all strategies perform well in all market conditions. This prompt addresses the need for
                  intelligent selection among available strategies based on multiple evaluation factors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">6. Database Optimization</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 8.25/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 8/10</div>
                  <div>Usefulness: 9/10</div>
                  <div>Impact: 8/10</div>
                </div>
                <p className="mt-3">
                  Algorithmic trading systems typically manage enormous volumes of market data, making database
                  efficiency critical. This prompt focuses on optimizing the database layer to handle high-frequency
                  time series data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">7. Trading Dashboard Enhancement</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 7.25/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 7/10</div>
                  <div>Complexity: 7/10</div>
                  <div>Usefulness: 8/10</div>
                  <div>Impact: 7/10</div>
                </div>
                <p className="mt-3">
                  Effective monitoring is essential for algorithmic trading oversight. This prompt addresses user
                  interface enhancements that improve visibility into system operation and performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">8. Backtesting Framework</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 9.0/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 9/10</div>
                  <div>Usefulness: 10/10</div>
                  <div>Impact: 9/10</div>
                </div>
                <p className="mt-3">
                  Backtesting is a cornerstone of algorithmic strategy development. This prompt addresses the creation
                  of a comprehensive simulation environment that balances historical accuracy with forward-looking
                  utility.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">9. Risk Management System</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 9.0/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 9/10</div>
                  <div>Complexity: 8/10</div>
                  <div>Usefulness: 10/10</div>
                  <div>Impact: 9/10</div>
                </div>
                <p className="mt-3">
                  Effective risk management is critical for long-term trading success. This prompt addresses the
                  creation of multi-layered protections that operate at different levels of the system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="dark:text-gray-900">10. Multi-Exchange Integration</CardTitle>
              </CardHeader>
              <CardContent className="dark:text-gray-700">
                <p className="font-medium">Overall Score: 8.25/10</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>Specificity: 8/10</div>
                  <div>Complexity: 9/10</div>
                  <div>Usefulness: 8/10</div>
                  <div>Impact: 8/10</div>
                </div>
                <p className="mt-3">
                  Trading across multiple exchanges provides diversification benefits and access to more opportunities.
                  This prompt addresses the architectural challenge of creating a unified interface that handles the
                  complexities and differences between exchange APIs.
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-semibold dark:text-white mt-8">Summary</h3>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              The analyzed prompts cover the full spectrum of algorithmic trading system development, from strategy
              creation to risk management. The highest-scoring prompts address core functions that directly impact
              trading performance and capital preservation:
            </p>
            <ol>
              <li>Capital Allocation Strategy (9.25/10)</li>
              <li>Algorithm Selection Framework (9.25/10)</li>
              <li>Performance Metrics Enhancement (9.0/10)</li>
              <li>Backtesting Framework (9.0/10)</li>
              <li>Risk Management System (9.0/10)</li>
              <li>Implementing a New Trading Strategy (8.75/10)</li>
              <li>Market Data Integration (8.5/10)</li>
              <li>Database Optimization (8.25/10)</li>
              <li>Multi-Exchange Integration (8.25/10)</li>
              <li>Trading Dashboard Enhancement (7.25/10)</li>
            </ol>
            <p>
              These prompts provide a comprehensive toolkit for algorithmic trading system development, with particular
              emphasis on the components that most directly affect trading performance and risk management. The
              generalized nature of these prompts makes them applicable across different trading systems and technology
              stacks, providing value regardless of specific implementation details.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

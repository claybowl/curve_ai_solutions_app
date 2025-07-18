"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function PromptAnalysisMethodology() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-8">
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        We've analyzed hundreds of prompts to identify patterns that lead to the most effective outcomes for business applications.
        Below is our evaluation framework and key insights.
      </p>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Evaluation Framework</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Each prompt has been evaluated based on the following criteria:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Criterion</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Weight</th>
                <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white dark:bg-gray-900">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Relevance</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">30%</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  How well the prompt aligns with the project's tech stack and business objectives
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Specificity</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">20%</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  How precisely the prompt addresses a particular development need
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Implementability</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">20%</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  How directly the output can be applied to the codebase
                </td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Comprehensiveness</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">15%</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  How thoroughly the prompt covers all aspects of the task
                </td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Innovation</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">15%</td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  How the prompt encourages novel or efficient approaches
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Highest Value Prompts</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Based on our analysis, the following prompt types provide the most value for development teams:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Task Decomposition Agents (95/100) - Structure complex requirements into actionable tickets</li>
          <li>Schema Design Assistants (92/100) - Generate data models with embedded access controls</li>
          <li>Security Review Experts (93/100) - Prevent vulnerabilities including AI-specific threats</li>
          <li>AI Service Architects (94/100) - Create provider-agnostic AI implementations</li>
          <li>Workflow Automation Architects (91/100) - Design multi-agent systems with clear responsibilities</li>
        </ol>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Key Patterns in Effective Prompts</h3>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-medium">Stack-specific guidance</span> - The most effective prompts directly
            reference the project's technology stack and architecture patterns.
          </li>
          <li>
            <span className="font-medium">End-to-end thinking</span> - Top prompts address complete workflows
            rather than isolated functionality.
          </li>
          <li>
            <span className="font-medium">Implementation readiness</span> - High-scoring prompts produce outputs
            that can be directly incorporated into the codebase.
          </li>
          <li>
            <span className="font-medium">Operational awareness</span> - The best prompts consider not just
            functionality, but also performance, security, and maintainability.
          </li>
        </ul>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export function PromptAnalysisMethodology() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Prompt Analysis and Scoring Methodology</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="methodology-content"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Show Details
            </>
          )}
        </Button>
      </div>

      <div
        id="methodology-content"
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <section className="mb-6">
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

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Detailed Analysis</h3>

          <div className="space-y-8">
            {/* Task Decomposition Agent */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                1. Task Decomposition Agent (Score: 95/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (29/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Directly addresses the core need of breaking down complex development tasks in an agentic AI
                    project.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Clearly structured with hierarchical subtasks, dependencies, and complexity ratings.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creates immediately actionable development plans that can be translated to tickets or sprints.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Covers task breakdown, complexity, tech stack requirements, and potential challenges.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Brings software engineering best practices into the prompt engineering domain.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The hierarchical breakdown with tech stack mapping provides a bridge between business requirements and
                  technical implementation.
                </p>
              </div>
            </div>

            {/* Schema Design Assistant */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                2. Schema Design Assistant (Score: 92/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (28/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Directly addresses the project's database modeling needs with ZenStack/Prisma.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Focused specifically on generating schema code with appropriate relationships and access controls.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generates code that can be directly placed in the models directory and used.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Covers models, relationships, validation, indexing, and documentation.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (12/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Combines database design with access control policies in a single prompt.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The integration of security concerns (access policies) within the data modeling process.
                </p>
              </div>
            </div>

            {/* API Integration Expert */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                3. API Integration Expert (Score: 90/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (28/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Addresses the tRPC and React Query implementation that forms the backbone of the application.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Clearly focused on both backend and frontend aspects of API integration.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generates code that follows the project's API architecture.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Covers validation, error handling, caching, and auth requirements.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Emphasizes optimistic updates for enhanced UX, showing forward-thinking.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The end-to-end approach that covers both API definition and consumption.
                </p>
              </div>
            </div>

            {/* AI Service Architect */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                4. AI Service Architect (Score: 94/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (29/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Extremely relevant given the project's focus on AI integrations and agentic systems.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Specifically addresses the challenge of creating provider-agnostic AI services.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creates modular services that can be directly integrated into the codebase.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Thoroughly addresses prompt engineering, fallbacks, rate limiting, and monitoring.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The provider abstraction approach is particularly valuable for maintaining flexibility.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Addresses both the technical implementation and operational concerns (costs, rate limits).
                </p>
              </div>
            </div>

            {/* UI Component Generator */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                5. UI Component Generator (Score: 88/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (27/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Aligns with the project's UI technologies (React, TailwindCSS, Ant Design).
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Clearly focused on creating comprehensive UI components.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (17/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generates components that can be directly used in the codebase.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Thoroughly addresses styling, types, states, and accessibility.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (12/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Integration of storybook-style examples is a forward-thinking approach.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The comprehensive state handling (loading, error, empty) makes components production-ready.
                </p>
              </div>
            </div>

            {/* Workflow Automation Architect */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                6. Workflow Automation Architect (Score: 91/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (28/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Directly addresses the agentic systems focus of the project.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Specifically focused on multi-agent workflow design.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creates actionable workflow designs with clear responsibilities.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Thoroughly covers data flow, decision points, error recovery, and observability.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The sequence diagram approach provides valuable visualization of complex workflows.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The emphasis on end-to-end process flows helps manage complex multi-agent interactions.
                </p>
              </div>
            </div>

            {/* Testing Strategy Advisor */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                7. Testing Strategy Advisor (Score: 86/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (26/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Addresses the challenging area of testing AI-powered applications.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (17/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Focused on creating reliable tests for non-deterministic AI components.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (16/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Provides concrete testing approaches, though implementation may be complex.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Covers unit, integration, and E2E testing with mock strategies.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The approach to creating deterministic tests for non-deterministic AI is innovative.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Recognition of the special challenges in testing AI-powered features.
                </p>
              </div>
            </div>

            {/* Performance Optimization Consultant */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                8. Performance Optimization Consultant (Score: 89/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (27/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Addresses performance considerations specific to the project's stack.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Focused on concrete optimizations with before/after examples.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creates immediately applicable code improvements.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Covers React optimizations, data fetching, and bundle size.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The impact estimation helps with prioritization.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The practical before/after code examples make implementation straightforward.
                </p>
              </div>
            </div>

            {/* Security Review Expert */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                9. Security Review Expert (Score: 93/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (29/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Security is critical for any application, especially those with AI components.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (19/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Focused specifically on both traditional and AI-specific security concerns.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (18/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Provides concrete security improvements with code examples.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Thoroughly covers OWASP vulnerabilities, AI security, auth mechanisms, and data handling.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The focus on emerging AI security threats is particularly valuable.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The combination of traditional web security with AI-specific concerns like prompt injection.
                </p>
              </div>
            </div>

            {/* Documentation Generator */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                10. Documentation Generator (Score: 85/100)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Relevance (25/30)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Documentation is important but slightly less critical than functional features.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Specificity (17/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Focused on creating comprehensive documentation for AI features.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Implementability (16/20)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Creates useful documentation, though not directly executable code.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Comprehensiveness (14/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Thoroughly covers feature overview, API reference, examples, and troubleshooting.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Innovation (13/15)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    The multi-audience approach bridges technical and non-technical stakeholders.
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-700 dark:text-gray-300">Key Strength:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  The balance between technical details and accessibility for different audiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Overall Insights</h3>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Highest Value Prompts</h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">Task Decomposition Agent (95/100)</span> - The highest-rated prompt due
                  to its fundamental role in project planning and its direct alignment with both business and technical
                  needs.
                </li>
                <li>
                  <span className="font-medium">AI Service Architect (94/100)</span> - Extremely valuable given the
                  project's focus on AI integration and the need for provider flexibility.
                </li>
                <li>
                  <span className="font-medium">Security Review Expert (93/100)</span> - Critical importance due to the
                  emerging security challenges in AI applications.
                </li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Key Patterns in Effective Prompts
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">Stack-specific guidance</span> - The most effective prompts directly
                  reference the project's technologies (Remix, ZenStack, tRPC, etc.)
                </li>
                <li>
                  <span className="font-medium">End-to-end thinking</span> - Top prompts address complete workflows
                  rather than isolated components
                </li>
                <li>
                  <span className="font-medium">Implementation readiness</span> - High-scoring prompts produce outputs
                  that can be directly applied to the codebase
                </li>
                <li>
                  <span className="font-medium">Operational awareness</span> - The best prompts consider not just
                  implementation but also maintenance, monitoring, and scaling
                </li>
              </ol>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Development Focus Areas</h4>
              <p className="mb-2 text-gray-700 dark:text-gray-300">
                Based on the analysis, the most critical development areas for this project are:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <span className="font-medium">AI service abstraction</span> - Creating flexible, provider-agnostic AI
                  integration layers
                </li>
                <li>
                  <span className="font-medium">Security with AI-specific considerations</span> - Addressing emerging
                  security challenges in AI applications
                </li>
                <li>
                  <span className="font-medium">Workflow automation</span> - Designing complex multi-agent workflows
                </li>
                <li>
                  <span className="font-medium">Data modeling with access control</span> - Ensuring proper data
                  structure and security
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

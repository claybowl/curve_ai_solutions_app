"use client"

export function EvaluationFramework() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 my-8">
      <section>
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
    </div>
  )
} 
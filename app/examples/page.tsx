import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ServerActionsExamplesPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Server Actions Examples</h1>
      <p className="text-lg mb-8">
        This page provides examples of using server actions for various admin operations in the Curve AI Solutions application.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Prompt Library Actions</h2>
          <p className="text-gray-600 mb-4">
            Examples of server actions for managing AI prompts in the prompt library, including creation, updating, and tagging.
          </p>
          <Link href="/examples/prompts-actions-example">
            <Button>View Prompt Actions</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">AI Tools Management</h2>
          <p className="text-gray-600 mb-4">
            Examples of server actions for managing AI tools, including creating, updating, and categorizing tools.
          </p>
          <Link href="/examples/tools-actions-example">
            <Button>View Tools Actions</Button>
          </Link>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Permissions Management</h2>
          <p className="text-gray-600 mb-4">
            Examples of server actions for managing roles and permissions, including role creation, permission assignment, and access control.
          </p>
          <Link href="/examples/permissions-actions-example">
            <Button>View Permissions Actions</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">How to Use These Examples</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>These examples demonstrate how to integrate the server actions in client components</li>
          <li>Each action manages authorization appropriately based on user roles and permissions</li>
          <li>The examples include error handling and loading states</li>
          <li>You can use these patterns as a starting point for implementing admin dashboards</li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-yellow-800">Important Notes</h2>
        <ul className="list-disc pl-6 space-y-2 text-yellow-800">
          <li>These example pages are for development and testing only</li>
          <li>They should not be included in production builds</li>
          <li>Authorization checks are implemented in the server actions themselves</li>
          <li>For extra security, wrap these pages in authentication middleware</li>
        </ul>
      </div>
    </div>
  )
}
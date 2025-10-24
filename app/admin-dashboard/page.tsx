"use client"

import { Users, Calendar, FileText, BarChart3 } from "lucide-react"

export default function AdminDashboardHome() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome to your admin control panel
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin-dashboard/users"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Users className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View and edit user accounts
            </p>
          </a>

          <a
            href="/admin-dashboard/consultations"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            <Calendar className="h-6 w-6 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Consultations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review consultation requests
            </p>
          </a>

          <a
            href="/admin-dashboard/assessments"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Assessments
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View assessment results
            </p>
          </a>

          <a
            href="/admin-dashboard/prompts"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Prompt Library
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage prompts and templates
            </p>
          </a>

          <a
            href="/admin-dashboard/analytics"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-indigo-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View usage analytics
            </p>
          </a>

          <a
            href="/admin-dashboard/database"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-pink-600 mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Database Browser
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Browse all tables
            </p>
          </a>
        </div>
      </div>
    </main>
  )
}

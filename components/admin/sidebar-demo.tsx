"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SidebarDemo() {
  return (
    <DashboardLayout
      title="Responsive Dashboard Test"
      description="Testing responsive design for admin dashboard"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Responsive Demo", href: "/admin/responsive-demo", current: true }
      ]}
      actions={
        <Button>Test Action</Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Test Card {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a test card to verify the responsive layout.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage user accounts, roles, and permissions"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Users", href: "/admin/users" },
        { label: "Management", href: "/admin/users/management", current: true }
      ]}
    >
      <div className="space-y-6">
        {/* Skeleton for filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Skeleton className="h-10 w-full sm:w-[300px]" />
              <Skeleton className="h-10 w-full sm:w-[200px]" />
            </div>
          </CardContent>
        </Card>
        
        {/* Skeleton for user table */}
        <Card>
          <CardContent className="pt-6">
            {/* Table header */}
            <div className="flex border-b py-3 px-4 gap-4">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[100px]" />
            </div>
            
            {/* Table rows */}
            {Array(5).fill(0).map((_, idx) => (
              <div 
                key={idx} 
                className="flex py-4 px-4 border-b last:border-0 gap-4 items-center"
              >
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-8 w-8 ml-auto rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
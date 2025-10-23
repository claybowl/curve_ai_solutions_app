import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System configuration and administration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                defaultValue="Curve AI Solutions"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="site-url">Site URL</Label>
              <Input
                id="site-url"
                defaultValue="https://curveai.com"
                disabled
              />
            </div>
            <Button disabled>Update Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage admin users and permissions
            </p>
            <Button variant="outline" disabled>
              Manage Admins
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              API keys and integration settings are managed in environment variables
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-800 dark:text-blue-200">
              For security, API keys are stored in environment variables and not
              editable through this interface.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

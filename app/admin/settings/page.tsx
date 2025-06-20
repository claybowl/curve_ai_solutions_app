"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { 
  Settings, Save, RefreshCw, Shield, Globe, 
  Database, Mail, Key, Bell, Users, 
  Palette, Monitor, Smartphone, AlertTriangle,
  CheckCircle, Info, Plus, Trash2, Edit
} from "lucide-react"

// Types for settings management
interface PlatformSettings {
  id: string
  site_name: string
  site_description: string
  site_url: string
  contact_email: string
  support_email: string
  max_users: number
  maintenance_mode: boolean
  registration_enabled: boolean
  email_verification_required: boolean
  social_login_enabled: boolean
  api_rate_limit: number
  session_timeout: number
  default_theme: 'light' | 'dark' | 'system'
  updated_at: string
}

interface EmailSettings {
  id: string
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  from_email: string
  from_name: string
  enabled: boolean
}

interface SecuritySettings {
  id: string
  password_min_length: number
  password_require_uppercase: boolean
  password_require_lowercase: boolean
  password_require_numbers: boolean
  password_require_symbols: boolean
  max_login_attempts: number
  lockout_duration: number
  two_factor_enabled: boolean
  api_key_expiry_days: number
}

interface NotificationSettings {
  id: string
  email_notifications: boolean
  new_user_notifications: boolean
  consultation_notifications: boolean
  assessment_notifications: boolean
  system_alerts: boolean
  weekly_reports: boolean
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Settings state
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    id: "1",
    site_name: "Curve AI Solutions",
    site_description: "AI consultation services and business process optimization",
    site_url: "https://curveai.com",
    contact_email: "contact@curveai.com",
    support_email: "support@curveai.com",
    max_users: 1000,
    maintenance_mode: false,
    registration_enabled: true,
    email_verification_required: true,
    social_login_enabled: true,
    api_rate_limit: 1000,
    session_timeout: 24,
    default_theme: "system",
    updated_at: new Date().toISOString()
  })
  
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    id: "1",
    smtp_host: "",
    smtp_port: 587,
    smtp_username: "",
    smtp_password: "",
    from_email: "noreply@curveai.com",
    from_name: "Curve AI Solutions",
    enabled: false
  })
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    id: "1",
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    max_login_attempts: 5,
    lockout_duration: 15,
    two_factor_enabled: false,
    api_key_expiry_days: 90
  })
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    id: "1",
    email_notifications: true,
    new_user_notifications: true,
    consultation_notifications: true,
    assessment_notifications: true,
    system_alerts: true,
    weekly_reports: false
  })

  // Dialog states
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false)
  const [testEmailAddress, setTestEmailAddress] = useState("")

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, these would fetch from the database
      // For now, we'll use the mock data already set in state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({
        title: "Settings loaded",
        description: "Platform settings have been loaded successfully",
      })
    } catch (err) {
      console.error("Error loading settings:", err)
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // In a real implementation, this would save to the database
      // For now, we'll simulate the save operation
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the updated_at timestamp
      setPlatformSettings(prev => ({
        ...prev,
        updated_at: new Date().toISOString()
      }))
      
      setHasUnsavedChanges(false)
      
      toast({
        title: "Settings saved",
        description: "All settings have been saved successfully",
      })
    } catch (err) {
      console.error("Error saving settings:", err)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the test email",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real implementation, this would send a test email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsTestEmailDialogOpen(false)
      setTestEmailAddress("")
      
      toast({
        title: "Test email sent",
        description: `Test email has been sent to ${testEmailAddress}`,
      })
    } catch (err) {
      console.error("Error sending test email:", err)
      toast({
        title: "Error",
        description: "Failed to send test email. Please check your email configuration.",
        variant: "destructive",
      })
    }
  }

  const resetToDefaults = (section: string) => {
    switch (section) {
      case "platform":
        setPlatformSettings(prev => ({
          ...prev,
          maintenance_mode: false,
          registration_enabled: true,
          email_verification_required: true,
          social_login_enabled: true,
          api_rate_limit: 1000,
          session_timeout: 24,
          default_theme: "system"
        }))
        break
      case "security":
        setSecuritySettings(prev => ({
          ...prev,
          password_min_length: 8,
          password_require_uppercase: true,
          password_require_lowercase: true,
          password_require_numbers: true,
          password_require_symbols: false,
          max_login_attempts: 5,
          lockout_duration: 15,
          two_factor_enabled: false,
          api_key_expiry_days: 90
        }))
        break
      case "notifications":
        setNotificationSettings(prev => ({
          ...prev,
          email_notifications: true,
          new_user_notifications: true,
          consultation_notifications: true,
          assessment_notifications: true,
          system_alerts: true,
          weekly_reports: false
        }))
        break
    }
    
    setHasUnsavedChanges(true)
    toast({
      title: "Reset to defaults",
      description: `${section} settings have been reset to default values`,
    })
  }

  const handleSettingChange = (setter: Function, field: string, value: any) => {
    setter((prev: any) => ({
      ...prev,
      [field]: value
    }))
    setHasUnsavedChanges(true)
  }

  return (
    <DashboardLayout
      title="Platform Settings"
      description="Configure platform-wide settings and preferences"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings", current: true }
      ]}
      actions={
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={loadSettings}
            disabled={isLoading || isSaving}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={!hasUnsavedChanges || isSaving}
          >
            <Save className={`mr-2 h-4 w-4 ${isSaving ? "animate-spin" : ""}`} />
            Save Changes
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="w-full py-12 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Loading settings...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    You have unsaved changes. Don't forget to save your settings.
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs 
            defaultValue="general" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Site Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={platformSettings.site_name}
                        onChange={(e) => handleSettingChange(setPlatformSettings, 'site_name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site_url">Site URL</Label>
                      <Input
                        id="site_url"
                        value={platformSettings.site_url}
                        onChange={(e) => handleSettingChange(setPlatformSettings, 'site_url', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={platformSettings.site_description}
                      onChange={(e) => handleSettingChange(setPlatformSettings, 'site_description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={platformSettings.contact_email}
                        onChange={(e) => handleSettingChange(setPlatformSettings, 'contact_email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="support_email">Support Email</Label>
                      <Input
                        id="support_email"
                        type="email"
                        value={platformSettings.support_email}
                        onChange={(e) => handleSettingChange(setPlatformSettings, 'support_email', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Configure how users can register and access your platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>User Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new users to register</p>
                        </div>
                        <Switch
                          checked={platformSettings.registration_enabled}
                          onCheckedChange={(checked) => handleSettingChange(setPlatformSettings, 'registration_enabled', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Verification</Label>
                          <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                        </div>
                        <Switch
                          checked={platformSettings.email_verification_required}
                          onCheckedChange={(checked) => handleSettingChange(setPlatformSettings, 'email_verification_required', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Social Login</Label>
                          <p className="text-sm text-muted-foreground">Enable Google and other social logins</p>
                        </div>
                        <Switch
                          checked={platformSettings.social_login_enabled}
                          onCheckedChange={(checked) => handleSettingChange(setPlatformSettings, 'social_login_enabled', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max_users">Maximum Users</Label>
                        <Input
                          id="max_users"
                          type="number"
                          value={platformSettings.max_users}
                          onChange={(e) => handleSettingChange(setPlatformSettings, 'max_users', parseInt(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
                        <Input
                          id="session_timeout"
                          type="number"
                          value={platformSettings.session_timeout}
                          onChange={(e) => handleSettingChange(setPlatformSettings, 'session_timeout', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Platform Configuration
                  </CardTitle>
                  <CardDescription>
                    General platform settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="flex items-center gap-2">
                            Maintenance Mode
                            <Badge variant="destructive" className="text-xs">
                              {platformSettings.maintenance_mode ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Temporarily disable site access for maintenance
                          </p>
                        </div>
                        <Switch
                          checked={platformSettings.maintenance_mode}
                          onCheckedChange={(checked) => handleSettingChange(setPlatformSettings, 'maintenance_mode', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="default_theme">Default Theme</Label>
                        <Select
                          value={platformSettings.default_theme}
                          onValueChange={(value) => handleSettingChange(setPlatformSettings, 'default_theme', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api_rate_limit">API Rate Limit (requests/hour)</Label>
                        <Input
                          id="api_rate_limit"
                          type="number"
                          value={platformSettings.api_rate_limit}
                          onChange={(e) => handleSettingChange(setPlatformSettings, 'api_rate_limit', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => resetToDefaults('platform')}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings Tab */}
            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    SMTP Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure email delivery settings for transactional emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <Label>Email Service Enabled</Label>
                      <p className="text-sm text-muted-foreground">Enable email sending functionality</p>
                    </div>
                    <Switch
                      checked={emailSettings.enabled}
                      onCheckedChange={(checked) => handleSettingChange(setEmailSettings, 'enabled', checked)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={emailSettings.smtp_host}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'smtp_host', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        type="number"
                        value={emailSettings.smtp_port}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'smtp_port', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_username">SMTP Username</Label>
                      <Input
                        id="smtp_username"
                        value={emailSettings.smtp_username}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'smtp_username', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={emailSettings.smtp_password}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'smtp_password', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from_email">From Email</Label>
                      <Input
                        id="from_email"
                        type="email"
                        value={emailSettings.from_email}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'from_email', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from_name">From Name</Label>
                      <Input
                        id="from_name"
                        value={emailSettings.from_name}
                        onChange={(e) => handleSettingChange(setEmailSettings, 'from_name', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsTestEmailDialogOpen(true)}
                      disabled={!emailSettings.enabled}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Password Requirements
                  </CardTitle>
                  <CardDescription>
                    Configure password strength requirements for user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password_min_length">Minimum Length</Label>
                        <Input
                          id="password_min_length"
                          type="number"
                          min="6"
                          max="32"
                          value={securitySettings.password_min_length}
                          onChange={(e) => handleSettingChange(setSecuritySettings, 'password_min_length', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Require Uppercase</Label>
                        <Switch
                          checked={securitySettings.password_require_uppercase}
                          onCheckedChange={(checked) => handleSettingChange(setSecuritySettings, 'password_require_uppercase', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Require Lowercase</Label>
                        <Switch
                          checked={securitySettings.password_require_lowercase}
                          onCheckedChange={(checked) => handleSettingChange(setSecuritySettings, 'password_require_lowercase', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Require Numbers</Label>
                        <Switch
                          checked={securitySettings.password_require_numbers}
                          onCheckedChange={(checked) => handleSettingChange(setSecuritySettings, 'password_require_numbers', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label>Require Symbols</Label>
                        <Switch
                          checked={securitySettings.password_require_symbols}
                          onCheckedChange={(checked) => handleSettingChange(setSecuritySettings, 'password_require_symbols', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => resetToDefaults('security')}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Authentication & Access
                  </CardTitle>
                  <CardDescription>
                    Configure login security and access controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.max_login_attempts}
                        onChange={(e) => handleSettingChange(setSecuritySettings, 'max_login_attempts', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                      <Input
                        id="lockout_duration"
                        type="number"
                        min="5"
                        max="60"
                        value={securitySettings.lockout_duration}
                        onChange={(e) => handleSettingChange(setSecuritySettings, 'lockout_duration', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        checked={securitySettings.two_factor_enabled}
                        onCheckedChange={(checked) => handleSettingChange(setSecuritySettings, 'two_factor_enabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="api_key_expiry_days">API Key Expiry (days)</Label>
                      <Input
                        id="api_key_expiry_days"
                        type="number"
                        min="30"
                        max="365"
                        value={securitySettings.api_key_expiry_days}
                        onChange={(e) => handleSettingChange(setSecuritySettings, 'api_key_expiry_days', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Admin Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure which events trigger notifications to administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Enable email notifications</p>
                        </div>
                        <Switch
                          checked={notificationSettings.email_notifications}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'email_notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New User Registrations</Label>
                          <p className="text-sm text-muted-foreground">Notify when new users register</p>
                        </div>
                        <Switch
                          checked={notificationSettings.new_user_notifications}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'new_user_notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Consultation Requests</Label>
                          <p className="text-sm text-muted-foreground">Notify when new consultations are requested</p>
                        </div>
                        <Switch
                          checked={notificationSettings.consultation_notifications}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'consultation_notifications', checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Assessment Completions</Label>
                          <p className="text-sm text-muted-foreground">Notify when assessments are completed</p>
                        </div>
                        <Switch
                          checked={notificationSettings.assessment_notifications}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'assessment_notifications', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Alerts</Label>
                          <p className="text-sm text-muted-foreground">Notify about system issues and errors</p>
                        </div>
                        <Switch
                          checked={notificationSettings.system_alerts}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'system_alerts', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Send weekly activity summary reports</p>
                        </div>
                        <Switch
                          checked={notificationSettings.weekly_reports}
                          onCheckedChange={(checked) => handleSettingChange(setNotificationSettings, 'weekly_reports', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => resetToDefaults('notifications')}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* System Info Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Platform status and version information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Platform Status</p>
                    <p className="text-sm text-muted-foreground">Operational</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Version</p>
                    <p className="text-sm text-muted-foreground">2.1.0</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(platformSettings.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Test Email Dialog */}
      <Dialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test email to verify your SMTP configuration is working correctly.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test_email">Email Address</Label>
              <Input
                id="test_email"
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTestEmail}>
              Send Test Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
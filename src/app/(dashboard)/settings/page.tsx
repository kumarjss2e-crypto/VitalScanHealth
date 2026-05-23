import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Shield, Moon, Globe, Trash2, Smartphone } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const { data: settingsData } = await supabase
       .from('user_settings')
       .select('*')
       .eq('user_id', user.id)
       .maybeSingle()

  const settings = settingsData as any;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600/10">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive alerts and reminders.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-zinc-500">Receive alerts about your wellness trends.</p>
              </div>
              <Switch defaultChecked={settings?.notifications_enabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Scan Reminders</Label>
                <p className="text-sm text-zinc-500">Get reminded to perform your daily scan.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-600/10">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle>Security & Privacy</CardTitle>
                <CardDescription>Manage your data and security preferences.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Biometric Login</Label>
                <p className="text-sm text-zinc-500">Use FaceID or Fingerprint to unlock the app.</p>
              </div>
              <Switch defaultChecked={settings?.biometric_login_enabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Data Sharing</Label>
                <p className="text-sm text-zinc-500">Share anonymous data to improve AI accuracy.</p>
              </div>
              <Switch defaultChecked={settings?.data_sharing_consent} />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-600/10">
                <Moon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <CardTitle>Appearance & Language</CardTitle>
                <CardDescription>Customize the look and feel of VitalScan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-zinc-500">Always use dark theme for the interface.</p>
              </div>
              <Switch defaultChecked={settings?.theme === 'dark'} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Language</Label>
                <p className="text-sm text-zinc-500">Currently set to English (US).</p>
              </div>
              <Button variant="outline" size="sm" className="border-zinc-800">Change</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/5 border-red-500/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-600/10">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Permanently delete your account and all data.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Once you delete your account, there is no going back. All your scan history and AI insights will be permanently removed.
            </p>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Calendar, Ruler, Weight, LogOut } from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const { data: profileData } = await supabase
       .from('profiles')
       .select('*')
       .eq('id', user.id)
       .maybeSingle()

  const profile = profileData as any;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-zinc-400">Manage your personal information and health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl h-fit">
          <CardContent className="pt-8 flex flex-col items-center">
            <Avatar className="w-24 h-24 border-2 border-blue-600/20 mb-4">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback className="bg-blue-600/10 text-blue-500 text-2xl font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{profile?.full_name || 'VitalScan User'}</h3>
            <p className="text-sm text-zinc-500">{user?.email}</p>
            <Button variant="outline" className="w-full mt-6 border-zinc-800 bg-zinc-950/50">
              Change Avatar
            </Button>
            <LogoutButton className="w-full mt-3" />
          </CardContent>
        </Card>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your basic profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-zinc-400">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input id="full_name" defaultValue={profile?.full_name || ''} className="pl-10 bg-zinc-950/50 border-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input id="email" value={user?.email || ''} disabled className="pl-10 bg-zinc-950/50 border-zinc-800 opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-zinc-400">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input id="dob" type="date" defaultValue={profile?.date_of_birth || ''} className="pl-10 bg-zinc-950/50 border-zinc-800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Biometric Data</CardTitle>
              <CardDescription>Your height and weight help calculate more accurate vitals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-zinc-400">Height (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input id="height" type="number" defaultValue={profile?.height_cm || ''} className="pl-10 bg-zinc-950/50 border-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-zinc-400">Weight (kg)</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input id="weight" type="number" defaultValue={profile?.weight_kg || ''} className="pl-10 bg-zinc-950/50 border-zinc-800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-500">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

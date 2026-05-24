import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Calendar, Ruler, Weight, LogOut, CreditCard, Settings, ChevronRight } from 'lucide-react'
import LogoutButton from '@/components/auth/LogoutButton'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const { data: profileData } = await supabase
       .from('profiles')
       .select('*')
       .eq('id', user.id)
       .maybeSingle()

  const profile = profileData as Database['public']['Tables']['profiles']['Row'] | null;

  return (
    <div className="space-y-8 max-w-4xl pb-20 md:pb-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card className="bg-card border-border backdrop-blur-xl h-fit">
            <CardContent className="pt-8 flex flex-col items-center">
              <Avatar className="w-24 h-24 border-2 border-primary/20 mb-4">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-foreground">{profile?.full_name || 'VitalScan User'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" className="w-full mt-6 border-border bg-background hover:bg-muted">
                Change Avatar
              </Button>
            </CardContent>
          </Card>

          {/* Mobile Quick Links - High Visibility for Mobile */}
          <Card className="bg-card border-border backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Account & App</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Link href="/billing" className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3 text-foreground">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span className="font-medium">Billing & Plan</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link href="/settings" className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3 text-foreground">
                  <Settings className="w-5 h-5 text-primary" />
                  <span className="font-medium">App Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <div className="p-4">
                <LogoutButton className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your basic profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="full_name" defaultValue={profile?.full_name || ''} className="pl-10 bg-background border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" value={user?.email || ''} disabled className="pl-10 bg-background border-border opacity-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-muted-foreground">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="dob" type="date" defaultValue={profile?.date_of_birth || ''} className="pl-10 bg-background border-border" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Biometric Data</CardTitle>
              <CardDescription>Your height and weight help calculate more accurate vitals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-muted-foreground">Height (cm)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="height" type="number" defaultValue={profile?.height_cm || ''} className="pl-10 bg-background border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-muted-foreground">Weight (kg)</Label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="weight" type="number" defaultValue={profile?.weight_kg || ''} className="pl-10 bg-background border-border" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

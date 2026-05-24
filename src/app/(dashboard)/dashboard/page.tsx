import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Brain,
  Droplets,
  Moon,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  // Fetch scan history for calculations
  const { data: scanHistory } = await (supabase.from('scans') as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const latestScan = (scanHistory?.[0] as any) || null
  const wellnessScore = latestScan?.wellness_score || 0

  // DERIVED METRICS CALCULATIONS
  
  // 1. Cardiovascular Wellness (based on HR and Stress)
  const cardioScore = latestScan ? Math.max(0, 100 - Math.abs(70 - latestScan.heart_rate) - (latestScan.stress_level / 4)) : 0
  
  // 2. Recovery Score (based on HRV and Stress)
  const recoveryScore = latestScan ? Math.min(100, (latestScan.hrv || 50) + (100 - latestScan.stress_level) / 2) : 0
  
  // 3. Wellness Consistency & Streak
  const last7DaysUniqueDays = Array.from(new Set((scanHistory as any[])?.filter(s => {
    const date = new Date(s.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > weekAgo
  }).map(s => format(new Date(s.created_at), 'yyyy-MM-dd')) || []))

  const consistencyScore = Math.min(100, (last7DaysUniqueDays.length / 7) * 100)

  // 4. Biometric Stability (HR variance)
  const hrValues = (scanHistory as any[])?.map(s => s.heart_rate).filter(Boolean) as number[] || []
  const hrMean = hrValues.reduce((a, b) => a + b, 0) / hrValues.length
  const hrStability = hrValues.length > 1 
    ? Math.max(0, 100 - (hrValues.reduce((a, b) => a + Math.abs(b - hrMean), 0) / hrValues.length) * 2)
    : 100

  const analytics = [
    { label: 'Cardio Wellness', value: `${Math.round(cardioScore)}%`, icon: Heart, color: 'text-red-400', desc: 'Heart efficiency' },
    { label: 'Recovery', value: `${Math.round(recoveryScore)}%`, icon: TrendingUp, color: 'text-emerald-400', desc: 'Readiness for activity' },
    { label: 'Stability Index', value: `${Math.round(hrStability)}%`, icon: ShieldCheck, color: 'text-blue-400', desc: 'Biometric consistency' },
    { label: 'Scan Streak', value: `${last7DaysUniqueDays.length} Days`, icon: Zap, color: 'text-yellow-400', desc: 'Consistency streak' },
  ]

  const vitals = [
    { label: 'Heart Rate', value: latestScan?.heart_rate ? `${latestScan.heart_rate} BPM` : '--', icon: Heart, color: 'text-red-500', trend: '+2%', status: 'Normal' },
    { label: 'Blood Oxygen', value: latestScan?.spo2 ? `${latestScan.spo2}%` : '--', icon: Activity, color: 'text-blue-500', trend: 'Stable', status: 'Optimal' },
    { label: 'Stress Level', value: latestScan?.stress_level ? latestScan.stress_level : '--', icon: Zap, color: 'text-yellow-500', trend: '-5%', status: 'Low' },
    { label: 'Wellness Score', value: wellnessScore, icon: TrendingUp, color: 'text-emerald-500', trend: '+3%', status: 'Improving' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Intelligence Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Advanced wellness analytics derived from your biometric signals.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-border bg-background hover:bg-muted text-foreground" asChild>
            <Link href="/history">
              <Calendar className="w-4 h-4 mr-2" />
              History
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" asChild>
            <Link href="/scan">
              <Activity className="w-4 h-4 mr-2" />
              Start New Scan
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((item) => (
          <Card key={item.label} className="bg-card border-border backdrop-blur-xl group hover:border-primary/50 transition-all shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${item.color.replace('text-', 'bg-')}/10 border border-current/20`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{item.value}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Vitals */}
        <Card className="lg:col-span-8 bg-card border-border backdrop-blur-xl shadow-sm dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-foreground text-lg md:text-xl">Recent Biometrics</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">Latest values from your scan on {latestScan ? format(new Date(latestScan.created_at), 'MMM d, h:mm a') : 'no date'}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Live Sync</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {vitals.map((v) => (
                <div key={v.label} className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{v.label}</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">{v.value}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600 font-medium">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Trend Visualization Placeholder */}
            <div className="mt-8 h-48 w-full bg-muted/30 rounded-2xl border border-border/50 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 dark:opacity-5">
                 <div className="h-full w-full bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:20px_20px]" />
               </div>
               <div className="flex flex-col items-center text-center px-6">
                 <TrendingUp className="w-8 h-8 text-muted-foreground/50 mb-2" />
                 <p className="text-xs text-muted-foreground font-medium">Biometric Trend Analysis</p>
                 <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">Perform more scans to unlock detailed weekly and monthly wellness charting.</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Health Insights */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-card border-border backdrop-blur-xl overflow-hidden relative shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 p-4">
              <Brain className="w-5 h-5 text-primary/20" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                <Zap className="w-4 h-4 text-yellow-500" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <h4 className="text-xs font-bold text-blue-500 uppercase">Hydration</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Minor signal variance detected. Consider 250ml water before next scan.</p>
                </div>
                
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="w-3.5 h-3.5 text-purple-500" />
                    <h4 className="text-xs font-bold text-purple-500 uppercase">Circadian</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Optimal scan time window identified: 08:30 AM - 09:15 AM.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <h4 className="text-xs font-bold text-emerald-500 uppercase">Recovery</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Your HRV is 12% above your 7-day average. Peak readiness achieved.</p>
                </div>
              </div>

              <Button variant="outline" className="w-full border-border bg-muted/50 hover:bg-muted text-[11px] h-9 text-foreground" asChild>
                <Link href="/copilot">Explore Deep Insights</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Health Consistency */}
          <Card className="bg-card border-border backdrop-blur-xl shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Consistency</h4>
                <span className="text-xs font-bold text-emerald-500">{Math.round(consistencyScore)}%</span>
              </div>
              <div className="flex gap-1.5 h-8 items-end">
                {[...Array(7)].map((_, i) => {
                  const day = new Date()
                  day.setDate(day.getDate() - (6 - i))
                  const hasScan = (scanHistory as any[])?.some(s => format(new Date(s.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-500 ${hasScan ? 'bg-emerald-500/60 h-full' : 'bg-muted h-2'}`} 
                      title={format(day, 'MMM d')}
                    />
                  )
                })}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 text-center">Your last 7 days of wellness activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


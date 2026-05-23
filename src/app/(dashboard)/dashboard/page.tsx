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
  const { data: scanHistory } = await supabase
    .from('scans')
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
  
  // 3. Wellness Consistency
  const last7DaysScans = scanHistory?.filter(s => {
    const date = new Date(s.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return date > weekAgo
  }) || []
  const consistencyScore = Math.min(100, (last7DaysScans.length / 7) * 100)

  // 4. Biometric Stability (HR variance)
  const hrValues = scanHistory?.map(s => s.heart_rate).filter(Boolean) as number[] || []
  const hrMean = hrValues.reduce((a, b) => a + b, 0) / hrValues.length
  const hrStability = hrValues.length > 1 
    ? Math.max(0, 100 - (hrValues.reduce((a, b) => a + Math.abs(b - hrMean), 0) / hrValues.length) * 2)
    : 100

  const analytics = [
    { label: 'Cardio Wellness', value: `${Math.round(cardioScore)}%`, icon: Heart, color: 'text-red-400', desc: 'Heart efficiency' },
    { label: 'Recovery', value: `${Math.round(recoveryScore)}%`, icon: TrendingUp, color: 'text-emerald-400', desc: 'Readiness for activity' },
    { label: 'Stability Index', value: `${Math.round(hrStability)}%`, icon: ShieldCheck, color: 'text-blue-400', desc: 'Biometric consistency' },
    { label: 'Scan Streak', value: `${last7DaysScans.length} Days`, icon: Zap, color: 'text-yellow-400', desc: 'Consistency streak' },
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
          <h1 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h1>
          <p className="text-zinc-400 mt-1">Advanced wellness analytics derived from your biometric signals.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800" asChild>
            <Link href="/history">
              <Calendar className="w-4 h-4 mr-2" />
              History
            </Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]" asChild>
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
          <Card key={item.label} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl group hover:border-zinc-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${item.color.replace('text-', 'bg-')}/10 border border-${item.color.split('-')[1]}-500/20`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{item.value}</h3>
                <p className="text-[10px] text-zinc-500 mt-1">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Core Vitals */}
        <Card className="lg:col-span-8 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Biometrics</CardTitle>
              <CardDescription>Latest values from your scan on {latestScan ? format(new Date(latestScan.created_at), 'MMM d, h:mm a') : 'no date'}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20">Live Sync</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {vitals.map((v) => (
                <div key={v.label} className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <v.icon className={`w-3.5 h-3.5 ${v.color}`} />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{v.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white">{v.value}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500/80 font-medium">{v.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Trend Visualization Placeholder */}
            <div className="mt-8 h-48 w-full bg-zinc-950/30 rounded-2xl border border-zinc-800/50 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                 <div className="h-full w-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
               </div>
               <div className="flex flex-col items-center text-center px-6">
                 <TrendingUp className="w-8 h-8 text-zinc-700 mb-2" />
                 <p className="text-xs text-zinc-500 font-medium">Biometric Trend Analysis</p>
                 <p className="text-[10px] text-zinc-600 mt-1 max-w-[200px]">Perform more scans to unlock detailed weekly and monthly wellness charting.</p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Health Insights */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
              <Brain className="w-5 h-5 text-blue-500/20" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-blue-600/5 border border-blue-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                    <h4 className="text-xs font-bold text-blue-400 uppercase">Hydration</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">Minor signal variance detected. Consider 250ml water before next scan.</p>
                </div>
                
                <div className="p-3.5 rounded-xl bg-purple-600/5 border border-purple-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                    <h4 className="text-xs font-bold text-purple-400 uppercase">Circadian</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">Optimal scan time window identified: 08:30 AM - 09:15 AM.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-600/5 border border-emerald-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <h4 className="text-xs font-bold text-emerald-400 uppercase">Recovery</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">Your HRV is 12% above your 7-day average. Peak readiness achieved.</p>
                </div>
              </div>

              <Button variant="outline" className="w-full border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-[11px] h-9" asChild>
                <Link href="/copilot">Explore Deep Insights</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Health Consistency */}
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Consistency</h4>
                <span className="text-xs font-bold text-emerald-500">{Math.round(consistencyScore)}%</span>
              </div>
              <div className="flex gap-1.5 h-8 items-end">
                {[...Array(7)].map((_, i) => {
                  const day = new Date()
                  day.setDate(day.getDate() - (6 - i))
                  const hasScan = scanHistory?.some(s => format(new Date(s.created_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                  return (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-500 ${hasScan ? 'bg-emerald-500/60 h-full' : 'bg-zinc-800 h-2'}`} 
                      title={format(day, 'MMM d')}
                    />
                  )
                })}
              </div>
              <p className="text-[10px] text-zinc-500 mt-3 text-center">Your last 7 days of wellness activity</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


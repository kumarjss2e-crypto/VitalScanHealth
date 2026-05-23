import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Fetch latest scan
  const { data: latestScan } = await supabase
    .from('scans')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch wellness score trends (mock data for now if empty)
  const wellnessScore = latestScan?.wellness_score || 0
  
  const vitals = [
    { label: 'Heart Rate', value: latestScan?.heart_rate ? `${latestScan.heart_rate} BPM` : '--', icon: Heart, color: 'text-red-500', trend: '+2%' },
    { label: 'Blood Oxygen', value: latestScan?.spo2 ? `${latestScan.spo2}%` : '--', icon: Activity, color: 'text-blue-500', trend: 'Stable' },
    { label: 'Stress Level', value: latestScan?.stress_level ? latestScan.stress_level : '--', icon: Zap, color: 'text-yellow-500', trend: '-5%' },
    { label: 'Wellness Score', value: wellnessScore, icon: TrendingUp, color: 'text-emerald-500', trend: '+3%' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</h1>
          <p className="text-zinc-400 mt-1">Here is your wellness overview for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800" asChild>
            <Link href="/history">
              <Calendar className="w-4 h-4 mr-2" />
              View History
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

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((vital) => (
          <Card key={vital.label} className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${vital.color.replace('text-', 'bg-')}/10`}>
                  <vital.icon className={`w-5 h-5 ${vital.color}`} />
                </div>
                <div className="flex items-center text-xs font-medium text-emerald-500">
                  {vital.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {vital.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{vital.label}</p>
                <h3 className="text-2xl font-bold mt-1">{vital.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart/Insights Area */}
        <Card className="lg:col-span-2 bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Wellness Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-zinc-800/50">
            <div className="text-center">
              <Activity className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Trend data will appear after your first few scans.</p>
              <Button variant="link" className="text-blue-400 mt-2" asChild>
                <Link href="/scan">Perform your first scan now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <h4 className="font-medium text-blue-400 text-sm">Hydration Alert</h4>
              <p className="text-xs text-zinc-400 mt-1">Based on your recent stress levels, increasing water intake could improve recovery.</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20">
              <h4 className="font-medium text-emerald-400 text-sm">Optimal Recovery</h4>
              <p className="text-xs text-zinc-400 mt-1">Your HRV indicates excellent recovery. Today is a great day for high-intensity training.</p>
            </div>
            <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-sm" asChild>
              <Link href="/copilot">Chat with Wellness Copilot</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

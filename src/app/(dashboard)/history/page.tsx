import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  Heart, 
  Zap, 
  TrendingUp,
  ChevronRight,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null
  
  const { data: scansData } = await (supabase.from('scans') as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const scans = scansData as any[] | null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wellness History</h1>
          <p className="text-zinc-400 mt-1">Review your past biometric scans and trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {!scans || scans.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl py-20">
          <CardContent className="flex flex-col items-center text-center">
            <Activity className="w-12 h-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold">No scans found</h3>
            <p className="text-zinc-500 max-w-sm mt-2">
              You haven&apos;t performed any wellness scans yet. Start your first scan to begin tracking your health.
            </p>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-500" asChild>
              <a href="/scan">Start First Scan</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan) => (
            <Card key={scan.id} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/80 transition-all group backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                      <Activity className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{format(new Date(scan.created_at), 'MMM d, yyyy')}</h3>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-blue-500/5 text-blue-400 border-blue-500/20">
                          {format(new Date(scan.created_at), 'h:mm a')}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-500 mt-0.5">Wellness Score: <span className="text-emerald-500 font-semibold">{scan.wellness_score || 'N/A'}</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 max-w-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Heart className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Heart Rate</span>
                      </div>
                      <p className="text-lg font-bold">{scan.heart_rate || '--'} <span className="text-xs font-normal text-zinc-500">BPM</span></p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">SpO2</span>
                      </div>
                      <p className="text-lg font-bold">{scan.spo2 || '--'} <span className="text-xs font-normal text-zinc-500">%</span></p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">Stress</span>
                      </div>
                      <p className="text-lg font-bold">{scan.stress_level || '--'}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wider">HRV</span>
                      </div>
                      <p className="text-lg font-bold">{scan.hrv || '--'} <span className="text-xs font-normal text-zinc-500">ms</span></p>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="hidden md:flex text-zinc-500 group-hover:text-white group-hover:bg-zinc-800">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

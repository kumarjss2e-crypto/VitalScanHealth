'use client'

import { useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handlePendingScan = async () => {
      if (typeof window === 'undefined') return

      const pendingScan = localStorage.getItem('pending_scan_result')
      if (!pendingScan) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const scanData = JSON.parse(pendingScan)
        
        const { error } = await (supabase.from('scans') as any).insert({
          user_id: user.id,
          provider: 'vital-scan-v3-recovered',
          heart_rate: scanData.heartRate,
          spo2: scanData.spo2,
          stress_level: scanData.stress === 'Low' ? 20 : scanData.stress === 'Normal' ? 45 : 75,
          wellness_score: scanData.wellnessScore,
          duration_seconds: 8,
          device_type: 'Web',
          created_at: scanData.timestamp
        })

        if (error) throw error

        localStorage.removeItem('pending_scan_result')
        toast.success('Your recent guest scan has been saved to your account!')
        router.refresh()
      } catch (err) {
        console.error('Failed to recover guest scan:', err)
      }
    }

    handlePendingScan()
  }, [supabase, router])

  return <DashboardLayout>{children}</DashboardLayout>
}

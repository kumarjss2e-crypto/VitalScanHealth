'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className={cn("border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 bg-zinc-950/50", className)}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}

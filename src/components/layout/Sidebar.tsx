'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  User, 
  Settings, 
  MessageSquare, 
  CreditCard,
  LogOut,
  HeartPulse
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Scan, label: 'New Scan', href: '/scan' },
  { icon: History, label: 'History', href: '/history' },
  { icon: MessageSquare, label: 'AI Copilot', href: '/copilot' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: CreditCard, label: 'Billing', href: '/billing' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-zinc-950 border-r border-zinc-800 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <HeartPulse className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">VitalScan</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "text-white bg-blue-600/10" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-blue-500" : "group-hover:text-zinc-200"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}

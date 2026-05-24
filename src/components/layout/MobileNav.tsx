'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  User, 
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mobileItems = [
  { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
  { icon: History, label: 'History', href: '/history' },
  { icon: Scan, label: 'Scan', href: '/scan', primary: true },
  { icon: MessageSquare, label: 'AI', href: '/copilot' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 bg-background/80 backdrop-blur-xl border-t border-border">
      <nav className="flex items-center justify-between max-w-lg mx-auto">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href
          
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-6 flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.4)] border-4 border-background">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className={cn(
                  "text-[10px] mt-1 font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center py-2 px-3 transition-colors"
            >
              <item.icon className={cn(
                "w-6 h-6 mb-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0 relative">
        {/* Subtle Background Mesh for Light Mode */}
        <div className="absolute inset-0 -z-10 dark:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

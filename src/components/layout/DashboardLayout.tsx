import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

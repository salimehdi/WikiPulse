"use client"

import Link from "next/link"
import { BarChart3, Settings, Activity } from "lucide-react"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="h-screen w-64 bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-blue-400">WikiPulse</h1>
        </div>
        <p className="text-sm text-slate-400">Digital Seismograph</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard") ? "bg-blue-900/30 text-blue-300 font-medium" : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <BarChart3 size={20} />
          <span>Command Center</span>
        </Link>
        <Link
          href="/domain-monitor"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/domain-monitor")
              ? "bg-blue-900/30 text-blue-300 font-medium"
              : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Activity size={20} />
          <span>Domain Monitor</span>
        </Link>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/settings") ? "bg-blue-900/30 text-blue-300 font-medium" : "text-slate-300 hover:bg-slate-800"
          }`}
        >
          <Settings size={20} />
          <span>System Settings</span>
        </Link>
      </nav>

      <div className="p-6 border-t border-slate-800 text-xs text-slate-400">
        <p>v1.0.0</p>
      </div>
    </aside>
  )
}

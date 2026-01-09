import type React from "react"
interface StatsCardProps {
  title: string
  value: string | number
  unit?: string
  status?: "normal" | "warning" | "critical"
  icon?: React.ReactNode
}

export function StatsCard({ title, value, unit, status = "normal", icon }: StatsCardProps) {
  const statusStyles = {
    normal: "text-green-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">{title}</p>
          <p className={`text-3xl font-bold ${statusStyles[status]}`}>
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        {icon && <div className="text-slate-500">{icon}</div>}
      </div>
    </div>
  )
}

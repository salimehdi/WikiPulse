"use client"

import Link from "next/link"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

const domains = [
  {
    id: "1",
    name: "Influenza",
    articlesMonitored: 487,
    status: "critical",
    anomalyRate: 28,
    trustScore: 0.71,
    sparklineData: [12, 14, 16, 18, 22, 25, 28, 26, 24, 20, 18, 16, 15, 14],
  },
  {
    id: "2",
    name: "COVID-19",
    articlesMonitored: 621,
    status: "anomaly",
    anomalyRate: 14,
    trustScore: 0.82,
    sparklineData: [8, 9, 10, 11, 12, 13, 14, 14, 13, 12, 11, 10, 9, 8],
  },
  {
    id: "3",
    name: "Climate Change",
    articlesMonitored: 793,
    status: "stable",
    anomalyRate: 5,
    trustScore: 0.91,
    sparklineData: [4, 4, 4, 5, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3],
  },
  {
    id: "4",
    name: "Artificial Intelligence",
    articlesMonitored: 512,
    status: "critical",
    anomalyRate: 32,
    trustScore: 0.65,
    sparklineData: [15, 18, 22, 25, 28, 31, 32, 30, 28, 26, 24, 22, 20, 18],
  },
  {
    id: "5",
    name: "Election 2026",
    articlesMonitored: 334,
    status: "anomaly",
    anomalyRate: 19,
    trustScore: 0.75,
    sparklineData: [12, 13, 15, 17, 18, 19, 19, 18, 17, 16, 15, 14, 13, 12],
  },
  {
    id: "6",
    name: "Economic Crisis",
    articlesMonitored: 456,
    status: "stable",
    anomalyRate: 7,
    trustScore: 0.88,
    sparklineData: [6, 6, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 5],
  },
]

export default function DomainMonitor() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stable":
        return <CheckCircle size={20} className="text-emerald-400" />
      case "anomaly":
        return <AlertTriangle size={20} className="text-yellow-400" />
      case "critical":
        return <AlertCircle size={20} className="text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "border-emerald-900/50 bg-emerald-900/10"
      case "anomaly":
        return "border-yellow-900/50 bg-yellow-900/10"
      case "critical":
        return "border-red-900/50 bg-red-900/10"
      default:
        return "border-slate-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-200">Domain Monitor</h1>
        <p className="text-slate-400 mt-2">Overview of all monitored surveillance domains</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <Link
            key={domain.id}
            href={`/domain/${domain.id}`}
            className={`bg-slate-900 border rounded-lg p-6 hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer ${getStatusColor(
              domain.status,
            )}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-200">{domain.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{domain.articlesMonitored} articles monitored</p>
              </div>
              {getStatusIcon(domain.status)}
            </div>

            {/* Mini Sparkline */}
            <div className="mb-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={domain.sparklineData.map((value, i) => ({ day: i, value }))}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-400">Anomaly Rate</p>
                <p className={`text-lg font-bold ${domain.anomalyRate > 15 ? "text-red-500" : "text-emerald-400"}`}>
                  {domain.anomalyRate}%
                </p>
              </div>
              <div>
                <p className="text-slate-400">Trust Score</p>
                <p className="text-lg font-bold text-blue-400">{(domain.trustScore * 100).toFixed(0)}%</p>
              </div>
            </div>

            {/* View Details Link */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-blue-400 group">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

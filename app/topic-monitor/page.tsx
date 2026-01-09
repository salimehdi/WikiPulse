"use client"

import Link from "next/link"
import { topics } from "@/lib/mock-data"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { AlertCircle, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

export default function TopicMonitor() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "stable":
        return <CheckCircle size={20} className="text-green-400" />
      case "anomaly":
        return <AlertTriangle size={20} className="text-yellow-400" />
      case "critical":
        return <AlertCircle size={20} className="text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "border-green-900/50 bg-green-900/10"
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
        <h1 className="text-4xl font-bold text-slate-100">Topic Monitor</h1>
        <p className="text-slate-400 mt-2">Overview of all monitored surveillance topics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topic/${topic.id}`}
            className={`bg-slate-900 border rounded-lg p-6 hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-900/20 cursor-pointer ${getStatusColor(
              topic.status,
            )}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">{topic.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{topic.articlesMonitored} articles monitored</p>
              </div>
              {getStatusIcon(topic.status)}
            </div>

            {/* Mini Sparkline */}
            <div className="mb-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={topic.sparklineData.map((value, i) => ({ day: i, value }))}>
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-400">Anomaly Rate</p>
                <p className={`text-lg font-bold ${topic.anomalyRate > 15 ? "text-red-400" : "text-green-400"}`}>
                  {topic.anomalyRate}%
                </p>
              </div>
              <div>
                <p className="text-slate-400">Trust Score</p>
                <p className="text-lg font-bold text-blue-400">{(topic.trustScore * 100).toFixed(0)}%</p>
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

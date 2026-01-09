"use client"
import { StatsCard } from "@/components/stats-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, Download, Zap } from "lucide-react"
import { getGlobalMetrics, getActivityData } from "@/lib/mock-data"

export default function Dashboard() {
  const metrics = getGlobalMetrics()
  const activityData = getActivityData()

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header with action buttons */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">Command Center</h1>
            <p className="text-slate-400 mt-2">Global monitoring and anomaly overview</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
              <Zap size={18} />
              Trigger Global Scan
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-100 transition-colors">
              <Download size={18} />
              Export Daily Report
            </button>
          </div>
        </div>
      </div>

      {/* Aggregated metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Topics Monitored"
          value={metrics.totalTopics}
          status="normal"
          icon={<Activity size={24} />}
        />
        <StatsCard
          title="Global Anomaly Rate"
          value={metrics.globalAnomalyRate}
          unit="%"
          status={metrics.globalAnomalyRate > 15 ? "warning" : "normal"}
          icon={<Activity size={24} />}
        />
        <StatsCard
          title="Anomalies Detected"
          value={metrics.anomalyDetectedCount}
          status={metrics.anomalyDetectedCount > 2 ? "critical" : "warning"}
          icon={<Activity size={24} />}
        />
        <StatsCard title="System Status" value={metrics.systemStatus} status="normal" icon={<Activity size={24} />} />
      </div>

      {/* Global Activity Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Anomalies Detected (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip cursor={{ fill: "rgba(17, 76, 225, 0.6)" }}  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Bar dataKey="influenza" fill="#ef4444" name="Influenza" />
            <Bar dataKey="covid19" fill="#f97316" name="COVID-19" />
            <Bar dataKey="vaccination" fill="#eab308" name="Vaccination" />
            <Bar dataKey="mpox" fill="#3b82f6" name="Mpox" />
            <Bar dataKey="ebola" fill="#8b5cf6" name="Ebola" />
            <Bar dataKey="measles" fill="#ec4899" name="Measles" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

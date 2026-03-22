"use client"
import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/stats-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, Download, Zap } from "lucide-react"

const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#eab308", // yellow
  "#f97316", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#10b981", // emerald
  "#06b6d4", // cyan
]

// Helper: "dom_infectious_disease" -> "Dom Infectious Disease"
const formatBarName = (key: string) => {
  return key
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

async function getGlobalMetrics() {
  const response = await fetch("https://wikipulse-backend.onrender.com/api/v1/dashboard")
  const data = await response.json()

  return {
    totalTopics: data.globalMetrics.totalDomains,
    globalAnomalyRate: data.globalMetrics.globalAnomalyRate,
    systemStatus: data.globalMetrics.systemStatus,
    anomalyDetectedCount: data.globalMetrics.anomalyCount,
    activityChart: data.activityChart || []
  }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getGlobalMetrics()
        
        // Appending your mock activity data to the real metrics just for demonstration
        // const activityData0 = [
        //   {
        //     "date": "2026-02-21",
        //     "dom_infectious_disease": 25430,
        //     "dom_stock_market_crash1": 12050,
        //     "dom_stock_market_crash3": 10050,
        //     "dom_stock_market_crash5": 11050,
        //     "dom_stock_market_crash7": 16050,
        //   },
        //   {
        //     "date": "2026-02-21",
        //     "dom_infectious_disease": 25430,
        //     "dom_stock_market_crash1": 12050,
        //     "dom_stock_market_crash3": 10050,
        //     "dom_stock_market_crash5": 11050,
        //     "dom_stock_market_crash7": 16050,
        //   },
        // ]
        // data.activityChart.push(...activityData0) 
        
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, []) 

  const dynamicBarKeys = useMemo(() => {
    if (!metrics?.activityChart) return []
    
    const keys = new Set<string>()
    metrics.activityChart.forEach((dataPoint: any) => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== "date") {
          keys.add(key)
        }
      })
    })
    
    return Array.from(keys)
  }, [metrics])

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-slate-400 text-xl animate-pulse">Loading Command Center...</p>
      </div>
    )
  }

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
        <StatsCard 
          title="System Status" 
          value={metrics.systemStatus} 
          status="normal" 
          icon={<Activity size={24} />} 
        />
      </div>

      {/* Global Activity Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Anomalies Detected (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={metrics.activityChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              cursor={{ fill: "rgba(17, 76, 225, 0.6)" }}  
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} 
            />
            <Legend />
            
            {/* Dynamically map through the extracted keys to create Bars */}
            {dynamicBarKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                name={formatBarName(key)} 
                fill={CHART_COLORS[index % CHART_COLORS.length]} 
              />
            ))}

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
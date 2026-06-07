"use client"
import { useState, useEffect, useMemo } from "react"
import { StatsCard } from "@/components/stats-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Activity, Download, Zap, X, Check, Loader2 } from "lucide-react"

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
  
  // Export States
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])
  const [isExporting, setIsExporting] = useState(false)

  // Scan States
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle")

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await getGlobalMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, []) 

  // Handler for Exporting Daily Report
  const handleExportDailyReport = async () => {
    if (!reportDate) return
    
    try {
      setIsExporting(true)
      const response = await fetch(`https://wikipulse-backend.onrender.com/api/v1/reports/daily?date=${reportDate}`, {
        method: "GET",
      })

      // Could be handled better
      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`)
      }

      const blob = await response.blob()
      
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `wikipulse_report_${reportDate}.csv`
      
      document.body.appendChild(link)
      link.click()
      
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      setIsExportDialogOpen(false)
    } catch (error) {
      console.error("Failed to export report:", error)
      alert("Failed to export the report. Please make sure data exists for this date.")
    } finally {
      setIsExporting(false)
    }
  }

  // Handler for Triggering Global Scan
  const handleTriggerScan = async () => {
    try {
      setScanStatus("scanning")
      
      const response = await fetch("https://wikipulse-backend.onrender.com/api/v1/scans/global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({}) // Optional JSON body as per docs
      })

      if (!response.ok) {
        throw new Error(`Scan failed with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Scan successfully initiated:", data) // Logs the scanId and message

      setScanStatus("success")
      
      // Reset button back to normal after 3 seconds
      setTimeout(() => {
        setScanStatus("idle")
      }, 3000)

    } catch (error) {
      console.error("Failed to trigger scan:", error)
      alert("Failed to initiate global scan. Please try again.")
      setScanStatus("idle")
    }
  }

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
    <div className="min-h-screen bg-slate-950 p-8 relative">
      {/* Header with action buttons */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">Command Center</h1>
            <p className="text-slate-400 mt-2">Global monitoring and anomaly overview</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleTriggerScan}
              disabled={scanStatus !== "idle"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 min-w-[190px] justify-center ${
                scanStatus === "success" 
                  ? "bg-emerald-600 hover:bg-emerald-700" 
                  : "bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
              }`}
            >
              {scanStatus === "idle" && (
                <>
                  <Zap size={18} />
                  Trigger Global Scan
                </>
              )}
              {scanStatus === "scanning" && (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Initiating...
                </>
              )}
              {scanStatus === "success" && (
                <>
                  <Check size={18} />
                  Scan Initiated
                </>
              )}
            </button>
            
            <button 
              onClick={() => setIsExportDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-100 transition-colors"
            >
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
            {dynamicBarKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key as string} 
                name={formatBarName(key as string)} 
                fill={CHART_COLORS[index % CHART_COLORS.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Export Dialog Modal */}
      {isExportDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-slate-100">Export Report</h2>
              <button 
                onClick={() => setIsExportDialogOpen(false)}
                className="text-slate-400 hover:text-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-400 mb-4 text-sm">
                Select a specific date to export raw telemetry data in CSV format.
              </p>
              
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="report-date">
                  Target Date
                </label>
                <input 
                  id="report-date"
                  type="date" 
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 px-4 py-3 rounded-lg outline-none border border-slate-700 focus:border-blue-500 transition-colors [color-scheme:dark]"
                  max={new Date().toISOString().split("T")[0]} 
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setIsExportDialogOpen(false)}
                  disabled={isExporting}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleExportDailyReport}
                  disabled={isExporting}
                  className="flex items-center justify-center min-w-[120px] gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors disabled:opacity-70 font-medium text-sm"
                >
                  {isExporting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> Exporting...
                    </span>
                  ) : (
                    "Download CSV"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
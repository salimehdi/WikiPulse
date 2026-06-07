"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { StatsCard } from "@/components/stats-card"
import {
  TrafficChart,
  SpectralFingerprint,
  BenfordsLaw,
  SpiderRatioChart,
  ZScoreHistory,
} from "@/components/dashboard-charts"
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"

let domainsData: Record<
  string,
  {
    id: string
    name: string
    anomalyRate: number
    trustScore: number
    articlesMonitored: number
  }
> = {
  "1": {
    id: "1",
    name: "Influenza",
    anomalyRate: 28,
    trustScore: 0.71,
    articlesMonitored: 487,
  },
  "2": {
    id: "2",
    name: "COVID-19",
    anomalyRate: 14,
    trustScore: 0.82,
    articlesMonitored: 621,
  },
  "3": {
    id: "3",
    name: "Climate Change",
    anomalyRate: 5,
    trustScore: 0.91,
    articlesMonitored: 793,
  },
  "4": {
    id: "4",
    name: "Artificial Intelligence",
    anomalyRate: 32,
    trustScore: 0.65,
    articlesMonitored: 512,
  },
  "5": {
    id: "5",
    name: "Election 2026",
    anomalyRate: 19,
    trustScore: 0.75,
    articlesMonitored: 334,
  },
  "6": {
    id: "6",
    name: "Economic Crisis",
    anomalyRate: 7,
    trustScore: 0.88,
    articlesMonitored: 456,
  },
}

const eventLogsData: Record<
  string,
  {
    id: string
    timestamp: string
    level: string
    message: string
    article: string
    zScore: number
    isAnomaly: number
    modelConfidence: number
    forensicScore: number
  }[]
> = {
  "1": [
    {
      id: "log-1",
      timestamp: "2026-01-02 19:31:47",
      level: "critical",
      message: "Anomalous edit pattern detected on Influenza article",
      article: "Influenza_pandemic",
      zScore: 3.2,
      isAnomaly: 1,
      modelConfidence: 0.94,
      forensicScore: 0.87,
    },
    {
      id: "log-2",
      timestamp: "2026-01-02 18:45:12",
      level: "warn",
      message: "High volume of metadata changes",
      article: "Influenza_types",
      zScore: 2.1,
      isAnomaly: 1,
      modelConfidence: 0.78,
      forensicScore: 0.72,
    },
    {
      id: "log-3",
      timestamp: "2026-01-02 17:22:33",
      level: "info",
      message: "Standard editorial activity",
      article: "History_of_flu",
      zScore: 0.5,
      isAnomaly: 0,
      modelConfidence: 0.91,
      forensicScore: 0.95,
    },
  ],
  "2": [
    {
      id: "log-1",
      timestamp: "2026-01-02 16:10:22",
      level: "warn",
      message: "Multiple rapid revisions detected",
      article: "COVID-19_pandemic",
      zScore: 1.8,
      isAnomaly: 1,
      modelConfidence: 0.83,
      forensicScore: 0.79,
    },
  ],
  "3": [
    {
      id: "log-1",
      timestamp: "2026-01-02 15:05:11",
      level: "info",
      message: "Normal editing activity",
      article: "Climate_change",
      zScore: 0.3,
      isAnomaly: 0,
      modelConfidence: 0.96,
      forensicScore: 0.97,
    },
  ],
}


export default function DomainDetail() {
  const { domainId } = useParams<{ domainId: string }>()
  
  const [domainData, setDomainData] = useState<any>(domainsData[domainId])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // NEW: State variables for the forensics API call
  const [isForensicsRunning, setIsForensicsRunning] = useState(false)
  const [forensicsFeedback, setForensicsFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    async function fetchDomainData() {
      try {
        setIsLoading(true)
        const response = await fetch(`https://wikipulse-backend.onrender.com/api/v1/domains/${domainId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch domain details")
        }
        
        const data = await response.json()
        // Merge API data with fallback/mock data
        const data0 = domainData
        data0.logs = eventLogsData[domainId] || [];
        console.log("Fetched domain data:", data0)
        setDomainData(data0)
        // -----
        // setDomainData(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (domainId) {
      fetchDomainData()
    }
  }, [domainId])

  // NEW: Function to handle the forensics API call
  const handleRunForensics = async () => {
    setIsForensicsRunning(true)
    setForensicsFeedback(null)

    try {
      const response = await fetch(`https://wikipulse-backend.onrender.com/api/v1/domains/${domainId}/forensics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          depth: "standard"
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to trigger forensics scan")
      }

      const data = await response.json()
      
      // Assuming a 202 Accepted returns the structure you provided
      setForensicsFeedback({ 
        type: 'success', 
        message: data.message || "Forensics started successfully." 
      })

      // Auto-hide the success message after 5 seconds
      setTimeout(() => setForensicsFeedback(null), 5000)

    } catch (err: any) {
      console.error(err)
      setForensicsFeedback({ 
        type: 'error', 
        message: err.message || "An error occurred while starting forensics." 
      })
    } finally {
      setIsForensicsRunning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-slate-400 text-xl animate-pulse">Analyzing Domain Telemetry...</p>
      </div>
    )
  }

  // if (error || !domainData) {
  //   return (
  //     <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
  //       <p className="text-red-400 text-xl">Error: {error || "Domain not found"}</p>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Breadcrumbs and Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Link href="/domain-monitor" className="hover:text-slate-200">
            Monitor
          </Link>
          <span>&gt;</span>
          <span className="text-slate-200 font-medium">{domainData.name}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-200">{domainData.name}</h1>
            <p className="text-slate-400 mt-2">Detailed forensic analysis and event logs</p>
          </div>
          
          {/* UPDATED: Run Forensics Button and Feedback */}
          <div className="flex flex-col items-end gap-2">
            <button 
              onClick={handleRunForensics}
              disabled={isForensicsRunning}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg text-white transition-colors font-medium flex items-center gap-2"
            >
              {isForensicsRunning ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting...
                </>
              ) : (
                "Run Forensics"
              )}
            </button>
            
            {forensicsFeedback && (
              <p className={`text-sm ${forensicsFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {forensicsFeedback.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Anomaly Rate"
          value={domainData.anomalyRate}
          unit="%"
          status={domainData.anomalyRate > 15 ? "critical" : domainData.anomalyRate > 8 ? "warning" : "normal"}
          icon={<AlertCircle size={24} />}
        />
        <StatsCard
          title="Forensic Trust Score"
          value={domainData.trustScore}
          status={domainData.trustScore > 0.8 ? "normal" : "warning"}
          icon={<CheckCircle size={24} />}
        />
        <StatsCard
          title="Articles Monitored"
          value={domainData.articlesMonitored}
          status="normal"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Main Charts */}
      <div className="mb-8">
        {/* Pass fullChartData if your TrafficChart accepts it as a prop */}
        <TrafficChart data={domainData.fullChartData} />
      </div>

      {/* Forensic Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpectralFingerprint />
        <BenfordsLaw />
        <SpiderRatioChart />
        <ZScoreHistory />
      </div>

      {/* Event Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Event Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800">
              <tr className="text-slate-400">
                <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium">Log Level</th>
                <th className="text-left py-3 px-4 font-medium">Message</th>
                <th className="text-left py-3 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {domainData.logs?.map((log: any) => (
                <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 text-slate-300">
                    {new Date(log.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        log.level === "critical"
                          ? "bg-red-900/30 text-red-500"
                          : log.level === "warn"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-200">{log.message}</td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/domain/${domainId}/log/${log.id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {(!domainData.logs || domainData.logs.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-slate-500">
                    No logs found for this domain.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
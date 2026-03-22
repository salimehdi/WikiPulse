"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowLeft, Newspaper } from "lucide-react"

// Keeping fallbacks for data that your API does not currently return 
const FALLBACK_NEWS_DATA = {
  search_info: { query: "influenza", date: "2026-01-09", total_articles: 127 },
  key_findings: {
    main_theme: "H3N2 'super flu' surge across United States",
    dominant_variant: "H3N2 Subclade K ('super flu')",
    severity: "Very high activity levels, hospitals overwhelmed",
    geographic_focus: "Nationwide US, particularly Michigan, Ohio, Texas",
  },
  top_stories: [
    { headline: "Flu cases rise 'exponentially' in Michigan...", source: "Detroit Free Press", date: "2026-01-07" },
    { headline: "SIH limiting visitors in hospitals...", source: "WPSD Local 6", date: "2026-01-08" },
    { headline: "San Mateo reports child influenza death...", source: "Los Angeles Times", date: "2026-01-08" },
  ],
}

const FALLBACK_HISTORY_DATA = [
  { date: "2025-12-03", isAnomaly: 0, modelConfidence: 0.92, forensicScore: 0.94 },
  { date: "2025-12-04", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.93 },
  { date: "2025-12-13", isAnomaly: 1, modelConfidence: 0.75, forensicScore: 0.78 },
  // ... Truncated for brevity, assuming you have your full array here
]

export default function LogDetail() {
  const { domainId, logId } = useParams<{ domainId: string; logId: string }>()
  
  const [logData, setLogData] = useState<any>(null)
  const [newsData, setNewsData] = useState(FALLBACK_NEWS_DATA)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogDetails() {
      try {
        setIsLoading(true)
        const response = await fetch(`https://wikipulse-backend.onrender.com/api/v1/domains/${domainId}/logs/${logId}`)
        
        // if (!response.ok) {
        //   throw new Error("Failed to fetch log details")
        // }
        
        const data = await response.json()
        setLogData(data)
      } catch (error) {
        console.error("Failed to fetch log data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (domainId && logId) {
      fetchLogDetails()
    }
  }, [domainId, logId])

  if (isLoading || !logData) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-slate-400 text-xl animate-pulse">Decrypting Telemetry...</p>
      </div>
    )
  }

  // Extract variables from the real API response
  const telemetry = logData.rawTelemetry || {}
  
  const formattedTimestamp = new Date(logData.timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/domain/${domainId}`}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Domain</span>
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Timestamp */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-slate-400">
                🕒
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Timestamp</p>
                <p className="text-lg font-semibold text-slate-100">{formattedTimestamp}</p>
                <p className="text-xs text-slate-500">{logData.timestamp}</p>
              </div>
            </div>

            {/* Article */}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Article</p>
              <p className="text-lg font-semibold text-slate-100">{telemetry.article || "Unknown"}</p>
            </div>

          </div>
        </div>
      </div>

      {/* Analysis Result Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Analysis Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Z-Score</p>
            <p className="text-3xl font-bold text-blue-400">{telemetry.z_score?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Is Anomaly</p>
            <p className={`text-3xl font-bold ${telemetry.is_anomaly === 1 ? "text-red-500" : "text-emerald-400"}`}>
              {telemetry.is_anomaly === 1 ? "Yes" : "No"}
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Model Confidence</p>
            <p className="text-3xl font-bold text-blue-400">
              {telemetry.model_confidence ? (telemetry.model_confidence * 100).toFixed(0) : "0"}%
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Forensic Score</p>
            <p className="text-3xl font-bold text-blue-400">
              {telemetry.forensic_score ? (telemetry.forensic_score * 100).toFixed(0) : "0"}%
            </p>
          </div>
        </div>
      </div>

      {/* Historical Context Charts (Using Fallback Data) */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">30-Day Historical Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={FALLBACK_HISTORY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: number) => value.toFixed(3)}
              />
              <Bar dataKey="isAnomaly" fill="#ef4444" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="modelConfidence" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="forensicScore" stroke="#10b981" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* News Intelligence (Using Fallback Data) */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={24} className="text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-200">External News Intelligence</h3>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 mb-2">
            <span className="font-medium">Search Query:</span> {newsData.search_info.query}
          </p>
          <p className="text-slate-400 mb-4">
            <span className="font-medium">Total Articles Found:</span> {newsData.search_info.total_articles}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 mb-4">
            <p className="text-slate-400 text-sm mb-2">Key Findings</p>
            <p className="text-slate-200 font-medium mb-2">{newsData.key_findings.main_theme}</p>
            <p className="text-slate-400 text-sm mb-2">
              <span className="font-medium">Dominant Variant:</span> {newsData.key_findings.dominant_variant}
            </p>
            <p className="text-slate-400 text-sm mb-2">
              <span className="font-medium">Severity:</span> {newsData.key_findings.severity}
            </p>
            <p className="text-slate-400 text-sm">
              <span className="font-medium">Geographic Focus:</span> {newsData.key_findings.geographic_focus}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-3">Top Stories</h4>
          <div className="space-y-3">
            {newsData.top_stories.slice(0, 5).map((story, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <p className="text-slate-200 font-medium mb-2">{story.headline}</p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{story.source}</span>
                  <span>{story.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
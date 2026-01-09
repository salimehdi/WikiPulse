"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowLeft, Newspaper } from "lucide-react"

const FALLBACK_LOG_DATA = {
  timestamp: "2026-01-02 19:31:47",
  article: "H3N2 Variant",
  zScore: 4.2,
  isAnomaly: 1,
  modelConfidence: 0.92,
  forensicScore: 0.88,
  historyData: [
    { date: "2025-12-03", isAnomaly: 0, modelConfidence: 0.92, forensicScore: 0.94 },
    { date: "2025-12-04", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.93 },
    { date: "2025-12-05", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.92 },
    { date: "2025-12-06", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.91 },
    { date: "2025-12-07", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.9 },
    { date: "2025-12-08", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.88 },
    { date: "2025-12-09", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.86 },
    { date: "2025-12-10", isAnomaly: 0, modelConfidence: 0.81, forensicScore: 0.84 },
    { date: "2025-12-11", isAnomaly: 0, modelConfidence: 0.8, forensicScore: 0.82 },
    { date: "2025-12-12", isAnomaly: 0, modelConfidence: 0.79, forensicScore: 0.81 },
    { date: "2025-12-13", isAnomaly: 1, modelConfidence: 0.75, forensicScore: 0.78 },
    { date: "2025-12-14", isAnomaly: 1, modelConfidence: 0.78, forensicScore: 0.8 },
    { date: "2025-12-15", isAnomaly: 1, modelConfidence: 0.81, forensicScore: 0.82 },
    { date: "2025-12-16", isAnomaly: 1, modelConfidence: 0.84, forensicScore: 0.85 },
    { date: "2025-12-17", isAnomaly: 1, modelConfidence: 0.86, forensicScore: 0.87 },
    { date: "2025-12-18", isAnomaly: 1, modelConfidence: 0.88, forensicScore: 0.88 },
    { date: "2025-12-19", isAnomaly: 1, modelConfidence: 0.89, forensicScore: 0.89 },
    { date: "2025-12-20", isAnomaly: 1, modelConfidence: 0.9, forensicScore: 0.89 },
    { date: "2025-12-21", isAnomaly: 1, modelConfidence: 0.91, forensicScore: 0.88 },
    { date: "2025-12-22", isAnomaly: 1, modelConfidence: 0.92, forensicScore: 0.87 },
    { date: "2025-12-23", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.89 },
    { date: "2025-12-24", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.88 },
    { date: "2025-12-25", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.87 },
    { date: "2025-12-26", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.86 },
    { date: "2025-12-27", isAnomaly: 0, modelConfidence: 0.81, forensicScore: 0.85 },
    { date: "2025-12-28", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.86 },
    { date: "2025-12-29", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.87 },
    { date: "2025-12-30", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.88 },
    { date: "2025-12-31", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.89 },
    { date: "2026-01-01", isAnomaly: 1, modelConfidence: 0.91, forensicScore: 0.88 },
    { date: "2026-01-02", isAnomaly: 1, modelConfidence: 0.92, forensicScore: 0.88 },
  ],
}

const FALLBACK_NEWS_DATA = {
  search_info: {
    query: "influenza",
    date: "2026-01-09",
    total_articles: 127,
  },
  key_findings: {
    main_theme: "H3N2 'super flu' surge across United States",
    dominant_variant: "H3N2 Subclade K ('super flu')",
    severity: "Very high activity levels, hospitals overwhelmed",
    geographic_focus: "Nationwide US, particularly Michigan, Ohio, Texas",
  },
  top_stories: [
    {
      headline: "Flu cases rise 'exponentially' in Michigan, with kids on ventilators",
      source: "Detroit Free Press",
      date: "2026-01-07",
    },
    {
      headline: "SIH limiting visitors in hospitals due to rise in Influenza A cases",
      source: "WPSD Local 6",
      date: "2026-01-08",
    },
    {
      headline: "San Mateo reports child influenza death same week as CDC cuts",
      source: "Los Angeles Times",
      date: "2026-01-08",
    },
  ],
}

const logDetailsData: Record<
  string,
  Record<
    string,
    {
      timestamp: string
      article: string
      zScore: number
      isAnomaly: number
      modelConfidence: number
      forensicScore: number
      historyData: {
        date: string
        isAnomaly: number
        modelConfidence: number
        forensicScore: number
      }[]
    }
  >
> = {
  "1": {
    "log-1": {
      timestamp: "2026-01-02 19:31:47",
      article: "Influenza_pandemic",
      zScore: 3.2,
      isAnomaly: 1,
      modelConfidence: 0.94,
      forensicScore: 0.87,
      historyData: [
        { date: "2025-12-03", isAnomaly: 0, modelConfidence: 0.92, forensicScore: 0.94 },
        { date: "2025-12-04", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.93 },
        { date: "2025-12-05", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.92 },
        { date: "2025-12-06", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.91 },
        { date: "2025-12-07", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.9 },
        { date: "2025-12-08", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.88 },
        { date: "2025-12-09", isAnomaly: 1, modelConfidence: 0.71, forensicScore: 0.65 },
        { date: "2025-12-10", isAnomaly: 1, modelConfidence: 0.78, forensicScore: 0.72 },
        { date: "2025-12-11", isAnomaly: 1, modelConfidence: 0.81, forensicScore: 0.75 },
        { date: "2025-12-12", isAnomaly: 1, modelConfidence: 0.85, forensicScore: 0.79 },
        { date: "2025-12-13", isAnomaly: 1, modelConfidence: 0.88, forensicScore: 0.82 },
        { date: "2025-12-14", isAnomaly: 1, modelConfidence: 0.89, forensicScore: 0.84 },
        { date: "2025-12-15", isAnomaly: 1, modelConfidence: 0.91, forensicScore: 0.86 },
        { date: "2025-12-16", isAnomaly: 1, modelConfidence: 0.92, forensicScore: 0.87 },
        { date: "2025-12-17", isAnomaly: 1, modelConfidence: 0.93, forensicScore: 0.88 },
        { date: "2025-12-18", isAnomaly: 1, modelConfidence: 0.93, forensicScore: 0.89 },
        { date: "2025-12-19", isAnomaly: 1, modelConfidence: 0.94, forensicScore: 0.87 },
        { date: "2025-12-20", isAnomaly: 1, modelConfidence: 0.94, forensicScore: 0.88 },
        { date: "2025-12-21", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.91 },
        { date: "2025-12-22", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.9 },
        { date: "2025-12-23", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.89 },
        { date: "2025-12-24", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.87 },
        { date: "2025-12-25", isAnomaly: 0, modelConfidence: 0.81, forensicScore: 0.86 },
        { date: "2025-12-26", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.85 },
        { date: "2025-12-27", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.86 },
        { date: "2025-12-28", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.87 },
        { date: "2025-12-29", isAnomaly: 0, modelConfidence: 0.86, forensicScore: 0.88 },
        { date: "2025-12-30", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.89 },
        { date: "2025-12-31", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.9 },
        { date: "2026-01-01", isAnomaly: 1, modelConfidence: 0.91, forensicScore: 0.86 },
        { date: "2026-01-02", isAnomaly: 1, modelConfidence: 0.94, forensicScore: 0.87 },
      ],
    },
    "log-2": {
      timestamp: "2026-01-02 18:45:12",
      article: "Influenza_types",
      zScore: 2.1,
      isAnomaly: 1,
      modelConfidence: 0.78,
      forensicScore: 0.72,
      historyData: [
        { date: "2025-12-03", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.92 },
        { date: "2025-12-04", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.91 },
        { date: "2025-12-05", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.89 },
        { date: "2025-12-06", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.88 },
        { date: "2025-12-07", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.86 },
        { date: "2025-12-08", isAnomaly: 0, modelConfidence: 0.8, forensicScore: 0.84 },
        { date: "2025-12-09", isAnomaly: 0, modelConfidence: 0.78, forensicScore: 0.82 },
        { date: "2025-12-10", isAnomaly: 1, modelConfidence: 0.65, forensicScore: 0.68 },
        { date: "2025-12-11", isAnomaly: 1, modelConfidence: 0.7, forensicScore: 0.7 },
        { date: "2025-12-12", isAnomaly: 1, modelConfidence: 0.73, forensicScore: 0.72 },
        { date: "2025-12-13", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.88 },
        { date: "2025-12-14", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.9 },
        { date: "2025-12-15", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.91 },
        { date: "2025-12-16", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.92 },
        { date: "2025-12-17", isAnomaly: 0, modelConfidence: 0.9, forensicScore: 0.93 },
        { date: "2025-12-18", isAnomaly: 0, modelConfidence: 0.9, forensicScore: 0.93 },
        { date: "2025-12-19", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.94 },
        { date: "2025-12-20", isAnomaly: 1, modelConfidence: 0.76, forensicScore: 0.71 },
        { date: "2025-12-21", isAnomaly: 1, modelConfidence: 0.74, forensicScore: 0.7 },
        { date: "2025-12-22", isAnomaly: 1, modelConfidence: 0.75, forensicScore: 0.71 },
        { date: "2025-12-23", isAnomaly: 1, modelConfidence: 0.76, forensicScore: 0.72 },
        { date: "2025-12-24", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.87 },
        { date: "2025-12-25", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.88 },
        { date: "2025-12-26", isAnomaly: 0, modelConfidence: 0.86, forensicScore: 0.89 },
        { date: "2025-12-27", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.9 },
        { date: "2025-12-28", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.91 },
        { date: "2025-12-29", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.92 },
        { date: "2025-12-30", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.93 },
        { date: "2025-12-31", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.93 },
        { date: "2026-01-01", isAnomaly: 1, modelConfidence: 0.77, forensicScore: 0.7 },
        { date: "2026-01-02", isAnomaly: 1, modelConfidence: 0.78, forensicScore: 0.72 },
      ],
    },
    "log-3": {
      timestamp: "2026-01-02 17:22:33",
      article: "History_of_flu",
      zScore: 0.5,
      isAnomaly: 0,
      modelConfidence: 0.91,
      forensicScore: 0.95,
      historyData: [
        { date: "2025-12-03", isAnomaly: 0, modelConfidence: 0.94, forensicScore: 0.96 },
        { date: "2025-12-04", isAnomaly: 0, modelConfidence: 0.93, forensicScore: 0.95 },
        { date: "2025-12-05", isAnomaly: 0, modelConfidence: 0.92, forensicScore: 0.94 },
        { date: "2025-12-06", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.93 },
        { date: "2025-12-07", isAnomaly: 0, modelConfidence: 0.9, forensicScore: 0.92 },
        { date: "2025-12-08", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.91 },
        { date: "2025-12-09", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.9 },
        { date: "2025-12-10", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.89 },
        { date: "2025-12-11", isAnomaly: 0, modelConfidence: 0.86, forensicScore: 0.88 },
        { date: "2025-12-12", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.87 },
        { date: "2025-12-13", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.86 },
        { date: "2025-12-14", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.85 },
        { date: "2025-12-15", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.84 },
        { date: "2025-12-16", isAnomaly: 0, modelConfidence: 0.81, forensicScore: 0.83 },
        { date: "2025-12-17", isAnomaly: 0, modelConfidence: 0.8, forensicScore: 0.82 },
        { date: "2025-12-18", isAnomaly: 0, modelConfidence: 0.81, forensicScore: 0.83 },
        { date: "2025-12-19", isAnomaly: 0, modelConfidence: 0.82, forensicScore: 0.84 },
        { date: "2025-12-20", isAnomaly: 0, modelConfidence: 0.83, forensicScore: 0.85 },
        { date: "2025-12-21", isAnomaly: 0, modelConfidence: 0.84, forensicScore: 0.86 },
        { date: "2025-12-22", isAnomaly: 0, modelConfidence: 0.85, forensicScore: 0.87 },
        { date: "2025-12-23", isAnomaly: 0, modelConfidence: 0.86, forensicScore: 0.88 },
        { date: "2025-12-24", isAnomaly: 0, modelConfidence: 0.87, forensicScore: 0.89 },
        { date: "2025-12-25", isAnomaly: 0, modelConfidence: 0.88, forensicScore: 0.9 },
        { date: "2025-12-26", isAnomaly: 0, modelConfidence: 0.89, forensicScore: 0.91 },
        { date: "2025-12-27", isAnomaly: 0, modelConfidence: 0.9, forensicScore: 0.92 },
        { date: "2025-12-28", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.93 },
        { date: "2025-12-29", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.94 },
        { date: "2025-12-30", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.94 },
        { date: "2025-12-31", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.94 },
        { date: "2026-01-01", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.95 },
        { date: "2026-01-02", isAnomaly: 0, modelConfidence: 0.91, forensicScore: 0.95 },
      ],
    },
  },
}

export default function LogDetail({ params }: { params: { domainId: string; logId: string } }) {
  const [newsData, setNewsData] = useState(FALLBACK_NEWS_DATA)
  const { domainId, logId } = useParams<{
    domainId: string
    logId: string
  }>()
  const logDetail = logDetailsData[domainId]?.[logId] || FALLBACK_LOG_DATA

  const formattedTimestamp = new Date(logDetail.timestamp).toLocaleString(
    "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );


  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Using fallback data
        setNewsData(FALLBACK_NEWS_DATA)
      } catch (error) {
        console.error("Failed to fetch news data:", error)
        setNewsData(FALLBACK_NEWS_DATA)
      }
    }

    fetchNewsData()
  }, [domainId])

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
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Timestamp
        </p>
        <p className="text-lg font-semibold text-slate-100">
          {formattedTimestamp}
        </p>
        <p className="text-xs text-slate-500">
          {logDetail.timestamp}
        </p>
      </div>
    </div>

    {/* Article */}
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">
        Article
      </p>
      <p className="text-lg font-semibold text-slate-100">
        {logDetail.article}
      </p>
    </div>

  </div>
</div>

      </div>

      {/* Analysis Result Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-200 mb-4">Analysis Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Z-Score</p>
            <p className="text-3xl font-bold text-blue-400">{logDetail.zScore.toFixed(2)}</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Is Anomaly</p>
            <p className={`text-3xl font-bold ${logDetail.isAnomaly === 1 ? "text-red-500" : "text-emerald-400"}`}>
              {logDetail.isAnomaly === 1 ? "Yes" : "No"}
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Model Confidence</p>
            <p className="text-3xl font-bold text-blue-400">{(logDetail.modelConfidence * 100).toFixed(0)}%</p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-4">
            <p className="text-slate-400 text-sm mb-1">Forensic Score</p>
            <p className="text-3xl font-bold text-blue-400">{(logDetail.forensicScore * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Historical Context Charts */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-4">30-Day Historical Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={logDetail.historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: number) => value.toFixed(3)}
              />
              {/* Red bars for anomalies */}
              <Bar dataKey="isAnomaly" fill="#ef4444" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
              {/* Blue line for model confidence */}
              <Line type="monotone" dataKey="modelConfidence" stroke="#3b82f6" strokeWidth={2} dot={false} />
              {/* Green line for forensic score */}
              <Line type="monotone" dataKey="forensicScore" stroke="#10b981" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* News Intelligence */}
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

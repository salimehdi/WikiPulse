"use client"

import { useParams } from "next/navigation"

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

const domainsData: Record<
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
  const domain = domainsData[domainId]
  const activeDomain = domain || domainsData["1"]
  const logs = eventLogsData[domainId] || eventLogsData["1"]

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Breadcrumbs and Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Link href="/domain-monitor" className="hover:text-slate-200">
            Monitor
          </Link>
          <span>&gt;</span>
          <span className="text-slate-200 font-medium">{activeDomain.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-200">{activeDomain.name}</h1>
            <p className="text-slate-400 mt-2">Detailed forensic analysis and event logs</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors font-medium">
            Run Forensics
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Anomaly Rate"
          value={activeDomain.anomalyRate}
          unit="%"
          status={activeDomain.anomalyRate > 15 ? "critical" : activeDomain.anomalyRate > 8 ? "warning" : "normal"}
          icon={<AlertCircle size={24} />}
        />
        <StatsCard
          title="Forensic Trust Score"
          value={activeDomain.trustScore}
          status={activeDomain.trustScore > 0.8 ? "normal" : "warning"}
          icon={<CheckCircle size={24} />}
        />
        <StatsCard
          title="Articles Monitored"
          value={activeDomain.articlesMonitored}
          status="normal"
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Main Charts */}
      <div className="mb-8">
        <TrafficChart />
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
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 text-slate-300">{log.timestamp}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

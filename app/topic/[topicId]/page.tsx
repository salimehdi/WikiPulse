"use client"

import { getTopicDetails, getEventLogs } from "@/lib/mock-data"
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

export default function TopicDetail({ params }: { params: { topicId: string } }) {
  const topic = getTopicDetails(params.topicId)
  const logs = getEventLogs(params.topicId)

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">Topic Not Found</h1>
          <Link href="/topic-monitor" className="text-blue-400 hover:text-blue-300">
            Back to Topic Monitor
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Breadcrumbs and Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Link href="/topic-monitor" className="hover:text-slate-200">
            Monitor
          </Link>
          <span>&gt;</span>
          <span className="text-slate-100 font-medium">{topic.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">{topic.name}</h1>
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
          value={topic.anomalyRate}
          unit="%"
          status={topic.anomalyRate > 15 ? "critical" : topic.anomalyRate > 8 ? "warning" : "normal"}
          icon={<AlertCircle size={24} />}
        />
        <StatsCard
          title="Forensic Trust Score"
          value={topic.trustScore}
          status={topic.trustScore > 0.8 ? "normal" : "warning"}
          icon={<CheckCircle size={24} />}
        />
        <StatsCard
          title="Articles Monitored"
          value={topic.articlesMonitored}
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
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Event Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800">
              <tr className="text-slate-400">
                <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium">Log Level</th>
                <th className="text-left py-3 px-4 font-medium">Message</th>
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
                          ? "bg-red-900/30 text-red-400"
                          : log.level === "warn"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {log.level.charAt(0).toUpperCase() + log.level.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-100">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

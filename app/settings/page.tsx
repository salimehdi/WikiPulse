"use client"

import { useState } from "react"
import { topics } from "@/lib/mock-data"
import { Save } from "lucide-react"

export default function Settings() {
  const [cronExpression, setCronExpression] = useState("0 0 * * *")
  const [zScoreThreshold, setZScoreThreshold] = useState(3.0)
  const [minTrustScore, setMinTrustScore] = useState(0.5)
  const [selectedTopic, setSelectedTopic] = useState("")

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100">System Settings</h1>
        <p className="text-slate-400 mt-2">Configure monitoring schedules and thresholds</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Cron Configuration Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Cron Configuration</h2>
          <p className="text-slate-400 text-sm mb-4">Define when global forensic scans are executed</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">Cron Expression</label>
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="0 0 * * *"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-blue-400 focus:outline-none"
            />
            <p className="text-xs text-slate-400 mt-2">Format: minute hour day month weekday</p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
            <Save size={18} />
            Save Schedule
          </button>
        </div>

        {/* Global Threshold Tuning Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Threshold Tuning</h2>

          {/* Z-Score Threshold */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Global Z-Score Threshold</label>
              <span className="text-lg font-bold text-blue-400">{zScoreThreshold.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={zScoreThreshold}
              onChange={(e) => setZScoreThreshold(Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-400 mt-2">
              Higher values = fewer false positives, Lower values = more sensitivity
            </p>
          </div>

          {/* Trust Score Threshold */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Minimum Trust Score</label>
              <span className="text-lg font-bold text-blue-400">{(minTrustScore * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minTrustScore}
              onChange={(e) => setMinTrustScore(Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-400 mt-2">Minimum trust score required to mark content as reliable</p>
          </div>

          {/* Topic-Specific Overrides */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-sm font-medium text-slate-300 mb-2">Topic-Specific Overrides</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:border-blue-400 focus:outline-none"
            >
              <option value="">Select a topic to override</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
            {selectedTopic && <p className="text-xs text-slate-400 mt-2">Overrides configured for {selectedTopic}</p>}
          </div>
        </div>

        {/* Save Settings Button */}
        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors font-medium">
          <Save size={20} />
          Save All Settings
        </button>
      </div>
    </div>
  )
}

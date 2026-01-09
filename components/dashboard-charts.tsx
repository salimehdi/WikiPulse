"use client"

import {
  ComposedChart,
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Cell,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

// Mock data for traffic chart
const trafficData = [
  { date: "Jan 1", views: 1200, editors: 40 },
  { date: "Jan 2", views: 1300, editors: 45 },
  { date: "Jan 3", views: 1500, editors: 48 },
  { date: "Jan 4", views: 2800, editors: 52 },
  { date: "Jan 5", views: 4200, editors: 58 },
  { date: "Jan 6", views: 3500, editors: 55 },
  { date: "Jan 7", views: 1800, editors: 42 },
]

// Spectral Fingerprint data
const spectralData = [
  { frequency: 0.05, magnitude: 0.3 },
  { frequency: 0.1, magnitude: 0.5 },
  { frequency: 0.14, magnitude: 0.9 },
  { frequency: 0.2, magnitude: 0.4 },
  { frequency: 0.3, magnitude: 0.2 },
  { frequency: 0.45, magnitude: 0.35 },
]

// Benford's Law data
const benfordData = [
  { digit: "1", observed: 28, expected: 30.1 },
  { digit: "2", observed: 17, expected: 17.6 },
  { digit: "3", observed: 12, expected: 12.5 },
  { digit: "4", observed: 10, expected: 9.7 },
  { digit: "5", observed: 8, expected: 7.9 },
]

// Spider Ratio data
const spiderRatioData = [
  { name: "User Traffic", value: 75 },
  { name: "Bot Traffic", value: 25 },
]

// Z-Score History data
const zScoreData = [
  { day: "Day 1", zScore: 1.2 },
  { day: "Day 2", zScore: 1.5 },
  { day: "Day 3", zScore: 2.1 },
  { day: "Day 4", zScore: 4.5 },
  { day: "Day 5", zScore: 3.8 },
  { day: "Day 6", zScore: 2.3 },
  { day: "Day 7", zScore: 1.1 },
]

export function TrafficChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Traffic Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={trafficData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis yAxisId="left" stroke="#3b82f6" scale="log" />
          <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="User Views" />
          <Bar yAxisId="right" dataKey="editors" fill="#9ca3af" opacity={0.3} name="Unique Editors" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpectralFingerprint() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Spectral Fingerprint</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={spectralData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="frequency" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
          <ReferenceLine
            x={0.14}
            stroke="#f59e0b"
            strokeDasharray="5 5"
            label={{ value: "Human Pulse (7-day)", fill: "#f59e0b", position: "top" }}
          />
          <Line type="monotone" dataKey="magnitude" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BenfordsLaw() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Benford's Law Analysis</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={benfordData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="digit" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip cursor={{ fill: "rgba(17, 76, 225, 0.6)" }} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
          <Bar dataKey="observed" fill="#3b82f6" name="Observed" />
          <Line type="monotone" dataKey="expected" stroke="#9ca3af" strokeWidth={2} name="Expected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SpiderRatioChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Traffic Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={spiderRatioData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#3b82f6"
            dataKey="value"
          >
            <Cell fill="#3b82f6" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ZScoreHistory() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Z-Score History</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={zScoreData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="day" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip cursor={{ fill: "rgba(17, 76, 225, 0.6)" }} contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
          <ReferenceLine
            y={3.0}
            stroke="#ef4444"
            strokeDasharray="5 5"
          />
          <Bar dataKey="zScore" fill="#3b82f6" name="Z-Score" shape={<CustomBar />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Custom bar component to color bars based on z-score
function CustomBar(props: any) {
  const { fill, x, y, width, height, payload } = props
  return <rect x={x} y={y} width={width} height={height} fill={payload.zScore > 3.0 ? "#ef4444" : "#3b82f6"} />
}

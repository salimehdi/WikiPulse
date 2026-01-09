export interface Topic {
  id: string
  name: string
  status: "stable" | "anomaly" | "critical"
  anomalyRate: number
  trustScore: number
  articlesMonitored: number
  lastUpdated: string
  sparklineData: number[]
}

export interface EventLog {
  id: number
  timestamp: string
  level: "info" | "warn" | "critical"
  message: string
}

export const topics: Topic[] = [
  {
    id: "influenza",
    name: "Influenza",
    status: "critical",
    anomalyRate: 24,
    trustScore: 0.82,
    articlesMonitored: 50,
    lastUpdated: "2024-01-04T14:32:00Z",
    sparklineData: [12, 18, 24, 21, 28, 32, 24],
  },
  {
    id: "covid-19",
    name: "COVID-19",
    status: "anomaly",
    anomalyRate: 18,
    trustScore: 0.76,
    articlesMonitored: 45,
    lastUpdated: "2024-01-04T14:15:00Z",
    sparklineData: [8, 12, 16, 14, 18, 21, 18],
  },
  {
    id: "vaccination",
    name: "Vaccination",
    status: "stable",
    anomalyRate: 8,
    trustScore: 0.91,
    articlesMonitored: 38,
    lastUpdated: "2024-01-04T13:45:00Z",
    sparklineData: [5, 6, 7, 8, 7, 8, 8],
  },
  {
    id: "mpox",
    name: "Mpox",
    status: "stable",
    anomalyRate: 5,
    trustScore: 0.88,
    articlesMonitored: 25,
    lastUpdated: "2024-01-04T13:20:00Z",
    sparklineData: [3, 4, 3, 5, 4, 5, 5],
  },
  {
    id: "ebola",
    name: "Ebola",
    status: "stable",
    anomalyRate: 6,
    trustScore: 0.85,
    articlesMonitored: 20,
    lastUpdated: "2024-01-04T12:50:00Z",
    sparklineData: [4, 5, 4, 6, 5, 6, 6],
  },
  {
    id: "measles",
    name: "Measles",
    status: "anomaly",
    anomalyRate: 15,
    trustScore: 0.79,
    articlesMonitored: 15,
    lastUpdated: "2024-01-04T12:30:00Z",
    sparklineData: [7, 9, 12, 10, 13, 15, 14],
  },
]

export function getTopicDetails(topicId: string): Topic | undefined {
  return topics.find((topic) => topic.id === topicId)
}

export function getEventLogs(topicId: string): EventLog[] {
  const logMap: Record<string, EventLog[]> = {
    influenza: [
      {
        id: 1,
        timestamp: "2024-01-04 14:32",
        level: "critical",
        message: "Z-Score spike detected: 4.5 (threshold: 3.0)",
      },
      {
        id: 2,
        timestamp: "2024-01-04 14:15",
        level: "warn",
        message: "Anomalous traffic pattern identified in regional edits",
      },
      {
        id: 3,
        timestamp: "2024-01-04 13:45",
        level: "info",
        message: "Scheduled forensic scan completed",
      },
    ],
    "covid-19": [
      {
        id: 1,
        timestamp: "2024-01-04 14:15",
        level: "warn",
        message: "Spider ratio deviation: 0.24 (expected: 0.18)",
      },
      {
        id: 2,
        timestamp: "2024-01-04 12:00",
        level: "info",
        message: "Benford's Law analysis completed",
      },
    ],
    vaccination: [
      {
        id: 1,
        timestamp: "2024-01-04 13:45",
        level: "info",
        message: "All forensic checks passed",
      },
    ],
  }
  return logMap[topicId] || []
}

export function getGlobalMetrics() {
  return {
    totalTopics: topics.length,
    globalAnomalyRate: Math.round((topics.reduce((sum, t) => sum + t.anomalyRate, 0) / topics.length) * 10) / 10,
    systemStatus: "Online",
    anomalyDetectedCount: topics.filter((t) => t.status !== "stable").length,
  }
}

// Generate mock activity data for last 7 days
export function getActivityData() {
  return [
    { date: "Mon", influenza: 12, covid19: 8, vaccination: 5, mpox: 3, ebola: 4, measles: 7 },
    { date: "Tue", influenza: 18, covid19: 12, vaccination: 6, mpox: 4, ebola: 5, measles: 9 },
    { date: "Wed", influenza: 24, covid19: 16, vaccination: 7, mpox: 3, ebola: 4, measles: 12 },
    { date: "Thu", influenza: 21, covid19: 14, vaccination: 8, mpox: 5, ebola: 6, measles: 10 },
    { date: "Fri", influenza: 28, covid19: 18, vaccination: 7, mpox: 4, ebola: 5, measles: 13 },
    { date: "Sat", influenza: 32, covid19: 21, vaccination: 8, mpox: 5, ebola: 6, measles: 15 },
    { date: "Sun", influenza: 24, covid19: 18, vaccination: 8, mpox: 5, ebola: 6, measles: 14 },
  ]
}

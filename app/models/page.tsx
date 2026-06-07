"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/stats-card"
import { Database, Cpu, Clock, Activity, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

interface ModelVersion {
  id: string
  name: string
  createdAt: string
  sizeMb: number
  isActive: boolean
}

const fallbackModels: ModelVersion[] = [
  {
    id: "model_v1_20260222_153000.pkl",
    name: "Random Forest (WikiPulse)",
    createdAt: "2026-02-22T15:30:00",
    sizeMb: 14.2,
    isActive: true,
  },
  {
    id: "model_v1_20260115_090000.pkl",
    name: "Random Forest (WikiPulse)",
    createdAt: "2026-01-15T09:00:00",
    sizeMb: 13.8,
    isActive: false,
  },
]

export default function ModelManagement() {
  const [models, setModels] = useState<ModelVersion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isRetraining, setIsRetraining] = useState(false)
  const [trainDays, setTrainDays] = useState<number>(180)
  const [retrainFeedback, setRetrainFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  useEffect(() => {
    async function fetchModels() {
      try {
        setIsLoading(true)
        const response = await fetch("https://wikipulse-backend.onrender.com/api/v1/models")
        
        if (!response.ok) {
          throw new Error("Failed to fetch models from server")
        }
        
        const data = await response.json()
        setModels(data)
      } catch (err: any) {
        console.warn("Using fallback data due to fetch error:", err.message)
        // Fallback to mock data for UI testing if server is down
        setModels(fallbackModels)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  const handleRetrain = async () => {
    setIsRetraining(true)
    setRetrainFeedback(null)

    try {
      const response = await fetch("https://wikipulse-backend.onrender.com/api/v1/models/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          days: trainDays,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to trigger retraining job")
      }

      const data = await response.json()
      
      setRetrainFeedback({
        type: "success",
        message: data.message || `Retraining initiated (Job: ${data.jobId.substring(0, 8)}...)`,
      })

      // Hide feedback after a few seconds
      setTimeout(() => setRetrainFeedback(null), 8000)
    } catch (err: any) {
      console.error(err)
      setRetrainFeedback({
        type: "error",
        message: err.message || "An error occurred while starting the training job.",
      })
    } finally {
      setIsRetraining(false)
    }
  }

  const activeModel = models.find((m) => m.isActive)
  const totalModels = models.length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-slate-400 text-xl animate-pulse">Loading Model Registry...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header & Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Link href="/dashboard" className="hover:text-slate-200">
            Dashboard
          </Link>
          <span>&gt;</span>
          <span className="text-slate-200 font-medium">MLOps & Models</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-200">Model Management</h1>
            <p className="text-slate-400 mt-2">
              Manage Random Forest versions, monitor sizes, and trigger SMOTE-enabled retraining pipelines.
            </p>
          </div>

          {/* Retrain Controls */}
          <div className="flex flex-col items-end gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="days" className="text-sm text-slate-400">
                  Data Days:
                </label>
                <input
                  id="days"
                  type="number"
                  value={trainDays}
                  onChange={(e) => setTrainDays(Number(e.target.value))}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  min={1}
                  max={365}
                />
              </div>
              <button
                onClick={handleRetrain}
                disabled={isRetraining}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:text-blue-200 disabled:cursor-not-allowed rounded-lg text-white transition-colors font-medium flex items-center gap-2"
              >
                {isRetraining ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Cpu size={18} />
                    Retrain Model
                  </>
                )}
              </button>
            </div>
            
            {/* Feedback Message */}
            {retrainFeedback && (
              <p className={`text-sm flex items-center gap-1 ${retrainFeedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {retrainFeedback.type === "success" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                {retrainFeedback.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Active Model Version"
          value={activeModel ? "v" + activeModel.id.split("_v")[1].split("_")[0] : "None"}
          status="normal"
          icon={<Activity size={24} />}
        />
        <StatsCard
          title="Total Models Stored"
          value={totalModels}
          status="normal"
          icon={<Database size={24} />}
        />
        <StatsCard
          title="Active Model Size"
          value={activeModel?.sizeMb || 0}
          unit="MB"
          status={activeModel && activeModel.sizeMb > 20 ? "warning" : "normal"}
          icon={<Cpu size={24} />}
        />
      </div>

      {/* Models List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200">Version History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800">
              <tr className="text-slate-400">
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">File ID</th>
                <th className="text-left py-3 px-4 font-medium">Algorithm</th>
                <th className="text-left py-3 px-4 font-medium">Created At</th>
                <th className="text-right py-3 px-4 font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr
                  key={model.id}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                    model.isActive ? "bg-slate-800/20" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    {model.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-200 font-mono text-xs">{model.id}</td>
                  <td className="py-4 px-4 text-slate-300">{model.name}</td>
                  <td className="py-4 px-4 text-slate-400 flex items-center gap-2">
                    <Clock size={14} className="text-slate-500" />
                    {new Date(model.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="py-4 px-4 text-right text-slate-300 font-medium">
                    {model.sizeMb.toFixed(1)} MB
                  </td>
                </tr>
              ))}
              {models.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-slate-500">
                    No models found in the registry.
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
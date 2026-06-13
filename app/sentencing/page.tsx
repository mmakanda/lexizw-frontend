"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sidebar } from "@/components/layout/sidebar"
import { sentencingSchema, type SentencingInput } from "@/lib/schemas"
import { Scale, AlertCircle, ExternalLink, Plus, X } from "lucide-react"

const COMMON_OFFENCES = [
  "Theft", "Assault", "Unlawful entry", "Fraud", "Robbery",
  "Possession of dagga", "Driving without a licence", "Stock theft",
  "Malicious damage to property", "Murder", "Rape",
]

const MITIGATING = [
  "First offender", "Cooperated with police", "Showed remorse",
  "Sole breadwinner", "Young offender (under 21)", "Pleaded guilty",
  "Made restitution", "Mental health issues", "Family hardship",
]

const AGGRAVATING = [
  "Weapon used", "Premeditated", "Previous convictions",
  "Victim vulnerable (elderly/child)", "Gang involvement",
  "Large value involved", "Violence used", "Repeat offence",
]

export default function SentencingPage() {
  const [mitigating, setMitigating] = useState<string[]>([])
  const [aggravating, setAggravating] = useState<string[]>([])
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<SentencingInput>({
      resolver: zodResolver(sentencingSchema),
      defaultValues: { is_first_offender: true, mitigating_factors: [], aggravating_factors: [] },
    })

  function toggleFactor(list: string[], setList: (v: string[]) => void, val: string, field: any) {
    const next = list.includes(val) ? list.filter(x => x !== val) : [...list, val]
    setList(next)
    setValue(field, next)
  }

  async function onSubmit(data: SentencingInput) {
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch("/api/sentencing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mitigating_factors: mitigating, aggravating_factors: aggravating }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Prediction failed")
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const confidenceColor: Record<string, string> = {
    high: "text-green-700 bg-green-50 border-green-200",
    medium: "text-yellow-700 bg-yellow-50 border-yellow-200",
    low: "text-red-700 bg-red-50 border-red-200",
  }

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Sentencing Predictor</h1>
        <p className="text-gray-500 mb-2">
          Predict likely sentence ranges based on Zimbabwe Magistrates\' Court precedent
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 mb-6">
          <AlertCircle size={12} />
          Predictive tool only — not legal advice. Always consult a qualified practitioner.
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Offence details */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Offence Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offence <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("offence")}
                  list="offence-list"
                  placeholder="e.g. Theft, Assault, Unlawful entry"
                  className="input"
                />
                <datalist id="offence-list">
                  {COMMON_OFFENCES.map(o => <option key={o} value={o} />)}
                </datalist>
                {errors.offence && <p className="text-red-500 text-xs mt-1">{errors.offence.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Facts <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("offence_details")}
                  rows={4}
                  placeholder="Describe the facts: what was stolen, value, circumstances, how accused was caught, etc."
                  className="input resize-none"
                />
                {errors.offence_details && <p className="text-red-500 text-xs mt-1">{errors.offence_details.message}</p>}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  {...register("value_involved", { valueAsNumber: true })}
                  placeholder="Value involved (USD)"
                  className="input w-48"
                  min={0}
                />
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_first_offender")}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  First offender
                </label>
              </div>
            </div>
          </div>

          {/* Mitigating factors */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Mitigating Factors</h2>
            <div className="flex flex-wrap gap-2">
              {MITIGATING.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFactor(mitigating, setMitigating, f, "mitigating_factors")}
                  className={[
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    mitigating.includes(f)
                      ? "bg-green-100 border-green-400 text-green-800"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400",
                  ].join(" ")}
                >
                  {mitigating.includes(f) ? "✓ " : ""}{f}
                </button>
              ))}
            </div>
          </div>

          {/* Aggravating factors */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Aggravating Factors</h2>
            <div className="flex flex-wrap gap-2">
              {AGGRAVATING.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFactor(aggravating, setAggravating, f, "aggravating_factors")}
                  className={[
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    aggravating.includes(f)
                      ? "bg-red-100 border-red-400 text-red-800"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-400",
                  ].join(" ")}
                >
                  {aggravating.includes(f) ? "✓ " : ""}{f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Scale size={16} />
            {loading ? "Analysing precedents..." : "Predict Sentence Range"}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Prediction Result</h2>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${confidenceColor[result.confidence] || confidenceColor.medium}`}>
                  {result.confidence} confidence
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Predicted Sentence Range</p>
                  <p className="text-lg font-semibold text-gray-900">{result.predicted_range}</p>
                </div>
                {result.fine_range && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Likely Fine Range</p>
                    <p className="text-lg font-semibold text-gray-900">{result.fine_range}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Reasoning</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.reasoning}</p>
              </div>
            </div>

            {result.similar_cases?.length > 0 && (
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-3">Similar Cases</h2>
                <div className="space-y-3">
                  {result.similar_cases.map((c: any, i: number) => (
                    <div key={i} className="border-l-2 border-brand-300 pl-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{c.title}</p>
                          <p className="text-xs text-gray-400">
                            {c.court}{c.judgment_date ? ` · ${c.judgment_date}` : ""}{c.citation ? ` · ${c.citation}` : ""}
                          </p>
                        </div>
                        {c.url && (
                          <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 flex-shrink-0">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{c.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

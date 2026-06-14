"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sidebar } from "@/components/layout/sidebar"
import { sentencingSchema, type SentencingInput } from "@/lib/schemas"
import { Scale, AlertCircle, AlertTriangle } from "lucide-react"

const MITIGATING = ["First offender","Cooperated with police","Showed remorse","Sole breadwinner","Young offender (under 21)","Pleaded guilty","Made restitution","Mental health issues","Family hardship"]
const AGGRAVATING = ["Weapon used","Premeditated","Previous convictions","Victim vulnerable (elderly/child)","Gang involvement","Large value involved","Violence used","Repeat offence"]

const I: React.CSSProperties = {
  width: "100%", background: "#1A2235",
  border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "10px",
  padding: "11px 14px", fontSize: "13px", color: "#EEE9DC",
  fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
}

export default function SentencingPage() {
  const [mitigating, setMitigating] = useState<string[]>([])
  const [aggravating, setAggravating] = useState<string[]>([])
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState<string|null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<SentencingInput>({
    resolver: zodResolver(sentencingSchema),
    defaultValues: { is_first_offender: true },
  })

  function toggleFactor(list: string[], setList: (v: string[]) => void, val: string) {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
  }

  async function onSubmit(data: SentencingInput) {
    setLoading(true); setError(null); setResult(null)
    try {
      const payload = { ...data, mitigating_factors: mitigating, aggravating_factors: aggravating }
      const res = await fetch("/api/sentencing", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`)
      setResult(json)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  function handleReset() { reset(); setMitigating([]); setAggravating([]); setResult(null); setError(null) }

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 4vw, 3rem)", overflowX: "hidden" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "6px" }}>Sentencing Predictor</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 700, color: "#EEE9DC", margin: "0 0 4px" }}>Predict Sentence Range</h1>
          <p style={{ fontSize: "13px", color: "#8B9AB0" }}>Based on Zimbabwe Magistrates' Court precedent · AI-assisted analysis</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(216,90,48,0.06)", border: "0.5px solid rgba(216,90,48,0.2)", borderRadius: "8px", padding: "10px 14px", marginTop: "14px" }}>
            <AlertTriangle size={14} color="#D85A30" />
            <span style={{ fontSize: "11px", color: "rgba(232,132,90,0.9)" }}>Predictive tool only — not legal advice. Always consult a qualified legal practitioner.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

            {/* Left column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ background: "#1A2235", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "22px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", marginBottom: "16px" }}>Offence Details</div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: errors.offence ? "#D85A30" : "#8B9AB0", display: "block", marginBottom: "6px" }}>
                    Offence <span style={{ color: "#D85A30" }}>*</span>
                  </label>
                  <input {...register("offence")} style={{ ...I, borderColor: errors.offence ? "rgba(216,90,48,0.5)" : "rgba(255,255,255,0.06)" }} placeholder="e.g. Theft, Assault, Unlawful Entry…" list="offence-list" />
                  <datalist id="offence-list">
                    {["Theft","Assault","Unlawful entry","Fraud","Robbery","Possession of dagga","Driving without a licence","Stock theft","Malicious damage to property","Murder","Rape"].map(o => <option key={o} value={o} />)}
                  </datalist>
                  {errors.offence && <p style={{ fontSize: "11px", color: "#D85A30", marginTop: "4px" }}>{errors.offence.message}</p>}
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: errors.offence_details ? "#D85A30" : "#8B9AB0", display: "block", marginBottom: "6px" }}>
                    Case Facts <span style={{ color: "#D85A30" }}>*</span>
                  </label>
                  <textarea {...register("offence_details")} style={{ ...I, minHeight: "90px", resize: "vertical" as const, borderColor: errors.offence_details ? "rgba(216,90,48,0.5)" : "rgba(255,255,255,0.06)" }} placeholder="Describe the facts: what was stolen, value, circumstances, how offence was committed…" />
                  {errors.offence_details && <p style={{ fontSize: "11px", color: "#D85A30", marginTop: "4px" }}>{errors.offence_details.message}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", display: "block", marginBottom: "6px" }}>Value Involved (USD)</label>
                    <input {...register("value_involved", { setValueAs: v => v === "" ? undefined : parseFloat(v) })} style={I} type="number" placeholder="0.00" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "22px" }}>
                    <input {...register("is_first_offender")} type="checkbox" style={{ accentColor: "#1D9E75", width: "14px", height: "14px" }} />
                    <label style={{ fontSize: "12px", color: "#8B9AB0" }}>First offender</label>
                  </div>
                </div>
              </div>

              {/* Mitigating */}
              <div style={{ background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "18px 22px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1D9E75", marginBottom: "10px" }}>✓ Mitigating Factors</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                  {MITIGATING.map(f => {
                    const on = mitigating.includes(f)
                    return (
                      <button key={f} type="button" onClick={() => toggleFactor(mitigating, setMitigating, f)} style={{
                        fontSize: "11px", padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                        background: on ? "rgba(29,158,117,0.15)" : "rgba(29,158,117,0.06)",
                        color: on ? "#1D9E75" : "#8B9AB0",
                        border: on ? "0.5px solid rgba(29,158,117,0.4)" : "0.5px solid rgba(29,158,117,0.15)",
                        fontWeight: on ? 500 : 400,
                      }}>{f}</button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {/* Aggravating */}
              <div style={{ background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "18px 22px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#D85A30", marginBottom: "10px" }}>⚠ Aggravating Factors</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
                  {AGGRAVATING.map(f => {
                    const on = aggravating.includes(f)
                    return (
                      <button key={f} type="button" onClick={() => toggleFactor(aggravating, setAggravating, f)} style={{
                        fontSize: "11px", padding: "5px 10px", borderRadius: "6px", cursor: "pointer",
                        background: on ? "rgba(216,90,48,0.14)" : "rgba(216,90,48,0.06)",
                        color: on ? "#D85A30" : "#8B9AB0",
                        border: on ? "0.5px solid rgba(216,90,48,0.35)" : "0.5px solid rgba(216,90,48,0.15)",
                        fontWeight: on ? 500 : 400,
                      }}>{f}</button>
                    )
                  })}
                </div>
              </div>

              {/* Result */}
              {result && (
                <div style={{ background: "#141C2E", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "24px 26px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "10px" }}>Predicted sentence range</div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 600, color: "#E8C97A", marginBottom: "6px" }}>{result.sentence_range || result.prediction || "See analysis below"}</div>
                  {result.confidence && <div style={{ fontSize: "11px", color: "#4A5568", marginBottom: "12px" }}>Confidence: {result.confidence}</div>}
                  {result.reasoning && <div style={{ fontSize: "12px", color: "#8B9AB0", lineHeight: 1.7, borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>{result.reasoning}</div>}
                  {result.answer && !result.reasoning && <div style={{ fontSize: "12px", color: "#8B9AB0", lineHeight: 1.7, borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>{result.answer}</div>}
                  <div style={{ fontSize: "10px", color: "#4A5568", marginTop: "14px", paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,0.06)", lineHeight: 1.5 }}>
                    Based on Zimbabwe Magistrates' Court precedent. Actual outcomes depend on the presiding magistrate's discretion.
                  </div>
                </div>
              )}

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(216,90,48,0.08)", border: "0.5px solid rgba(216,90,48,0.25)", borderRadius: "8px", color: "#E8845A", fontSize: "13px" }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "24px", flexWrap: "wrap" as const }}>
            <button type="submit" disabled={loading} style={{ background: "#C9A84C", color: "#0A0F1E", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "10px", padding: "12px 24px", cursor: loading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "8px", opacity: loading ? 0.7 : 1 }}>
              <Scale size={15} />{loading ? "Predicting…" : "Predict Sentence Range"}
            </button>
            <button type="button" onClick={handleReset} style={{ background: "none", color: "#8B9AB0", fontFamily: "Inter, sans-serif", fontSize: "12px", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 18px", cursor: "pointer" }}>Reset</button>
          </div>
        </form>
      </main>
    </div>
  )
}


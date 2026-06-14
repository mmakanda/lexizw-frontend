"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Search, ExternalLink, AlertCircle } from "lucide-react"

const SUGGESTED = [
  "Test for granting a provisional interdict",
  "Employment dismissal grounds Zimbabwe",
  "Criminal sentencing theft Magistrates Court",
  "Lease termination notice period",
  "Constitutional rights Zimbabwe 2013",
]

const COURTS = [
  { id: "high_court", label: "High Court" },
  { id: "supreme_court", label: "Supreme Court" },
  { id: "constitutional_court", label: "Constitutional Court" },
  { id: "labour", label: "Labour Court" },
]

const TABS = ["All Sources", "Case Law", "Statutes", "Statutory Instruments"]

export default function SearchPage() {
  const [query, setQuery]     = useState("")
  const [filters, setFilters] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<any>(null)
  const [error, setError]     = useState<string|null>(null)
  const [tab, setTab]         = useState("All Sources")

  function toggleFilter(id: string) {
    setFilters(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id])
  }

  async function search() {
    if (!query.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch("/api/search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, search_type: "research", filters }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Search failed")
      setResult(json)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main className="lz-main-content" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Header */}
        <div style={{ padding: "clamp(1.5rem, 4vw, 28px) clamp(1rem, 4vw, 36px) 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "6px" }}>Legal Research</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 4vw, 26px)", fontWeight: 600, color: "#EEE9DC", margin: "0 0 4px" }}>Search Zimbabwe Law</h1>
          <p style={{ fontSize: "13px", color: "#8B9AB0", marginBottom: "20px" }}>Case law, statutes, and Statutory Instruments — powered by pgvector RAG</p>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" as const }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontSize: "12px", fontWeight: 500, padding: "10px 16px", whiteSpace: "nowrap" as const,
                color: t === tab ? "#E8C97A" : "#8B9AB0",
                background: "none", border: "none",
                borderBottom: t === tab ? "2px solid #C9A84C" : "2px solid transparent",
                cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "clamp(1rem, 4vw, 28px) clamp(1rem, 4vw, 36px)", flex: 1, overflowY: "auto" as const }}>

          {/* Search box */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", marginBottom: "10px" }}>Your legal question</div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1A2235", border: "0.5px solid rgba(201,168,76,0.25)", borderRadius: "12px", padding: "12px 16px" }}>
              <Search size={18} color="#C9A84C" style={{ flexShrink: 0 }} />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()}
                placeholder="e.g. What is the test for granting a provisional interdict?"
                style={{ background: "none", border: "none", outline: "none", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#EEE9DC", flex: 1, caretColor: "#C9A84C", minWidth: 0 }}
              />
              <button onClick={search} disabled={loading || !query.trim()} style={{
                background: loading || !query.trim() ? "#4A5568" : "#C9A84C",
                color: "#0A0F1E", fontSize: "12px", fontWeight: 600,
                border: "none", borderRadius: "8px", padding: "8px 14px",
                cursor: loading || !query.trim() ? "not-allowed" : "pointer",
                fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" as const, flexShrink: 0,
              }}>{loading ? "…" : "Search →"}</button>
            </div>

            {/* Suggested queries */}
            {!result && (
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginTop: "12px" }}>
                {SUGGESTED.map(s => (
                  <button key={s} onClick={() => setQuery(s)} style={{
                    fontSize: "11px", color: "#8B9AB0", background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "6px",
                    padding: "4px 10px", cursor: "pointer",
                  }}>{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* Court filters */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" as const }}>
            {COURTS.map(c => {
              const on = filters.includes(c.id)
              return (
                <button key={c.id} onClick={() => toggleFilter(c.id)} style={{
                  fontSize: "11px", padding: "5px 12px", borderRadius: "6px", cursor: "pointer",
                  background: on ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                  color: on ? "#E8C97A" : "#8B9AB0",
                  border: on ? "0.5px solid rgba(201,168,76,0.3)" : "0.5px solid rgba(255,255,255,0.06)",
                  fontWeight: on ? 500 : 400,
                }}>{c.label}</button>
              )
            })}
          </div>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(216,90,48,0.08)", border: "0.5px solid rgba(216,90,48,0.25)", borderRadius: "8px", color: "#E8845A", fontSize: "13px", marginBottom: "20px" }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div>
              <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "12px" }}>
                {result.sources?.length || 0} sources found
              </div>

              {/* AI Answer */}
              <div style={{ background: "#141C2E", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "20px 22px", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#C9A84C", marginBottom: "12px" }}>AI Analysis</div>
                <div style={{ fontSize: "14px", color: "#EEE9DC", lineHeight: 1.75 }}>{result.answer}</div>
              </div>

              {/* Source cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.sources?.map((s: any, i: number) => (
                  <div key={i} style={{ background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px 18px" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)"; e.currentTarget.style.background = "rgba(26,34,53,0.9)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "#1A2235" }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: 600, color: "#EEE9DC", flex: 1 }}>{s.title}</div>
                      <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "4px", flexShrink: 0, background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "0.5px solid rgba(201,168,76,0.2)" }}>{s.court || "ZW"}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#8B9AB0", lineHeight: 1.6, marginBottom: "10px" }}>{s.excerpt}</div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" as const }}>
                      {s.judgment_date && <span style={{ fontSize: "10px", color: "#4A5568" }}>📅 {s.judgment_date}</span>}
                      {s.citation && <span style={{ fontSize: "10px", color: "#4A5568" }}>{s.citation}</span>}
                      {s.url && s.url.startsWith("http") && (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: "10px", color: "#C9A84C", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
                          <ExternalLink size={11} />View source
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


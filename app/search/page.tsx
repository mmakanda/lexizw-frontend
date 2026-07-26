"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ExternalLink } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery]     = useState("")
  const [answer, setAnswer]   = useState("")
  const [sources, setSources] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string|null>(null)

  async function search() {
    if (!query.trim() || query.length < 3) return
    setLoading(true); setError(null); setAnswer(""); setSources([])

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, search_type: "research", filters: [] }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Search failed")

      // Simulate streaming by revealing answer progressively
      const fullAnswer = json.answer || ""
      setSources(json.sources || [])

      let i = 0
      const interval = setInterval(() => {
        i += 8
        setAnswer(fullAnswer.slice(0, i))
        if (i >= fullAnswer.length) {
          clearInterval(interval)
          setAnswer(fullAnswer)
          setLoading(false)
        }
      }, 16)

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "860px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Legal Research</h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          Search Zimbabwean case law, statutes, and Statutory Instruments
        </p>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); search() } }}
            placeholder="e.g. What are the grounds for unfair dismissal under the Labour Act?"
            rows={3}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", resize: "none", boxSizing: "border-box", marginBottom: "1rem", outline: "none" }}
          />
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={search}
              disabled={loading || query.length < 3}
              style={{ background: loading ? "#6b7280" : "#0f766e", color: "white", padding: "0.625rem 1.5rem", borderRadius: "0.5rem", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500, fontSize: "0.875rem" }}
            >
              {loading ? "Searching..." : "Search Zimbabwe Law"}
            </button>
            {loading && (
              <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Searching 76,000+ legal documents...
              </span>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "1rem", color: "#dc2626", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {(answer || loading) && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "1rem" }}>Answer</h2>
            <div style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {answer}
              {loading && <span style={{ opacity: 0.5 }}>▊</span>}
            </div>
          </div>
        )}

        {sources.length > 0 && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "1rem" }}>
              Sources ({sources.length})
            </h2>
            {sources.map((src: any, i: number) => (
              <div key={i} style={{ borderLeft: "3px solid #0d9488", paddingLeft: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem", margin: "0 0 2px" }}>{src.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                      {src.court}{src.judgment_date ? ` · ${src.judgment_date}` : ""}
                      {src.citation ? ` · ${src.citation}` : ""}
                    </p>
                  </div>
                  {src.url && !src.url.startsWith("file://") && (
                    <a href={src.url} target="_blank" rel="noopener noreferrer"
                       style={{ color: "#0f766e", flexShrink: 0 }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#4b5563", marginTop: "0.25rem" }}>{src.excerpt}</p>
              </div>
            ))}
          </div>
        )}

        {sources.length > 0 && (
          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            ⚠ AI-generated research. Verify citations before relying on them in court proceedings.
          </p>
        )}
      </main>
    </div>
  )
}

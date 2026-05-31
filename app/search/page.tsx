"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"

export default function SearchPage() {
  const [query, setQuery]   = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<any>(null)
  const [error, setError]     = useState<string|null>(null)

  async function search() {
    if (!query.trim() || query.length < 3) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, search_type: "research", filters: [] }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Search failed")
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "800px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Legal Research</h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Search Zimbabwean case law, statutes, and Statutory Instruments</p>

        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. What is the test for granting a provisional interdict in Zimbabwe?"
            rows={3}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", resize: "none", boxSizing: "border-box", marginBottom: "1rem" }}
          />
          <button
            onClick={search}
            disabled={loading || query.length < 3}
            style={{ background: "#0f766e", color: "white", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 500, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Searching..." : "Search Zimbabwe Law"}
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "0.5rem", padding: "1rem", color: "#dc2626", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        {result && (
          <div>
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1rem" }}>
              <h2 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Answer</h2>
              <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{result.answer}</p>
            </div>

            {result.sources?.length > 0 && (
              <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <h2 style={{ fontWeight: 600, marginBottom: "0.75rem" }}>Sources ({result.sources.length})</h2>
                {result.sources.map((src: any, i: number) => (
                  <div key={i} style={{ borderLeft: "2px solid #0d9488", paddingLeft: "1rem", marginBottom: "1rem" }}>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{src.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{src.court} {src.judgment_date && `· ${src.judgment_date}`}</p>
                    <p style={{ fontSize: "0.75rem", color: "#4b5563", marginTop: "0.25rem" }}>{src.excerpt}</p>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.75rem" }}>⚠ AI-generated. Verify citations before use in court.</p>
          </div>
        )}
      </main>
    </div>
  )
}

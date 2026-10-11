"use client"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Sidebar } from "@/components/layout/sidebar"
import { ExternalLink } from "lucide-react"

type SearchSource = {
  title?: string
  url?: string
  court?: string | null
  judgment_date?: string | null
  citation?: string | null
  excerpt?: string
}

export default function SearchPage() {
  const [query, setQuery]     = useState("")
  const [answer, setAnswer]   = useState("")
  const [sources, setSources] = useState<SearchSource[]>([])
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
      setSources(json.sources || [])
      const full = json.answer || ""
      let i = 0
      const interval = setInterval(() => {
        i += 12
        setAnswer(full.slice(0, i))
        if (i >= full.length) { clearInterval(interval); setAnswer(full); setLoading(false) }
      }, 16)
    } catch (err: any) {
      setError(err.message); setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", maxWidth: "860px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Legal Research</h1>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>Search Zimbabwean case law, statutes, and Statutory Instruments</p>

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
            {loading && <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Searching 223,000+ legal documents...</span>}
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
            <div style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.8 }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "1rem 0 0.5rem", color: "#111827" }}>{children}</h1>,
                  h2: ({children}) => <h2 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0.75rem 0 0.5rem", color: "#111827" }}>{children}</h2>,
                  h3: ({children}) => <h3 style={{ fontSize: "0.95rem", fontWeight: 600, margin: "0.75rem 0 0.25rem", color: "#0f766e" }}>{children}</h3>,
                  p: ({children}) => <p style={{ marginBottom: "0.75rem", lineHeight: 1.8 }}>{children}</p>,
                  strong: ({children}) => <strong style={{ fontWeight: 600, color: "#111827" }}>{children}</strong>,
                  em: ({children}) => <em style={{ fontStyle: "italic" }}>{children}</em>,
                  ul: ({children}) => <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem" }}>{children}</ul>,
                  ol: ({children}) => <ol style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem" }}>{children}</ol>,
                  li: ({children}) => <li style={{ marginBottom: "0.25rem", lineHeight: 1.7 }}>{children}</li>,
                  hr: () => <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "1rem 0" }} />,
                  table: ({children}) => <div style={{ overflowX: "auto", marginBottom: "1rem" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>{children}</table></div>,
                  th: ({children}) => <th style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 600 }}>{children}</th>,
                  td: ({children}) => <td style={{ border: "1px solid #e5e7eb", padding: "0.5rem 0.75rem" }}>{children}</td>,
                  blockquote: ({children}) => <blockquote style={{ borderLeft: "3px solid #0d9488", paddingLeft: "1rem", margin: "0.75rem 0", color: "#4b5563", fontStyle: "italic" }}>{children}</blockquote>,
                  code: ({children}) => <code style={{ background: "#f3f4f6", padding: "0.125rem 0.375rem", borderRadius: "0.25rem", fontSize: "0.8rem", fontFamily: "monospace" }}>{children}</code>,
                }}
              >
                {answer}
              </ReactMarkdown>
              {loading && <span style={{ opacity: 0.4 }}>▊</span>}
            </div>
          </div>
        )}

        {sources.length > 0 && (
          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1rem" }}>
            <h2 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "1rem" }}>Sources ({sources.length})</h2>
            {sources.map((src, i) => (
              <div key={i} style={{ borderLeft: "3px solid #0d9488", paddingLeft: "1rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem", margin: "0 0 2px", color: "#111827" }}>{src.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>
                      {src.court}{src.judgment_date ? ` · ${src.judgment_date}` : ""}{src.citation ? ` · ${src.citation}` : ""}
                    </p>
                  </div>
                  {src.url && !src.url.startsWith("file://") && (
                    <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0f766e", flexShrink: 0 }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#4b5563", marginTop: "0.25rem", lineHeight: 1.6 }}>{src.excerpt}</p>
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

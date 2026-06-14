"use client"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Search, FileText, ClipboardList, Scale, ArrowRight, Zap } from "lucide-react"

const MODULES = [
  {
    href: "/search", icon: Search, label: "Legal Research",
    desc: "Search Zimbabwean case law and statutes using natural language",
    tag: "RAG · pgvector", color: "#C9A84C",
  },
  {
    href: "/draft", icon: FileText, label: "Contract Drafter",
    desc: "Generate NDAs, employment contracts, leases and more",
    tag: "AI Drafting", color: "#1D9E75",
  },
  {
    href: "/forms", icon: ClipboardList, label: "Court Forms",
    desc: "Generate HC12 summons, affidavits, and court-ready documents",
    tag: "HC · Magistrates'", color: "#7F77DD",
  },
  {
    href: "/sentencing", icon: Scale, label: "Sentencing Tool",
    desc: "Predict sentence ranges using Zimbabwe precedent",
    tag: "Predictive AI", color: "#D85A30",
  },
]

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName || "Counsellor"

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "3rem 3.5rem", position: "relative" as const, overflow: "hidden" }}>

        {/* Stone texture SVG background motif */}
        <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.03, pointerEvents: "none" }} width="480" height="480" viewBox="0 0 480 480" fill="none">
          <path d="M240 60 L300 180 L420 180 L330 260 L360 380 L240 310 L120 380 L150 260 L60 180 L180 180 Z" stroke="#C9A84C" strokeWidth="1" fill="none"/>
          <path d="M240 100 L288 200 L400 200 L316 268 L344 368 L240 304 L136 368 L164 268 L80 200 L192 200 Z" stroke="#C9A84C" strokeWidth="0.5" fill="none"/>
          <path d="M240 140 L276 220 L380 220 L302 276 L328 356 L240 300 L152 356 L178 276 L100 220 L204 220 Z" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
          <circle cx="240" cy="240" r="180" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
          <circle cx="240" cy="240" r="140" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
          <circle cx="240" cy="240" r="100" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
        </svg>

        {/* Header */}
        <div style={{ marginBottom: "3rem", position: "relative" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "8px" }}>
            <Zap size={11} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} color="#C9A84C" />
            LexiZW AI Legal Suite
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: 700, color: "#EEE9DC", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Welcome, {firstName}
          </h1>
          <p style={{ fontSize: "14px", color: "#8B9AB0" }}>Zimbabwe's first AI-powered legal research and drafting platform</p>

          {/* Gold divider */}
          <div style={{ width: "48px", height: "2px", background: "linear-gradient(90deg, #C9A84C, transparent)", marginTop: "16px", borderRadius: "2px" }} />
        </div>

        {/* Module grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "820px" }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "26px", cursor: "pointer",
                transition: "all 0.2s", position: "relative" as const, overflow: "hidden" as const,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = "rgba(201,168,76,0.3)"
                  el.style.transform = "translateY(-2px)"
                  el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = "rgba(255,255,255,0.06)"
                  el.style.transform = "translateY(0)"
                  el.style.boxShadow = "none"
                }}
              >
                {/* Color accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${m.color}, transparent)`, borderRadius: "16px 16px 0 0" }} />

                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    background: `rgba(${m.color === "#C9A84C" ? "201,168,76" : m.color === "#1D9E75" ? "29,158,117" : m.color === "#7F77DD" ? "127,119,221" : "216,90,48"},0.12)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <m.icon size={20} color={m.color} strokeWidth={1.75} />
                  </div>
                  <ArrowRight size={16} color="#4A5568" />
                </div>

                <div style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: 600, color: "#EEE9DC", marginBottom: "6px" }}>{m.label}</div>
                <div style={{ fontSize: "13px", color: "#8B9AB0", lineHeight: 1.55, marginBottom: "18px" }}>{m.desc}</div>

                <div style={{ paddingTop: "14px", borderTop: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em",
                    textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "4px",
                    background: `rgba(${m.color === "#C9A84C" ? "201,168,76" : m.color === "#1D9E75" ? "29,158,117" : m.color === "#7F77DD" ? "127,119,221" : "216,90,48"},0.1)`,
                    color: m.color,
                    border: `0.5px solid ${m.color}33`,
                  }}>{m.tag}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#C9A84C" }}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75" }} />
          <span style={{ fontSize: "11px", color: "#4A5568" }}>All AI outputs are advisory. Always verify with a qualified Zimbabwean legal practitioner.</span>
        </div>
      </main>
    </div>
  )
}


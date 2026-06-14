"use client"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Search, FileText, ClipboardList, Scale, ArrowRight, Zap } from "lucide-react"

const MODULES = [
  { href: "/search",     icon: Search,      label: "Legal Research",   desc: "Search Zimbabwean case law and statutes using natural language",       tag: "RAG · pgvector", color: "#C9A84C", rgb: "201,168,76" },
  { href: "/draft",      icon: FileText,    label: "Contract Drafter", desc: "Generate NDAs, employment contracts, leases and more",                  tag: "AI Drafting",    color: "#1D9E75", rgb: "29,158,117" },
  { href: "/forms",      icon: ClipboardList, label: "Court Forms",    desc: "Generate HC12 summons, affidavits, and court-ready documents",          tag: "HC · Magistrates'", color: "#7F77DD", rgb: "127,119,221" },
  { href: "/sentencing", icon: Scale,       label: "Sentencing Tool",  desc: "Predict sentence ranges using Zimbabwe precedent",                      tag: "Predictive AI",  color: "#D85A30", rgb: "216,90,48" },
]

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName || "Counsellor"

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main className="lz-main-content" style={{ flex: 1, padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 3.5rem)", position: "relative" as const, overflow: "hidden", minWidth: 0 }}>

        {/* Stone motif */}
        <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.03, pointerEvents: "none" as const, maxWidth: "60vw" }} width="480" height="480" viewBox="0 0 480 480" fill="none">
          <path d="M240 60 L300 180 L420 180 L330 260 L360 380 L240 310 L120 380 L150 260 L60 180 L180 180 Z" stroke="#C9A84C" strokeWidth="1" fill="none"/>
          <circle cx="240" cy="240" r="180" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
          <circle cx="240" cy="240" r="120" stroke="#C9A84C" strokeWidth="0.3" fill="none"/>
        </svg>

        <div style={{ marginBottom: "clamp(1.5rem, 4vw, 3rem)", position: "relative" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "8px", display: "flex", alignItems: "center", gap: "5px" }}>
            <Zap size={11} color="#C9A84C" /> LexiZW AI Legal Suite
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 5vw, 32px)", fontWeight: 700, color: "#EEE9DC", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Welcome, {firstName}
          </h1>
          <p style={{ fontSize: "clamp(12px, 2vw, 14px)", color: "#8B9AB0" }}>Zimbabwe's first AI-powered legal research and drafting platform</p>
          <div style={{ width: "48px", height: "2px", background: "linear-gradient(90deg, #C9A84C, transparent)", marginTop: "16px", borderRadius: "2px" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", maxWidth: "820px" }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "clamp(16px, 3vw, 26px)", cursor: "pointer", transition: "all 0.2s", position: "relative" as const, overflow: "hidden" as const }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(201,168,76,0.3)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none" }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${m.color}, transparent)`, borderRadius: "16px 16px 0 0" }} />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `rgba(${m.rgb},0.12)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <m.icon size={20} color={m.color} strokeWidth={1.75} />
                  </div>
                  <ArrowRight size={16} color="#4A5568" />
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px, 2vw, 17px)", fontWeight: 600, color: "#EEE9DC", marginBottom: "6px" }}>{m.label}</div>
                <div style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "#8B9AB0", lineHeight: 1.55, marginBottom: "18px" }}>{m.desc}</div>
                <div style={{ paddingTop: "14px", borderTop: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "4px", background: `rgba(${m.rgb},0.1)`, color: m.color, border: `0.5px solid ${m.color}33` }}>{m.tag}</span>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "#C9A84C" }}>Open →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "#4A5568" }}>All AI outputs are advisory. Always verify with a qualified Zimbabwean legal practitioner.</span>
        </div>
      </main>
    </div>
  )
}


"use client"
import { useUser } from "@clerk/nextjs"
import { Sidebar } from "@/components/layout/sidebar"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          LexiZW — AI Legal Suite for Zimbabwe
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {[
            { title: "Legal Research", desc: "Search Zimbabwean case law and statutes using natural language", href: "/search" },
            { title: "Contract Drafter", desc: "Generate NDAs, employment contracts, leases and more", href: "/draft" },
            { title: "Court Forms", desc: "Generate HC12 summons, affidavits, and court-ready documents", href: "/forms" },
            { title: "Sentencing Tool", desc: "Predict sentence ranges using Zimbabwe precedent", href: "/sentencing" },
          ].map(card => (
            <Link key={card.href} href={card.href} style={{
              display: "block", padding: "1.5rem", background: "white",
              border: "1px solid #e5e7eb", borderRadius: "0.75rem",
              textDecoration: "none", transition: "border-color 0.2s"
            }}>
              <h3 style={{ fontWeight: 600, color: "#111827", marginBottom: "0.5rem" }}>{card.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1rem" }}>{card.desc}</p>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#0f766e" }}>Open →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

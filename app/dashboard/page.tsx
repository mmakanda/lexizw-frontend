"use client"

import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import {
  ArrowRight, Bookmark, Clock3, FileText, Search, Scale,
  ClipboardList, Sparkles, BookOpen, ChevronRight
} from "lucide-react"

const MODULES = [
  {
    href: "/search",
    icon: Search,
    number: "01",
    label: "Legal Research",
    desc: "Explore Zimbabwean case law and legislation using natural-language questions.",
    action: "Start researching",
  },
  {
    href: "/draft",
    icon: FileText,
    number: "02",
    label: "Contract Drafter",
    desc: "Prepare a first draft of NDAs, employment contracts, leases and more.",
    action: "Draft a document",
  },
  {
    href: "/forms",
    icon: ClipboardList,
    number: "03",
    label: "Court Forms",
    desc: "Create supported court documents and forms for review.",
    action: "Explore forms",
  },
  {
    href: "/sentencing",
    icon: Scale,
    number: "04",
    label: "Sentencing Tool",
    desc: "Review indicative sentencing information informed by Zimbabwean precedent.",
    action: "Open tool",
  },
]

export default function DashboardPage() {
  const { user } = useUser()
  const firstName = user?.firstName || "Counsellor"

  return (
    <div className="lz-app-shell">
      <Sidebar />
      <main className="lz-main-content lz-dashboard">
        <div className="lz-dashboard-topline">
          <span className="lz-eyebrow"><Sparkles size={13} /> YOUR LEGAL WORKSPACE</span>
          <span className="lz-beta-note">LEXIZW · BETA</span>
        </div>

        <section className="lz-welcome">
          <div className="lz-welcome-copy">
            <p className="lz-kicker">LEGAL RESEARCH. MADE MORE ACCESSIBLE.</p>
            <h1>Good day, {firstName}.</h1>
            <p className="lz-welcome-description">
              Your workspace for exploring Zimbabwean law, preparing documents,
              and organising your legal research.
            </p>
            <div className="lz-welcome-actions">
              <Link href="/search" className="lz-button lz-button-primary">
                <Search size={16} /> Start legal research <ArrowRight size={16} />
              </Link>
              <Link href="/draft" className="lz-button lz-button-secondary">
                Draft a document
              </Link>
            </div>
          </div>
          <div className="lz-welcome-image" role="img" aria-label="Law books and legal research materials on a desk">
            <div className="lz-image-caption">
              <span className="lz-image-caption-rule" />
              <span>THE PRACTICE OF LAW, SUPPORTED BY TECHNOLOGY</span>
            </div>
          </div>
        </section>

        <section className="lz-section">
          <div className="lz-section-heading">
            <div>
              <p className="lz-kicker">YOUR TOOLKIT</p>
              <h2>What would you like to work on?</h2>
            </div>
            <span className="lz-section-aside">FOUR LEGAL TOOLS</span>
          </div>

          <div className="lz-module-grid">
            {MODULES.map((module) => {
              const Icon = module.icon
              return (
                <Link key={module.href} href={module.href} className="lz-module-card">
                  <div className="lz-module-card-top">
                    <span className="lz-module-number">{module.number}</span>
                    <span className="lz-module-icon"><Icon size={19} strokeWidth={1.7} /></span>
                  </div>
                  <h3>{module.label}</h3>
                  <p>{module.desc}</p>
                  <span className="lz-module-action">{module.action}<ArrowRight size={15} /></span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="lz-dashboard-lower">
          <div className="lz-editorial-note">
            <div className="lz-note-icon"><BookOpen size={19} /></div>
            <div>
              <p className="lz-kicker">A NOTE ON LEGAL AI</p>
              <h2>Designed to assist your practice, not replace your judgement.</h2>
              <p>Review generated material carefully and verify legal authorities against reliable sources before relying on them.</p>
            </div>
          </div>
          <div className="lz-quick-links">
            <p className="lz-kicker">QUICK ACCESS</p>
            <Link href="/search"><span><Search size={16} /> Search case law</span><ChevronRight size={16} /></Link>
            <Link href="/draft"><span><FileText size={16} /> Create a draft</span><ChevronRight size={16} /></Link>
            <Link href="/forms"><span><ClipboardList size={16} /> Browse court forms</span><ChevronRight size={16} /></Link>
            <Link href="/sentencing"><span><Scale size={16} /> Sentencing tool</span><ChevronRight size={16} /></Link>
          </div>
        </section>

        <footer className="lz-dashboard-footer">
          <span><span className="lz-status-dot" /> LexiZW legal workspace</span>
          <span>AI outputs are advisory. Verify with a qualified Zimbabwean legal practitioner.</span>
        </footer>
      </main>
    </div>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import {
  Search, FileText, ClipboardList, Scale, LayoutDashboard,
  Settings, Menu, X, ChevronRight
} from "lucide-react"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Legal Research", icon: Search },
  { href: "/draft", label: "Contract Drafter", icon: FileText },
  { href: "/forms", label: "Court Forms", icon: ClipboardList },
  { href: "/sentencing", label: "Sentencing Tool", icon: Scale },
]

function Brand() {
  return (
    <Link href="/dashboard" className="lz-brand" aria-label="LexiZW dashboard">
      <span className="lz-brand-mark" aria-hidden="true">L<span>.</span></span>
      <span className="lz-brand-copy">
        <span className="lz-brand-name">LexiZW</span>
        <span className="lz-brand-subtitle">AI LEGAL SUITE</span>
      </span>
    </Link>
  )
}

function NavContent({ path, onClose }: { path: string; onClose?: () => void }) {
  return (
    <>
      <div className="lz-sidebar-brand"><Brand /></div>
      <nav className="lz-sidebar-nav" aria-label="Main navigation">
        <p className="lz-nav-label">WORKSPACE</p>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`lz-nav-link${active ? " is-active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={17} strokeWidth={active ? 2 : 1.7} />
              <span>{label}</span>
              {active && <ChevronRight className="lz-nav-chevron" size={14} />}
            </Link>
          )
        })}
        <p className="lz-nav-label lz-nav-label-account">ACCOUNT</p>
        <div className="lz-nav-link lz-nav-link-muted" aria-label="Account settings are not linked to a dedicated page yet">
          <Settings size={17} strokeWidth={1.7} />
          <span>Settings</span>
        </div>
      </nav>
      <div className="lz-sidebar-account">
        <p className="lz-nav-label">YOUR ACCOUNT</p>
        <UserButton
          afterSignOutUrl="/"
          showName
          appearance={{
            elements: {
              userButtonBox: { color: "#f3efe5", fontSize: "12px" },
              userButtonOuterIdentifier: { color: "#f3efe5", fontSize: "12px" },
            },
          }}
        />
      </div>
      <div className="lz-sidebar-bottom">Built for Zimbabwe’s legal community</div>
    </>
  )
}

export function Sidebar() {
  const path = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="lz-sidebar-desktop">
        <NavContent path={path} />
      </aside>

      <header className="lz-mobile-bar">
        <Brand />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="lz-mobile-menu-button"
        >
          <Menu size={22} />
        </button>
      </header>

      {mobileOpen && (
        <div className="lz-mobile-overlay">
          <button
            type="button"
            className="lz-mobile-scrim"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lz-sidebar-mobile">
            <button
              type="button"
              className="lz-mobile-close"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
            <NavContent path={path} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}


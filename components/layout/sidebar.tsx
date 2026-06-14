"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Search, FileText, ClipboardList, Scale, BarChart2, Settings } from "lucide-react"

const NAV = [
  { href: "/dashboard",  label: "Dashboard",        icon: BarChart2 },
  { href: "/search",     label: "Legal Research",   icon: Search },
  { href: "/draft",      label: "Contract Drafter", icon: FileText },
  { href: "/forms",      label: "Court Forms",      icon: ClipboardList },
  { href: "/sentencing", label: "Sentencing Tool",  icon: Scale },
]

export function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{
      display: "flex", flexDirection: "column",
      width: "220px", minHeight: "100vh", flexShrink: 0,
      background: "linear-gradient(180deg, #0D1424 0%, #0A0F1E 100%)",
      borderRight: "0.5px solid rgba(201,168,76,0.18)",
      padding: "28px 0 24px",
    }}>
      <div style={{
        padding: "0 24px 24px",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div style={{
          width: "34px", height: "34px", background: "#C9A84C",
          borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0A0F1E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.5 4.5H18l-3.75 2.7 1.5 4.5L12 12.3l-3.75 2.4 1.5-4.5L6 7.5h4.5z"/>
            <line x1="12" y1="15" x2="12" y2="21"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: 700, color: "#E8C97A", lineHeight: 1 }}>LexiZW</div>
          <div style={{ fontSize: "9px", fontWeight: 500, color: "#4A5568", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginTop: "3px" }}>AI Legal Suite · Beta</div>
        </div>
      </div>

      <nav style={{ padding: "20px 12px", flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", padding: "0 12px", marginBottom: "6px" }}>Workspace</div>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/dashboard" && path.startsWith(href))
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              fontSize: "13px", fontWeight: active ? 500 : 400,
              color: active ? "#E8C97A" : "#8B9AB0",
              background: active ? "rgba(201,168,76,0.12)" : "transparent",
              border: active ? "0.5px solid rgba(201,168,76,0.25)" : "0.5px solid transparent",
              textDecoration: "none",
            }}>
              <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          )
        })}
        <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", padding: "0 12px", marginTop: "20px", marginBottom: "6px" }}>Account</div>
        <Link href="#" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", fontSize: "13px", color: "#8B9AB0", border: "0.5px solid transparent", textDecoration: "none" }}>
          <Settings size={16} strokeWidth={1.75} /> Settings
        </Link>
      </nav>

      <div style={{ padding: "16px 20px 0", borderTop: "0.5px solid rgba(255,255,255,0.06)", marginTop: "auto" }}>
        <UserButton afterSignOutUrl="/" showName appearance={{
          elements: {
            userButtonBox: { color: "#EEE9DC", fontSize: "12px" },
            userButtonOuterIdentifier: { color: "#EEE9DC", fontSize: "12px" },
          }
        }} />
      </div>
    </aside>
  )
}


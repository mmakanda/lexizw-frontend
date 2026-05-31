"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { Search, FileText, ClipboardList, Scale, BarChart2 } from "lucide-react"

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
    <aside style={{ display: "flex", flexDirection: "column", width: "240px", minHeight: "100vh", background: "white", borderRight: "1px solid #e5e7eb", padding: "1.5rem 1rem" }}>
      <div style={{ marginBottom: "2rem", padding: "0 0.5rem" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f766e" }}>LexiZW</span>
        <span style={{ marginLeft: "0.25rem", fontSize: "0.75rem", color: "#9ca3af" }}>Beta</span>
      </div>
      <nav style={{ flex: 1 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.5rem 0.75rem", borderRadius: "0.5rem",
              marginBottom: "0.25rem", textDecoration: "none",
              fontSize: "0.875rem", fontWeight: 500,
              background: active ? "#f0fdf9" : "transparent",
              color: active ? "#0f766e" : "#4b5563",
            }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
        <UserButton afterSignOutUrl="/" showName />
      </div>
    </aside>
  )
}

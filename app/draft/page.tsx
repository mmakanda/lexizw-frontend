"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { FileText, Download, AlertCircle, ChevronRight, ArrowLeft, Sparkles } from "lucide-react"

const TEMPLATES: Record<string, { label: string; description: string; tag: string; fields: { key: string; label: string; required?: boolean; type?: string }[] }> = {
  nda: {
    label: "Non-Disclosure Agreement", tag: "NDA",
    description: "Protect confidential information between parties",
    fields: [
      { key: "disclosing_party", label: "Disclosing Party", required: true },
      { key: "receiving_party",  label: "Receiving Party",  required: true },
      { key: "purpose",          label: "Purpose of Disclosure", required: true },
      { key: "duration",         label: "Duration (e.g. 2 years)", required: true },
      { key: "date",             label: "Agreement Date", type: "date" },
    ],
  },
  employment: {
    label: "Employment Contract", tag: "Labour Act",
    description: "Labour Act compliant employment agreement",
    fields: [
      { key: "employer_name",    label: "Employer Name", required: true },
      { key: "employer_address", label: "Employer Address" },
      { key: "employee_name",    label: "Employee Full Name", required: true },
      { key: "employee_id",      label: "Employee ID Number" },
      { key: "position",         label: "Position / Job Title", required: true },
      { key: "department",       label: "Department" },
      { key: "start_date",       label: "Start Date", type: "date" },
      { key: "probation_period", label: "Probation Period" },
      { key: "currency",         label: "Currency (USD or ZiG)", required: true },
      { key: "salary",           label: "Gross Monthly Salary", required: true },
      { key: "leave_days",       label: "Annual Leave Days" },
      { key: "notice_period",    label: "Notice Period" },
    ],
  },
  lease: {
    label: "Lease Agreement", tag: "Property",
    description: "Residential or commercial property lease",
    fields: [
      { key: "landlord_name",    label: "Landlord Name", required: true },
      { key: "tenant_name",      label: "Tenant Name", required: true },
      { key: "property_address", label: "Property Address", required: true },
      { key: "currency",         label: "Currency (USD or ZiG)" },
      { key: "rent_amount",      label: "Monthly Rent", required: true },
      { key: "deposit_amount",   label: "Security Deposit" },
      { key: "lease_term",       label: "Lease Term (e.g. 12 months)" },
      { key: "start_date",       label: "Start Date", type: "date" },
      { key: "payment_day",      label: "Rent Due Day (e.g. 1st)" },
    ],
  },
  affidavit: {
    label: "Affidavit", tag: "Court",
    description: "Sworn statement for court proceedings",
    fields: [
      { key: "deponent_name",    label: "Deponent Full Name", required: true },
      { key: "deponent_id_type", label: "ID Type (National ID / Passport)" },
      { key: "deponent_id",      label: "ID Number" },
      { key: "deponent_address", label: "Deponent Address" },
      { key: "court",            label: "Court Name" },
      { key: "case_number",      label: "Case Number (if applicable)" },
      { key: "subject_matter",   label: "Subject Matter", required: true },
      { key: "facts",            label: "Statement of Facts", required: true },
    ],
  },
}

const I: React.CSSProperties = {
  width: "100%", background: "#1A2235",
  border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "10px",
  padding: "11px 14px", fontSize: "13px", color: "#EEE9DC",
  fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
}

export default function DraftPage() {
  const [template, setTemplate] = useState<string|null>(null)
  const [fields, setFields]     = useState<Record<string,string>>({})
  const [language, setLanguage] = useState("en")
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState<string|null>(null)

  async function generate() {
    if (!template) return
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_type: template, fields, language }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Generation failed")
      setResult(json)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const tmpl = template ? TEMPLATES[template] : null

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2.5rem 3rem", maxWidth: "900px" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "6px" }}>AI Document Generation</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: 700, color: "#EEE9DC", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Contract Drafter</h1>
          <p style={{ fontSize: "13px", color: "#8B9AB0" }}>Generate Zimbabwe-law compliant documents instantly</p>
        </div>

        {!template ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button key={key} onClick={() => { setTemplate(key); setFields({}); setResult(null); setError(null) }}
                style={{
                  background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px", padding: "22px", cursor: "pointer",
                  textAlign: "left" as const, transition: "all 0.18s", position: "relative" as const, overflow: "hidden" as const,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(201,168,76,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={18} color="#E8C97A" />
                  </div>
                  <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ChevronRight size={14} color="#4A5568" />
                  </div>
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 600, color: "#EEE9DC", marginBottom: "5px" }}>{t.label}</div>
                <div style={{ fontSize: "12px", color: "#8B9AB0", lineHeight: 1.5, marginBottom: "14px" }}>{t.description}</div>
                <div style={{ paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "4px", background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "0.5px solid rgba(201,168,76,0.2)" }}>{t.tag}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setTemplate(null)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#C9A84C", background: "none", border: "none", cursor: "pointer", marginBottom: "1.5rem", padding: 0 }}>
              <ArrowLeft size={13} /> Back to templates
            </button>

            <div style={{ background: "#1A2235", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "16px", padding: "28px" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 600, color: "#EEE9DC", marginBottom: "20px" }}>{tmpl?.label}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: "20px" }}>
                {tmpl?.fields.map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", display: "block", marginBottom: "6px" }}>
                      {f.label}{f.required && <span style={{ color: "#D85A30", marginLeft: "3px" }}>*</span>}
                    </label>
                    <input type={f.type || "text"} style={I} value={fields[f.key] || ""} onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", display: "block", marginBottom: "6px" }}>Client Summary Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ ...I, width: "220px" }}>
                  <option value="en">English only</option>
                  <option value="sn">Include Shona summary</option>
                </select>
              </div>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", background: "rgba(216,90,48,0.08)", border: "0.5px solid rgba(216,90,48,0.25)", borderRadius: "8px", color: "#E8845A", fontSize: "13px", marginBottom: "16px" }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button onClick={generate} disabled={loading} style={{
                background: "#C9A84C", color: "#0A0F1E", fontFamily: "Inter, sans-serif",
                fontSize: "13px", fontWeight: 600, border: "none", borderRadius: "10px",
                padding: "12px 24px", cursor: loading ? "not-allowed" : "pointer",
                display: "inline-flex", alignItems: "center", gap: "8px", opacity: loading ? 0.7 : 1,
              }}>
                <Sparkles size={15} />
                {loading ? "Generating…" : "Generate Document"}
              </button>
            </div>

            {result && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ background: "#141C2E", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "24px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 600, color: "#EEE9DC" }}>Generated Document</div>
                    <a href={`https://lexizw-backend-production.up.railway.app${result.download_url}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 500, color: "#C9A84C", background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "7px 14px", textDecoration: "none" }}>
                      <Download size={13} /> Download DOCX
                    </a>
                  </div>
                  <pre style={{ fontSize: "12px", color: "#8B9AB0", whiteSpace: "pre-wrap" as const, fontFamily: "monospace", background: "#0A0F1E", padding: "16px", borderRadius: "8px", maxHeight: "400px", overflowY: "auto" as const, border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    {result.generated_text}
                  </pre>
                </div>

                <div style={{ background: "rgba(29,158,117,0.06)", border: "0.5px solid rgba(29,158,117,0.2)", borderRadius: "12px", padding: "18px 22px", marginTop: "12px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1D9E75", marginBottom: "8px" }}>Plain English Summary</div>
                  <p style={{ fontSize: "13px", color: "#8B9AB0", margin: 0, lineHeight: 1.6 }}>{result.plain_summary}</p>
                  {result.plain_summary_shona && (
                    <>
                      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1D9E75", margin: "14px 0 8px" }}>Shona Summary (chiShona)</div>
                      <p style={{ fontSize: "13px", color: "#8B9AB0", margin: 0, lineHeight: 1.6 }}>{result.plain_summary_shona}</p>
                    </>
                  )}
                </div>
                <p style={{ fontSize: "10px", color: "#4A5568", marginTop: "10px" }}>⚠ AI-generated. Review with a qualified Zimbabwean lawyer before execution.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}


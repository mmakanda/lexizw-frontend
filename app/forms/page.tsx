"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ClipboardList, Download, AlertCircle, ChevronRight, ArrowLeft, Sparkles } from "lucide-react"

const FORM_TYPES: Record<string, {
  label: string; court: string; tag: string;
  fields: { key: string; label: string; type?: string; required?: boolean; rows?: number }[]
}> = {
  hc12_summons: {
    label: "High Court Summons (HC12)", court: "High Court of Zimbabwe", tag: "HC",
    fields: [
      { key: "plaintiff_name",     label: "Plaintiff Full Name / Entity", required: true },
      { key: "plaintiff_address",  label: "Plaintiff Address", required: true },
      { key: "defendant_name",     label: "Defendant Full Name / Entity", required: true },
      { key: "defendant_address",  label: "Defendant Address", required: true },
      { key: "claim_description",  label: "Nature of Claim", required: true, rows: 3 },
      { key: "currency",           label: "Currency (USD / ZiG)" },
      { key: "amount",             label: "Amount Claimed" },
      { key: "legal_practitioner", label: "Legal Practitioner Name & Firm", required: true },
    ],
  },
  magistrates_summons: {
    label: "Magistrates' Court Summons", court: "Magistrates' Court of Zimbabwe", tag: "MAG",
    fields: [
      { key: "plaintiff_name",    label: "Plaintiff Name", required: true },
      { key: "plaintiff_address", label: "Plaintiff Address" },
      { key: "defendant_name",    label: "Defendant Name", required: true },
      { key: "defendant_address", label: "Defendant Address" },
      { key: "claim",             label: "Nature of Claim", required: true, rows: 2 },
      { key: "amount",            label: "Amount Claimed" },
    ],
  },
  opposing_affidavit: {
    label: "Opposing Affidavit", court: "All Courts", tag: "ALL",
    fields: [
      { key: "deponent_name",    label: "Deponent Full Name", required: true },
      { key: "deponent_id",      label: "ID Number" },
      { key: "deponent_address", label: "Deponent Address" },
      { key: "case_number",      label: "Case Number", required: true },
      { key: "court",            label: "Court Name" },
      { key: "opposition_basis", label: "Basis of Opposition", required: true, rows: 4 },
    ],
  },
  notice_of_motion: {
    label: "Notice of Motion", court: "High Court of Zimbabwe", tag: "HC",
    fields: [
      { key: "applicant_name",   label: "Applicant Name", required: true },
      { key: "respondent_name",  label: "Respondent Name", required: true },
      { key: "case_number",      label: "Case Number" },
      { key: "relief_sought",    label: "Relief Sought", required: true, rows: 3 },
      { key: "return_date",      label: "Return Date", type: "date" },
      { key: "practitioner",     label: "Legal Practitioner" },
    ],
  },
  chamber_application: {
    label: "Chamber Application", court: "High Court of Zimbabwe", tag: "HC",
    fields: [
      { key: "applicant_name",   label: "Applicant Name", required: true },
      { key: "respondent_name",  label: "Respondent Name" },
      { key: "case_number",      label: "Case Number" },
      { key: "urgency_grounds",  label: "Grounds for Urgency", required: true, rows: 3 },
      { key: "relief_sought",    label: "Relief Sought", required: true, rows: 3 },
      { key: "practitioner",     label: "Legal Practitioner", required: true },
    ],
  },
  mitigation_letter: {
    label: "Mitigation Letter", court: "Magistrates' Court", tag: "MAG",
    fields: [
      { key: "accused_name",     label: "Accused Name", required: true },
      { key: "offence",          label: "Offence", required: true },
      { key: "personal_details", label: "Personal Circumstances", rows: 3 },
      { key: "mitigation",       label: "Mitigating Factors", required: true, rows: 4 },
      { key: "practitioner",     label: "Legal Practitioner" },
    ],
  },
}

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  HC:  { bg: "rgba(201,168,76,0.1)",  color: "#C9A84C", border: "rgba(201,168,76,0.2)" },
  MAG: { bg: "rgba(29,158,117,0.1)",  color: "#1D9E75", border: "rgba(29,158,117,0.2)" },
  ALL: { bg: "rgba(127,119,221,0.1)", color: "#7F77DD", border: "rgba(127,119,221,0.2)" },
}

const I: React.CSSProperties = {
  width: "100%", background: "#1A2235",
  border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: "10px",
  padding: "11px 14px", fontSize: "13px", color: "#EEE9DC",
  fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box",
}

export default function FormsPage() {
  const [formType, setFormType] = useState<string|null>(null)
  const [fields, setFields]     = useState<Record<string,string>>({})
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState<string|null>(null)

  async function generate() {
    if (!formType) return
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/forms", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: formType, fields }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Generation failed")
      setResult(json)
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  const tmpl = formType ? FORM_TYPES[formType] : null

  return (
    <div style={{ display: "flex", flexDirection: "row", minHeight: "100vh", background: "#0A0F1E" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2.5rem 3rem", maxWidth: "960px" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#4A5568", marginBottom: "6px" }}>Court Documents</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", fontWeight: 700, color: "#EEE9DC", margin: "0 0 4px" }}>Court Forms</h1>
          <p style={{ fontSize: "13px", color: "#8B9AB0" }}>Generate court-ready documents compliant with Zimbabwe High Court Rules and Magistrates' Court Act</p>
        </div>

        {!formType ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {Object.entries(FORM_TYPES).map(([key, t]) => {
              const tagStyle = TAG_COLORS[t.tag] || TAG_COLORS.ALL
              return (
                <button key={key} onClick={() => { setFormType(key); setFields({}); setResult(null); setError(null) }}
                  style={{
                    background: "#1A2235", border: "0.5px solid rgba(255,255,255,0.06)",
                    borderRadius: "14px", padding: "20px", cursor: "pointer",
                    textAlign: "left" as const, transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"; e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ClipboardList size={17} color="#E8C97A" />
                    </div>
                    <ChevronRight size={14} color="#4A5568" />
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: 600, color: "#EEE9DC", marginBottom: "4px", lineHeight: 1.3 }}>{t.label}</div>
                  <div style={{ fontSize: "11px", color: "#4A5568", marginBottom: "12px" }}>{t.court}</div>
                  <span style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, padding: "3px 8px", borderRadius: "4px", background: tagStyle.bg, color: tagStyle.color, border: `0.5px solid ${tagStyle.border}` }}>{t.tag === "HC" ? "High Court" : t.tag === "MAG" ? "Magistrates'" : "All Courts"}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div>
            <button onClick={() => setFormType(null)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#C9A84C", background: "none", border: "none", cursor: "pointer", marginBottom: "1.5rem", padding: 0 }}>
              <ArrowLeft size={13} /> Back to forms
            </button>

            <div style={{ background: "#1A2235", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "16px", padding: "28px" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 600, color: "#EEE9DC", marginBottom: "4px" }}>{tmpl?.label}</div>
                <div style={{ fontSize: "12px", color: "#4A5568" }}>{tmpl?.court}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 20px", marginBottom: "20px" }}>
                {tmpl?.fields.map(f => (
                  <div key={f.key} style={{ gridColumn: f.rows ? "1 / -1" : undefined }}>
                    <label style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#8B9AB0", display: "block", marginBottom: "6px" }}>
                      {f.label}{f.required && <span style={{ color: "#D85A30", marginLeft: "3px" }}>*</span>}
                    </label>
                    {f.rows ? (
                      <textarea rows={f.rows} style={{ ...I, resize: "vertical" as const }} value={fields[f.key] || ""} onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))} />
                    ) : (
                      <input type={f.type || "text"} style={I} value={fields[f.key] || ""} onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))} />
                    )}
                  </div>
                ))}
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
                {loading ? "Generating…" : "Generate Court Form"}
              </button>
            </div>

            {result && (
              <div style={{ marginTop: "20px" }}>
                <div style={{ background: "#141C2E", border: "0.5px solid rgba(201,168,76,0.18)", borderRadius: "14px", padding: "24px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 600, color: "#EEE9DC" }}>Generated Form</div>
                    <a href={result.download_url} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 500, color: "#C9A84C", background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.2)", borderRadius: "8px", padding: "7px 14px", textDecoration: "none" }}>
                      <Download size={13} /> Download PDF
                    </a>
                  </div>
                  <pre style={{ fontSize: "12px", color: "#8B9AB0", whiteSpace: "pre-wrap" as const, fontFamily: "monospace", background: "#0A0F1E", padding: "16px", borderRadius: "8px", maxHeight: "400px", overflowY: "auto" as const, border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    {result.generated_text || result.content}
                  </pre>
                </div>
                <p style={{ fontSize: "10px", color: "#4A5568", marginTop: "10px" }}>⚠ AI-generated. Verify accuracy with a qualified legal practitioner before filing.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}


"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ClipboardList, Download, AlertCircle, ChevronRight } from "lucide-react"

const FORM_TYPES: Record<string, {
  label: string
  court: string
  fields: { key: string; label: string; type?: string; required?: boolean; rows?: number }[]
}> = {
  hc12_summons: {
    label: "High Court Summons (HC12)",
    court: "High Court of Zimbabwe",
    fields: [
      { key: "plaintiff_name",      label: "Plaintiff Full Name / Entity",    required: true },
      { key: "plaintiff_address",   label: "Plaintiff Address",               required: true },
      { key: "defendant_name",      label: "Defendant Full Name / Entity",    required: true },
      { key: "defendant_address",   label: "Defendant Address",               required: true },
      { key: "claim_description",   label: "Nature of Claim",                 required: true, rows: 3 },
      { key: "currency",            label: "Currency (USD / ZiG)" },
      { key: "amount",              label: "Amount Claimed" },
      { key: "legal_practitioner",  label: "Legal Practitioner Name & Firm",  required: true },
    ],
  },
  magistrates_summons: {
    label: "Magistrates\' Court Summons",
    court: "Magistrates\' Court of Zimbabwe",
    fields: [
      { key: "plaintiff_name",     label: "Plaintiff Name",         required: true },
      { key: "plaintiff_address",  label: "Plaintiff Address" },
      { key: "defendant_name",     label: "Defendant Name",         required: true },
      { key: "defendant_address",  label: "Defendant Address" },
      { key: "claim_description",  label: "Claim Description",      required: true, rows: 3 },
      { key: "currency",           label: "Currency (USD / ZiG)" },
      { key: "amount",             label: "Amount Claimed" },
      { key: "court_name",         label: "Court Location (e.g. Harare)" },
    ],
  },
  opposing_affidavit: {
    label: "Opposing Affidavit",
    court: "All Courts",
    fields: [
      { key: "deponent_name",   label: "Deponent Full Name",          required: true },
      { key: "deponent_id",     label: "Deponent ID Number",          required: true },
      { key: "court",           label: "Court Name",                  required: true },
      { key: "case_number",     label: "Case Number" },
      { key: "other_party",     label: "Applicant / Plaintiff Name",  required: true },
      { key: "grounds",         label: "Grounds of Opposition",       required: true, rows: 5 },
    ],
  },
  notice_of_motion: {
    label: "Notice of Motion",
    court: "High Court of Zimbabwe",
    fields: [
      { key: "applicant_name",      label: "Applicant Name",          required: true },
      { key: "legal_practitioner",  label: "Legal Practitioner",      required: true },
      { key: "respondent_name",     label: "Respondent Name",         required: true },
      { key: "relief_sought",       label: "Relief Sought",           required: true, rows: 4 },
      { key: "return_date",         label: "Return Date",             type: "date" },
    ],
  },
  chamber_application: {
    label: "Chamber Application",
    court: "High Court of Zimbabwe",
    fields: [
      { key: "applicant_name",  label: "Applicant Name",   required: true },
      { key: "respondent_name", label: "Respondent Name",  required: true },
      { key: "relief_sought",   label: "Relief Sought",    required: true, rows: 3 },
      { key: "grounds",         label: "Grounds",          required: true, rows: 4 },
    ],
  },
  mitigation_letter: {
    label: "Mitigation Letter",
    court: "Magistrates\' Court",
    fields: [
      { key: "accused_name",       label: "Accused Full Name",        required: true },
      { key: "court",              label: "Court",                    required: true },
      { key: "offence",            label: "Offence",                  required: true },
      { key: "background",         label: "Personal Background",      required: true, rows: 3 },
      { key: "family_situation",   label: "Family Situation",         rows: 2 },
      { key: "employment",         label: "Employment Status" },
      { key: "remorse_statement",  label: "Statement of Remorse",     rows: 2 },
      { key: "mitigating_factors", label: "Other Mitigating Factors", rows: 3 },
      { key: "language",           label: "Language (en = English, sn = Shona)" },
    ],
  },
}

export default function FormsPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [fields, setFields]     = useState<Record<string, string>>({})
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<any>(null)
  const [error, setError]       = useState<string | null>(null)

  function selectForm(key: string) {
    setSelected(key); setFields({}); setResult(null); setError(null)
  }

  async function generate() {
    if (!selected) return
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: selected,
          fields,
          language: fields.language || "en",
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Generation failed")
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const form = selected ? FORM_TYPES[selected] : null

  return (
    <div className="flex flex-row min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Court Forms</h1>
        <p className="text-gray-500 mb-6">
          Generate court-ready documents compliant with Zimbabwe High Court Rules and Magistrates\' Court Act
        </p>

        {!selected ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(FORM_TYPES).map(([key, f]) => (
              <button
                key={key}
                onClick={() => selectForm(key)}
                className="card text-left hover:border-brand-300 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={20} className="text-brand-600" />
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-brand-700">{f.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.court}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-brand-600 hover:underline mb-6 flex items-center gap-1"
            >
              ← Back to form types
            </button>

            <div className="card mb-6">
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900">{form?.label}</h2>
                <p className="text-xs text-gray-400">{form?.court}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {form?.fields.map(f => (
                  <div key={f.key} className={f.rows ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {f.label}
                      {f.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {f.rows ? (
                      <textarea
                        rows={f.rows}
                        className="input resize-none"
                        value={fields[f.key] || ""}
                        onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type={f.type || "text"}
                        className="input"
                        value={fields[f.key] || ""}
                        onChange={e => setFields(p => ({ ...p, [f.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-sm">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button onClick={generate} disabled={loading} className="btn-primary">
                {loading ? "Generating..." : "Generate Form"}
              </button>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900">Generated Form</h2>
                    <a
                      href={result.download_url}
                      className="btn-secondary flex items-center gap-2 text-sm"
                    >
                      <Download size={14} /> Download DOCX
                    </a>
                  </div>
                  {result.preview_text && (
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                      {result.preview_text}...
                    </pre>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  ⚠ AI-generated. Review carefully and have a qualified legal practitioner check before filing.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

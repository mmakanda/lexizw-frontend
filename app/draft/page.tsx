"use client"
import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { FileText, Download, AlertCircle, ChevronRight } from "lucide-react"

const TEMPLATES: Record<string, { label: string; fields: { key: string; label: string; required?: boolean; type?: string }[] }> = {
  nda: {
    label: "Non-Disclosure Agreement",
    fields: [
      { key: "disclosing_party", label: "Disclosing Party", required: true },
      { key: "receiving_party",  label: "Receiving Party",  required: true },
      { key: "purpose",          label: "Purpose of Disclosure", required: true },
      { key: "duration",         label: "Duration (e.g. 2 years)", required: true },
      { key: "date",             label: "Agreement Date", type: "date" },
    ],
  },
  employment: {
    label: "Employment Contract",
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
    label: "Lease Agreement",
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
    label: "Affidavit",
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

export default function DraftPage() {
  const [template, setTemplate]   = useState<string|null>(null)
  const [fields, setFields]       = useState<Record<string,string>>({})
  const [language, setLanguage]   = useState("en")
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<any>(null)
  const [error, setError]         = useState<string|null>(null)

  function selectTemplate(key: string) {
    setTemplate(key); setFields({}); setResult(null); setError(null)
  }

  async function generate() {
    if (!template) return
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_type: template, fields, language }),
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

  const tmpl = template ? TEMPLATES[template] : null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Contract Drafter</h1>
        <p className="text-gray-500 mb-6">Generate Zimbabwe-law compliant documents instantly</p>

        {!template ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(TEMPLATES).map(([key, t]) => (
              <button key={key} onClick={() => selectTemplate(key)}
                className="card text-left hover:border-brand-300 transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-brand-600" />
                    <span className="font-medium text-gray-900 group-hover:text-brand-700">{t.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button onClick={() => setTemplate(null)} className="text-sm text-brand-600 hover:underline mb-6 flex items-center gap-1">
              ← Back to templates
            </button>

            <div className="card mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">{tmpl?.label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {tmpl?.fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type={f.type || "text"}
                      className="input"
                      value={fields[f.key] || ""}
                      onChange={e => setFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Client summary language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="input w-48">
                  <option value="en">English only</option>
                  <option value="sn">Include Shona summary</option>
                </select>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-red-700 text-sm">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button onClick={generate} disabled={loading} className="btn-primary">
                {loading ? "Generating..." : "Generate Document"}
              </button>
            </div>

            {result && (
              <div className="space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900">Generated Document</h2>
                    <a href={result.download_url} className="btn-secondary flex items-center gap-2 text-sm">
                      <Download size={14} /> Download DOCX
                    </a>
                  </div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                    {result.generated_text}
                  </pre>
                </div>
                <div className="card bg-brand-50 border-brand-200">
                  <h3 className="font-medium text-brand-900 mb-2">Plain English Summary</h3>
                  <p className="text-sm text-brand-800">{result.plain_summary}</p>
                  {result.plain_summary_shona && (
                    <>
                      <h3 className="font-medium text-brand-900 mt-4 mb-2">Shona Summary (chiShona)</h3>
                      <p className="text-sm text-brand-800">{result.plain_summary_shona}</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400">⚠ AI-generated. Review with a qualified Zimbabwean lawyer before execution.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

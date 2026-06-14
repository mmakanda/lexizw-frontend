import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.API_BASE_URL || "http://localhost:8000"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const token = await session.getToken()
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id   = searchParams.get("id")
    const type = searchParams.get("type") || "draft"   // draft | form
    const fmt  = searchParams.get("fmt") || "docx"     // docx | pdf

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    const backendUrl = `${BACKEND}/api/${type}/${id}/download?fmt=${fmt}`

    const res = await fetch(backendUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Download failed" }))
      return NextResponse.json(err, { status: res.status })
    }

    const blob = await res.blob()
    const contentType = res.headers.get("content-type") || "application/octet-stream"
    const disposition = res.headers.get("content-disposition") || `attachment; filename="document.${fmt}"`

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Download failed" }, { status: 500 })
  }
}


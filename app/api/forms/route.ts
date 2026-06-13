import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { apiFetch } from "@/lib/api"
import { formsSchema } from "@/lib/schemas"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const token = await session.getToken()
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    const body = await req.json()
    const parsed = formsSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 422 })
    const data = await apiFetch("/api/forms", { method: "POST", body: JSON.stringify(parsed.data), token })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "forms failed" }, { status: 500 })
  }
}

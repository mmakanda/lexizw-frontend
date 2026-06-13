import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { apiFetch } from "@/lib/api"
import { sentencingSchema } from "@/lib/schemas"
export async function POST(req: NextRequest) {
  try {
    const { getToken } = await auth()
    const token = await getToken()
    if (!token) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
    const body = await req.json()
    const parsed = sentencingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors }, { status: 422 })
    const data = await apiFetch("/api/sentencing", { method: "POST", body: JSON.stringify(parsed.data), token })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Prediction failed" }, { status: 500 })
  }
}

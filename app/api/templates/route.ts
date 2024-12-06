import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const templates = await db.template.findMany({
    include: {
      author: true,
      category: true,
    },
  })
  return NextResponse.json(templates)
}
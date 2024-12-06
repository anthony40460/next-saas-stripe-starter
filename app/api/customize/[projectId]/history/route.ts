import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const history = await db.customizationHistory.findMany({
      where: {
        projectId: params.projectId,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Failed to fetch history:', error)
    return new Response("Failed to fetch history", { status: 500 })
  }
}
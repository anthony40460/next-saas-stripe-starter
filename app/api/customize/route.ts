import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { customizeBoltProject } from "@/lib/bolt"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { projectId, prompt } = await req.json()

    // Vérifier que l'utilisateur a accès au projet
    const project = await db.boltProject.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
      include: {
        template: true,
      },
    })

    if (!project) {
      return new Response("Project not found", { status: 404 })
    }

    // Appliquer les modifications avec l'API de Bolt.new
    const customization = await customizeBoltProject(project.boltId, {
      prompt,
      template: project.template.id,
    })

    // Enregistrer l'historique des modifications
    await db.customizationHistory.create({
      data: {
        projectId,
        prompt,
        changes: customization.changes,
        duration: customization.duration,
        userId: session.user.id,
      },
    })

    // Mettre à jour les statistiques du template
    await db.template.update({
      where: { id: project.template.id },
      data: {
        customizationCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(customization)
  } catch (error) {
    console.error('Customization failed:', error)
    return new Response("Failed to customize template", { status: 500 })
  }
}
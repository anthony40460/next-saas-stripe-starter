import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    // Vérifier la signature du webhook
    const signature = headers().get("bolt-signature")
    if (!signature || signature !== process.env.BOLT_WEBHOOK_SECRET) {
      return new Response("Invalid signature", { status: 401 })
    }

    const data = await req.json()

    switch (data.type) {
      case "project.created":
        await handleProjectCreated(data.project)
        break
      case "customization.completed":
        await handleCustomizationCompleted(data.customization)
        break
      case "deployment.completed":
        await handleDeploymentCompleted(data.deployment)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing failed:', error)
    return new Response("Webhook processing failed", { status: 500 })
  }
}

async function handleProjectCreated(project: any) {
  await db.boltProject.create({
    data: {
      boltId: project.id,
      templateId: project.metadata.templateId,
      status: "CREATED",
      url: project.url
    }
  })
}

async function handleCustomizationCompleted(customization: any) {
  const project = await db.boltProject.findFirst({
    where: { boltId: customization.projectId }
  })

  if (project) {
    await db.customizationHistory.create({
      data: {
        projectId: project.id,
        prompt: customization.prompt,
        changes: customization.changes,
        duration: customization.duration
      }
    })
  }
}

async function handleDeploymentCompleted(deployment: any) {
  await db.boltProject.update({
    where: { boltId: deployment.projectId },
    data: {
      status: "DEPLOYED",
      liveUrl: deployment.url
    }
  })
}
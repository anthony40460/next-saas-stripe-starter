"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { CustomizationType } from "@/types"

export async function getCustomizationHistory(projectId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return db.customizationHistory.findMany({
    where: {
      projectId,
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  })
}

export async function saveCustomization(data: {
  projectId: string
  prompt: string
  changes: any
  duration: number
}) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const customization = await db.customizationHistory.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  })

  revalidatePath(`/templates/${data.projectId}/customize`)

  return customization
}

export async function undoCustomization(customizationId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  const customization = await db.customizationHistory.findUnique({
    where: {
      id: customizationId,
      userId: session.user.id,
    },
    include: {
      project: true,
    },
  })

  if (!customization) {
    throw new Error("Customization not found")
  }

  // Implémenter la logique d'annulation avec l'API Bolt.new
  // ...

  revalidatePath(`/templates/${customization.project.id}/customize`)

  return customization
}
"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createPurchaseRecord(data: {
  templateId: string
  stripeSessionId: string
}) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return db.purchasedTemplate.create({
    data: {
      templateId: data.templateId,
      userId: session.user.id,
      stripeSessionId: data.stripeSessionId,
      status: "PENDING",
    },
  })
}

export async function getPurchaseById(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Not authenticated")
  }

  return db.purchasedTemplate.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      template: true,
    },
  })
}
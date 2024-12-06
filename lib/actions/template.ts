"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

interface CreateTemplateData {
  title: string
  description: string
  githubUrl: string
  price: number
  category: string
  technologies: string[]
  features: { title: string; description: string }[]
  customizationOptions: {
    name: string
    description: string
    type: string
  }[]
}

export async function createTemplate(data: CreateTemplateData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  // Create new template
  const template = await db.template.create({
    data: {
      title: data.title,
      description: data.description,
      githubUrl: data.githubUrl,
      price: data.price,
      authorId: session.user.id,
      categoryId: data.category,
      technologies: {
        connectOrCreate: data.technologies.map((tech) => ({
          where: { name: tech },
          create: { name: tech },
        })),
      },
    },
  })

  // Create features
  for (const feature of data.features) {
    await db.templateFeature.create({
      data: {
        ...feature,
        templateId: template.id,
      },
    })
  }

  // Create customization options
  for (const option of data.customizationOptions) {
    await db.customizationOption.create({
      data: {
        ...option,
        templateId: template.id,
      },
    })
  }

  revalidatePath("/creator/templates")
  return template
}

export async function getTemplateById(id: string) {
  return db.template.findUnique({
    where: { id },
    include: {
      category: true,
      technologies: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      features: true,
      customizationOptions: true,
      ratings: true,
    },
  })
}

export async function updateTemplate(id: string, data: Partial<CreateTemplateData>) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  const template = await db.template.findUnique({
    where: { id },
    include: { technologies: true },
  })

  if (!template || template.authorId !== session.user.id) {
    throw new Error("Template not found or unauthorized")
  }

  // Update template
  const updatedTemplate = await db.template.update({
    where: { id },
    data: {
      ...data,
      ...(data.technologies && {
        technologies: {
          set: [],
          connectOrCreate: data.technologies.map((tech) => ({
            where: { name: tech },
            create: { name: tech },
          })),
        },
      }),
    },
  })

  revalidatePath(`/creator/templates/${id}`)
  revalidatePath("/creator/templates")

  return updatedTemplate
}
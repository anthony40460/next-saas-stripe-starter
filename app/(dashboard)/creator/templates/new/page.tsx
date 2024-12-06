import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TemplateForm } from "@/components/templates/template-form"

export const metadata = {
  title: "New Template",
  description: "Create a new template to sell on the marketplace",
}

export default async function NewTemplatePage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Template</h1>
        <p className="text-muted-foreground">
          Fill in the details below to submit your template to the marketplace.
        </p>
      </div>
      <TemplateForm />
    </div>
  )
}
import { getTemplateById } from "@/lib/actions/template"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface TemplatePageProps {
  params: {
    id: string
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await getTemplateById(params.id)

  if (!template) {
    return <div>Template not found</div>
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preview */}
        <div className="space-y-4">
          <div className="aspect-video w-full rounded-lg border overflow-hidden">
            <iframe
              src={template.previewUrl}
              className="w-full h-full"
              style={{ border: 0 }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{template.title}</h1>
            <p className="text-muted-foreground mt-2">{template.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{formatPrice(template.price)}</div>
            <Link href={`/templates/${template.id}/purchase`}>
              <Button size="lg">Purchase Template</Button>
            </Link>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Features</h2>
            <ul className="space-y-2">
              {template.features?.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">About the Creator</h2>
            <div className="flex items-center gap-4">
              {template.author.image && (
                <img
                  src={template.author.image}
                  alt={template.author.name || ""}
                  className="h-12 w-12 rounded-full"
                />
              )}
              <div>
                <div className="font-medium">{template.author.name}</div>
                <Link 
                  href={`/creators/${template.author.id}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
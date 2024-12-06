import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTemplateById } from "@/lib/actions/template"
import { Card } from "@/components/ui/card"
import { StripeCheckout } from "@/components/checkout/stripe-checkout"

interface PurchasePageProps {
  params: {
    id: string
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const session = await auth()
  if (!session?.user) {
    redirect(`/login?from=/templates/${params.id}/purchase`)
  }

  const template = await getTemplateById(params.id)
  if (!template) {
    redirect('/templates')
  }

  return (
    <div className="container max-w-xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Complete Purchase</h1>
        <StripeCheckout 
          templateId={template.id}
          amount={template.price}
          redirectUrl={`/templates/${template.id}/success`}
        />
      </Card>
    </div>
  )
}
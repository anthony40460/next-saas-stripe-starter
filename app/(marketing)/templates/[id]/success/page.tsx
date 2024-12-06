import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getTemplateById } from "@/lib/actions/template"
import Link from "next/link"

export default async function SuccessPage(
  { params, searchParams }: { params: { id: string }, searchParams: { session_id?: string } }
) {
  if (!searchParams.session_id) {
    redirect('/')
  }

  const template = await getTemplateById(params.id)
  if (!template) {
    redirect('/')
  }

  return (
    <div className="container max-w-xl py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-muted-foreground mb-8">
        Your template is now ready to be customized on Bolt.new
      </p>
      <Button asChild>
        <Link href="https://bolt.new">Go to Bolt.new</Link>
      </Button>
    </div>
  )
}
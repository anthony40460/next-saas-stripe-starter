import { DataTable } from "@/components/templates/data-table"
import { columns } from "./columns"
import { getCreatorTemplates } from "@/lib/actions/creator"

export default async function CreatorTemplatesPage() {
  const templates = await getCreatorTemplates()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Templates</h1>
      <DataTable columns={columns} data={templates} />
    </div>
  )
}
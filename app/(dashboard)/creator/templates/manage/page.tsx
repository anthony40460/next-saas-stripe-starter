import { getTemplates } from "@/lib/actions/template"
import { DataTable } from "@/components/templates/data-table"
import { templateColumns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Icons } from "@/components/icons"

export default async function ManageTemplatesPage() {
  const templates = await getTemplates()

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Templates</h1>
        <Link href="/creator/templates/new">
          <Button>
            <Icons.plus className="mr-2 h-4 w-4" />
            Add New Template
          </Button>
        </Link>
      </div>

      <DataTable
        columns={templateColumns}
        data={templates}
        filters={[
          {
            id: "status",
            label: "Status",
            options: [
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" }
            ]
          }
        ]}
      />
    </div>
  )
}
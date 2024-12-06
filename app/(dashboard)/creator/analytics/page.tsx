import { getCreatorStats } from "@/lib/actions/creator"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { SalesChart } from "@/components/analytics/sales-chart"
import { TemplatePerformance } from "@/components/analytics/template-performance"
import { DateRangePicker } from "@/components/date-range-picker"

export default async function AnalyticsPage() {
  const stats = await getCreatorStats()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <DateRangePicker />
      </div>

      <div className="grid gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold">Sales Overview</h2>
          </div>
          <SalesChart data={stats.salesData} />
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold">Template Performance</h2>
          </div>
          <TemplatePerformance data={stats.templatePerformance} />
        </Card>
      </div>
    </div>
  )
}
import { getEarnings } from "@/lib/actions/creator"
import { Card } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { earningsColumns } from "./columns"
import { connectStripeAccount } from "@/lib/stripe"

export default async function EarningsPage() {
  const earnings = await getEarnings()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Earnings</h1>

      {/* Carte de configuration Stripe */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Payment Settings</h2>
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to receive payments
            </p>
          </div>
          <form action={connectStripeAccount}>
            <Button variant="outline">
              <Icons.stripe className="mr-2 h-4 w-4" />
              Connect Stripe
            </Button>
          </form>
        </div>
      </Card>

      {/* Historique des gains */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Earnings History</h2>
        <DataTable
          columns={earningsColumns}
          data={earnings}
          filters={[
            {
              id: "period",
              label: "Period",
              options: [
                { label: "Last 7 days", value: "7d" },
                { label: "Last 30 days", value: "30d" },
                { label: "Last 90 days", value: "90d" }
              ]
            }
          ]}
        />
      </div>
    </div>
  )
}
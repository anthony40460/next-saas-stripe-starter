import { getUserPurchases } from "@/lib/actions/user"

export default async function PurchasedPage() {
  const purchases = await getUserPurchases()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Purchases</h1>
      {/* Liste des templates achetés */}
    </div>
  )
}
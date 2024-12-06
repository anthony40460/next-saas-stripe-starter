import { getCreatorStats } from "@/lib/actions/creator"

export default async function AnalyticsPage() {
  const stats = await getCreatorStats()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      {/* Affichage des statistiques */}
    </div>
  )
}
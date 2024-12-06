"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { createBoltProject, customizeBoltProject } from "@/lib/bolt"

interface BoltDeployProps {
  templateId: string
  githubUrl: string
  onDeploymentComplete: (url: string) => void
}

export function BoltDeploy({
  templateId,
  githubUrl,
  onDeploymentComplete
}: BoltDeployProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeploy = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Créer le projet sur Bolt.new
      const project = await createBoltProject(githubUrl, templateId)

      // Attendre que le projet soit prêt
      while (project.status === "CREATING") {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const status = await getBoltProjectStatus(project.id)
        if (status.status === "READY") {
          break
        }
        if (status.status === "FAILED") {
          throw new Error("Project creation failed")
        }
      }

      onDeploymentComplete(project.customizationUrl || project.url)
    } catch (err) {
      console.error("Deployment failed:", err)
      setError("Failed to deploy template to Bolt.new")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Deploy to Bolt.new</h3>
          <p className="text-sm text-muted-foreground">
            Deploy this template to start customization
          </p>
        </div>
        <Button
          onClick={handleDeploy}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          {isLoading ? "Deploying..." : "Deploy"}
          <Icons.bolt className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500 mt-2">
          {error}
        </div>
      )}
    </Card>
  )
}
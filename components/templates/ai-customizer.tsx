"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AICustomizerProps {
  projectId: string
  onCustomizationComplete: (changes: any) => void
}

type CustomizationStatus = "idle" | "processing" | "completed" | "error"

export function AICustomizer({ projectId, onCustomizationComplete }: AICustomizerProps) {
  const [prompt, setPrompt] = useState("")
  const [status, setStatus] = useState<CustomizationStatus>("idle")
  const [history, setHistory] = useState<Array<{
    prompt: string
    changes: any
    timestamp: Date
  }>>([])

  async function handleCustomization() {
    if (!prompt.trim()) return

    setStatus("processing")

    try {
      const response = await fetch("/api/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          prompt,
        }),
      })

      if (!response.ok) throw new Error("Customization failed")

      const changes = await response.json()
      
      setHistory(prev => [{
        prompt,
        changes,
        timestamp: new Date()
      }, ...prev])

      onCustomizationComplete(changes)
      setStatus("completed")
      setPrompt("")
    } catch (error) {
      console.error("Customization error:", error)
      setStatus("error")
    }
  }

  const suggestedPrompts = [
    "Make the header background a gradient from blue to purple",
    "Change the font to be more modern and minimal",
    "Add a hero section with a large image and bold text",
    "Update the color scheme to be more professional",
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">AI Customization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Describe the changes you want to make in natural language.
        </p>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Example: Change the background color to a light blue and make the heading text larger"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {status === "processing" && "Processing changes..."}
              {status === "error" && "Failed to apply changes. Please try again."}
            </div>
            <Button
              onClick={handleCustomization}
              disabled={status === "processing" || !prompt.trim()}
            >
              {status === "processing" && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Apply Changes
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 flex-1">
        <h3 className="text-lg font-semibold mb-2">Suggested Changes</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setPrompt(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4 flex-1">
        <h3 className="text-lg font-semibold mb-2">Change History</h3>
        <ScrollArea className="h-[200px]">
          {history.map((item, index) => (
            <div
              key={index}
              className="py-2 border-b last:border-0"
            >
              <p className="text-sm font-medium">{item.prompt}</p>
              <p className="text-xs text-muted-foreground">
                {item.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </ScrollArea>
      </Card>
    </div>
  )
}
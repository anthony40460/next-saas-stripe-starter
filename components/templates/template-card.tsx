"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Template } from "@/types"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Star } from "lucide-react"

interface TemplateCardProps {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <iframe
            src={template.previewUrl}
            className="w-full h-full border-0"
            style={{ transform: 'scale(0.7)', transformOrigin: 'top left' }}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-2.5 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{template.title}</h3>
          <Badge variant="secondary">{template.category.name}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4 fill-current" />
          <span>{template.rating.toFixed(1)}</span>
          <span>•</span>
          <span>{template.deploymentCount} deployments</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto flex justify-between items-center">
        <div className="font-semibold">{formatPrice(template.price)}</div>
        <Link href={`/templates/${template.id}`}>
          <Button variant="secondary">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
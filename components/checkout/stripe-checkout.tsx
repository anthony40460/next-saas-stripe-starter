"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { loadStripe } from "@stripe/stripe-js"
import { formatPrice } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  templateId: string
  amount: number
  redirectUrl: string
}

export function StripeCheckout({
  templateId,
  amount,
  redirectUrl,
}: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleCheckout() {
    setIsLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          redirectUrl,
        }),
      })

      const data = await response.json()

      // Rediriger vers la page de paiement Stripe
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) throw error

    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between py-4 border-y">
        <div className="text-lg font-medium">Total</div>
        <div className="text-2xl font-bold">{formatPrice(amount)}</div>
      </div>

      <Button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Checkout with Stripe
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        You will be redirected to Stripe to complete your purchase securely.
      </p>
    </div>
  )
}
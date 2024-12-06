import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object

      // Mettre à jour le statut de l'achat
      await db.purchasedTemplate.update({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          status: "COMPLETED",
          purchasedAt: new Date(),
        },
      })

      // Incrémenter le compteur de ventes du template
      await db.template.update({
        where: {
          id: session.metadata.templateId,
        },
        data: {
          purchases: {
            increment: 1,
          },
        },
      })

      // Transférer 50% au créateur
      if (session.metadata.creatorId) {
        const creator = await db.user.findUnique({
          where: { id: session.metadata.creatorId },
          select: { stripeAccountId: true },
        })

        if (creator?.stripeAccountId) {
          await stripe.transfers.create({
            amount: Math.round(session.amount_total * 0.5),
            currency: "usd",
            destination: creator.stripeAccountId,
            transfer_group: session.id,
          })
        }
      }

      break

    case "checkout.session.expired":
      // Marquer l'achat comme échoué
      await db.purchasedTemplate.update({
        where: {
          stripeSessionId: event.data.object.id,
        },
        data: {
          status: "FAILED",
        },
      })
      break
  }

  return NextResponse.json({ received: true })
}
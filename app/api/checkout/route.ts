import { auth } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { templateId, redirectUrl } = await req.json()

    // Récupérer les infos du template
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        author: true,
      },
    })

    if (!template) {
      return new Response("Template not found", { status: 404 })
    }

    // Créer une session Stripe
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: template.title,
              description: template.description,
            },
            unit_amount: Math.round(template.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${redirectUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/templates/${templateId}`,
      metadata: {
        templateId: template.id,
        buyerId: session.user.id,
        creatorId: template.author.id,
      },
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
    })
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return new Response("Failed to create checkout session", { status: 500 })
  }
}
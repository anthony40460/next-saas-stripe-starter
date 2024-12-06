import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { githubUrl } = await req.json()

    // Vérification du format de l'URL GitHub
    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/
    if (!githubUrlPattern.test(githubUrl)) {
      return new Response("Invalid GitHub URL format", { status: 400 })
    }

    // Integration avec Netlify pour le déploiement
    const netlifyResponse = await fetch(`${process.env.NETLIFY_API_URL}/sites`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        repo: {
          provider: 'github',
          repo_path: githubUrl.replace('https://github.com/', ''),
          repo_branch: 'main'
        },
        manual_deploy: true
      })
    })

    const siteData = await netlifyResponse.json()

    return NextResponse.json({
      previewUrl: siteData.deploy_url,
      siteId: siteData.id
    })
  } catch (error) {
    console.error('Preview generation failed:', error)
    return new Response("Failed to generate preview", { status: 500 })
  }
}
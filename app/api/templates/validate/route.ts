import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { githubUrl } = await req.json()
    const [owner, repo] = githubUrl
      .replace('https://github.com/', '')
      .split('/')

    // Vérification des fichiers requis
    const requiredFiles = ['package.json', 'README.md', '.env.example']
    const validationResults = await Promise.all(
      requiredFiles.map(async (file) => {
        try {
          await octokit.repos.getContent({
            owner,
            repo,
            path: file,
          })
          return {
            file,
            exists: true,
            message: `${file} found`
          }
        } catch {
          return {
            file,
            exists: false,
            message: `${file} is missing`
          }
        }
      })
    )

    // Vérification de la configuration
    const packageJson = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    })

    const content = Buffer.from(packageJson.data.content, 'base64').toString()
    const pkg = JSON.parse(content)

    // Validation des dépendances nécessaires
    const requiredDeps = ['react', 'next', 'tailwindcss']
    const missingDeps = requiredDeps.filter(
      dep => !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]
    )

    return NextResponse.json({
      results: [
        ...validationResults,
        {
          check: 'dependencies',
          passed: missingDeps.length === 0,
          message: missingDeps.length > 0
            ? `Missing required dependencies: ${missingDeps.join(', ')}`
            : 'All required dependencies are present'
        }
      ]
    })
  } catch (error) {
    console.error('Validation failed:', error)
    return new Response("Failed to validate template", { status: 500 })
  }
}
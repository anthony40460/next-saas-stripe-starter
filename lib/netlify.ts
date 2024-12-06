export async function createNetlifyDeployment(githubUrl: string) {
  try {
    const response = await fetch(`${process.env.NETLIFY_API_URL}/sites`, {
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

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to create Netlify deployment:', error)
    throw error
  }
}

export async function getDeploymentStatus(siteId: string) {
  try {
    const response = await fetch(
      `${process.env.NETLIFY_API_URL}/sites/${siteId}/deploys`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.statusText}`)
    }

    const deploys = await response.json()
    return deploys[0] // Latest deployment
  } catch (error) {
    console.error('Failed to get deployment status:', error)
    throw error
  }
}
import { NextResponse } from 'next/server'

const baseUrl = 'https://autopropelidos.com.br'

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /.*\\?*
Disallow: /search?
Disallow: /404
Disallow: /500

# Allow specific API endpoints
Allow: /api/sitemap
Allow: /api/robots
Allow: /api/rss

# Crawl delay
Crawl-delay: 1

# Specific rules for different crawlers
User-agent: Googlebot
Crawl-delay: 0
Allow: /

User-agent: Bingbot
Crawl-delay: 1
Allow: /

User-agent: Slurp
Crawl-delay: 2
Allow: /

User-agent: DuckDuckBot
Crawl-delay: 1
Allow: /

User-agent: Baiduspider
Crawl-delay: 3
Allow: /

User-agent: YandexBot
Crawl-delay: 2
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: SiteBot
Disallow: /

User-agent: LinkpadBot
Disallow: /

User-agent: ThinkChaos
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Host
Host: ${baseUrl}
`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
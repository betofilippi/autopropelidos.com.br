import { HeroSection } from "@/components/hero-section"
import FeaturedVideos from "@/components/sections/featured-videos"
import LatestNews from "@/components/sections/latest-news"
import ComplianceChecker from "@/components/sections/compliance-checker"
import Newsletter from "@/components/sections/newsletter"
import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

export default async function Home() {
  // Buscar conteúdo dinâmico
  const [latestNews, featuredVideos] = await Promise.all([
    getLatestNews(undefined, 12),
    getLatestVideos(undefined, 6)
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Latest News Section */}
      <LatestNews news={latestNews} />
      
      {/* Featured Videos Section */}
      <FeaturedVideos videos={featuredVideos} />
      
      {/* Compliance Checker */}
      <ComplianceChecker />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}
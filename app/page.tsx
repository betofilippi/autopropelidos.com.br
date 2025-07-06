import HeroSection from "@/components/sections/hero"
import Resolution996Summary from "@/components/sections/resolution-summary"
import VehicleCategories from "@/components/sections/vehicle-categories"
import LatestNews from "@/components/sections/latest-news"
import FeaturedVideos from "@/components/sections/featured-videos"
import ComplianceChecker from "@/components/sections/compliance-checker"
import SafetyTips from "@/components/sections/safety-tips"
import FAQ from "@/components/sections/faq"
import Newsletter from "@/components/sections/newsletter"
import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

export default async function Home() {
  // Buscar conteúdo dinâmico
  const [latestNews, featuredVideos] = await Promise.all([
    getLatestNews(undefined, 6),
    getLatestVideos(undefined, 4)
  ])

  return (
    <div className="min-h-screen">
      <HeroSection />
      <Resolution996Summary />
      <VehicleCategories />
      <LatestNews news={latestNews} />
      <FeaturedVideos videos={featuredVideos} />
      <ComplianceChecker />
      <SafetyTips />
      <FAQ />
      <Newsletter />
    </div>
  )
}
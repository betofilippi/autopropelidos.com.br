import HeroSection from "@/components/hero-section"
import FeaturedNews from "@/components/featured-news"
import NewsCategories from "@/components/news-categories"
import LegislationTimeline from "@/components/legislation-timeline"
import MarketStats from "@/components/market-stats"
import ExpertColumns from "@/components/expert-columns"
import QuickGuides from "@/components/quick-guides"
import FAQ from "@/components/faq"
import Newsletter from "@/components/newsletter"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <MarketStats />
      <FeaturedNews />
      <NewsCategories />
      <LegislationTimeline />
      <ExpertColumns />
      <QuickGuides />
      <FAQ />
      <Newsletter />
    </div>
  )
}

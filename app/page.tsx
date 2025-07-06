import BreakingNewsBar, { useBreakingNews } from "@/components/portal/breaking-news-bar"
import HeroNews, { useHeroNews } from "@/components/portal/hero-news"
import NewsGrid from "@/components/portal/news-grid"
import PortalSidebar, { useSidebarData } from "@/components/portal/portal-sidebar"
import FeaturedVideos from "@/components/sections/featured-videos"
import ComplianceChecker from "@/components/sections/compliance-checker"
import Newsletter from "@/components/sections/newsletter"
import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

export default async function Home() {
  // Buscar conteúdo dinâmico
  const [latestNews, featuredVideos] = await Promise.all([
    getLatestNews(undefined, 15), // Mais notícias para o portal
    getLatestVideos(undefined, 4)
  ])

  // Preparar dados para os componentes do portal
  const breakingNews = useBreakingNews()
  const { mainNews, sideNews } = useHeroNews(latestNews)
  const sidebarData = useSidebarData()

  return (
    <div className="min-h-screen">
      {/* Breaking News Bar */}
      <BreakingNewsBar news={breakingNews} />
      
      {/* Hero News Section */}
      {mainNews && (
        <HeroNews mainNews={mainNews} sideNews={sideNews} />
      )}
      
      {/* Main Content Grid */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main News Grid */}
            <div className="lg:col-span-3">
              <NewsGrid 
                news={latestNews.slice(5, 14)} // Exclui as notícias já mostradas no hero
                title="Últimas Notícias"
                subtitle="Fique por dentro das principais novidades sobre equipamentos autopropelidos"
                showViewAll={true}
                itemsPerRow={3}
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <PortalSidebar 
                trendingNews={sidebarData.trendingNews}
                quickLinks={sidebarData.quickLinks}
                newsletterStats={sidebarData.newsletterStats}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Videos Section */}
      <FeaturedVideos videos={featuredVideos} />
      
      {/* Compliance Checker - Mantido mas movido para baixo */}
      <ComplianceChecker />
      
      {/* Newsletter - Mantido no final */}
      <Newsletter />
    </div>
  )
}
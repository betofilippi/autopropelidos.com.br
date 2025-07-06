import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

// Seções principais adaptadas para CSS customizado
function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-12">
      <div className="container text-center">
        <h1 className="text-4xl font-bold mb-4">Portal Autopropelidos</h1>
        <p className="text-xl mb-8">
          Seu guia completo sobre a Resolução 996 do CONTRAN e equipamentos autopropelidos
        </p>
        <div className="flex justify-center gap-4 flex-col md:flex-row">
          <a href="/ferramentas/verificador-conformidade" className="btn btn-primary">
            Verificar Conformidade
          </a>
          <a href="/resolucao-996" className="btn btn-outline">
            Conhecer Resolução 996
          </a>
        </div>
      </div>
    </section>
  )
}

function Resolution996Summary() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Resolução 996/2023 do CONTRAN</h2>
          <p className="text-lg text-gray-600">
            Entenda a regulamentação que define os equipamentos autopropelidos no Brasil
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-2">Velocidade Máxima</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">32 km/h</div>
            <p className="text-gray-600">Limite de velocidade para equipamentos autopropelidos</p>
          </div>
          
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-2">Potência Máxima</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">1.000W</div>
            <p className="text-gray-600">Potência máxima do motor elétrico</p>
          </div>
          
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-2">Largura Máxima</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">70 cm</div>
            <p className="text-gray-600">Largura máxima do equipamento</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function VehicleCategories() {
  const categories = [
    {
      name: "Patinetes Elétricos",
      description: "Equipamentos de duas rodas com plataforma",
      count: "45+ modelos"
    },
    {
      name: "Bicicletas Elétricas", 
      description: "Bicicletas com motor elétrico auxiliar",
      count: "120+ modelos"
    },
    {
      name: "Ciclomotores",
      description: "Veículos que excedem os limites dos autopropelidos",
      count: "30+ modelos"
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Categorias de Equipamentos</h2>
          <p className="text-lg text-gray-600">
            Conheça os diferentes tipos de equipamentos e suas classificações
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="card">
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="text-sm font-medium text-blue-600">{category.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolsShowcase() {
  const tools = [
    {
      name: "Verificador de Conformidade",
      description: "Verifique se seu equipamento está conforme a Resolução 996",
      href: "/ferramentas/verificador-conformidade"
    },
    {
      name: "Calculadora de Custos",
      description: "Calcule os custos de uso do seu equipamento",
      href: "/ferramentas/calculadora-custos"
    },
    {
      name: "Buscador de Regulamentações",
      description: "Encontre regulamentações específicas da sua cidade",
      href: "/ferramentas/buscador-regulamentacoes"
    },
    {
      name: "Planejador de Rotas",
      description: "Planeje rotas seguras para seu equipamento",
      href: "/ferramentas/planejador-rotas"
    }
  ]

  return (
    <section className="py-12">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Ferramentas Úteis</h2>
          <p className="text-lg text-gray-600">
            Utilize nossas ferramentas para facilitar o uso do seu equipamento
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <a href={tool.href} className="btn btn-primary w-full">
                Acessar
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NewsPreview({ news }: { news: any[] }) {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Últimas Notícias</h2>
            <p className="text-gray-600">Fique por dentro das novidades sobre equipamentos autopropelidos</p>
          </div>
          <a href="/noticias" className="btn btn-outline">Ver Todas</a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 3).map((article, index) => (
            <article key={index} className="card">
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.description}</p>
              <div className="text-sm text-gray-500">{article.source}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function VideosPreview({ videos }: { videos: any[] }) {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Vídeos em Destaque</h2>
            <p className="text-gray-600">Assista aos melhores vídeos sobre equipamentos autopropelidos</p>
          </div>
          <a href="/videos" className="btn btn-outline">Ver Todos</a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.slice(0, 4).map((video, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <div className="text-sm text-gray-500">{video.channel_name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
      <ToolsShowcase />
      <NewsPreview news={latestNews} />
      <VideosPreview videos={featuredVideos} />
    </div>
  )
}
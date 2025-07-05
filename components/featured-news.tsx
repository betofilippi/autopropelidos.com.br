import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Flame } from "lucide-react"
import Link from "next/link"

const featuredNews = [
  {
    id: "1",
    title: "Resolução 996: Guia Completo das Novas Regras para Autopropelidos",
    excerpt:
      "Análise detalhada de todas as mudanças na regulamentação que afetam usuários de bicicletas elétricas, patinetes e outros equipamentos",
    image: "https://via.placeholder.com/600x400/e5e7eb/9ca3af?text=News+Image",
    category: "Legislação",
    date: "2024-02-25",
    readTime: "12 min",
    featured: true,
    trending: true,
  },
  {
    id: "2",
    title: "E-bikes Nacionais vs Importadas: Comparativo Completo 2024",
    excerpt: "Análise técnica e financeira dos principais modelos disponíveis no mercado brasileiro",
    image: "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=News+Image",
    category: "Comparativos",
    date: "2024-02-24",
    readTime: "8 min",
  },
  {
    id: "3",
    title: "Segurança em Primeiro Lugar: Equipamentos Obrigatórios",
    excerpt: "Lista atualizada dos EPIs necessários para circular legalmente com equipamentos autopropelidos",
    image: "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=News+Image",
    category: "Segurança",
    date: "2024-02-23",
    readTime: "6 min",
  },
  {
    id: "4",
    title: "Baterias de Lítio: Tecnologia e Cuidados Essenciais",
    excerpt: "Como maximizar a vida útil da bateria do seu equipamento autopropelido",
    image: "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=News+Image",
    category: "Tecnologia",
    date: "2024-02-22",
    readTime: "10 min",
  },
]

export function FeaturedNews() {
  const mainNews = featuredNews[0]
  const sideNews = featuredNews.slice(1)

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold">Destaques</h2>
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <Link href="/noticias" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
          Ver todas as notícias
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Notícia Principal */}
        <div className="lg:col-span-2">
          <Link href={`/noticias/${mainNews.id}`}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                <img
                  src={mainNews.image || "https://via.placeholder.com/600x400/e5e7eb/9ca3af?text=News+Image"}
                  alt={mainNews.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {mainNews.trending && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-600 hover:bg-red-700 text-white">
                      <Flame className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-0 p-8 text-white">
                  <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">{mainNews.category}</Badge>
                  <h3 className="text-3xl font-bold mb-4 leading-tight">{mainNews.title}</h3>
                  <p className="text-gray-200 mb-6 text-lg line-clamp-2">{mainNews.excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(mainNews.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {mainNews.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Notícias Laterais */}
        <div className="space-y-6">
          {sideNews.map((news) => (
            <Link key={news.id} href={`/noticias/${news.id}`}>
              <Card className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-24 flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                      <img
                        src={news.image || "https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=News+Image"}
                        alt={news.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {news.category}
                      </Badge>
                      <h4 className="font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(news.date).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {news.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedNews

"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

type NewsItem = {
  id: string
  title: string
  excerpt: string
  date: string
  image: string
  source: string
  url: string
  category: string
  featured?: boolean
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Nova Regulamentação do CONTRAN para Equipamentos Autopropelidos",
    excerpt:
      "Resolução 996 atualiza definições e estabelece novos critérios para uso de bicicletas elétricas e equipamentos autopropelidos.",
    date: "2024-02-22",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0926_Branco-Photoroom-OjT3fZXgD8t6eitNTjXuM51UeTH5YG.png",
    source: "Ministério dos Transportes",
    url: "/resolucao-996",
    category: "Legislação",
    featured: true,
  },
  {
    id: "2",
    title: "Bicicletas Elétricas: Como Escolher o Modelo Ideal",
    excerpt:
      "Guia completo com dicas e recomendações para escolher a bicicleta elétrica que melhor atende suas necessidades.",
    date: "2024-02-21",
    image: "https://images.unsplash.com/photo-1696582641485-5d2c8c92c0c3",
    source: "Blog Autopropelidos",
    url: "/guia-bikes",
    category: "Guias",
  },
  {
    id: "3",
    title: "Patinetes Elétricos: Novas Regras de Circulação",
    excerpt:
      "Confira as principais mudanças nas regras de circulação para patinetes elétricos nas cidades brasileiras.",
    date: "2024-02-20",
    image: "https://images.unsplash.com/photo-1698757864746-2a1cf8b37e30",
    source: "CONTRAN",
    url: "/regras-patinetes",
    category: "Legislação",
  },
  {
    id: "4",
    title: "Monociclos Elétricos Ganham Popularidade",
    excerpt: "Crescimento expressivo nas vendas de monociclos elétricos mostra nova tendência na mobilidade urbana.",
    date: "2024-02-19",
    image: "https://images.unsplash.com/photo-1697025358346-3b3ef3fdc461",
    source: "Blog Autopropelidos",
    url: "/monociclos",
    category: "Tendências",
    featured: true,
  },
  {
    id: "5",
    title: "Segurança em Primeiro Lugar: Equipamentos Obrigatórios",
    excerpt: "Lista completa dos equipamentos de segurança necessários para circular com veículos autopropelidos.",
    date: "2024-02-18",
    image: "https://images.unsplash.com/photo-1697025358346-3b3ef3fdc461",
    source: "Blog Autopropelidos",
    url: "/seguranca",
    category: "Segurança",
  },
  {
    id: "6",
    title: "Manutenção de Baterias: Guia Essencial",
    excerpt:
      "Aprenda como prolongar a vida útil da bateria do seu equipamento autopropelido com dicas de especialistas.",
    date: "2024-02-17",
    image: "https://images.unsplash.com/photo-1696582641485-5d2c8c92c0c3",
    source: "Blog Autopropelidos",
    url: "/baterias",
    category: "Manutenção",
  },
]

export function NewsGrid() {
  // Separar notícias em destaque
  const featuredNews = newsItems.filter((item) => item.featured)
  const regularNews = newsItems.filter((item) => !item.featured)

  return (
    <div className="space-y-8">
      {/* Notícias em Destaque */}
      <div className="grid gap-6 md:grid-cols-2">
        {featuredNews.map((item) => (
          <Link key={item.id} href={item.url}>
            <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-72 w-full">
                <img src={item.image || "https://placehold.co/400x300/e5e7eb/9ca3af?text=News+Image"} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <Badge className="mb-2 bg-primary hover:bg-primary">{item.category}</Badge>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{item.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Grade Principal de Notícias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {regularNews.map((item) => (
          <Link key={item.id} href={item.url}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <img src={item.image || "https://placehold.co/400x300/e5e7eb/9ca3af?text=News+Image"} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{item.category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">{item.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.source}</span>
                <ArrowRight className="h-4 w-4" />
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

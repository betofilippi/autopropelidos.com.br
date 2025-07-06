import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categoryNews = {
  Legislação: [
    {
      id: "leg1",
      title: "Velocidade Máxima de 32km/h: Entenda a Regra",
      excerpt: "Nova regulamentação estabelece limite claro para equipamentos autopropelidos",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-22",
    },
    {
      id: "leg2",
      title: "Documentação Obrigatória: O Que Você Precisa Saber",
      excerpt: "Lista completa dos documentos necessários para circular legalmente",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-21",
    },
  ],
  Segurança: [
    {
      id: "seg1",
      title: "Equipamentos de Proteção Individual Obrigatórios",
      excerpt: "Capacete, joelheiras e outros itens essenciais para sua segurança",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-20",
    },
    {
      id: "seg2",
      title: "Dicas de Condução Defensiva para Autopropelidos",
      excerpt: "Como se proteger no trânsito urbano com seu equipamento",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-19",
    },
  ],
  Tecnologia: [
    {
      id: "tech1",
      title: "Baterias de Lítio: Revolução na Autonomia",
      excerpt: "Nova geração de baterias promete até 100km de autonomia",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-18",
    },
    {
      id: "tech2",
      title: "Sistemas de Frenagem Regenerativa",
      excerpt: "Como a tecnologia está aumentando a eficiência dos equipamentos",
      image: "/placeholder.svg?height=300&width=400",
      date: "2024-02-17",
    },
  ],
}

export function NewsCategories() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Por Categoria</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {Object.entries(categoryNews).map(([category, news]) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{category}</h3>
                <Link href={`/categoria/${category.toLowerCase()}`} className="text-blue-600 hover:text-blue-700">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {news.map((item) => (
                  <Link key={item.id} href={`/noticias/${item.id}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative h-48 w-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{category}</Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <h4 className="font-semibold mb-2 line-clamp-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewsCategories

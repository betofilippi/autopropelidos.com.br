import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

const experts = [
  {
    id: "1",
    name: "Dr. Carlos Mendes",
    title: "Especialista em Mobilidade Urbana",
    avatar: "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Expert",
    article: {
      title: "O Futuro da Mobilidade Urbana no Brasil",
      excerpt:
        "Análise sobre como os equipamentos autopropelidos estão transformando o transporte nas grandes cidades brasileiras",
      date: "2024-02-20",
      readTime: "7 min",
    },
  },
  {
    id: "2",
    name: "Eng. Ana Silva",
    title: "Engenheira de Transportes",
    avatar: "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Expert",
    article: {
      title: "Infraestrutura Necessária para Autopropelidos",
      excerpt: "Como as cidades precisam se adaptar para receber a nova geração de veículos elétricos leves",
      date: "2024-02-18",
      readTime: "9 min",
    },
  },
  {
    id: "3",
    name: "Adv. Roberto Lima",
    title: "Advogado Especialista em Trânsito",
    avatar: "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Expert",
    article: {
      title: "Aspectos Jurídicos da Resolução 996",
      excerpt: "Interpretação legal das novas regras e seus impactos na responsabilidade civil dos usuários",
      date: "2024-02-16",
      readTime: "11 min",
    },
  },
]

export function ExpertColumns() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Colunistas Especialistas</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Análises aprofundadas de profissionais reconhecidos no setor de mobilidade urbana e legislação de trânsito
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {experts.map((expert) => (
          <Link key={expert.id} href={`/colunistas/${expert.id}`}>
            <Card className="h-full hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="relative w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full">
                  <img
                    src={expert.avatar || "https://via.placeholder.com/80x80/e5e7eb/9ca3af?text=Expert"}
                    alt={expert.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-blue-100 group-hover:border-blue-200 transition-colors"
                  />
                </div>
                <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{expert.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {expert.title}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {expert.article.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">{expert.article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(expert.article.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{expert.article.readTime}</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ExpertColumns

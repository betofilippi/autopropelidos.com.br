import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Shield, Wrench, DollarSign, ArrowRight } from "lucide-react"
import Link from "next/link"

const guides = [
  {
    icon: BookOpen,
    title: "Guia do Iniciante",
    description: "Tudo que você precisa saber para começar",
    items: ["Escolhendo seu primeiro equipamento", "Documentação necessária", "Primeiros passos"],
    href: "/guias/iniciante",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Proteja-se no trânsito urbano",
    items: ["Equipamentos obrigatórios", "Condução defensiva", "Sinalizações importantes"],
    href: "/guias/seguranca",
  },
  {
    icon: Wrench,
    title: "Manutenção",
    description: "Mantenha seu equipamento em dia",
    items: ["Cuidados com a bateria", "Limpeza e lubrificação", "Quando procurar ajuda"],
    href: "/guias/manutencao",
  },
  {
    icon: DollarSign,
    title: "Financeiro",
    description: "Custos e investimentos",
    items: ["Custo-benefício", "Seguros disponíveis", "Financiamento"],
    href: "/guias/financeiro",
  },
]

export function QuickGuides() {
  return (
    <section className="bg-blue-50 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Guias Rápidos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Informações essenciais organizadas para facilitar sua jornada com equipamentos autopropelidos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <guide.icon className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{guide.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {guide.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={guide.href}>
                    Ler Guia
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default QuickGuides

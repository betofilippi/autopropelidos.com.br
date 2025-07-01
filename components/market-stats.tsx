import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Zap, Shield } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "200%",
    label: "Crescimento em 2024",
    description: "Aumento nas vendas de e-bikes",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
  {
    icon: Users,
    value: "2.5M",
    label: "Usuários ativos",
    description: "Pessoas usando equipamentos autopropelidos",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: Zap,
    value: "85%",
    label: "Redução de emissões",
    description: "Comparado ao transporte tradicional",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    icon: Shield,
    value: "32km/h",
    label: "Limite de velocidade",
    description: "Estabelecido pela Resolução 996",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
  },
]

export function MarketStats() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">O Setor em Números</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dados atualizados sobre o crescimento e impacto dos equipamentos autopropelidos no Brasil
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="font-semibold text-lg mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketStats

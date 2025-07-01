import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, AlertTriangle, Eye, Heart } from "lucide-react"

const safetyTips = [
  {
    id: 1,
    icon: <Shield className="h-6 w-6" />,
    title: "Equipamentos de Proteção",
    category: "Obrigatório",
    color: "red",
    tips: [
      "Capacete sempre, mesmo quando não obrigatório",
      "Roupas claras e refletivas para maior visibilidade",
      "Joelheiras e cotoveleiras para patinetes",
      "Luvas para melhor aderência"
    ]
  },
  {
    id: 2,
    icon: <Eye className="h-6 w-6" />,
    title: "Visibilidade no Trânsito",
    category: "Essencial",
    color: "orange",
    tips: [
      "Luz dianteira branca e traseira vermelha",
      "Sinalização lateral amarela ou vermelha",
      "Evitar pontos cegos de carros e caminhões",
      "Usar sinais com as mãos para conversões"
    ]
  },
  {
    id: 3,
    icon: <Zap className="h-6 w-6" />,
    title: "Manutenção Preventiva",
    category: "Importante",
    color: "blue",
    tips: [
      "Verificar pneus e freios semanalmente",
      "Manter bateria carregada e protegida",
      "Lubrificar correntes e componentes móveis",
      "Revisão técnica a cada 6 meses"
    ]
  },
  {
    id: 4,
    icon: <Heart className="h-6 w-6" />,
    title: "Condução Defensiva",
    category: "Comportamento",
    color: "green",
    tips: [
      "Manter distância segura de outros veículos",
      "Reduzir velocidade em cruzamentos",
      "Respeitar semáforos e placas de trânsito",
      "Evitar uso de celular durante a condução"
    ]
  },
  {
    id: 5,
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "Condições Adversas",
    category: "Atenção",
    color: "yellow",
    tips: [
      "Evitar circular na chuva quando possível",
      "Reduzir velocidade em pisos molhados",
      "Aumentar distância de frenagem",
      "Usar roupas impermeáveis adequadas"
    ]
  },
  {
    id: 6,
    icon: <Shield className="h-6 w-6" />,
    title: "Segurança da Bateria",
    category: "Técnico",
    color: "purple",
    tips: [
      "Usar apenas carregadores originais",
      "Não deixar carregando por mais de 8 horas",
      "Evitar exposição a altas temperaturas",
      "Armazenar em local seco e ventilado"
    ]
  }
]

export default function SafetyTips() {
  const getCategoryColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'purple': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600 bg-red-100 dark:bg-red-900'
      case 'orange': return 'text-orange-600 bg-orange-100 dark:bg-orange-900'
      case 'blue': return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
      case 'green': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'yellow': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'purple': return 'text-purple-600 bg-purple-100 dark:bg-purple-900'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900'
    }
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Dicas de Segurança
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Circule com responsabilidade e proteja sua vida e a dos outros
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {safetyTips.map((tip) => (
            <Card key={tip.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`rounded-full p-3 ${getIconColor(tip.color)}`}>
                    {tip.icon}
                  </div>
                  <Badge className={getCategoryColor(tip.color)}>
                    {tip.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tip.tips.map((tipText, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-gray-400 rounded-full mt-2" />
                      <span className="text-gray-700 dark:text-gray-300">{tipText}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 mx-auto max-w-2xl">
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" />
                Lembre-se: Segurança em Primeiro Lugar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 dark:text-red-300">
                A Resolução 996 estabelece regras importantes, mas a segurança vai além da conformidade legal. 
                Use sempre equipamentos de proteção, respeite as regras de trânsito e mantenha seu equipamento 
                em bom estado. Sua vida vale mais que qualquer pressa.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
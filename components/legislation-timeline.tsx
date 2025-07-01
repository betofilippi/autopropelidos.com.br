import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

const timelineItems = [
  {
    date: "Julho 2023",
    title: "Resolução 996/2023 - CONTRAN",
    description: "Estabelece definições e critérios para equipamentos autopropelidos",
    status: "active",
    type: "Regulamentação",
    details: ["Velocidade máxima: 32 km/h", "Não necessita habilitação", "Equipamentos de segurança obrigatórios"],
  },
  {
    date: "Setembro 2023",
    title: "Portaria DENATRAN 234/2023",
    description: "Padronização de equipamentos de segurança para autopropelidos",
    status: "active",
    type: "Norma Técnica",
    details: ["Especificações de capacetes", "Refletores obrigatórios", "Sistemas de iluminação"],
  },
  {
    date: "Dezembro 2023",
    title: "Projeto de Lei 4567/2023",
    description: "Regulamentação de seguros para equipamentos elétricos",
    status: "pending",
    type: "Projeto de Lei",
    details: ["Seguro obrigatório em discussão", "Cobertura para terceiros", "Valores em definição"],
  },
  {
    date: "Março 2024",
    title: "Consulta Pública ANTT",
    description: "Uso de autopropelidos em transporte público complementar",
    status: "consultation",
    type: "Consulta Pública",
    details: ["Integração com transporte público", "Estações de recarga", "Tarifação especial"],
  },
]

export function LegislationTimeline() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Timeline Legislativo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acompanhe a evolução das leis e regulamentações que impactam o setor de equipamentos autopropelidos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Linha do tempo */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-emerald-500" />

            <div className="space-y-8">
              {timelineItems.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Ícone da timeline */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        item.status === "active"
                          ? "bg-green-100 dark:bg-green-900"
                          : item.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      {item.status === "active" && <CheckCircle className="h-6 w-6 text-green-600" />}
                      {item.status === "pending" && <Clock className="h-6 w-6 text-yellow-600" />}
                      {item.status === "consultation" && <AlertTriangle className="h-6 w-6 text-blue-600" />}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <Card className="flex-1 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-muted-foreground font-medium">{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge
                            className={
                              item.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : item.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }
                          >
                            {item.status === "active"
                              ? "Em vigor"
                              : item.status === "pending"
                                ? "Em tramitação"
                                : "Consulta pública"}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <ul className="space-y-1 mb-4">
                        {item.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/legislacao">
              Ver Histórico Completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default LegislationTimeline

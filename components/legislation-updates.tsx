import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

const legislationUpdates = [
  {
    title: "Resolução 996/2023 - CONTRAN",
    status: "Em vigor",
    date: "Julho 2023",
    description: "Nova regulamentação para equipamentos autopropelidos",
    type: "active",
  },
  {
    title: "Projeto de Lei 3267/2023",
    status: "Em tramitação",
    date: "Setembro 2023",
    description: "Regulamentação de seguros para equipamentos elétricos",
    type: "pending",
  },
  {
    title: "Portaria DENATRAN 1234/2023",
    status: "Consulta pública",
    date: "Outubro 2023",
    description: "Padronização de equipamentos de segurança",
    type: "consultation",
  },
]

export function LegislationUpdates() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Atualizações Legislativas</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Acompanhe as principais mudanças na legislação que afetam o uso de equipamentos autopropelidos
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {legislationUpdates.map((update, index) => (
          <Card key={index} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="flex items-center gap-2">
                  {update.type === "active" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {update.type === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                  {update.type === "consultation" && <AlertCircle className="h-4 w-4 text-blue-600" />}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      update.type === "active"
                        ? "bg-green-100 text-green-700"
                        : update.type === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {update.status}
                  </span>
                </div>
              </div>
              <CardTitle className="text-lg">{update.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{update.description}</p>
              <p className="text-sm text-muted-foreground">{update.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild>
          <Link href="/legislacao">Ver Todas as Atualizações</Link>
        </Button>
      </div>
    </section>
  )
}

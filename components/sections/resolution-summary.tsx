import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Calendar } from "lucide-react"

export default function Resolution996Summary() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Resolução 996/2023 - O que você precisa saber
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Publicada em 15 de junho de 2023, a resolução define regras claras para 
            equipamentos de mobilidade individual autopropelidos
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Bicicleta Elétrica */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Bicicleta Elétrica</CardTitle>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Sem Registro
                </Badge>
              </div>
              <CardDescription>Assistência ao pedalar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Motor até 1000W</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Velocidade máxima 32 km/h</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Funciona apenas com pedal</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Sem acelerador manual</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Não precisa: CNH, emplacamento ou registro
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Autopropelido */}
          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Autopropelido</CardTitle>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Sem Registro
                </Badge>
              </div>
              <CardDescription>Patinetes e similares</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Motor até 1000W</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Velocidade máxima 32 km/h</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Largura máxima 70cm</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Entre-eixos até 130cm</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Circula em: calçadas (6km/h), ciclovias e vias até 40km/h
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ciclomotor */}
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Ciclomotor</CardTitle>
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  Registro Obrigatório
                </Badge>
              </div>
              <CardDescription>Scooters e motos pequenas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Motor até 4000W</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Velocidade máxima 50 km/h</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">CNH categoria A ou ACC</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Prazo: até 31/12/2025</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Obrigatório: placa, registro e habilitação
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 mx-auto max-w-2xl">
          <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                Atenção aos Prazos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Proprietários de ciclomotores têm até <strong>31 de dezembro de 2025</strong> para 
                regularizar seus veículos. Após essa data, circular sem registro resultará em multa 
                e apreensão do veículo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
import { Button } from "@/components/ui/button"
import { AlertCircle, BookOpen, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      <div className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Entenda a <span className="text-blue-600 dark:text-blue-400">Resolução 996</span> do CONTRAN
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
              O guia definitivo sobre autopropelidos no Brasil: patinetes elétricos, 
              bicicletas elétricas e ciclomotores. Saiba o que mudou, como se adequar 
              e circule com segurança.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/resolucao-996">
              <Button size="lg" className="gap-2">
                <BookOpen className="h-5 w-5" />
                Ler a Resolução Completa
              </Button>
            </Link>
            <Link href="/verificador">
              <Button size="lg" variant="outline" className="gap-2">
                <Shield className="h-5 w-5" />
                Verificar Conformidade
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Equipamentos Elétricos
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Classificação e regras para cada tipo de veículo
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Segurança no Trânsito
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Equipamentos obrigatórios e boas práticas
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Prazos e Multas
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Adequação até 31/12/2025 para ciclomotores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-400 opacity-10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-green-400 opacity-10 blur-3xl" />
    </section>
  )
}
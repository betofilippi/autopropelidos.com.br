import { Button } from "@/components/ui/button"
import { ArrowRight, Play, TrendingUp } from "lucide-react"
import { HeroImage } from "@/components/ui/optimized-image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section 
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden"
      aria-labelledby="hero-title"
      role="banner"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-slate-800/50" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div 
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-emerald-500/20"
                  role="status"
                  aria-label="Estatística de crescimento do mercado"
                >
                  <TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">Mercado em crescimento de 200%</span>
                </div>
              </div>
              <h1 
                id="hero-title"
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                Mobilidade
                <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  do Futuro
                </span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Seu portal completo sobre equipamentos autopropelidos, legislação atualizada e as últimas inovações do
                setor de mobilidade urbana
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="Ações principais">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900" 
                asChild
              >
                <Link href="/resolucao-996" aria-describedby="cta-description">
                  Entenda a Resolução 996
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Assistir vídeo explicativo sobre mobilidade urbana"
              >
                <Play className="mr-2 h-5 w-5" aria-hidden="true" />
                Vídeo Explicativo
              </Button>
              <span id="cta-description" className="sr-only">
                Saiba mais sobre a regulamentação de equipamentos autopropelidos
              </span>
            </div>
            <div 
              className="flex items-center gap-8 pt-4"
              role="group"
              aria-label="Especificações técnicas"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400" aria-label="Velocidade máxima permitida">32km/h</div>
                <div className="text-sm text-slate-400">Velocidade máxima</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400" aria-label="Ano da nova regulamentação">2023</div>
                <div className="text-sm text-slate-400">Nova regulamentação</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400" aria-label="Equipamentos totalmente elétricos">100%</div>
                <div className="text-sm text-slate-400">Elétrico</div>
              </div>
            </div>
          </div>
          <div className="relative" role="img" aria-labelledby="hero-image-description">
            <div className="relative h-[600px] w-full">
              <HeroImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0926_Branco-Photoroom-OjT3fZXgD8t6eitNTjXuM51UeTH5YG.png"
                alt="Equipamento autopropelido moderno - patinete elétrico branco em destaque representando a nova mobilidade urbana regulamentada pela Resolução 996 do CONTRAN"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 blur-3xl -z-10" />
            </div>
            <p id="hero-image-description" className="sr-only">
              Imagem em destaque mostrando um moderno equipamento autopropelido que representa a nova era da mobilidade urbana sustentável, regulamentada pela Resolução 996 do CONTRAN
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

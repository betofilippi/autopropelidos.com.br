import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  HelpCircle, 
  Search, 
  Book, 
  FileText, 
  Calculator, 
  Phone, 
  Mail, 
  MessageSquare,
  ExternalLink,
  Download,
  PlayCircle
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Central de Ajuda - Portal Autopropelidos',
  description: 'Central de ajuda do Portal Autopropelidos. Encontre respostas para suas dúvidas sobre equipamentos autopropelidos e a Resolução 996.',
  keywords: ['ajuda', 'suporte', 'dúvidas', 'tutorial', 'como usar'],
}

export default function AjudaPage() {
  const quickHelp = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Como buscar informações",
      description: "Use nossa busca avançada para encontrar regulamentações específicas",
      link: "/busca"
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Usar calculadoras",
      description: "Aprenda a utilizar nossas ferramentas de cálculo",
      link: "/ferramentas"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Entender a Resolução 996",
      description: "Guia completo sobre a regulamentação do CONTRAN",
      link: "/resolucao-996"
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: "Acessar biblioteca",
      description: "Como navegar pelos documentos e regulamentações",
      link: "/biblioteca"
    }
  ]

  const frequentQuestions = [
    {
      question: "O que é a Resolução 996 do CONTRAN?",
      answer: "É a regulamentação que estabelece requisitos de segurança para equipamentos de mobilidade urbana autopropelidos.",
      category: "Regulamentação"
    },
    {
      question: "Quais equipamentos são regulamentados?",
      answer: "Patinetes elétricos, bicicletas elétricas, ciclomotores e similares com motor elétrico.",
      category: "Equipamentos"
    },
    {
      question: "Preciso de habilitação para usar patinete elétrico?",
      answer: "Não é necessária habilitação, mas há requisitos de idade mínima e uso de capacete.",
      category: "Documentação"
    },
    {
      question: "Como posso denunciar irregularidades?",
      answer: "Entre em contato com os órgãos de trânsito locais ou use nossos canais de comunicação.",
      category: "Denúncias"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Central de Ajuda
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Encontre respostas para suas dúvidas sobre equipamentos autopropelidos 
              e a Resolução 996 do CONTRAN
            </p>
            
            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Digite sua dúvida aqui..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Ajuda Rápida
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickHelp.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={item.link}>
                      Ver Guia
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Frequent Questions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            
            <div className="space-y-6">
              {frequentQuestions.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="outline" className="mt-1">
                        {faq.category}
                      </Badge>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/faq">
                  Ver Todas as Perguntas
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recursos Úteis
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Guides */}
            <Card>
              <CardHeader>
                <Book className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Guias e Tutoriais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Guias passo a passo para usar todas as funcionalidades do portal.
                </p>
                <div className="space-y-3">
                  <Link href="/biblioteca" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Como usar a biblioteca</span>
                    </div>
                  </Link>
                  <Link href="/ferramentas" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Ferramentas disponíveis</span>
                    </div>
                  </Link>
                  <Link href="/busca" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">Como fazer buscas</span>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Downloads */}
            <Card>
              <CardHeader>
                <Download className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Documentos e materiais para download gratuito.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Resolução 996 (PDF)</span>
                    </div>
                    <p className="text-xs text-gray-500">Texto completo da regulamentação</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Checklist de Segurança</span>
                    </div>
                    <p className="text-xs text-gray-500">Lista de verificação para equipamentos</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Guia de Conformidade</span>
                    </div>
                    <p className="text-xs text-gray-500">Manual de adequação à regulamentação</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card>
              <CardHeader>
                <PlayCircle className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Vídeos Tutoriais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Aprenda visualmente com nossos vídeos explicativos.
                </p>
                <div className="space-y-3">
                  <Link href="/videos" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PlayCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Introdução à Resolução 996</span>
                    </div>
                    <p className="text-xs text-gray-500">Entenda os principais pontos da regulamentação</p>
                  </Link>
                  <Link href="/videos" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PlayCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Como usar as ferramentas</span>
                    </div>
                    <p className="text-xs text-gray-500">Tutorial das calculadoras e verificadores</p>
                  </Link>
                  <Link href="/videos" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <PlayCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Segurança no trânsito</span>
                    </div>
                    <p className="text-xs text-gray-500">Dicas para circular com segurança</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ainda Precisa de Ajuda?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Nossa equipe está pronta para ajudar você
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4">ajuda@autopropelidos.com.br</p>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    Enviar Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <CardTitle>WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4">(11) 99999-9999</p>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    Chamar no WhatsApp
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader className="text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-blue-300" />
                  <CardTitle>Telefone</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="mb-4">(11) 3000-0000</p>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    Ligar Agora
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link href="/contato" className="flex items-center gap-2">
                  Central de Contato Completa
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Award, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: 'Sobre Nós - Portal Autopropelidos',
  description: 'Conheça o Portal Autopropelidos, sua fonte confiável de informações sobre equipamentos de mobilidade urbana e a Resolução 996 do CONTRAN.',
  keywords: ['sobre', 'portal autopropelidos', 'equipe', 'missão', 'visão'],
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre o Portal Autopropelidos
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Sua fonte confiável de informações sobre equipamentos de mobilidade urbana 
              e a Resolução 996 do CONTRAN
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Nossa Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fornecer informações precisas e atualizadas sobre regulamentações de equipamentos autopropelidos no Brasil.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Nossa Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Especialistas em mobilidade urbana, direito de trânsito e tecnologia trabalhando para você.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Nossa Qualidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Informações verificadas, fontes oficiais e conteúdo atualizado diariamente por nossos especialistas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Nossa Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ser a principal referência em informações sobre mobilidade urbana sustentável no Brasil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Quem Somos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">
                  Portal Especializado em Mobilidade Urbana
                </h3>
                <p className="text-gray-600 mb-6">
                  O Portal Autopropelidos nasceu da necessidade de centralizar informações confiáveis 
                  sobre a Resolução 996 do CONTRAN e regulamentações relacionadas a equipamentos de 
                  mobilidade urbana no Brasil.
                </p>
                <p className="text-gray-600 mb-6">
                  Nosso objetivo é simplificar o acesso à informação para usuários, fabricantes, 
                  revendedores e órgãos públicos, contribuindo para um trânsito mais seguro e 
                  uma mobilidade urbana mais sustentável.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge>Confiável</Badge>
                  <Badge>Atualizado</Badge>
                  <Badge>Especializado</Badge>
                  <Badge>Gratuito</Badge>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h4 className="text-xl font-bold mb-4">O que oferecemos:</h4>
                <ul className="space-y-3 text-gray-600">
                  <li>• Notícias atualizadas sobre regulamentações</li>
                  <li>• Ferramentas práticas para usuários</li>
                  <li>• Biblioteca de documentos oficiais</li>
                  <li>• Vídeos educativos e tutoriais</li>
                  <li>• FAQ com dúvidas frequentes</li>
                  <li>• Glossário técnico especializado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">
              Nossos Números
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">50k+</div>
                <div className="text-blue-100">Usuários Mensais</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">500+</div>
                <div className="text-blue-100">Artigos Publicados</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">100+</div>
                <div className="text-blue-100">Documentos Oficiais</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-300 mb-2">24h</div>
                <div className="text-blue-100">Atualização Diária</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
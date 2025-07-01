import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Search, CheckCircle, FileText, Map, AlertTriangle } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ferramentas e Recursos | Portal Autopropelidos',
  description: 'Acesse ferramentas úteis para verificar conformidade, calcular custos e encontrar informações sobre equipamentos autopropelidos.',
  keywords: 'ferramentas, calculadora, verificador conformidade, patinete elétrico, bicicleta elétrica, CONTRAN 996'
}

const tools = [
  {
    id: 'compliance-checker',
    title: 'Verificador de Conformidade',
    description: 'Verifique se seu equipamento está em conformidade com a Resolução 996 do CONTRAN',
    icon: <CheckCircle className="h-8 w-8" />,
    color: 'bg-green-100 text-green-600 border-green-200',
    href: '/ferramentas/verificador-conformidade',
    features: [
      'Análise baseada na Resolução 996',
      'Resultado imediato',
      'Recomendações personalizadas',
      'Documentação necessária'
    ]
  },
  {
    id: 'cost-calculator',
    title: 'Calculadora de Custos',
    description: 'Calcule os custos de aquisição, manutenção e operação do seu equipamento',
    icon: <Calculator className="h-8 w-8" />,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    href: '/ferramentas/calculadora-custos',
    features: [
      'Custo total de propriedade',
      'Comparação entre modelos',
      'Economia vs transporte público',
      'Tempo de retorno do investimento'
    ]
  },
  {
    id: 'regulation-finder',
    title: 'Buscador de Regulamentações',
    description: 'Encontre as regulamentações específicas da sua cidade ou estado',
    icon: <Search className="h-8 w-8" />,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    href: '/ferramentas/buscador-regulamentacoes',
    features: [
      'Base de dados atualizada',
      'Busca por localização',
      'Alertas de mudanças',
      'Download de documentos'
    ]
  },
  {
    id: 'documentation-guide',
    title: 'Guia de Documentação',
    description: 'Passo a passo para regularizar seu equipamento autopropelido',
    icon: <FileText className="h-8 w-8" />,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
    href: '/ferramentas/guia-documentacao',
    features: [
      'Documentos necessários',
      'Onde fazer o registro',
      'Custos envolvidos',
      'Prazos e processos'
    ]
  },
  {
    id: 'route-planner',
    title: 'Planejador de Rotas',
    description: 'Planeje rotas seguras considerando ciclofaixas e regulamentações locais',
    icon: <Map className="h-8 w-8" />,
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    href: '/ferramentas/planejador-rotas',
    features: [
      'Rotas otimizadas',
      'Ciclofaixas mapeadas',
      'Pontos de recarga',
      'Alertas de segurança'
    ]
  },
  {
    id: 'safety-checklist',
    title: 'Checklist de Segurança',
    description: 'Lista de verificação completa para circular com segurança',
    icon: <AlertTriangle className="h-8 w-8" />,
    color: 'bg-red-100 text-red-600 border-red-200',
    href: '/ferramentas/checklist-seguranca',
    features: [
      'Equipamentos obrigatórios',
      'Manutenção preventiva',
      'Boas práticas no trânsito',
      'Situações de emergência'
    ]
  }
]

export default function FerramentasPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ferramentas e Recursos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Acesse ferramentas práticas para verificar conformidade, calcular custos, 
              encontrar regulamentações e muito mais
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${tool.color}`}>
                  {tool.icon}
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                  {tool.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {tool.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link
                  href={tool.href}
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Acessar Ferramenta
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Recursos Adicionais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Biblioteca de Documentos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Acesse uma coleção completa de leis, regulamentações, manuais e guias oficiais.
                  </p>
                  <Link
                    href="/biblioteca"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Explorar biblioteca →
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Central de Ajuda
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Precisa de ajuda? Acesse nossa base de conhecimento com perguntas frequentes.
                  </p>
                  <Link
                    href="/ajuda"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Obter ajuda →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Precisa de uma ferramenta específica?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Sugerimos constantemente novas ferramentas baseadas nas necessidades da comunidade. 
            Envie sua sugestão e ajude a tornar este portal ainda mais útil.
          </p>
          <Link
            href="/contato?subject=sugestao-ferramenta"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sugerir Nova Ferramenta
          </Link>
        </div>
      </div>
    </div>
  )
}
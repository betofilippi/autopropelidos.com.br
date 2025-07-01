import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, Download, ExternalLink, Calendar, Building, 
  Scale, BookOpen, AlertCircle, FileCheck, Search,
  Filter, Clock, Eye, Star, TrendingUp
} from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Biblioteca de Documentos - Resolução 996 CONTRAN | Portal Autopropelidos',
  description: 'Acesse documentos oficiais, legislação, manuais técnicos e recursos sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN.',
  keywords: 'biblioteca, documentos, resolução 996, CONTRAN, legislação, manuais, normas técnicas'
}

const documents = {
  legislation: [
    {
      id: 1,
      title: "Resolução CONTRAN nº 996/2023",
      description: "Regulamenta e define os equipamentos de mobilidade individual autopropelidos, as bicicletas elétricas e os ciclomotores",
      date: "28/06/2023",
      source: "CONTRAN",
      type: "Resolução",
      fileSize: "245 KB",
      downloads: 15420,
      rating: 4.8,
      tags: ["Oficial", "Vigente", "Principal"],
      featured: true
    },
    {
      id: 2,
      title: "Código de Trânsito Brasileiro - Lei 9.503/1997",
      description: "Lei que institui o Código de Trânsito Brasileiro",
      date: "23/09/1997",
      source: "Congresso Nacional",
      type: "Lei Federal",
      fileSize: "1.2 MB",
      downloads: 8930,
      rating: 4.7,
      tags: ["Lei", "CTB", "Base Legal"]
    },
    {
      id: 3,
      title: "Resolução CONTRAN nº 465/2013 (Revogada)",
      description: "Antiga regulamentação sobre equipamentos autopropelidos - Revogada pela Res. 996/2023",
      date: "27/11/2013",
      source: "CONTRAN",
      type: "Resolução",
      fileSize: "180 KB",
      downloads: 3240,
      rating: 3.5,
      tags: ["Revogada", "Histórico"]
    },
    {
      id: 4,
      title: "Portaria SENATRAN nº 68/2023",
      description: "Estabelece procedimentos para fiscalização de equipamentos autopropelidos",
      date: "15/08/2023",
      source: "SENATRAN",
      type: "Portaria",
      fileSize: "156 KB",
      downloads: 5670,
      rating: 4.2,
      tags: ["Fiscalização", "Procedimentos"]
    },
    {
      id: 5,
      title: "Deliberação CONTRAN nº 245/2023",
      description: "Esclarecimentos sobre a aplicação da Resolução 996/2023",
      date: "10/09/2023",
      source: "CONTRAN",
      type: "Deliberação",
      fileSize: "98 KB",
      downloads: 7890,
      rating: 4.6,
      tags: ["Esclarecimentos", "Complementar"]
    }
  ],
  technical: [
    {
      id: 6,
      title: "Manual Técnico - Classificação de Equipamentos",
      description: "Guia técnico para classificação e identificação de equipamentos conforme Res. 996",
      date: "01/10/2023",
      source: "DENATRAN",
      type: "Manual",
      fileSize: "3.4 MB",
      downloads: 12340,
      rating: 4.9,
      tags: ["Técnico", "Classificação", "Guia"],
      featured: true
    },
    {
      id: 7,
      title: "Norma ABNT NBR 16945:2021",
      description: "Bicicletas elétricas - Requisitos de segurança",
      date: "15/11/2021",
      source: "ABNT",
      type: "Norma Técnica",
      fileSize: "890 KB",
      downloads: 4560,
      rating: 4.3,
      tags: ["ABNT", "Segurança", "E-bike"]
    },
    {
      id: 8,
      title: "Guia de Homologação - Equipamentos Autopropelidos",
      description: "Procedimentos para homologação de equipamentos junto aos órgãos competentes",
      date: "20/11/2023",
      source: "INMETRO",
      type: "Guia",
      fileSize: "2.1 MB",
      downloads: 6780,
      rating: 4.5,
      tags: ["Homologação", "INMETRO", "Certificação"]
    },
    {
      id: 9,
      title: "Especificações Técnicas - Sistemas de Iluminação",
      description: "Requisitos técnicos para sistemas de iluminação e sinalização",
      date: "05/12/2023",
      source: "DENATRAN",
      type: "Especificação",
      fileSize: "567 KB",
      downloads: 3890,
      rating: 4.1,
      tags: ["Iluminação", "Segurança", "Técnico"]
    }
  ],
  municipal: [
    {
      id: 10,
      title: "Decreto Municipal SP nº 62.789/2023",
      description: "Regulamenta uso de patinetes elétricos na cidade de São Paulo",
      date: "15/09/2023",
      source: "Prefeitura de São Paulo",
      type: "Decreto Municipal",
      fileSize: "234 KB",
      downloads: 9870,
      rating: 4.4,
      tags: ["São Paulo", "Municipal", "Patinetes"]
    },
    {
      id: 11,
      title: "Lei Municipal RJ nº 7.123/2023",
      description: "Disciplina a circulação de equipamentos autopropelidos no Rio de Janeiro",
      date: "22/10/2023",
      source: "Prefeitura do Rio de Janeiro",
      type: "Lei Municipal",
      fileSize: "189 KB",
      downloads: 6540,
      rating: 4.2,
      tags: ["Rio de Janeiro", "Municipal", "Circulação"]
    },
    {
      id: 12,
      title: "Portaria SMTR-BH nº 045/2023",
      description: "Normas para operação de sistemas compartilhados em Belo Horizonte",
      date: "08/11/2023",
      source: "Prefeitura de Belo Horizonte",
      type: "Portaria",
      fileSize: "156 KB",
      downloads: 3450,
      rating: 4.0,
      tags: ["Belo Horizonte", "Compartilhado", "Municipal"]
    }
  ],
  guides: [
    {
      id: 13,
      title: "Guia do Usuário - Equipamentos Autopropelidos",
      description: "Manual completo para usuários sobre direitos, deveres e boas práticas",
      date: "01/12/2023",
      source: "Portal Autopropelidos",
      type: "Guia",
      fileSize: "5.2 MB",
      downloads: 18760,
      rating: 4.9,
      tags: ["Guia", "Usuário", "Completo"],
      featured: true
    },
    {
      id: 14,
      title: "Manual de Segurança no Trânsito",
      description: "Orientações de segurança para condutores de equipamentos autopropelidos",
      date: "15/11/2023",
      source: "OBSERVATÓRIO",
      type: "Manual",
      fileSize: "3.8 MB",
      downloads: 14320,
      rating: 4.8,
      tags: ["Segurança", "Trânsito", "Manual"]
    },
    {
      id: 15,
      title: "Cartilha - Primeiros Passos",
      description: "Guia básico para iniciantes em mobilidade elétrica",
      date: "20/10/2023",
      source: "ABVE",
      type: "Cartilha",
      fileSize: "1.5 MB",
      downloads: 22100,
      rating: 4.7,
      tags: ["Iniciante", "Básico", "Cartilha"]
    }
  ],
  studies: [
    {
      id: 16,
      title: "Impacto da Micromobilidade no Trânsito Urbano",
      description: "Estudo sobre os efeitos da adoção de equipamentos autopropelidos nas cidades",
      date: "30/11/2023",
      source: "IPEA",
      type: "Estudo",
      fileSize: "8.9 MB",
      downloads: 5430,
      rating: 4.6,
      tags: ["Estudo", "Impacto", "Urbano"]
    },
    {
      id: 17,
      title: "Relatório de Acidentes - 2023",
      description: "Análise estatística de acidentes envolvendo equipamentos de mobilidade individual",
      date: "15/01/2024",
      source: "DPVAT",
      type: "Relatório",
      fileSize: "4.2 MB",
      downloads: 7890,
      rating: 4.3,
      tags: ["Estatística", "Acidentes", "2023"]
    }
  ]
}

export default function BibliotecaPage() {
  const allDocuments = [...documents.legislation, ...documents.technical, ...documents.municipal, ...documents.guides, ...documents.studies]
  const totalDownloads = allDocuments.reduce((sum, doc) => sum + doc.downloads, 0)
  const featuredDocs = allDocuments.filter(doc => doc.featured)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Biblioteca de Documentos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Acesse documentos oficiais, legislação, manuais e recursos sobre 
              equipamentos autopropelidos e a Resolução 996
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Buscar documentos..."
                    className="pl-10 pr-4 py-3"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="legislation">Legislação</SelectItem>
                    <SelectItem value="technical">Técnicos</SelectItem>
                    <SelectItem value="guides">Guias</SelectItem>
                    <SelectItem value="studies">Estudos</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{allDocuments.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Documentos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{(totalDownloads / 1000).toFixed(0)}k</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">4.5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avaliação média</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Featured Documents */}
          {featuredDocs.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Documentos em Destaque
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredDocs.map((doc) => (
                  <Card key={doc.id} className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <Badge className="bg-blue-600 text-white">Destaque</Badge>
                      </div>
                      <CardTitle className="text-lg">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {doc.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fonte:</span>
                          <span className="font-medium">{doc.source}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Downloads:</span>
                          <span className="font-medium">{doc.downloads.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Document Categories */}
          <Tabs defaultValue="legislation" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="legislation">Legislação</TabsTrigger>
              <TabsTrigger value="technical">Técnicos</TabsTrigger>
              <TabsTrigger value="municipal">Municipais</TabsTrigger>
              <TabsTrigger value="guides">Guias</TabsTrigger>
              <TabsTrigger value="studies">Estudos</TabsTrigger>
            </TabsList>

            <TabsContent value="legislation" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Legislação Federal
                </h3>
                <Badge variant="secondary">{documents.legislation.length} documentos</Badge>
              </div>
              <div className="grid gap-4">
                {documents.legislation.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  Documentos Técnicos
                </h3>
                <Badge variant="secondary">{documents.technical.length} documentos</Badge>
              </div>
              <div className="grid gap-4">
                {documents.technical.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="municipal" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  Legislação Municipal
                </h3>
                <Badge variant="secondary">{documents.municipal.length} documentos</Badge>
              </div>
              <div className="grid gap-4">
                {documents.municipal.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Guias e Manuais
                </h3>
                <Badge variant="secondary">{documents.guides.length} documentos</Badge>
              </div>
              <div className="grid gap-4">
                {documents.guides.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="studies" className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-red-600" />
                  Estudos e Relatórios
                </h3>
                <Badge variant="secondary">{documents.studies.length} documentos</Badge>
              </div>
              <div className="grid gap-4">
                {documents.studies.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Info Box */}
          <Card className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                    Sobre os Documentos
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Todos os documentos disponibilizados são de caráter público e foram obtidos 
                    através de fontes oficiais. Para documentos técnicos pagos (como normas ABNT), 
                    fornecemos apenas informações de referência e links para aquisição legal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Receba Atualizações de Novos Documentos
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Cadastre-se para ser notificado quando novos documentos, legislações ou 
                  atualizações importantes forem adicionados à biblioteca.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Seu e-mail" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Cadastrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function DocumentCard({ document }: { document: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  {document.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {document.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {document.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {document.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {document.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {document.rating}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {document.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
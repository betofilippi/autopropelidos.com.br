'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  Tag, 
  ExternalLink, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen
} from "lucide-react"
import Link from 'next/link'

// Mock data for regulations
const mockRegulations = [
  {
    id: 1,
    number: "Resolução CONTRAN nº 996/2023",
    date: "2023-12-14",
    title: "Dispõe sobre os equipamentos de mobilidade individual autopropelidos",
    summary: "Estabelece os requisitos técnicos e operacionais para equipamentos autopropelidos, incluindo patinetes e bicicletas elétricas, definindo limites de velocidade, potência e dimensões.",
    category: "Equipamentos Autopropelidos",
    type: "Resolução",
    status: "vigente",
    tags: ["patinete elétrico", "bicicleta elétrica", "regulamentação", "limites técnicos"],
    relatedRegulations: ["Resolução 315/2009", "Lei 9.503/1997"],
    fullTextUrl: "#"
  },
  {
    id: 2,
    number: "Resolução CONTRAN nº 315/2009",
    date: "2009-05-08",
    title: "Estabelece a equiparação dos veículos ciclo-elétricos aos ciclomotores",
    summary: "Define critérios para equiparação de ciclo-elétricos aos ciclomotores e estabelece requisitos para sua circulação.",
    category: "Ciclomotores",
    type: "Resolução",
    status: "parcialmente revogada",
    tags: ["ciclo-elétrico", "ciclomotor", "equiparação"],
    relatedRegulations: ["Resolução 996/2023"],
    fullTextUrl: "#"
  },
  {
    id: 3,
    number: "Portaria INMETRO nº 18/2024",
    date: "2024-01-15",
    title: "Requisitos de certificação para baterias de equipamentos autopropelidos",
    summary: "Estabelece os requisitos técnicos para certificação de baterias utilizadas em equipamentos de mobilidade individual autopropelidos.",
    category: "Certificação",
    type: "Portaria",
    status: "vigente",
    tags: ["bateria", "certificação", "segurança", "INMETRO"],
    relatedRegulations: ["Resolução 996/2023"],
    fullTextUrl: "#"
  },
  {
    id: 4,
    number: "Resolução CONTRAN nº 882/2021",
    date: "2021-12-13",
    title: "Dispõe sobre o uso de capacete para condutores e passageiros de motocicletas e similares",
    summary: "Regulamenta o uso obrigatório de capacete de segurança e estabelece os requisitos técnicos para sua certificação.",
    category: "Equipamentos de Segurança",
    type: "Resolução",
    status: "vigente",
    tags: ["capacete", "segurança", "EPI", "certificação"],
    relatedRegulations: ["NBR 7471"],
    fullTextUrl: "#"
  },
  {
    id: 5,
    number: "Lei Municipal SP nº 17.849/2022",
    date: "2022-04-20",
    title: "Regulamenta o uso de patinetes elétricos compartilhados no Município de São Paulo",
    summary: "Estabelece regras para operação de sistemas de compartilhamento de patinetes elétricos, incluindo áreas permitidas, velocidade máxima e requisitos operacionais.",
    category: "Compartilhamento",
    type: "Lei Municipal",
    status: "vigente",
    tags: ["compartilhamento", "São Paulo", "patinete elétrico", "operação"],
    relatedRegulations: ["Resolução 996/2023"],
    fullTextUrl: "#"
  }
]

// Metadata would normally be exported at module level, but since we're using 'use client', we'll handle it differently
// export const metadata: Metadata = {
//   title: 'Buscador de Regulamentações - Autopropelidos | Portal Autopropelidos',
//   description: 'Encontre facilmente regulamentações do CONTRAN e outras normas relacionadas a equipamentos autopropelidos.',
//   keywords: 'regulamentações, CONTRAN, normas, patinete elétrico, bicicleta elétrica, legislação, autopropelidos'
// }

export default function BuscadorRegulamentacoes() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [expandedCards, setExpandedCards] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get unique tags from all regulations
  const allTags = Array.from(new Set(mockRegulations.flatMap(reg => reg.tags)))

  // Filter regulations based on search criteria
  const filteredRegulations = mockRegulations.filter(regulation => {
    const matchesSearch = searchTerm === '' || 
      regulation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      regulation.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || regulation.category === selectedCategory
    const matchesType = selectedType === 'all' || regulation.type === selectedType
    const matchesStatus = selectedStatus === 'all' || regulation.status === selectedStatus
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => regulation.tags.includes(tag))
    
    const regulationDate = new Date(regulation.date)
    const matchesDateFrom = !dateFrom || regulationDate >= new Date(dateFrom)
    const matchesDateTo = !dateTo || regulationDate <= new Date(dateTo)
    
    return matchesSearch && matchesCategory && matchesType && matchesStatus && matchesTags && matchesDateFrom && matchesDateTo
  })

  const toggleCardExpansion = (id: number) => {
    setExpandedCards(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    )
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Ferramenta Gratuita
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Base Atualizada
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Buscador de Regulamentações
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Encontre facilmente normas e resoluções sobre equipamentos autopropelidos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Buscar Regulamentações
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por número, título, palavra-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as Categorias</SelectItem>
                            <SelectItem value="Equipamentos Autopropelidos">Equipamentos Autopropelidos</SelectItem>
                            <SelectItem value="Ciclomotores">Ciclomotores</SelectItem>
                            <SelectItem value="Certificação">Certificação</SelectItem>
                            <SelectItem value="Equipamentos de Segurança">Equipamentos de Segurança</SelectItem>
                            <SelectItem value="Compartilhamento">Compartilhamento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de Documento</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Tipos</SelectItem>
                            <SelectItem value="Resolução">Resolução</SelectItem>
                            <SelectItem value="Portaria">Portaria</SelectItem>
                            <SelectItem value="Lei Municipal">Lei Municipal</SelectItem>
                            <SelectItem value="Instrução Normativa">Instrução Normativa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="vigente">Vigente</SelectItem>
                            <SelectItem value="revogada">Revogada</SelectItem>
                            <SelectItem value="parcialmente revogada">Parcialmente Revogada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Período</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="date-from" className="text-xs text-gray-500">De</Label>
                            <Input
                              id="date-from"
                              type="date"
                              value={dateFrom}
                              onChange={(e) => setDateFrom(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="date-to" className="text-xs text-gray-500">Até</Label>
                            <Input
                              id="date-to"
                              type="date"
                              value={dateTo}
                              onChange={(e) => setDateTo(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => toggleTag(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredRegulations.length} regulamentações encontradas
            </p>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Resultados
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {filteredRegulations.map(regulation => (
              <Card 
                key={regulation.id} 
                className={`transition-all duration-200 ${
                  regulation.status === 'vigente' 
                    ? 'border-green-200 dark:border-green-800' 
                    : regulation.status === 'revogada'
                    ? 'border-red-200 dark:border-red-800'
                    : 'border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {regulation.number}
                          </h3>
                          <Badge 
                            variant={
                              regulation.status === 'vigente' ? 'default' : 
                              regulation.status === 'revogada' ? 'destructive' : 
                              'secondary'
                            }
                            className="flex items-center gap-1"
                          >
                            {regulation.status === 'vigente' && <CheckCircle className="h-3 w-3" />}
                            {regulation.status === 'revogada' && <XCircle className="h-3 w-3" />}
                            {regulation.status === 'parcialmente revogada' && <AlertCircle className="h-3 w-3" />}
                            {regulation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(regulation.date).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {regulation.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {regulation.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title and Summary */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {regulation.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {regulation.summary}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {regulation.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Expanded Content */}
                    {expandedCards.includes(regulation.id) && (
                      <>
                        <Separator />
                        <div className="space-y-3 text-sm">
                          {regulation.relatedRegulations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                                Regulamentações Relacionadas:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {regulation.relatedRegulations.map(related => (
                                  <Badge key={related} variant="secondary" className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                                    {related}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(regulation.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expandedCards.includes(regulation.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Ver menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Ver mais
                          </>
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(regulation.fullTextUrl, '_blank')}
                      >
                        <BookOpen className="h-4 w-4" />
                        Texto Completo
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredRegulations.length === 0 && (
            <Card className="bg-gray-50 dark:bg-gray-800/50">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nenhuma regulamentação encontrada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Sobre esta ferramenta
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Este buscador reúne as principais regulamentações federais, estaduais e municipais 
                    relacionadas a equipamentos autopropelidos. A base de dados é atualizada regularmente 
                    para garantir acesso às normas mais recentes.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Dica:</strong> Use os filtros avançados para refinar sua busca e encontrar 
                    exatamente o que precisa. Você também pode combinar múltiplos critérios de pesquisa.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Tools */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Verificador de Conformidade
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Verifique se seu equipamento está em conformidade com a Resolução 996.
                    </p>
                    <Link
                      href="/ferramentas/verificador-conformidade"
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Verificar agora
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Linha do Tempo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Acompanhe a evolução histórica das regulamentações de autopropelidos.
                    </p>
                    <Link
                      href="/resolucao-996#historico"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      Ver linha do tempo
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Aviso Legal:</h4>
                <p>
                  Esta ferramenta apresenta uma compilação de regulamentações para fins informativos. 
                  Para questões legais específicas ou interpretações oficiais, consulte sempre as 
                  fontes originais e órgãos competentes. As informações aqui disponibilizadas não 
                  substituem assessoria jurídica profissional.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
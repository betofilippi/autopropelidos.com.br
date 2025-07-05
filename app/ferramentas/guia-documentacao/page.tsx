'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Download, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  MapPin,
  CreditCard,
  Shield,
  User,
  Home,
  Camera,
  Clipboard,
  FileCheck,
  Info,
  ExternalLink
} from "lucide-react"
import Link from 'next/link'

// Mock data for document requirements
const documentRequirements = {
  'electric_scooter': {
    name: 'Patinete Elétrico',
    documents: [
      {
        id: 'nf',
        name: 'Nota Fiscal',
        description: 'Documento fiscal de compra do equipamento',
        required: true,
        whereToGet: 'Fornecido pela loja no momento da compra',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Guarde sempre a via original',
          'Tire uma foto ou escaneie para backup',
          'Verifique se todos os dados estão corretos'
        ]
      },
      {
        id: 'manual',
        name: 'Manual do Fabricante',
        description: 'Manual técnico com especificações do equipamento',
        required: true,
        whereToGet: 'Fornecido pelo fabricante (físico ou digital)',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Baixe a versão digital do site do fabricante',
          'Verifique se contém as especificações técnicas',
          'Guarde em local seguro'
        ]
      },
      {
        id: 'seguro',
        name: 'Apólice de Seguro',
        description: 'Seguro contra roubo, furto e danos a terceiros',
        required: false,
        whereToGet: 'Corretoras de seguro ou seguradoras online',
        estimatedTime: '1-3 dias úteis',
        estimatedCost: 'R$ 150-300/ano',
        tips: [
          'Compare preços entre seguradoras',
          'Verifique a cobertura para terceiros',
          'Leia as cláusulas de exclusão'
        ]
      },
      {
        id: 'fotos',
        name: 'Fotos do Equipamento',
        description: 'Registro fotográfico para identificação',
        required: false,
        whereToGet: 'Tire você mesmo com smartphone',
        estimatedTime: '10 minutos',
        estimatedCost: 'Gratuito',
        tips: [
          'Fotografe número de série e chassi',
          'Inclua fotos de todos os ângulos',
          'Use boa iluminação'
        ]
      }
    ]
  },
  'electric_bike': {
    name: 'Bicicleta Elétrica',
    documents: [
      {
        id: 'nf',
        name: 'Nota Fiscal',
        description: 'Documento fiscal de compra do equipamento',
        required: true,
        whereToGet: 'Fornecido pela loja no momento da compra',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Guarde sempre a via original',
          'Tire uma foto ou escaneie para backup',
          'Verifique se todos os dados estão corretos'
        ]
      },
      {
        id: 'certificado',
        name: 'Certificado de Conformidade',
        description: 'Documento que atesta conformidade com normas técnicas',
        required: true,
        whereToGet: 'Fornecido pelo fabricante ou importador',
        estimatedTime: '1-5 dias úteis',
        estimatedCost: 'Gratuito',
        tips: [
          'Solicite ao vendedor se não receber',
          'Verifique se está dentro da validade',
          'Confirme se cobre seu modelo específico'
        ]
      },
      {
        id: 'manual',
        name: 'Manual do Fabricante',
        description: 'Manual técnico com especificações do equipamento',
        required: true,
        whereToGet: 'Fornecido pelo fabricante (físico ou digital)',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Baixe a versão digital do site do fabricante',
          'Verifique se contém as especificações técnicas',
          'Guarde em local seguro'
        ]
      },
      {
        id: 'seguro',
        name: 'Apólice de Seguro',
        description: 'Seguro contra roubo, furto e danos a terceiros',
        required: false,
        whereToGet: 'Corretoras de seguro ou seguradoras online',
        estimatedTime: '1-3 dias úteis',
        estimatedCost: 'R$ 200-500/ano',
        tips: [
          'Compare preços entre seguradoras',
          'Verifique a cobertura para terceiros',
          'Considere seguro específico para bikes elétricas'
        ]
      },
      {
        id: 'registro_bike',
        name: 'Registro da Bicicleta',
        description: 'Cadastro em sistema de registro local',
        required: false,
        whereToGet: 'Prefeitura ou órgão de trânsito local',
        estimatedTime: '1-7 dias úteis',
        estimatedCost: 'R$ 0-50',
        tips: [
          'Verifique se sua cidade possui sistema de registro',
          'Facilita recuperação em caso de roubo',
          'Pode ser feito online em algumas cidades'
        ]
      }
    ]
  },
  'other': {
    name: 'Outros Equipamentos',
    documents: [
      {
        id: 'nf',
        name: 'Nota Fiscal',
        description: 'Documento fiscal de compra do equipamento',
        required: true,
        whereToGet: 'Fornecido pela loja no momento da compra',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Guarde sempre a via original',
          'Tire uma foto ou escaneie para backup',
          'Verifique se todos os dados estão corretos'
        ]
      },
      {
        id: 'manual',
        name: 'Manual do Fabricante',
        description: 'Manual técnico com especificações do equipamento',
        required: true,
        whereToGet: 'Fornecido pelo fabricante (físico ou digital)',
        estimatedTime: 'Imediato',
        estimatedCost: 'Gratuito',
        tips: [
          'Baixe a versão digital do site do fabricante',
          'Verifique se contém as especificações técnicas',
          'Guarde em local seguro'
        ]
      },
      {
        id: 'laudo',
        name: 'Laudo Técnico',
        description: 'Análise técnica de conformidade',
        required: false,
        whereToGet: 'Empresas especializadas em certificação',
        estimatedTime: '5-15 dias úteis',
        estimatedCost: 'R$ 300-800',
        tips: [
          'Necessário para equipamentos importados sem certificação',
          'Procure empresas credenciadas',
          'Solicite orçamento antes'
        ]
      }
    ]
  }
}

// Templates data
const documentTemplates = [
  {
    id: 'checklist',
    name: 'Checklist de Documentação',
    description: 'Lista completa para verificar todos os documentos',
    icon: Clipboard,
    downloadUrl: '#'
  },
  {
    id: 'declaracao',
    name: 'Declaração de Propriedade',
    description: 'Modelo de declaração para comprovação',
    icon: FileText,
    downloadUrl: '#'
  },
  {
    id: 'autorizacao',
    name: 'Autorização para Menor',
    description: 'Modelo para menores de idade',
    icon: User,
    downloadUrl: '#'
  },
  {
    id: 'registro',
    name: 'Formulário de Registro',
    description: 'Modelo para registro municipal',
    icon: FileCheck,
    downloadUrl: '#'
  }
]

export default function GuiaDocumentacao() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [completedDocuments, setCompletedDocuments] = useState<string[]>([])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleDocument = (docId: string) => {
    setCompletedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const selectedDocuments = selectedType ? documentRequirements[selectedType as keyof typeof documentRequirements] : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Guia Interativo
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Passo a Passo
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Guia de Documentação
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Saiba exatamente quais documentos você precisa para seu equipamento autopropelido
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Progress Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-600 dark:text-gray-400">
                    Passo {currentStep} de {totalSteps}
                  </span>
                  <span className="text-blue-600">
                    {Math.round(progress)}% completo
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tipo de Equipamento</span>
                  <span>Documentos Necessários</span>
                  <span>Onde Obter</span>
                  <span>Custos e Prazos</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                {currentStep === 1 && 'Selecione o Tipo de Equipamento'}
                {currentStep === 2 && 'Documentos Necessários'}
                {currentStep === 3 && 'Onde Obter os Documentos'}
                {currentStep === 4 && 'Custos e Prazos Estimados'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Step 1: Equipment Type Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Escolha o tipo de equipamento autopropelido para ver a documentação específica necessária.
                  </p>
                  
                  <RadioGroup value={selectedType} onValueChange={setSelectedType}>
                    <div className="grid gap-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <RadioGroupItem value="electric_scooter" id="electric_scooter" />
                        <Label htmlFor="electric_scooter" className="flex-1 cursor-pointer">
                          <div className="font-medium">Patinete Elétrico</div>
                          <div className="text-sm text-gray-500">Patinetes motorizados com guidão</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <RadioGroupItem value="electric_bike" id="electric_bike" />
                        <Label htmlFor="electric_bike" className="flex-1 cursor-pointer">
                          <div className="font-medium">Bicicleta Elétrica</div>
                          <div className="text-sm text-gray-500">E-bikes com assistência elétrica</div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="flex-1 cursor-pointer">
                          <div className="font-medium">Outros Equipamentos</div>
                          <div className="text-sm text-gray-500">Skate elétrico, hoverboard, monociclo, etc.</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  {selectedType && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                            Você selecionou: {selectedDocuments?.name}
                          </p>
                          <p className="text-blue-700 dark:text-blue-300">
                            Vamos guiá-lo pelos documentos necessários para este tipo de equipamento.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Required Documents */}
              {currentStep === 2 && selectedDocuments && (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Marque os documentos que você já possui. Documentos com <Badge className="bg-red-100 text-red-800 text-xs">Obrigatório</Badge> são essenciais.
                  </p>

                  <div className="space-y-4">
                    {selectedDocuments.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg transition-all ${
                          completedDocuments.includes(doc.id)
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <button
                            onClick={() => toggleDocument(doc.id)}
                            className="mt-0.5"
                          >
                            {completedDocuments.includes(doc.id) ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{doc.name}</h3>
                              {doc.required && (
                                <Badge className="bg-red-100 text-red-800 text-xs">Obrigatório</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                          Dica Importante:
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                          Mantenha cópias digitais de todos os documentos em seu celular ou nuvem para fácil acesso.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Where to Get Documents */}
              {currentStep === 3 && selectedDocuments && (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Veja onde e como obter cada documento necessário para seu {selectedDocuments.name}.
                  </p>

                  <Tabs defaultValue={selectedDocuments.documents[0].id} className="w-full">
                    <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-6">
                      {selectedDocuments.documents.map((doc) => (
                        <TabsTrigger key={doc.id} value={doc.id} className="text-xs">
                          {doc.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {selectedDocuments.documents.map((doc) => (
                      <TabsContent key={doc.id} value={doc.id} className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              {doc.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Onde obter:</h4>
                              <p className="text-gray-600 dark:text-gray-400">
                                {doc.whereToGet}
                              </p>
                            </div>

                            <Separator />

                            <div>
                              <h4 className="font-medium mb-2">Dicas úteis:</h4>
                              <ul className="space-y-1">
                                {doc.tips.map((tip, index) => (
                                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {doc.required && (
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
                                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                  ⚠️ Este documento é obrigatório
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* Step 4: Costs and Timeline */}
              {currentStep === 4 && selectedDocuments && (
                <div className="space-y-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Resumo dos custos e prazos estimados para obter toda a documentação.
                  </p>

                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <DollarSign className="h-8 w-8 text-blue-600" />
                          <div className="text-sm text-blue-600 dark:text-blue-400">Custo Total Estimado</div>
                          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            R$ {selectedDocuments.documents.reduce((total, doc) => {
                              if (doc.estimatedCost === 'Gratuito') return total;
                              const match = doc.estimatedCost.match(/R\$\s*(\d+)/);
                              return total + (match ? parseInt(match[1]) : 0);
                            }, 0)}-{selectedDocuments.documents.reduce((total, doc) => {
                              if (doc.estimatedCost === 'Gratuito') return total;
                              const match = doc.estimatedCost.match(/R\$\s*\d+-(\d+)/);
                              return total + (match ? parseInt(match[1]) : 0);
                            }, 0)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <Clock className="h-8 w-8 text-green-600" />
                          <div className="text-sm text-green-600 dark:text-green-400">Tempo Total</div>
                          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            1-15 dias
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300">
                            Para todos os documentos
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          <FileCheck className="h-8 w-8 text-purple-600" />
                          <div className="text-sm text-purple-600 dark:text-purple-400">Documentos</div>
                          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {completedDocuments.length}/{selectedDocuments.documents.length}
                          </div>
                          <div className="text-xs text-purple-700 dark:text-purple-300">
                            Já obtidos
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Cronograma Detalhado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedDocuments.documents.map((doc, index) => (
                          <div key={doc.id} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                completedDocuments.includes(doc.id)
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {completedDocuments.includes(doc.id) ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{doc.name}</h4>
                                <Badge variant="outline" className="ml-2">
                                  {doc.estimatedTime}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {doc.whereToGet}
                              </p>
                              <p className="text-sm font-medium text-blue-600 mt-1">
                                {doc.estimatedCost}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Common Mistakes */}
                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                            Erros Comuns a Evitar:
                          </h4>
                          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                            <li>• Não guardar a nota fiscal original</li>
                            <li>• Esquecer de verificar especificações no manual</li>
                            <li>• Deixar para fazer seguro após um sinistro</li>
                            <li>• Não manter cópias digitais dos documentos</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Navigation Buttons */}
              <Separator />
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                
                <Button
                  onClick={handleNextStep}
                  disabled={currentStep === 1 && !selectedType}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Templates Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modelos e Formulários
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {documentTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                        <template.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {template.description}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Modelo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Precisa de Ajuda com a Documentação?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Nossa equipe está pronta para esclarecer suas dúvidas sobre documentação e requisitos legais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ajuda"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Central de Ajuda
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  href="/ferramentas/verificador-conformidade"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Verificar Conformidade
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
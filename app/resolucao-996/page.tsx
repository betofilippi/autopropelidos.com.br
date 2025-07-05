import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, FileText, HelpCircle, Shield, AlertTriangle, Zap, Settings, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Resolução 996 do CONTRAN - Guia Completo | Portal Autopropelidos',
  description: 'Entenda tudo sobre a Resolução 996 do CONTRAN que regulamenta equipamentos autopropelidos, bicicletas elétricas e ciclomotores no Brasil.',
  keywords: 'CONTRAN 996, resolução, equipamentos autopropelidos, bicicleta elétrica, ciclomotor, regulamentação'
}

export default function Resolucao996() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Regulamentação Oficial
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Em Vigor desde 2023
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Resolução 996 do CONTRAN
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Guia completo sobre a regulamentação que define equipamentos autopropelidos, 
                bicicletas elétricas e ciclomotores no Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Introduction */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    O que é a Resolução 996?
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    A Resolução 996 do CONTRAN, publicada em junho de 2023, atualizou as definições e 
                    regulamentações para equipamentos de mobilidade urbana, estabelecendo diretrizes 
                    claras para bicicletas elétricas, ciclomotores e equipamentos autopropelidos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="definicoes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="definicoes">Definições</TabsTrigger>
              <TabsTrigger value="classificacao">Classificação</TabsTrigger>
              <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="definicoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    Definições Atualizadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-green-700 dark:text-green-400">
                        Equipamentos Autopropelidos
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Dispositivos de mobilidade individual com motor elétrico
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Velocidade máxima de 32 km/h
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Potência máxima de 1.500W
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Largura máxima de 70cm
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400">
                        Bicicletas Elétricas
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Bicicletas com assistência elétrica ao pedal
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Motor acionado apenas pedalando
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Potência máxima de 350W
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Velocidade limitada a 25 km/h
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="classificacao" className="space-y-6">
              <div className="grid gap-6">
                <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      NÃO precisam de registro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Equipamentos Autopropelidos</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Patinetes elétricos</li>
                          <li>• Skates elétricos</li>
                          <li>• Monociclos elétricos</li>
                          <li>• Hoverboards</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Bicicletas Elétricas</h4>
                        <ul className="text-sm space-y-1">
                          <li>• E-bikes com assistência ao pedal</li>
                          <li>• Potência até 350W</li>
                          <li>• Velocidade até 25 km/h</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                      <AlertTriangle className="h-5 w-5" />
                      PRECISAM de registro (Ciclomotores)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300">
                        Equipamentos que excedem os limites dos autopropelidos são classificados como ciclomotores:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          Velocidade superior a 32 km/h
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          Potência superior a 1.500W
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                          Largura superior a 70cm
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requisitos" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Equipamentos de Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Obrigatórios:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Capacete (recomendado)</li>
                          <li>• Luzes dianteira e traseira (período noturno)</li>
                          <li>• Dispositivos refletivos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Recomendados:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Joelheiras e cotoveleiras</li>
                          <li>• Roupas com alta visibilidade</li>
                          <li>• Buzina ou campainha</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Áreas de Circulação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Permitido:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Ciclofaixas e ciclovias</li>
                          <li>• Vias urbanas locais (&lt; 60 km/h)</li>
                          <li>• Área de circulação de pedestres*</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Proibido:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Rodovias e vias expressas</li>
                          <li>• Vias com velocidade &gt; 60 km/h</li>
                          <li>• Calçadas (exceto onde permitido)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Preciso de habilitação?</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Não.</strong> Equipamentos autopropelidos e bicicletas elétricas que se enquadram 
                          nas especificações da Resolução 996 não exigem habilitação.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Meu equipamento precisa de placa?</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Não.</strong> Equipamentos dentro dos limites estabelecidos não precisam de 
                          emplacamento ou registro no DETRAN.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">Posso circular em qualquer rua?</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Você pode circular em vias urbanas com velocidade máxima de até 60 km/h, ciclofaixas 
                          e ciclovias. É proibido em rodovias e vias expressas.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">O que acontece se exceder os limites?</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Equipamentos que excedem velocidade de 32 km/h ou potência de 1.500W são considerados 
                          ciclomotores e precisam de registro, emplacamento e habilitação categoria A.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Official Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Documentos Oficiais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="https://www.gov.br/transportes/pt-br/assuntos/noticias/2023/06/resolucao-do-contran-atualiza-definicao-de-ciclomotores-bicicletas-eletricas-e-autopropelidos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">Ministério dos Transportes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Resolução oficial do CONTRAN
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </Link>

                <Link
                  href="https://www.gov.br/secom/pt-br/fatos/brasil-contra-fake/noticias/2023/06/bicicletas-eletricas-e-equipamentos-autopropelidos-nao-precisam-de-registro-emplacamento-ou-habilitacao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">Brasil contra Fake</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Esclarecimentos oficiais
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas sobre seu equipamento?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Use nossa ferramenta de verificação de conformidade para saber se seu equipamento 
                está de acordo com a Resolução 996.
              </p>
              <Link
                href="/ferramentas/verificador-conformidade"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Verificar Meu Equipamento
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

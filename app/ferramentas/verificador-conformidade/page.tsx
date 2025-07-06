import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertTriangle, Calculator, Shield, HelpCircle, ArrowRight, FileText } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verificador de Conformidade - Resolução 996 | Portal Autopropelidos',
  description: 'Verifique se seu equipamento autopropelido está em conformidade com a Resolução 996 do CONTRAN. Análise gratuita e instantânea.',
  keywords: 'verificador conformidade, CONTRAN 996, patinete elétrico, bicicleta elétrica, autopropelidos, regulamentação'
}

export default function VerificadorConformidade() {
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
                  Resultado Instantâneo
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Verificador de Conformidade
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Descubra se seu equipamento está em conformidade com a Resolução 996 do CONTRAN
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Information Card */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    Como funciona esta ferramenta?
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Nossa ferramenta analisa as especificações do seu equipamento e verifica a conformidade 
                    com os limites estabelecidos pela Resolução 996 do CONTRAN.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Limites para equipamentos autopropelidos:</strong> Velocidade ≤ 32 km/h • Potência ≤ 1.000W • Largura ≤ 70cm
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Dados do Equipamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Equipment Type */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tipo de Equipamento</Label>
                <RadioGroup defaultValue="electric_scooter" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="electric_scooter" id="electric_scooter" />
                    <Label htmlFor="electric_scooter" className="font-normal">Patinete Elétrico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="electric_bike" id="electric_bike" />
                    <Label htmlFor="electric_bike" className="font-normal">Bicicleta Elétrica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="electric_skateboard" id="electric_skateboard" />
                    <Label htmlFor="electric_skateboard" className="font-normal">Skate Elétrico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hoverboard" id="hoverboard" />
                    <Label htmlFor="hoverboard" className="font-normal">Hoverboard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monowheel" id="monowheel" />
                    <Label htmlFor="monowheel" className="font-normal">Monociclo Elétrico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal">Outro</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Technical Specifications */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Especificações Técnicas</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_speed">Velocidade Máxima (km/h)</Label>
                    <Input
                      id="max_speed"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="Ex: 25"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Velocidade máxima que o equipamento pode atingir
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motor_power">Potência do Motor (W)</Label>
                    <Input
                      id="motor_power"
                      type="number"
                      min="0"
                      max="5000"
                      placeholder="Ex: 350"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Potência nominal do motor elétrico
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">Largura do Equipamento (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      max="200"
                      placeholder="Ex: 45"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Largura total do equipamento
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Características Adicionais</h3>
                  
                  <div className="space-y-2">
                    <Label>Possui Assistência ao Pedal?</Label>
                    <RadioGroup defaultValue="no" className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="pedal_yes" />
                        <Label htmlFor="pedal_yes" className="font-normal">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="pedal_no" />
                        <Label htmlFor="pedal_no" className="font-normal">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Possui Acelerador (Throttle)?</Label>
                    <RadioGroup defaultValue="yes" className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="throttle_yes" />
                        <Label htmlFor="throttle_yes" className="font-normal">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="throttle_no" />
                        <Label htmlFor="throttle_no" className="font-normal">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand_model">Marca e Modelo</Label>
                    <Input
                      id="brand_model"
                      placeholder="Ex: Xiaomi Mi Electric Scooter Pro 2"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Opcional: para consulta em nossa base de dados
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Analysis Button */}
              <div className="text-center">
                <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
                  <Calculator className="h-5 w-5 mr-2" />
                  Verificar Conformidade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Result (Static for demonstration) */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                Resultado da Análise (Exemplo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium">Velocidade</div>
                  <div className="text-sm text-gray-600">25 km/h ≤ 32 km/h</div>
                  <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 border-green-200">
                    Conforme
                  </Badge>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium">Potência</div>
                  <div className="text-sm text-gray-600">350W ≤ 1.000W</div>
                  <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 border-green-200">
                    Conforme
                  </Badge>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium">Largura</div>
                  <div className="text-sm text-gray-600">45cm ≤ 70cm</div>
                  <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 border-green-200">
                    Conforme
                  </Badge>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-green-700 dark:text-green-400">
                  ✅ Seu equipamento está conforme a Resolução 996!
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Classificação:</strong> Equipamento Autopropelido conforme Resolução 996/2023 do CONTRAN
                  </p>
                  <p>
                    <strong>Registro:</strong> Não é necessário registro no DETRAN
                  </p>
                  <p>
                    <strong>Habilitação:</strong> Não é necessária habilitação para conduzir
                  </p>
                  <p>
                    <strong>Emplacamento:</strong> Não é necessário emplacamento
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                      Lembre-se das regras de circulação:
                    </h4>
                    <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>• Use equipamentos de proteção (capacete recomendado)</li>
                      <li>• Circule apenas em vias permitidas (ciclofaixas, vias locais ≤ 60 km/h)</li>
                      <li>• Use luzes e dispositivos refletivos no período noturno</li>
                      <li>• Respeite pedestres e ciclistas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Entenda a Resolução 996
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Acesse o guia completo sobre a Resolução 996 do CONTRAN com todas as definições e regras.
                    </p>
                    <Link
                      href="/resolucao-996"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Ler guia completo
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Ainda tem dúvidas?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Acesse nossa central de ajuda com perguntas frequentes e casos específicos.
                    </p>
                    <Link
                      href="/ajuda"
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Central de ajuda
                      <ArrowRight className="h-4 w-4 ml-1" />
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
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Aviso Importante:</h4>
                <p>
                  Esta ferramenta fornece uma análise baseada nas informações fornecidas e na Resolução 996/2023 do CONTRAN. 
                  Para casos específicos ou dúvidas sobre conformidade, consulte sempre os órgãos competentes ou um especialista 
                  em regulamentação de trânsito. As informações aqui apresentadas têm caráter informativo e não substituem 
                  uma análise técnica oficial.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
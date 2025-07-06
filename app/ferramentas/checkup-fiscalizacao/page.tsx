import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, XCircle, AlertTriangle, Shield, Scale, FileText, Printer, Camera, Ruler, AlertCircleIcon } from "lucide-react"

export const metadata: Metadata = {
  title: 'Checkup de Fiscalização - Autoridades | Portal Autopropelidos',
  description: 'Ferramenta oficial para autoridades verificarem conformidade de equipamentos autopropelidos com a Resolução 996 do CONTRAN.',
  keywords: 'fiscalização, autoridades, CONTRAN 996, equipamentos autopropelidos, verificação técnica, regulamentação'
}

export default function CheckupFiscalizacao() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  Autoridades Oficiais
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Resolução 996/2023
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Relatório Oficial
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Checkup de Fiscalização
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Ferramenta para autoridades verificarem conformidade de equipamentos com a Resolução 996/2023 do CONTRAN
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Warning Card */}
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 dark:bg-red-800 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                    ⚠️ Ferramenta Exclusiva para Autoridades
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Esta ferramenta é destinada exclusivamente para agentes de trânsito, policiais e demais autoridades 
                    competentes na fiscalização de equipamentos autopropelidos conforme Resolução 996/2023 do CONTRAN.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Uso responsável:</strong> As informações aqui coletadas serão utilizadas para emissão de 
                    relatórios oficiais de fiscalização.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Identificação da Autoridade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="agent_name">Nome do Agente/Autoridade</Label>
                    <Input
                      id="agent_name"
                      placeholder="Nome completo"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badge_number">Número da Matrícula/Badge</Label>
                    <Input
                      id="badge_number"
                      placeholder="Ex: 12345"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Órgão/Instituição</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o órgão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pm">Polícia Militar</SelectItem>
                        <SelectItem value="pc">Polícia Civil</SelectItem>
                        <SelectItem value="prf">Polícia Rodoviária Federal</SelectItem>
                        <SelectItem value="detran">DETRAN</SelectItem>
                        <SelectItem value="municipal">Guarda Municipal</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inspection_date">Data da Fiscalização</Label>
                    <Input
                      id="inspection_date"
                      type="datetime-local"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Local da Fiscalização</Label>
                    <Input
                      id="location"
                      placeholder="Endereço completo"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report_number">Número do Auto/Relatório</Label>
                    <Input
                      id="report_number"
                      placeholder="Ex: AIT123456"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-blue-600" />
                Dados do Equipamento Fiscalizado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Basic Equipment Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Equipamento</Label>
                    <RadioGroup defaultValue="" className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="brand_model">Marca e Modelo</Label>
                    <Input
                      id="brand_model"
                      placeholder="Ex: Xiaomi Mi Electric Scooter Pro 2"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serial_number">Número de Série/Chassi</Label>
                    <Input
                      id="serial_number"
                      placeholder="Conforme etiqueta do fabricante"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">Nome do Condutor</Label>
                    <Input
                      id="user_name"
                      placeholder="Nome completo"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_document">Documento do Condutor</Label>
                    <Input
                      id="user_document"
                      placeholder="CPF ou RG"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_age">Idade do Condutor</Label>
                    <Input
                      id="user_age"
                      type="number"
                      min="0"
                      max="120"
                      placeholder="Ex: 25"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Technical Measurements */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Medições Técnicas (Resolução 996/2023)</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max_speed">Velocidade Máxima Aferida (km/h)</Label>
                    <Input
                      id="max_speed"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="Ex: 28.5"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Limite: 32 km/h para autopropelidos
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
                      Limite: 1.000W para autopropelidos
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">Largura Total (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      min="0"
                      max="200"
                      placeholder="Ex: 45.5"
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Limite: 70cm para autopropelidos
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Additional Characteristics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Características Adicionais</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_pedals" />
                      <Label htmlFor="has_pedals" className="font-normal">Possui pedais</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_throttle" />
                      <Label htmlFor="has_throttle" className="font-normal">Possui acelerador (throttle)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_seat" />
                      <Label htmlFor="has_seat" className="font-normal">Possui banco/assento</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_lights" />
                      <Label htmlFor="has_lights" className="font-normal">Possui sistema de iluminação</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_horn" />
                      <Label htmlFor="has_horn" className="font-normal">Possui buzina/campainha</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_brakes" />
                      <Label htmlFor="has_brakes" className="font-normal">Possui sistema de frenagem</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="has_reflectors" />
                      <Label htmlFor="has_reflectors" className="font-normal">Possui dispositivos refletivos</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="modified" />
                      <Label htmlFor="modified" className="font-normal">Equipamento modificado</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Equipment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Equipamentos de Segurança do Condutor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wearing_helmet" />
                    <Label htmlFor="wearing_helmet" className="font-normal">Usando capacete</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wearing_knee_pads" />
                    <Label htmlFor="wearing_knee_pads" className="font-normal">Usando joelheiras</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="wearing_elbow_pads" />
                    <Label htmlFor="wearing_elbow_pads" className="font-normal">Usando cotoveleiras</Label>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="reflective_clothing" />
                    <Label htmlFor="reflective_clothing" className="font-normal">Roupas com alta visibilidade</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="appropriate_footwear" />
                    <Label htmlFor="appropriate_footwear" className="font-normal">Calçado adequado</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="other_safety" />
                    <Label htmlFor="other_safety" className="font-normal">Outros equipamentos</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Observações da Fiscalização
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="violation_type">Tipo de Infração (se aplicável)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione se houver infração" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma infração</SelectItem>
                    <SelectItem value="speed_excess">Velocidade acima de 32 km/h</SelectItem>
                    <SelectItem value="power_excess">Potência acima de 1.000W</SelectItem>
                    <SelectItem value="width_excess">Largura acima de 70cm</SelectItem>
                    <SelectItem value="no_safety">Falta de equipamentos de segurança</SelectItem>
                    <SelectItem value="wrong_circulation">Circulação em via inadequada</SelectItem>
                    <SelectItem value="modified">Equipamento modificado irregularmente</SelectItem>
                    <SelectItem value="multiple">Múltiplas infrações</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações Detalhadas</Label>
                <Textarea
                  id="observations"
                  placeholder="Descreva detalhadamente as circunstâncias da fiscalização, infrações observadas, condições do equipamento, comportamento do condutor, etc."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weather_conditions">Condições Climáticas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Tempo limpo</SelectItem>
                      <SelectItem value="cloudy">Nublado</SelectItem>
                      <SelectItem value="rain">Chuva</SelectItem>
                      <SelectItem value="fog">Neblina</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traffic_conditions">Condições de Trânsito</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Trânsito leve</SelectItem>
                      <SelectItem value="moderate">Trânsito moderado</SelectItem>
                      <SelectItem value="heavy">Trânsito intenso</SelectItem>
                      <SelectItem value="congested">Congestionamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Result (Static for demonstration) */}
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <AlertTriangle className="h-5 w-5" />
                Resultado da Análise (Exemplo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="font-medium">Velocidade</div>
                  <div className="text-sm text-gray-600">38 km/h &gt; 32 km/h</div>
                  <Badge variant="outline" className="mt-2 bg-red-100 text-red-800 border-red-200">
                    Não Conforme
                  </Badge>
                </div>

                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-medium">Potência</div>
                  <div className="text-sm text-gray-600">800W ≤ 1.000W</div>
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
                <h3 className="font-semibold text-lg mb-3 text-red-700 dark:text-red-400">
                  ⚠️ EQUIPAMENTO NÃO CONFORME - CICLOMOTOR
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Classificação:</strong> Por exceder o limite de velocidade de 32 km/h, este equipamento 
                    é classificado como CICLOMOTOR conforme Resolução 996/2023 do CONTRAN
                  </p>
                  <p>
                    <strong>Infrações:</strong> Conduzir ciclomotor sem registro, emplacamento e habilitação categoria A
                  </p>
                  <p>
                    <strong>Código CTB:</strong> Art. 230 - Conduzir veículo sem a devida habilitação
                  </p>
                  <p>
                    <strong>Penalidade:</strong> Multa gravíssima + 7 pontos na carteira + retenção do veículo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-5 w-5 mr-2" />
              Gerar Relatório de Fiscalização
            </Button>
            
            <Button size="lg" variant="outline" className="border-gray-300">
              <Printer className="h-5 w-5 mr-2" />
              Imprimir Auto de Infração
            </Button>
          </div>

          {/* Legal Disclaimer */}
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Aviso Legal:</h4>
                <p>
                  Esta ferramenta foi desenvolvida com base na Resolução 996/2023 do CONTRAN e serve como auxílio 
                  para fiscalização. As medições técnicas devem ser realizadas com equipamentos calibrados e 
                  homologados. O resultado desta análise deve ser complementado com a avaliação técnica da autoridade 
                  competente. Em caso de dúvidas sobre classificação, consulte a legislação vigente e órgãos técnicos 
                  especializados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, TrendingUp, Zap, Wrench, Bus, Car, DollarSign, PiggyBank, AlertCircle } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculadora de Custos - Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Calcule o custo total de propriedade do seu equipamento autopropelido. Compare com transporte público e veículo particular.',
  keywords: 'calculadora custos, patinete elétrico, bicicleta elétrica, custo benefício, economia, transporte'
}

export default function CalculadoraCustos() {
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
                  Análise Completa
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Calculadora de Custos
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Calcule o custo total de propriedade e compare com outras formas de transporte
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tool-container">
        <div className="tool-content">

          {/* Information Cards */}
          <div className="tool-grid">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold">Custo Total</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Aquisição + Operação</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <PiggyBank className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold">Economia</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">vs Transporte Público</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="font-semibold">ROI</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Retorno do Investimento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Calculator */}
          <Tabs defaultValue="equipment" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="equipment">Equipamento</TabsTrigger>
              <TabsTrigger value="usage">Uso Diário</TabsTrigger>
              <TabsTrigger value="comparison">Comparação</TabsTrigger>
            </TabsList>

            <TabsContent value="equipment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Dados do Equipamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="equipment_type">Tipo de Equipamento</Label>
                        <Select defaultValue="electric_scooter">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electric_scooter">Patinete Elétrico</SelectItem>
                            <SelectItem value="electric_bike">Bicicleta Elétrica</SelectItem>
                            <SelectItem value="electric_skateboard">Skate Elétrico</SelectItem>
                            <SelectItem value="hoverboard">Hoverboard</SelectItem>
                            <SelectItem value="monowheel">Monociclo Elétrico</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purchase_price">Preço de Compra (R$)</Label>
                        <Input
                          id="purchase_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="2500.00"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="battery_capacity">Capacidade da Bateria (Wh)</Label>
                        <Input
                          id="battery_capacity"
                          type="number"
                          min="0"
                          placeholder="350"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Exemplo: 36V x 10Ah = 360Wh
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="autonomy">Autonomia (km)</Label>
                        <Input
                          id="autonomy"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="25"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Distância com bateria cheia
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="battery_lifespan">Vida Útil da Bateria (ciclos)</Label>
                        <Input
                          id="battery_lifespan"
                          type="number"
                          min="0"
                          placeholder="500"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="battery_replacement_cost">Custo de Reposição da Bateria (R$)</Label>
                        <Input
                          id="battery_replacement_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="800.00"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    Padrão de Uso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="daily_distance">Distância Diária (km)</Label>
                        <Input
                          id="daily_distance"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="10"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="days_per_week">Dias de Uso por Semana</Label>
                        <Input
                          id="days_per_week"
                          type="number"
                          min="0"
                          max="7"
                          placeholder="5"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="electricity_cost">Custo da Eletricidade (R$/kWh)</Label>
                        <Input
                          id="electricity_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.75"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="annual_maintenance">Manutenção Anual (R$)</Label>
                        <Input
                          id="annual_maintenance"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="200.00"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="insurance_cost">Seguro Anual (R$)</Label>
                        <Input
                          id="insurance_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="150.00"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Opcional: seguro contra roubo/danos
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accessories_cost">Acessórios (R$)</Label>
                        <Input
                          id="accessories_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="300.00"
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Capacete, cadeado, luzes, etc.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bus className="h-5 w-5 text-blue-600" />
                    Comparação com Outros Transportes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Bus className="h-4 w-4" />
                        Transporte Público
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bus_ticket_price">Valor da Passagem (R$)</Label>
                        <Input
                          id="bus_ticket_price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="4.40"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="daily_trips">Viagens por Dia</Label>
                        <Input
                          id="daily_trips"
                          type="number"
                          min="0"
                          placeholder="2"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Veículo Particular
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fuel_cost">Custo de Combustível (R$/km)</Label>
                        <Input
                          id="fuel_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.50"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parking_cost">Estacionamento Mensal (R$)</Label>
                        <Input
                          id="parking_cost"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="200.00"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
                      <Calculator className="h-5 w-5 mr-2" />
                      Calcular e Comparar Custos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Example Results (Static for demonstration) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resultado da Análise (Exemplo)
            </h2>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-sm text-blue-600 dark:text-blue-400">Custo Total (3 anos)</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">R$ 4.650</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">R$ 129/mês</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-sm text-green-600 dark:text-green-400">Economia vs Ônibus</div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">R$ 3.120</div>
                    <div className="text-xs text-green-700 dark:text-green-300">em 3 anos</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-sm text-purple-600 dark:text-purple-400">Economia vs Carro</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">R$ 15.840</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">em 3 anos</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="text-sm text-orange-600 dark:text-orange-400">Retorno do Investimento</div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">8 meses</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">vs transporte público</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custos do Equipamento (3 anos)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Aquisição</span>
                      <span className="font-medium">R$ 2.500,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Eletricidade</span>
                      <span className="font-medium">R$ 180,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Manutenção</span>
                      <span className="font-medium">R$ 600,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Reposição de Bateria</span>
                      <span className="font-medium">R$ 800,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Seguro</span>
                      <span className="font-medium">R$ 450,00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Acessórios</span>
                      <span className="font-medium">R$ 300,00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>R$ 4.650,00</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Custo por km</span>
                      <span>R$ 0,16</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comparação de Custos (3 anos)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Patinete Elétrico</span>
                        <span className="text-sm font-medium">R$ 4.650</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Transporte Público</span>
                        <span className="text-sm font-medium">R$ 7.920</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{width: '40%'}}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Veículo Particular</span>
                        <span className="text-sm font-medium">R$ 20.520</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '100%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights */}
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-green-900 dark:text-green-100">
                      Análise de Economia
                    </h3>
                    <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <li>• Você economizará <strong>R$ 87/mês</strong> comparado ao transporte público</li>
                      <li>• A economia vs carro particular é de <strong>R$ 440/mês</strong></li>
                      <li>• O investimento se paga em <strong>8 meses</strong> vs transporte público</li>
                      <li>• Redução de <strong>95%</strong> nas emissões de CO₂ vs carro</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                    Dicas para Economizar Ainda Mais:
                  </h4>
                  <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                    <li>• Faça manutenção preventiva regularmente para evitar gastos maiores</li>
                    <li>• Carregue a bateria corretamente para prolongar sua vida útil</li>
                    <li>• Compare preços de seguros e escolha coberturas adequadas</li>
                    <li>• Aproveite descontos em compras coletivas de acessórios</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Pronto para economizar?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ferramentas/verificador-conformidade"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Verificar Conformidade
              </Link>
              <Link
                href="/videos?category=review"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Ver Reviews de Equipamentos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
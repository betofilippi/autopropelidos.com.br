import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Map, Navigation, Clock, Shield, Battery, MapPin, 
  AlertTriangle, Bike, Mountain, Download, Share2, 
  Info, Ban, ParkingCircle, Zap, TrafficCone,
  Gauge, Route, Heart
} from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Planejador de Rotas - Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Planeje rotas seguras para seu equipamento autopropelido. Encontre ciclofaixas, evite áreas proibidas e otimize seus trajetos.',
  keywords: 'planejador rotas, ciclofaixa, patinete elétrico, bicicleta elétrica, navegação, segurança, trajeto'
}

export default function PlanejadorRotas() {
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
                  Rotas Seguras
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Planejador de Rotas
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Planeje trajetos seguros e otimizados para seu equipamento autopropelido
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Information Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Route className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="font-semibold">3 Rotas</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Opções de trajeto</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-semibold">Segurança</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Nota de 0-10</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Bike className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="font-semibold">Ciclofaixas</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Km disponíveis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Battery className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="font-semibold">Autonomia</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Consumo bateria</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Route Planner */}
          <Tabs defaultValue="route" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="route">Planejar Rota</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="restrictions">Restrições</TabsTrigger>
            </TabsList>

            <TabsContent value="route" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    Dados da Rota
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Origin and Destination */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origem</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="origin"
                          type="text"
                          placeholder="Digite o endereço de partida"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">Destino</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="destination"
                          type="text"
                          placeholder="Digite o endereço de destino"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Add Stops */}
                    <Button variant="outline" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Adicionar Parada
                    </Button>
                  </div>

                  <Separator />

                  {/* Equipment Type */}
                  <div className="space-y-4">
                    <Label>Tipo de Equipamento</Label>
                    <RadioGroup defaultValue="electric_scooter">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="electric_scooter" id="electric_scooter" />
                          <Label htmlFor="electric_scooter" className="font-normal cursor-pointer">
                            Patinete Elétrico
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="electric_bike" id="electric_bike" />
                          <Label htmlFor="electric_bike" className="font-normal cursor-pointer">
                            Bicicleta Elétrica
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="electric_skateboard" id="electric_skateboard" />
                          <Label htmlFor="electric_skateboard" className="font-normal cursor-pointer">
                            Skate Elétrico
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="font-normal cursor-pointer">
                            Outro Equipamento
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Route Type */}
                  <div className="space-y-4">
                    <Label>Tipo de Rota Preferida</Label>
                    <RadioGroup defaultValue="safest">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="safest" id="safest" className="mt-1" />
                          <div className="space-y-1">
                            <Label htmlFor="safest" className="font-normal cursor-pointer">
                              Mais Segura
                            </Label>
                            <p className="text-sm text-gray-500">Prioriza ciclofaixas e vias com menor tráfego</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="shortest" id="shortest" className="mt-1" />
                          <div className="space-y-1">
                            <Label htmlFor="shortest" className="font-normal cursor-pointer">
                              Mais Curta
                            </Label>
                            <p className="text-sm text-gray-500">Menor distância possível</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="fastest" id="fastest" className="mt-1" />
                          <div className="space-y-1">
                            <Label htmlFor="fastest" className="font-normal cursor-pointer">
                              Mais Rápida
                            </Label>
                            <p className="text-sm text-gray-500">Menor tempo estimado</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value="bike_lanes" id="bike_lanes" className="mt-1" />
                          <div className="space-y-1">
                            <Label htmlFor="bike_lanes" className="font-normal cursor-pointer">
                              Máximo de Ciclofaixas
                            </Label>
                            <p className="text-sm text-gray-500">Usa o máximo possível de infraestrutura ciclável</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="text-center">
                    <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-700">
                      <Map className="h-5 w-5 mr-2" />
                      Calcular Rotas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    Preferências de Rota
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox id="avoid_hills" />
                      <Label htmlFor="avoid_hills" className="font-normal cursor-pointer">
                        Evitar subidas íngremes (acima de 10% de inclinação)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="charging_stations" />
                      <Label htmlFor="charging_stations" className="font-normal cursor-pointer">
                        Mostrar pontos de recarga no trajeto
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="parking_spots" />
                      <Label htmlFor="parking_spots" className="font-normal cursor-pointer">
                        Incluir locais de estacionamento para autopropelidos
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="low_traffic" />
                      <Label htmlFor="low_traffic" className="font-normal cursor-pointer">
                        Preferir vias com menor tráfego
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Checkbox id="well_lit" />
                      <Label htmlFor="well_lit" className="font-normal cursor-pointer">
                        Priorizar vias bem iluminadas (rotas noturnas)
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label htmlFor="max_distance">Distância Máxima Aceitável (km)</Label>
                    <Input
                      id="max_distance"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Ex: 15"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="battery_capacity">Autonomia da Bateria (km)</Label>
                    <Input
                      id="battery_capacity"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Ex: 25"
                    />
                    <p className="text-xs text-gray-500">
                      Será alertado se a rota exceder 80% da autonomia
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="restrictions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-blue-600" />
                    Restrições e Regulamentações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                          Importante sobre restrições locais
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                          As restrições variam por cidade. Sempre verifique as regulamentações locais antes de circular.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Áreas a Evitar</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="avoid_highways" defaultChecked />
                        <Label htmlFor="avoid_highways" className="font-normal cursor-pointer">
                          Rodovias e vias expressas (proibido por lei)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox id="avoid_tunnels" defaultChecked />
                        <Label htmlFor="avoid_tunnels" className="font-normal cursor-pointer">
                          Túneis (geralmente proibidos)
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox id="avoid_bridges" />
                        <Label htmlFor="avoid_bridges" className="font-normal cursor-pointer">
                          Pontes sem ciclofaixa
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox id="avoid_pedestrian" defaultChecked />
                        <Label htmlFor="avoid_pedestrian" className="font-normal cursor-pointer">
                          Calçadas e áreas exclusivas de pedestres
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold">Limites de Velocidade</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="max_speed">Velocidade Máxima do Equipamento (km/h)</Label>
                      <Select defaultValue="20">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 km/h (calçada compartilhada)</SelectItem>
                          <SelectItem value="20">20 km/h (ciclofaixa)</SelectItem>
                          <SelectItem value="25">25 km/h (limite legal)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                        Regulamentação CONTRAN 996/2023
                      </h4>
                      <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                        <li>• Velocidade máxima: 25 km/h (limitada de fábrica)</li>
                        <li>• Idade mínima: 14 anos</li>
                        <li>• Circulação: ciclofaixas, ciclovias e acostamentos</li>
                        <li>• Proibido em calçadas (exceto se permitido localmente)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Example Route Results (Static for demonstration) */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Rotas Sugeridas (Exemplo)
            </h2>

            {/* Map Placeholder */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 h-64 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Visualização do Mapa
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    As rotas serão exibidas aqui
                  </p>
                </div>
              </div>
            </Card>

            {/* Route Options */}
            <div className="space-y-4">
              {/* Route 1 - Safest */}
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 dark:bg-green-900/50 text-green-600 p-2 rounded-lg">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Rota Mais Segura</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 mt-1">
                          Recomendada
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">9.2</div>
                      <div className="text-xs text-gray-500">Nota Segurança</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-gray-400" />
                          Distância
                        </span>
                        <span className="font-medium">8.5 km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Tempo estimado
                        </span>
                        <span className="font-medium">28 min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Bike className="h-4 w-4 text-gray-400" />
                          Ciclofaixas
                        </span>
                        <span className="font-medium">7.2 km (85%)</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-gray-400" />
                          Consumo de bateria
                        </span>
                        <span className="font-medium">34%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Mountain className="h-4 w-4 text-gray-400" />
                          Elevação total
                        </span>
                        <span className="font-medium">45m</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-gray-400" />
                          Velocidade média
                        </span>
                        <span className="font-medium">18 km/h</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <TrafficCone className="h-4 w-4 text-gray-400" />
                          Nível de tráfego
                        </span>
                        <span className="font-medium text-green-600">Baixo</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-gray-400" />
                          Pontos de recarga
                        </span>
                        <span className="font-medium">2 no trajeto</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Principais vias do trajeto:</h4>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Ciclovia da Av. Paulista (2.3 km)</li>
                      <li>• Ciclofaixa da Rua Augusta (1.8 km)</li>
                      <li>• Ciclovia do Parque Ibirapuera (3.5 km)</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Iniciar Navegação
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Route 2 - Shortest */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 p-2 rounded-lg">
                        <Route className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Rota Mais Curta</CardTitle>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">7.5</div>
                      <div className="text-xs text-gray-500">Nota Segurança</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-gray-400" />
                          Distância
                        </span>
                        <span className="font-medium">6.8 km</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          Tempo estimado
                        </span>
                        <span className="font-medium">22 min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Bike className="h-4 w-4 text-gray-400" />
                          Ciclofaixas
                        </span>
                        <span className="font-medium">4.1 km (60%)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Battery className="h-4 w-4 text-gray-400" />
                          Consumo de bateria
                        </span>
                        <span className="font-medium">27%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <TrafficCone className="h-4 w-4 text-gray-400" />
                          Nível de tráfego
                        </span>
                        <span className="font-medium text-yellow-600">Médio</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-yellow-800 dark:text-yellow-400">
                          Esta rota inclui 2.7 km em vias compartilhadas com veículos. Redobre a atenção.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Iniciar Navegação
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Safety Tips */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Info className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-blue-900 dark:text-blue-100">
                      Dicas de Segurança para o Trajeto
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li>• Use sempre capacete e equipamentos de proteção</li>
                      <li>• Respeite a velocidade máxima de 20 km/h em ciclofaixas</li>
                      <li>• Sinalize com antecedência suas manobras</li>
                      <li>• Mantenha distância segura de veículos e pedestres</li>
                      <li>• Evite usar fones de ouvido durante o trajeto</li>
                      <li>• Em dias de chuva, reduza a velocidade e aumente a distância de frenagem</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Regulations Alert */}
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
                      Regulamentações Locais Detectadas
                    </h4>
                    <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>• São Paulo: Obrigatório registro e placa de identificação</li>
                      <li>• Velocidade máxima em ciclofaixas: 20 km/h</li>
                      <li>• Proibido circular em calçadas (multa de R$ 195,23)</li>
                      <li>• Uso de capacete obrigatório para menores de 18 anos</li>
                    </ul>
                    <Link 
                      href="/ferramentas/buscador-regulamentacoes"
                      className="inline-flex items-center text-yellow-800 dark:text-yellow-400 hover:underline mt-3 font-medium"
                    >
                      Ver todas as regulamentações →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Exportar Rota
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <Map className="h-8 w-8 text-blue-600" />
                    <span>Google Maps</span>
                    <span className="text-xs text-gray-500">Abrir no app</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <Navigation className="h-8 w-8 text-green-600" />
                    <span>Waze</span>
                    <span className="text-xs text-gray-500">Navegação GPS</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <Download className="h-8 w-8 text-purple-600" />
                    <span>GPX</span>
                    <span className="text-xs text-gray-500">Arquivo GPS</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Próximos passos</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ferramentas/checklist-seguranca"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Checklist de Segurança
              </Link>
              <Link
                href="/ferramentas/guia-documentacao"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Documentação Necessária
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
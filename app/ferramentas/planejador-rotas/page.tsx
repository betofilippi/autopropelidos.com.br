'use client'

import { Metadata } from 'next'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
  Gauge, Route, Heart, Loader2, Target, Play
} from "lucide-react"
import Link from 'next/link'
import { useToast } from '@/lib/hooks/use-toast'

interface RouteFormData {
  origin: string
  destination: string
  equipmentType: string
  routePreference: string
  avoidHighways: boolean
  preferCycleLanes: boolean
  avoidHills: boolean
  batteryCapacity: number
  currentBattery: number
  includePoi: boolean
}

interface RouteResult {
  distance: number
  duration: number
  batteryUsage: number
  safetyScore: number
  difficulty: 'fácil' | 'médio' | 'difícil'
  waypoints: Array<{
    name: string
    type: 'origin' | 'destination' | 'poi' | 'charging' | 'rest'
    coordinates: [number, number]
    description: string
  }>
  warnings: string[]
  recommendations: string[]
  cycleLanePercentage: number
  estimatedCost: number
}

interface PointOfInterest {
  id: string
  name: string
  type: 'parking' | 'charging' | 'repair' | 'rest' | 'danger'
  coordinates: [number, number]
  description: string
}

const mockPOIs: PointOfInterest[] = [
  {
    id: '1',
    name: 'Estação Tembici - Vila Madalena',
    type: 'parking',
    coordinates: [-46.690583, -23.554061],
    description: 'Estação de compartilhamento com bicicletário'
  },
  {
    id: '2',
    name: 'Posto de Carregamento - Shopping',
    type: 'charging',
    coordinates: [-46.691234, -23.553456],
    description: 'Tomadas disponíveis para carregamento'
  },
  {
    id: '3',
    name: 'Oficina Bike & E-bike',
    type: 'repair',
    coordinates: [-46.689876, -23.555123],
    description: 'Reparo de bicicletas e patinetes elétricos'
  }
]

export default function PlanejadorRotas() {
  const [isPlanning, setIsPlanning] = useState(false)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [activeTab, setActiveTab] = useState('planning')
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RouteFormData>({
    defaultValues: {
      origin: '',
      destination: '',
      equipmentType: 'electric_scooter',
      routePreference: 'safest',
      avoidHighways: true,
      preferCycleLanes: true,
      avoidHills: false,
      batteryCapacity: 350,
      currentBattery: 80,
      includePoi: true
    }
  })

  const routePreference = watch('routePreference')
  const equipmentType = watch('equipmentType')
  const currentBattery = watch('currentBattery')

  useEffect(() => {
    // Obter localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          console.log('Erro ao obter localização:', error)
        }
      )
    }
  }, [])

  const planRoute = async (data: RouteFormData) => {
    setIsPlanning(true)
    
    // Simular planejamento de rota
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Simular cálculos baseados nos parâmetros
    const baseDistance = 8.5 + (Math.random() * 5) // 8.5-13.5 km
    const distanceMultiplier = data.routePreference === 'fastest' ? 0.9 : 
                              data.routePreference === 'safest' ? 1.2 : 1.0
    const distance = baseDistance * distanceMultiplier
    
    const baseSpeed = data.equipmentType === 'electric_bike' ? 25 : 20 // km/h
    const speedMultiplier = data.avoidHills ? 1.0 : 0.8
    const actualSpeed = baseSpeed * speedMultiplier
    const duration = (distance / actualSpeed) * 60 // minutos
    
    const batteryEfficiency = data.equipmentType === 'electric_bike' ? 15 : 25 // Wh/km
    const batteryUsage = (distance * batteryEfficiency)
    const batteryUsagePercent = (batteryUsage / data.batteryCapacity) * 100
    
    const cycleLanePercentage = data.preferCycleLanes ? 75 + (Math.random() * 20) : 30 + (Math.random() * 30)
    const safetyScore = Math.max(0, Math.min(10, 
      8 + (cycleLanePercentage - 50) * 0.05 + (data.avoidHighways ? 1 : -1)
    ))
    
    const difficulty = batteryUsagePercent > 60 || distance > 12 ? 'difícil' :
                      batteryUsagePercent > 30 || distance > 8 ? 'médio' : 'fácil'
    
    const warnings = []
    const recommendations = []
    
    if (batteryUsagePercent > 80) {
      warnings.push('Bateria pode não ser suficiente para o trajeto completo')
      recommendations.push('Considere carregar a bateria antes da viagem')
    }
    
    if (cycleLanePercentage < 50) {
      warnings.push('Rota possui trechos com pouca infraestrutura cicloviária')
      recommendations.push('Use equipamentos de proteção e sinalizadores')
    }
    
    if (safetyScore < 7) {
      warnings.push('Rota apresenta alguns riscos de segurança')
      recommendations.push('Evite horários de trânsito intenso')
    }
    
    const mockRoute: RouteResult = {
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(duration),
      batteryUsage: Math.round(batteryUsagePercent),
      safetyScore: Math.round(safetyScore * 10) / 10,
      difficulty,
      cycleLanePercentage: Math.round(cycleLanePercentage),
      estimatedCost: 0, // Gratuito para equipamentos próprios
      waypoints: [
        {
          name: data.origin || 'Ponto de Partida',
          type: 'origin',
          coordinates: [-46.690583, -23.554061],
          description: 'Início da jornada'
        },
        {
          name: 'Ciclofaixa da Rua Augusta',
          type: 'poi',
          coordinates: [-46.641234, -23.553456],
          description: 'Trecho com ciclofaixa protegida'
        },
        {
          name: 'Parque Villa-Lobos',
          type: 'rest',
          coordinates: [-46.689876, -23.555123],
          description: 'Área de descanso com bebedouros'
        },
        {
          name: data.destination || 'Destino Final',
          type: 'destination',
          coordinates: [-46.630987, -23.545789],
          description: 'Destino da viagem'
        }
      ],
      warnings,
      recommendations
    }
    
    setRoute(mockRoute)
    setIsPlanning(false)
    setActiveTab('result')
    
    toast({
      title: "🗺️ Rota planejada!",
      description: `${mockRoute.distance}km em ${mockRoute.duration} minutos - Segurança: ${mockRoute.safetyScore}/10`
    })
  }

  const onSubmit = (data: RouteFormData) => {
    if (!data.origin || !data.destination) {
      toast({
        title: "Erro na validação",
        description: "Origem e destino são obrigatórios",
        variant: "destructive"
      })
      return
    }
    planRoute(data)
  }

  const useCurrentLocation = () => {
    if (currentLocation) {
      setValue('origin', 'Localização Atual')
      toast({
        title: "📍 Localização definida",
        description: "Usando sua localização atual como origem"
      })
    } else {
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização",
        variant: "destructive"
      })
    }
  }

  const shareRoute = () => {
    if (route) {
      const routeData = {
        distance: route.distance,
        duration: route.duration,
        safetyScore: route.safetyScore,
        url: window.location.href
      }
      
      if (navigator.share) {
        navigator.share({
          title: 'Rota Planejada - Autopropelidos',
          text: `Rota de ${route.distance}km em ${route.duration} minutos`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(JSON.stringify(routeData, null, 2))
        toast({
          title: "🔗 Rota copiada!",
          description: "Dados da rota copiados para a área de transferência"
        })
      }
    }
  }

  const downloadRoute = () => {
    if (route) {
      const routeData = {
        timestamp: new Date().toISOString(),
        route
      }
      
      const blob = new Blob([JSON.stringify(routeData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rota-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "📄 Rota baixada!",
        description: "Arquivo da rota salvo em seu dispositivo"
      })
    }
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Battery Status */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Battery className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-semibold">Nível da Bateria</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Atual: {currentBattery}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{currentBattery}%</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${currentBattery}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Planner */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="planning">Planejamento</TabsTrigger>
                <TabsTrigger value="preferences">Preferências</TabsTrigger>
                <TabsTrigger value="result" disabled={!route}>Resultado</TabsTrigger>
              </TabsList>

              <TabsContent value="planning" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Origem e Destino
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin">Origem</Label>
                      <div className="flex gap-2">
                        <Input
                          id="origin"
                          placeholder="Digite o endereço de origem"
                          className="flex-1"
                          {...register('origin')}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={useCurrentLocation}
                          title="Usar localização atual"
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destino</Label>
                      <Input
                        id="destination"
                        placeholder="Digite o endereço de destino"
                        {...register('destination')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="equipment_type">Tipo de Equipamento</Label>
                      <Select onValueChange={(value) => setValue('equipmentType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione seu equipamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electric_scooter">Patinete Elétrico</SelectItem>
                          <SelectItem value="electric_bike">Bicicleta Elétrica</SelectItem>
                          <SelectItem value="electric_skateboard">Skate Elétrico</SelectItem>
                          <SelectItem value="monowheel">Monociclo Elétrico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Battery className="h-5 w-5 text-blue-600" />
                      Informações da Bateria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="battery_capacity">Capacidade da Bateria (Wh)</Label>
                        <Input
                          id="battery_capacity"
                          type="number"
                          placeholder="350"
                          {...register('batteryCapacity', { valueAsNumber: true })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current_battery">Nível Atual (%)</Label>
                        <Input
                          id="current_battery"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="80"
                          {...register('currentBattery', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-blue-600" />
                      Preferências de Rota
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Tipo de Rota Preferida</Label>
                      <RadioGroup 
                        value={routePreference} 
                        onValueChange={(value) => setValue('routePreference', value)}
                        className="grid grid-cols-1 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fastest" id="fastest" />
                          <Label htmlFor="fastest" className="font-normal flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            Mais Rápida - Minimize o tempo de viagem
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="safest" id="safest" />
                          <Label htmlFor="safest" className="font-normal flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Mais Segura - Priorize ciclofaixas e vias seguras
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="balanced" id="balanced" />
                          <Label htmlFor="balanced" className="font-normal flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            Balanceada - Equilibrio entre tempo e segurança
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Opções Avançadas</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="avoid_highways"
                            {...register('avoidHighways')}
                          />
                          <Label htmlFor="avoid_highways" className="flex items-center gap-2">
                            <Ban className="h-4 w-4" />
                            Evitar rodovias e vias de trânsito rápido
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="prefer_cycle_lanes"
                            {...register('preferCycleLanes')}
                          />
                          <Label htmlFor="prefer_cycle_lanes" className="flex items-center gap-2">
                            <Bike className="h-4 w-4" />
                            Priorizar ciclofaixas e ciclovias
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="avoid_hills"
                            {...register('avoidHills')}
                          />
                          <Label htmlFor="avoid_hills" className="flex items-center gap-2">
                            <Mountain className="h-4 w-4" />
                            Evitar subidas íngremes
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="include_poi"
                            {...register('includePoi')}
                          />
                          <Label htmlFor="include_poi" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Incluir pontos de interesse (carregamento, reparo, etc.)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
                    disabled={isPlanning}
                  >
                    {isPlanning ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Planejando rota...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-5 w-5 mr-2" />
                        Planejar Rota
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="result" className="space-y-6">
                {route && (
                  <>
                    {/* Route Summary */}
                    <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Route className="h-5 w-5 text-blue-600" />
                            Rota Planejada
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={shareRoute}
                              className="flex items-center gap-2"
                            >
                              <Share2 className="h-4 w-4" />
                              Compartilhar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={downloadRoute}
                              className="flex items-center gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Baixar
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <Route className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                            <div className="font-medium">Distância</div>
                            <div className="text-2xl font-bold text-blue-600">{route.distance} km</div>
                          </div>
                          
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <div className="font-medium">Tempo</div>
                            <div className="text-2xl font-bold text-green-600">{route.duration} min</div>
                          </div>
                          
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <Battery className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                            <div className="font-medium">Bateria</div>
                            <div className="text-2xl font-bold text-orange-600">{route.batteryUsage}%</div>
                          </div>
                          
                          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                            <div className="font-medium">Segurança</div>
                            <div className="text-2xl font-bold text-purple-600">{route.safetyScore}/10</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Dificuldade:</span>
                              <Badge variant={route.difficulty === 'fácil' ? 'default' : route.difficulty === 'médio' ? 'secondary' : 'destructive'}>
                                {route.difficulty}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Ciclofaixas:</span>
                              <span className="font-medium">{route.cycleLanePercentage}% da rota</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Custo estimado:</span>
                              <span className="font-medium text-green-600">Gratuito</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Waypoints:</span>
                              <span className="font-medium">{route.waypoints.length} pontos</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Warnings and Recommendations */}
                    {(route.warnings.length > 0 || route.recommendations.length > 0) && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {route.warnings.length > 0 && (
                          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                                <AlertTriangle className="h-5 w-5" />
                                Avisos
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {route.warnings.map((warning, index) => (
                                  <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-0.5">•</span>
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                        
                        {route.recommendations.length > 0 && (
                          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-400">
                                <Info className="h-5 w-5" />
                                Recomendações
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {route.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                    
                    {/* Waypoints */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          Pontos da Rota
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {route.waypoints.map((waypoint, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className={`p-2 rounded-full ${
                                waypoint.type === 'origin' ? 'bg-green-100 text-green-600' :
                                waypoint.type === 'destination' ? 'bg-red-100 text-red-600' :
                                waypoint.type === 'poi' ? 'bg-blue-100 text-blue-600' :
                                waypoint.type === 'charging' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                {waypoint.type === 'origin' && <Play className="h-4 w-4" />}
                                {waypoint.type === 'destination' && <Target className="h-4 w-4" />}
                                {waypoint.type === 'poi' && <Info className="h-4 w-4" />}
                                {waypoint.type === 'charging' && <Zap className="h-4 w-4" />}
                                {waypoint.type === 'rest' && <ParkingCircle className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{waypoint.name}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{waypoint.description}</div>
                              </div>
                              <div className="text-sm text-gray-500">
                                {index + 1}/{route.waypoints.length}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Action Buttons */}
                    <div className="text-center space-y-4">
                      <Button 
                        size="lg" 
                        className="px-8 py-3 bg-green-600 hover:bg-green-700"
                        onClick={() => window.open(`https://www.google.com/maps/dir/${route.waypoints[0].coordinates[1]},${route.waypoints[0].coordinates[0]}/${route.waypoints[route.waypoints.length - 1].coordinates[1]},${route.waypoints[route.waypoints.length - 1].coordinates[0]}`, '_blank')}
                      >
                        <Navigation className="h-5 w-5 mr-2" />
                        Iniciar Navegação
                      </Button>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Abre no Google Maps para navegação turn-by-turn
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </form>
          
          {/* Information Card */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                  <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                    Como funciona o planejador?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Nossa ferramenta analisa múltiplos fatores para criar a rota ideal: infraestrutura 
                    cicloviária, segurança do trânsito, topografia, pontos de interesse e autonomia da bateria.
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Dica:</strong> Configure suas preferências na aba "Preferências" para obter 
                    rotas personalizadas para seu estilo de condução e equipamento.
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
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Verificador de Conformidade
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Certifique-se de que seu equipamento está em conformidade antes de viajar.
                    </p>
                    <Link
                      href="/ferramentas/verificador-conformidade"
                      className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Verificar agora
                      <Navigation className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                    <Gauge className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      Calculadora de Custos
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      Compare os custos da sua rota com outros meios de transporte.
                    </p>
                    <Link
                      href="/ferramentas/calculadora-custos"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                    >
                      Calcular custos
                      <Navigation className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
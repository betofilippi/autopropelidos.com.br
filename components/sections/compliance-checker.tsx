"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle, Calculator } from "lucide-react"
import { useState } from "react"

interface VehicleSpecs {
  category: string
  power: number
  maxSpeed: number
  hasPedalAssist: boolean
  hasThrottle: boolean
  width?: number
  wheelbase?: number
}

interface ComplianceResult {
  isCompliant: boolean
  category: string
  requirements: string[]
  warnings: string[]
  nextSteps: string[]
}

export default function ComplianceChecker() {
  const [specs, setSpecs] = useState<VehicleSpecs>({
    category: '',
    power: 0,
    maxSpeed: 0,
    hasPedalAssist: false,
    hasThrottle: false
  })
  const [result, setResult] = useState<ComplianceResult | null>(null)

  const checkCompliance = () => {
    let category = ''
    let isCompliant = true
    let requirements: string[] = []
    let warnings: string[] = []
    let nextSteps: string[] = []

    // Determine category based on specifications
    if (specs.power <= 1000 && specs.maxSpeed <= 32 && specs.hasPedalAssist && !specs.hasThrottle) {
      category = 'Bicicleta Elétrica'
      requirements = [
        'Velocímetro ou limitador eletrônico',
        'Campainha',
        'Sinalização noturna (dianteira, traseira e lateral)',
        'Espelho retrovisor esquerdo',
        'Pneus em bom estado'
      ]
      nextSteps = [
        'Verificar equipamentos obrigatórios',
        'Utilizar apenas ciclovias e vias permitidas',
        'Usar equipamentos de proteção individual'
      ]
    } else if (
      specs.power <= 1000 && 
      specs.maxSpeed <= 32 && 
      (!specs.width || specs.width <= 70) &&
      (!specs.wheelbase || specs.wheelbase <= 130)
    ) {
      category = 'Autopropelido'
      requirements = [
        'Velocímetro e/ou limitador eletrônico',
        'Sinalização noturna incorporada',
        'Sistema de autoequilíbrio (quando aplicável)'
      ]
      nextSteps = [
        'Circular apenas em calçadas (máx. 6km/h), ciclovias ou vias até 40km/h',
        'Usar equipamentos de proteção individual',
        'Verificar regulamentação municipal específica'
      ]
    } else if (specs.power <= 4000 && specs.maxSpeed <= 50) {
      category = 'Ciclomotor'
      requirements = [
        'Registro no DETRAN',
        'Emplacamento obrigatório',
        'Carteira de habilitação (CNH Cat. A ou ACC)',
        'Equipamentos obrigatórios do CTB'
      ]
      warnings = [
        'Prazo para regularização: até 31/12/2025',
        'Multa por circular sem registro: R$ 574,62 + apreensão'
      ]
      nextSteps = [
        'Registrar o veículo no DETRAN',
        'Obter habilitação adequada',
        'Instalar equipamentos obrigatórios',
        'Fazer vistoria técnica'
      ]
    } else {
      category = 'Não Classificado'
      isCompliant = false
      warnings = [
        'Especificações não se enquadram na Resolução 996',
        'Veículo pode não ser permitido para uso urbano'
      ]
      nextSteps = [
        'Consultar DETRAN local',
        'Verificar regulamentação específica',
        'Considerar adequação às normas'
      ]
    }

    setResult({
      isCompliant,
      category,
      requirements,
      warnings,
      nextSteps
    })
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Verificador de Conformidade
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Descubra em qual categoria seu veículo se encaixa e quais são os requisitos
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Especificações do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="power">Potência do Motor (W)</Label>
                    <Input
                      id="power"
                      type="number"
                      placeholder="ex: 1000"
                      value={specs.power || ''}
                      onChange={(e) => setSpecs({...specs, power: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxSpeed">Velocidade Máxima (km/h)</Label>
                    <Input
                      id="maxSpeed"
                      type="number"
                      placeholder="ex: 25"
                      value={specs.maxSpeed || ''}
                      onChange={(e) => setSpecs({...specs, maxSpeed: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="assistance">Tipo de Assistência</Label>
                  <Select onValueChange={(value) => {
                    if (value === 'pedal') {
                      setSpecs({...specs, hasPedalAssist: true, hasThrottle: false})
                    } else if (value === 'throttle') {
                      setSpecs({...specs, hasPedalAssist: false, hasThrottle: true})
                    } else if (value === 'both') {
                      setSpecs({...specs, hasPedalAssist: true, hasThrottle: true})
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de assistência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pedal">Apenas assistência ao pedalar</SelectItem>
                      <SelectItem value="throttle">Apenas acelerador manual</SelectItem>
                      <SelectItem value="both">Ambos (pedal + acelerador)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Largura (cm) - Opcional</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="ex: 60"
                      value={specs.width || ''}
                      onChange={(e) => setSpecs({...specs, width: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wheelbase">Entre-eixos (cm) - Opcional</Label>
                    <Input
                      id="wheelbase"
                      type="number"
                      placeholder="ex: 120"
                      value={specs.wheelbase || ''}
                      onChange={(e) => setSpecs({...specs, wheelbase: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <Button onClick={checkCompliance} className="w-full" size="lg">
                  Verificar Conformidade
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result.isCompliant ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Resultado da Análise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge className={
                      result.category === 'Bicicleta Elétrica' ? 'bg-green-100 text-green-800' :
                      result.category === 'Autopropelido' ? 'bg-blue-100 text-blue-800' :
                      result.category === 'Ciclomotor' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {result.category}
                    </Badge>
                  </div>

                  {result.requirements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Requisitos Obrigatórios:</h4>
                      <ul className="space-y-1">
                        {result.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-orange-600">Atenção:</h4>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Próximos Passos:</h4>
                    <ul className="space-y-1">
                      {result.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
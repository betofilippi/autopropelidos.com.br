'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Printer,
  Calendar,
  Clock,
  Heart,
  Phone,
  Info,
  Wrench,
  Eye,
  HardHat,
  Flashlight,
  AlertCircle,
  ShieldCheck,
  Settings,
  FileText
} from "lucide-react"

// Types for checklist items
interface ChecklistItem {
  id: string
  label: string
  description: string
  importance: 'critical' | 'important' | 'recommended'
  checked: boolean
  category: string
}

interface ChecklistCategory {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  items: ChecklistItem[]
}


export default function ChecklistSeguranca() {
  const [checklists, setChecklists] = useState<ChecklistCategory[]>([
    {
      id: 'pre-ride',
      title: 'Verificação Pré-Uso',
      icon: <Eye className="h-5 w-5" />,
      description: 'Checklist diário antes de cada uso',
      items: [
        {
          id: 'pr1',
          label: 'Freios funcionando corretamente',
          description: 'Teste ambos os freios (dianteiro e traseiro) verificando se param o veículo adequadamente',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr2',
          label: 'Pneus com pressão adequada',
          description: 'Verifique a calibragem recomendada pelo fabricante (geralmente entre 40-60 PSI)',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr3',
          label: 'Guidão firme e alinhado',
          description: 'Certifique-se que o guidão está bem fixado e alinhado com a roda dianteira',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr4',
          label: 'Bateria carregada suficientemente',
          description: 'Verifique se há carga suficiente para seu trajeto planejado',
          importance: 'important',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr5',
          label: 'Luzes funcionando (dianteira e traseira)',
          description: 'Teste todas as luzes, especialmente importante para uso noturno',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr6',
          label: 'Buzina ou campainha funcionando',
          description: 'Dispositivo de alerta sonoro em bom funcionamento',
          importance: 'important',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr7',
          label: 'Estrutura sem rachaduras ou danos',
          description: 'Inspecione visualmente o chassi, deck ou quadro',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr8',
          label: 'Acelerador respondendo suavemente',
          description: 'Teste o acelerador verificando resposta gradual sem travamentos',
          importance: 'critical',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr9',
          label: 'Refletores limpos e visíveis',
          description: 'Limpe e verifique todos os refletores laterais e traseiros',
          importance: 'important',
          checked: false,
          category: 'pre-ride'
        },
        {
          id: 'pr10',
          label: 'Parafusos e conexões apertados',
          description: 'Verifique se não há peças soltas ou parafusos frouxos',
          importance: 'important',
          checked: false,
          category: 'pre-ride'
        }
      ]
    },
    {
      id: 'safety-equipment',
      title: 'Equipamentos de Segurança',
      icon: <HardHat className="h-5 w-5" />,
      description: 'Equipamentos de proteção individual obrigatórios e recomendados',
      items: [
        {
          id: 'se1',
          label: 'Capacete apropriado e bem ajustado',
          description: 'Capacete certificado pelo INMETRO, ajustado corretamente na cabeça',
          importance: 'critical',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se2',
          label: 'Luzes dianteiras (branca)',
          description: 'Luz branca ou amarela na frente, visível a pelo menos 30 metros',
          importance: 'critical',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se3',
          label: 'Luzes traseiras (vermelha)',
          description: 'Luz vermelha atrás, preferencialmente piscante para maior visibilidade',
          importance: 'critical',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se4',
          label: 'Refletores laterais',
          description: 'Refletores nas rodas ou laterais do equipamento',
          importance: 'important',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se5',
          label: 'Roupas claras ou refletivas',
          description: 'Use roupas de cores claras ou com faixas refletivas, especialmente à noite',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se6',
          label: 'Luvas de proteção',
          description: 'Protegem as mãos em caso de queda e melhoram a aderência',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se7',
          label: 'Óculos de proteção',
          description: 'Protegem os olhos de insetos, poeira e detritos',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se8',
          label: 'Joelheiras e cotoveleiras',
          description: 'Proteção adicional para articulações em caso de queda',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se9',
          label: 'Espelho retrovisor',
          description: 'Permite visualizar o tráfego atrás sem virar a cabeça',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        },
        {
          id: 'se10',
          label: 'Kit de primeiros socorros',
          description: 'Kit básico com band-aids, antisséptico e gaze',
          importance: 'recommended',
          checked: false,
          category: 'safety-equipment'
        }
      ]
    },
    {
      id: 'weekly-maintenance',
      title: 'Manutenção Semanal',
      icon: <Wrench className="h-5 w-5" />,
      description: 'Verificações semanais para manter seu equipamento seguro',
      items: [
        {
          id: 'wm1',
          label: 'Limpeza geral do equipamento',
          description: 'Remova sujeira e detritos que possam afetar o funcionamento',
          importance: 'important',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm2',
          label: 'Verificar desgaste dos pneus',
          description: 'Procure por cortes, furos ou desgaste irregular na banda de rodagem',
          importance: 'important',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm3',
          label: 'Lubrificar corrente (se aplicável)',
          description: 'Use lubrificante específico para correntes de bicicleta',
          importance: 'important',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm4',
          label: 'Verificar pastilhas de freio',
          description: 'Verifique espessura e desgaste uniforme das pastilhas',
          importance: 'critical',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm5',
          label: 'Testar sistema de iluminação',
          description: 'Verifique todas as luzes e substitua lâmpadas queimadas',
          importance: 'important',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm6',
          label: 'Verificar aperto de parafusos',
          description: 'Use as ferramentas adequadas para verificar torque correto',
          importance: 'important',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm7',
          label: 'Limpar contatos da bateria',
          description: 'Remova oxidação dos contatos elétricos com álcool isopropílico',
          importance: 'recommended',
          checked: false,
          category: 'weekly-maintenance'
        },
        {
          id: 'wm8',
          label: 'Verificar cabos e fiação',
          description: 'Procure por fios expostos ou conexões soltas',
          importance: 'critical',
          checked: false,
          category: 'weekly-maintenance'
        }
      ]
    },
    {
      id: 'monthly-inspection',
      title: 'Inspeção Mensal',
      icon: <Settings className="h-5 w-5" />,
      description: 'Inspeção completa mensal para manutenção preventiva',
      items: [
        {
          id: 'mi1',
          label: 'Verificar alinhamento das rodas',
          description: 'Certifique-se que as rodas giram sem oscilação lateral',
          importance: 'important',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi2',
          label: 'Testar suspensão (se equipado)',
          description: 'Verifique se a suspensão comprime e retorna suavemente',
          importance: 'important',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi3',
          label: 'Verificar folgas em rolamentos',
          description: 'Procure por folgas nas rodas e direção',
          importance: 'important',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi4',
          label: 'Calibrar velocímetro/odômetro',
          description: 'Verifique se as leituras estão precisas',
          importance: 'recommended',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi5',
          label: 'Verificar estado da bateria',
          description: 'Teste capacidade e tempo de carga da bateria',
          importance: 'critical',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi6',
          label: 'Atualizar firmware (se disponível)',
          description: 'Verifique atualizações do fabricante para melhorias de segurança',
          importance: 'recommended',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi7',
          label: 'Revisar manual do usuário',
          description: 'Releia instruções de segurança e manutenção do fabricante',
          importance: 'recommended',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi8',
          label: 'Documentar manutenções realizadas',
          description: 'Mantenha registro de todas as manutenções e reparos',
          importance: 'recommended',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi9',
          label: 'Verificar recalls do fabricante',
          description: 'Consulte o site do fabricante para recalls de segurança',
          importance: 'important',
          checked: false,
          category: 'monthly-inspection'
        },
        {
          id: 'mi10',
          label: 'Planejar substituições preventivas',
          description: 'Programe trocas de peças conforme vida útil recomendada',
          importance: 'recommended',
          checked: false,
          category: 'monthly-inspection'
        }
      ]
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('pre-ride')

  // Calculate progress for each category
  const calculateProgress = (category: ChecklistCategory) => {
    const checkedItems = category.items.filter(item => item.checked).length
    return (checkedItems / category.items.length) * 100
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalItems = checklists.reduce((acc, cat) => acc + cat.items.length, 0)
    const checkedItems = checklists.reduce((acc, cat) => 
      acc + cat.items.filter(item => item.checked).length, 0
    )
    return (checkedItems / totalItems) * 100
  }

  // Toggle item checked state
  const toggleItem = (categoryId: string, itemId: string) => {
    setChecklists(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        }
      }
      return category
    }))
  }

  // Get importance badge variant
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Crítico</Badge>
      case 'important':
        return <Badge variant="default" className="text-xs bg-orange-500">Importante</Badge>
      case 'recommended':
        return <Badge variant="secondary" className="text-xs">Recomendado</Badge>
      default:
        return null
    }
  }

  // Generate report content
  const generateReport = () => {
    const report = {
      date: new Date().toLocaleString('pt-BR'),
      overallProgress: calculateOverallProgress(),
      categories: checklists.map(cat => ({
        name: cat.title,
        progress: calculateProgress(cat),
        items: cat.items.map(item => ({
          label: item.label,
          checked: item.checked,
          importance: item.importance
        }))
      }))
    }
    return report
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle download (as JSON for demo)
  const handleDownload = () => {
    const report = generateReport()
    const dataStr = JSON.stringify(report, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `checklist-seguranca-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
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
                  Ferramenta Interativa
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                  Segurança em Primeiro Lugar
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Checklist de Segurança
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Mantenha-se seguro com verificações regulares do seu equipamento autopropelido
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Overall Progress Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                      <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Progresso Geral de Segurança
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(calculateOverallProgress())}% dos itens verificados
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="hidden sm:flex"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </div>
                <Progress value={calculateOverallProgress()} className="h-3" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {checklists.map(category => (
                    <div key={category.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(calculateProgress(category))}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {category.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Checklist Tabs */}
          <Card>
            <CardContent className="p-0">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
                  {checklists.map(category => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="flex flex-col items-center space-y-1 p-3"
                    >
                      {category.icon}
                      <span className="text-xs font-medium">{category.title}</span>
                      <Progress 
                        value={calculateProgress(category)} 
                        className="h-1 w-full"
                      />
                    </TabsTrigger>
                  ))}
                </TabsList>

                {checklists.map(category => (
                  <TabsContent key={category.id} value={category.id} className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {category.description}
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        {category.items.map(item => (
                          <div
                            key={item.id}
                            className={`flex items-start space-x-3 p-4 rounded-lg border ${
                              item.checked 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <Checkbox
                              id={item.id}
                              checked={item.checked}
                              onCheckedChange={() => toggleItem(category.id, item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <label
                                  htmlFor={item.id}
                                  className={`font-medium cursor-pointer ${
                                    item.checked 
                                      ? 'text-green-700 dark:text-green-400 line-through' 
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {item.label}
                                </label>
                                {getImportanceBadge(item.importance)}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Maintenance Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Cronograma de Manutenção Recomendado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Diariamente</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Verificação pré-uso completa antes de cada trajeto
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Semanalmente</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Limpeza e verificação detalhada de componentes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Mensalmente</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Inspeção completa e manutenção preventiva
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Anualmente</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revisão profissional em assistência técnica
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <Phone className="h-5 w-5" />
                Contatos de Emergência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Números de Emergência
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">SAMU</span>
                      <span className="font-mono">192</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Bombeiros</span>
                      <span className="font-mono">193</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Polícia</span>
                      <span className="font-mono">190</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Defesa Civil</span>
                      <span className="font-mono">199</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Informações Importantes
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Mantenha seus contatos de emergência sempre atualizados</p>
                    <p>• Tenha sempre um celular carregado durante os trajetos</p>
                    <p>• Informe familiares sobre suas rotas planejadas</p>
                    <p>• Considere usar apps de compartilhamento de localização</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Aid Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Primeiros Socorros Básicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Em caso de acidente grave, sempre procure ajuda médica profissional imediatamente.
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Escoriações e Cortes</h4>
                    <ol className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>1. Limpe a ferida com água limpa</li>
                      <li>2. Aplique pressão para estancar sangramento</li>
                      <li>3. Use antisséptico se disponível</li>
                      <li>4. Cubra com curativo limpo</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Suspeita de Fratura</h4>
                    <ol className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>1. Não mova a vítima desnecessariamente</li>
                      <li>2. Imobilize a área afetada</li>
                      <li>3. Aplique gelo se disponível</li>
                      <li>4. Procure ajuda médica imediata</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety Tips Alert */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle>Dicas de Segurança</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>• Sempre use o equipamento de proteção adequado, especialmente capacete</p>
              <p>• Respeite os limites de velocidade e as regras de trânsito</p>
              <p>• Evite usar o equipamento em condições climáticas adversas</p>
              <p>• Mantenha distância segura de veículos e pedestres</p>
              <p>• Realize manutenções regulares conforme recomendado pelo fabricante</p>
            </AlertDescription>
          </Alert>

          {/* Print-specific styles */}
          <style jsx global>{`
            @media print {
              .no-print {
                display: none !important;
              }
              
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .print-break {
                page-break-after: always;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
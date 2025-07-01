import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BookOpen, Zap, Shield, FileText, Settings, AlertTriangle, MapPin } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Glossário de Termos - Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Glossário completo com termos técnicos sobre equipamentos autopropelidos, Resolução 996 do CONTRAN, mobilidade elétrica e regulamentação.',
  keywords: 'glossário, termos técnicos, autopropelidos, CONTRAN 996, mobilidade elétrica, definições'
}

const glossaryTerms = {
  A: [
    {
      term: "Autopropelido",
      definition: "Equipamento de mobilidade individual com propulsão elétrica, como patinetes elétricos, skates elétricos e monociclos. Termo criado pela Resolução 996 do CONTRAN para categorizar esses veículos.",
      related: ["Equipamento de Mobilidade Individual", "Resolução 996"]
    },
    {
      term: "Autonomia",
      definition: "Distância máxima que um equipamento elétrico pode percorrer com a bateria totalmente carregada, medida em quilômetros (km).",
      related: ["Bateria", "Capacidade"]
    },
    {
      term: "Acelerador",
      definition: "Dispositivo de controle que regula a velocidade do motor elétrico. Pode ser do tipo gatilho, manopla giratória ou botão.",
      related: ["Controlador", "Motor Elétrico"]
    },
    {
      term: "ACC",
      definition: "Autorização para Conduzir Ciclomotor. Categoria de habilitação específica para conduzir ciclomotores, obtida a partir dos 18 anos.",
      related: ["Ciclomotor", "CNH"]
    }
  ],
  B: [
    {
      term: "Bateria de Lítio",
      definition: "Tipo mais comum de bateria em equipamentos autopropelidos. Oferece alta densidade energética, longa vida útil e peso reduzido.",
      related: ["Capacidade", "Ciclos de Carga"]
    },
    {
      term: "BMS",
      definition: "Battery Management System (Sistema de Gerenciamento de Bateria). Circuito eletrônico que protege e gerencia a bateria, controlando carga, descarga e temperatura.",
      related: ["Bateria de Lítio", "Segurança"]
    },
    {
      term: "Brushless",
      definition: "Tipo de motor elétrico sem escovas, mais eficiente e durável que motores com escovas. Comum em equipamentos de maior qualidade.",
      related: ["Motor Elétrico", "Eficiência"]
    },
    {
      term: "Bicicleta Elétrica",
      definition: "Bicicleta equipada com motor auxiliar elétrico de até 350W que funciona apenas com pedal assistido, limitada a 25 km/h pela Resolução 996.",
      related: ["Pedal Assistido", "Pedelec"]
    }
  ],
  C: [
    {
      term: "CONTRAN",
      definition: "Conselho Nacional de Trânsito. Órgão máximo normativo do Sistema Nacional de Trânsito, responsável por estabelecer normas e diretrizes da política nacional de trânsito.",
      related: ["Resolução 996", "CTB"]
    },
    {
      term: "Ciclomotor",
      definition: "Veículo de duas ou três rodas com motor de até 50cc (combustão) ou 4.000W (elétrico), velocidade máxima de 50 km/h. Exige habilitação, registro e emplacamento.",
      related: ["ACC", "CNH categoria A"]
    },
    {
      term: "Capacidade (Bateria)",
      definition: "Quantidade de energia que uma bateria pode armazenar, medida em Ampere-hora (Ah) ou Watt-hora (Wh). Determina a autonomia do equipamento.",
      related: ["Autonomia", "Voltagem"]
    },
    {
      term: "Controlador",
      definition: "Componente eletrônico que gerencia a potência entregue ao motor, controlando velocidade e aceleração do equipamento.",
      related: ["ESC", "Motor Elétrico"]
    },
    {
      term: "Ciclos de Carga",
      definition: "Número de vezes que uma bateria pode ser carregada e descarregada antes de perder capacidade significativa. Geralmente entre 500-1000 ciclos.",
      related: ["Bateria", "Vida Útil"]
    },
    {
      term: "Ciclofaixa",
      definition: "Parte da pista de rolamento destinada à circulação exclusiva de ciclos, delimitada por sinalização específica.",
      related: ["Ciclovia", "Infraestrutura"]
    },
    {
      term: "Ciclovia",
      definition: "Via destinada exclusivamente à circulação de ciclos, separada fisicamente do tráfego comum.",
      related: ["Ciclofaixa", "Mobilidade"]
    },
    {
      term: "CNH",
      definition: "Carteira Nacional de Habilitação. Documento que atesta a aptidão de um cidadão para conduzir veículos automotores e elétricos.",
      related: ["ACC", "Habilitação"]
    },
    {
      term: "CTB",
      definition: "Código de Trânsito Brasileiro. Lei nº 9.503/1997 que regulamenta o trânsito de veículos, pedestres e animais nas vias terrestres do Brasil.",
      related: ["CONTRAN", "Legislação"]
    }
  ],
  D: [
    {
      term: "Deck",
      definition: "Plataforma onde o usuário posiciona os pés em patinetes e skates elétricos. Pode ser de alumínio, fibra de carbono ou materiais compostos.",
      related: ["Estrutura", "Ergonomia"]
    },
    {
      term: "Display",
      definition: "Tela que exibe informações como velocidade, nível de bateria, distância percorrida e modo de condução.",
      related: ["Painel", "Interface"]
    },
    {
      term: "Dual Motor",
      definition: "Sistema com dois motores elétricos, um em cada roda. Oferece maior potência, aceleração e capacidade de subida.",
      related: ["Motor", "Potência"]
    }
  ],
  E: [
    {
      term: "ESC",
      definition: "Electronic Speed Controller (Controlador Eletrônico de Velocidade). Componente que controla a velocidade do motor baseado nos comandos do acelerador.",
      related: ["Controlador", "Motor"]
    },
    {
      term: "E-bike",
      definition: "Termo em inglês para bicicleta elétrica. No Brasil, deve seguir os limites da Resolução 996: motor até 350W e velocidade até 25 km/h.",
      related: ["Bicicleta Elétrica", "Pedelec"]
    },
    {
      term: "Equipamento de Mobilidade Individual",
      definition: "Categoria que engloba dispositivos motorizados de pequeno porte para transporte pessoal, como patinetes elétricos e hoverboards.",
      related: ["Autopropelido", "Micromobilidade"]
    },
    {
      term: "Emplacamento",
      definition: "Processo de registro e identificação de veículos. Equipamentos autopropelidos dentro dos limites da Resolução 996 não necessitam emplacamento.",
      related: ["Registro", "Licenciamento"]
    }
  ],
  F: [
    {
      term: "Freio Regenerativo",
      definition: "Sistema que converte energia cinética em elétrica durante a frenagem, recarregando parcialmente a bateria e aumentando a autonomia.",
      related: ["Recuperação de Energia", "KERS"]
    },
    {
      term: "Freio a Disco",
      definition: "Sistema de frenagem com disco metálico e pinça, oferece maior poder de parada e melhor desempenho em condições úmidas.",
      related: ["Segurança", "Manutenção"]
    }
  ],
  G: [
    {
      term: "Guidão",
      definition: "Barra de direção em patinetes e bicicletas elétricas. Pode ser ajustável em altura e dobrável para transporte.",
      related: ["Ergonomia", "Controle"]
    },
    {
      term: "GPS",
      definition: "Sistema de Posicionamento Global. Alguns equipamentos possuem GPS integrado para rastreamento, navegação e segurança antifurto.",
      related: ["Conectividade", "Segurança"]
    }
  ],
  H: [
    {
      term: "Hoverboard",
      definition: "Prancha elétrica autoequilibrada com duas rodas paralelas. Classificado como equipamento autopropelido pela Resolução 996.",
      related: ["Autoequilíbrio", "Giroscópio"]
    },
    {
      term: "Hub Motor",
      definition: "Motor elétrico integrado diretamente no cubo da roda. Design compacto e eficiente, comum em patinetes e bicicletas elétricas.",
      related: ["Motor", "Roda"]
    }
  ],
  I: [
    {
      term: "IP (Proteção)",
      definition: "Índice de Proteção contra entrada de sólidos e líquidos. Ex: IP54 indica proteção contra poeira e respingos d'água.",
      related: ["Resistência", "Durabilidade"]
    },
    {
      term: "Indicador de Direção",
      definition: "Luzes sinalizadoras para indicar mudança de direção. Obrigatórias em ciclomotores, opcionais em equipamentos autopropelidos.",
      related: ["Sinalização", "Segurança"]
    }
  ],
  K: [
    {
      term: "KERS",
      definition: "Kinetic Energy Recovery System. Sistema de recuperação de energia cinética, similar ao freio regenerativo.",
      related: ["Freio Regenerativo", "Eficiência"]
    },
    {
      term: "Kickscooter",
      definition: "Termo em inglês para patinete elétrico. Equipamento com guidão, deck e duas ou mais rodas, propulsão elétrica.",
      related: ["Patinete Elétrico", "Autopropelido"]
    }
  ],
  L: [
    {
      term: "LED",
      definition: "Light Emitting Diode. Tipo de iluminação eficiente usada em faróis e lanternas. Obrigatória para uso noturno.",
      related: ["Iluminação", "Segurança"]
    },
    {
      term: "Limite de Velocidade",
      definition: "Velocidade máxima permitida. Para autopropelidos: 32 km/h em modo autônomo e 25 km/h com propulsão humana.",
      related: ["Resolução 996", "Regulamentação"]
    },
    {
      term: "Licenciamento",
      definition: "Processo anual de regularização de veículos. Equipamentos autopropelidos não necessitam licenciamento.",
      related: ["Registro", "Documentação"]
    }
  ],
  M: [
    {
      term: "Micromobilidade",
      definition: "Conceito que engloba meios de transporte compactos e sustentáveis para curtas distâncias, incluindo equipamentos autopropelidos.",
      related: ["Mobilidade Urbana", "Sustentabilidade"]
    },
    {
      term: "Motor Brushless",
      definition: "Motor elétrico sem escovas de carvão, mais eficiente, silencioso e durável que motores convencionais.",
      related: ["Motor", "Eficiência"]
    },
    {
      term: "Modo Eco",
      definition: "Configuração que limita potência e velocidade para economizar bateria e aumentar autonomia.",
      related: ["Modos de Condução", "Economia"]
    },
    {
      term: "Monociclo Elétrico",
      definition: "Equipamento autopropelido com uma única roda e autoequilíbrio giroscópico. Requer prática para dominar.",
      related: ["EUC", "Autoequilíbrio"]
    }
  ],
  N: [
    {
      term: "Norma ABNT",
      definition: "Normas técnicas da Associação Brasileira de Normas Técnicas que podem se aplicar a componentes e segurança de equipamentos.",
      related: ["Regulamentação", "Qualidade"]
    },
    {
      term: "Nível de Bateria",
      definition: "Indicador da carga restante da bateria, geralmente mostrado em porcentagem ou barras no display.",
      related: ["Bateria", "Autonomia"]
    }
  ],
  P: [
    {
      term: "Patinete Elétrico",
      definition: "Equipamento de mobilidade individual com plataforma, guidão e motor elétrico. Um dos tipos mais comuns de autopropelidos.",
      related: ["Kickscooter", "E-scooter"]
    },
    {
      term: "Pedal Assistido",
      definition: "Sistema onde o motor elétrico funciona apenas quando há movimento dos pedais, característico de bicicletas elétricas regulamentadas.",
      related: ["Pedelec", "Bicicleta Elétrica"]
    },
    {
      term: "Pedelec",
      definition: "Pedal Electric Cycle. Bicicleta elétrica com assistência ao pedal, sem acelerador manual.",
      related: ["Bicicleta Elétrica", "E-bike"]
    },
    {
      term: "Potência",
      definition: "Medida da força do motor, expressa em Watts (W). Limite de 1.500W para autopropelidos e 350W para bicicletas elétricas.",
      related: ["Motor", "Watts"]
    },
    {
      term: "Porta USB",
      definition: "Conexão para carregar dispositivos móveis usando a bateria do equipamento. Recurso adicional em alguns modelos.",
      related: ["Conectividade", "Bateria"]
    }
  ],
  R: [
    {
      term: "Resolução 996",
      definition: "Norma do CONTRAN publicada em 28/06/2023 que regulamenta equipamentos de mobilidade individual autopropelidos, bicicletas elétricas e ciclomotores.",
      related: ["CONTRAN", "Regulamentação"]
    },
    {
      term: "Regeneração",
      definition: "Processo de recuperação de energia durante frenagem ou desaceleração, recarregando parcialmente a bateria.",
      related: ["Freio Regenerativo", "Eficiência"]
    },
    {
      term: "Registro",
      definition: "Cadastro do veículo nos órgãos de trânsito. Obrigatório apenas para ciclomotores, não para equipamentos autopropelidos.",
      related: ["Emplacamento", "CRV"]
    },
    {
      term: "Resistência à Água",
      definition: "Capacidade do equipamento resistir a água, indicada pelo índice IP. Importante para uso em condições climáticas variadas.",
      related: ["IP", "Durabilidade"]
    }
  ],
  S: [
    {
      term: "Suspensão",
      definition: "Sistema de amortecimento que absorve impactos e irregularidades do terreno, melhorando conforto e controle.",
      related: ["Conforto", "Estabilidade"]
    },
    {
      term: "Sistema de Freios",
      definition: "Conjunto de componentes para reduzir velocidade e parar. Pode ser mecânico (cabo), hidráulico ou eletrônico.",
      related: ["Segurança", "ABS"]
    },
    {
      term: "Skate Elétrico",
      definition: "Prancha com motor elétrico e controle remoto. Classificado como equipamento autopropelido pela Resolução 996.",
      related: ["Longboard Elétrico", "Autopropelido"]
    },
    {
      term: "Speed Limiter",
      definition: "Limitador de velocidade eletrônico que impede o equipamento de exceder a velocidade máxima regulamentada.",
      related: ["Controlador", "Segurança"]
    }
  ],
  T: [
    {
      term: "Throttle",
      definition: "Acelerador em inglês. Dispositivo que controla a potência entregue ao motor, podendo ser tipo gatilho ou manopla.",
      related: ["Acelerador", "Controle"]
    },
    {
      term: "Tração",
      definition: "Capacidade das rodas transmitirem força ao solo. Pode ser dianteira, traseira ou integral (dual motor).",
      related: ["Motor", "Aderência"]
    },
    {
      term: "Tempo de Carga",
      definition: "Período necessário para carregar completamente a bateria. Varia de 2 a 8 horas dependendo da capacidade e carregador.",
      related: ["Bateria", "Carregador"]
    }
  ],
  V: [
    {
      term: "Voltagem",
      definition: "Tensão elétrica do sistema, medida em Volts (V). Comum: 24V, 36V, 48V ou 60V. Maior voltagem permite maior velocidade.",
      related: ["Bateria", "Potência"]
    },
    {
      term: "Velocidade Máxima",
      definition: "Limite de velocidade do equipamento. Para autopropelidos: 32 km/h (autônomo) ou 25 km/h (com propulsão humana).",
      related: ["Limite", "Regulamentação"]
    },
    {
      term: "Vida Útil",
      definition: "Tempo de uso esperado do equipamento ou componente antes de necessitar substituição. Baterias: 2-5 anos.",
      related: ["Durabilidade", "Manutenção"]
    }
  ],
  W: [
    {
      term: "Watt (W)",
      definition: "Unidade de medida de potência elétrica. Limite de 1.500W para equipamentos autopropelidos conforme Resolução 996.",
      related: ["Potência", "Motor"]
    },
    {
      term: "Watt-hora (Wh)",
      definition: "Unidade de medida de capacidade energética da bateria. Calculada multiplicando voltagem (V) por ampere-hora (Ah).",
      related: ["Capacidade", "Bateria"]
    },
    {
      term: "Waterproof",
      definition: "À prova d'água. Nível máximo de proteção contra água, permitindo imersão. Diferente de water-resistant.",
      related: ["IP", "Proteção"]
    }
  ]
}

export default function GlossarioPage() {
  const allTerms = Object.values(glossaryTerms).flat()
  const totalTerms = allTerms.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Glossário de Termos Técnicos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Entenda todos os termos relacionados a equipamentos autopropelidos e a Resolução 996
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar termo..."
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{totalTerms}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Termos definidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Object.keys(glossaryTerms).length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Categorias</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Alphabet Navigation */}
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(glossaryTerms).map((letter) => (
                <a
                  key={letter}
                  href={`#${letter}`}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>

          {/* Terms by Letter */}
          <div className="space-y-12">
            {Object.entries(glossaryTerms).map(([letter, terms]) => (
              <div key={letter} id={letter}>
                {/* Letter Header */}
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {letter}
                  </div>
                  <div className="ml-4 flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <Badge variant="secondary" className="ml-4">
                    {terms.length} {terms.length === 1 ? 'termo' : 'termos'}
                  </Badge>
                </div>

                {/* Terms */}
                <div className="space-y-4">
                  {terms.map((term, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {term.term}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {term.definition}
                        </p>
                        {term.related && term.related.length > 0 && (
                          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Termos relacionados:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {term.related.map((relatedTerm, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {relatedTerm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reference Card */}
          <Card className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Termos Essenciais para Entender
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Limites Técnicos
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li>• <strong>Velocidade:</strong> máx. 32 km/h (autopropelidos)</li>
                    <li>• <strong>Potência:</strong> máx. 1.500W (autopropelidos)</li>
                    <li>• <strong>Largura:</strong> máx. 70cm</li>
                    <li>• <strong>Bicicleta elétrica:</strong> 350W e 25 km/h</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Documentação
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li>• <strong>Autopropelidos:</strong> sem registro ou habilitação</li>
                    <li>• <strong>Ciclomotor:</strong> precisa CNH, placa e registro</li>
                    <li>• <strong>Equipamentos obrigatórios:</strong> luzes e refletivos</li>
                    <li>• <strong>Circulação:</strong> ciclovias e vias até 60 km/h</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-4">Explore mais:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/faq">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Perguntas Frequentes
                </Badge>
              </Link>
              <Link href="/resolucao-996">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Guia da Resolução 996
                </Badge>
              </Link>
              <Link href="/ferramentas/verificador-conformidade">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Verificar Conformidade
                </Badge>
              </Link>
              <Link href="/biblioteca">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Documentos Técnicos
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
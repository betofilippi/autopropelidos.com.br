import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Search, HelpCircle, Shield, Zap, AlertTriangle, FileText, Settings, MapPin } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes sobre Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Tire suas dúvidas sobre a Resolução 996 do CONTRAN, patinetes elétricos, bicicletas elétricas e regulamentação de equipamentos autopropelidos.',
  keywords: 'FAQ, perguntas frequentes, dúvidas, CONTRAN 996, patinete elétrico, bicicleta elétrica'
}

const faqCategories = [
  {
    id: 'resolution',
    title: 'Resolução 996',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    questions: [
      {
        question: "O que é a Resolução 996 do CONTRAN?",
        answer: "A Resolução 996 do CONTRAN, publicada em junho de 2023, é a norma que regulamenta e define os equipamentos de mobilidade individual autopropelidos, bicicletas elétricas e ciclomotores no Brasil. Ela estabelece limites técnicos claros para classificação desses veículos e determina as regras de circulação."
      },
      {
        question: "Quando a Resolução 996 entrou em vigor?",
        answer: "A Resolução 996 foi publicada em 28 de junho de 2023 e entrou em vigor na mesma data. Ela revogou as resoluções anteriores (465/2013 e 842/2021) e trouxe definições mais claras e atualizadas."
      },
      {
        question: "Quais são os principais limites estabelecidos pela resolução?",
        answer: "Para equipamentos autopropelidos: velocidade máxima de 32 km/h, potência máxima de 1.500W e largura máxima de 70cm. Para bicicletas elétricas: motor auxiliar de até 350W, velocidade limitada a 25 km/h e acionamento apenas com pedal assistido."
      },
      {
        question: "A resolução se aplica em todo o Brasil?",
        answer: "Sim, a Resolução 996 é uma norma federal do CONTRAN e se aplica em todo o território nacional. No entanto, estados e municípios podem criar regulamentações complementares, desde que não contrariem a norma federal."
      }
    ]
  },
  {
    id: 'equipment',
    title: 'Equipamentos',
    icon: <Settings className="h-5 w-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    questions: [
      {
        question: "Preciso de habilitação para usar patinete elétrico?",
        answer: "Não. Equipamentos autopropelidos que atendem aos limites da Resolução 996 (velocidade ≤ 32 km/h, potência ≤ 1.500W, largura ≤ 70cm) não exigem habilitação para condução."
      },
      {
        question: "Meu patinete precisa ser emplacado?",
        answer: "Não. Equipamentos que se enquadram como autopropelidos não precisam de registro, emplacamento ou licenciamento no DETRAN."
      },
      {
        question: "Qual a diferença entre bicicleta elétrica e ciclomotor?",
        answer: "Bicicleta elétrica tem motor de até 350W que funciona apenas como assistência ao pedal, limitada a 25 km/h. Ciclomotor tem motor mais potente (até 4.000W), pode ter acelerador, atinge até 50 km/h e precisa de registro, placa e habilitação categoria A ou ACC."
      },
      {
        question: "Posso modificar meu equipamento para ficar mais rápido?",
        answer: "Não é recomendado. Se você modificar seu equipamento e ele exceder os limites da Resolução 996, ele será reclassificado como ciclomotor, exigindo registro, emplacamento e habilitação. Além disso, você pode ser multado por conduzir veículo não licenciado."
      },
      {
        question: "Hoverboard e monociclo elétrico são considerados autopropelidos?",
        answer: "Sim, desde que atendam aos limites técnicos estabelecidos. Hoverboards, monociclos elétricos, skates elétricos e similares são classificados como equipamentos autopropelidos pela Resolução 996."
      }
    ]
  },
  {
    id: 'circulation',
    title: 'Circulação',
    icon: <MapPin className="h-5 w-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    questions: [
      {
        question: "Onde posso circular com meu patinete elétrico?",
        answer: "Você pode circular em: ciclofaixas, ciclovias, acostamentos, faixas compartilhadas com ciclistas e vias urbanas com velocidade máxima de até 60 km/h. É proibido circular em rodovias, vias de trânsito rápido e vias com velocidade superior a 60 km/h."
      },
      {
        question: "Posso andar na calçada?",
        answer: "Em geral, não. A circulação na calçada é permitida apenas onde houver sinalização específica autorizando ou em áreas de circulação compartilhada com pedestres devidamente sinalizadas."
      },
      {
        question: "É obrigatório usar capacete?",
        answer: "A Resolução 996 não torna o capacete obrigatório, mas seu uso é altamente recomendado para sua segurança. Alguns municípios podem ter legislação específica tornando o uso obrigatório."
      },
      {
        question: "Preciso usar equipamentos de sinalização?",
        answer: "Sim. Para circular no período noturno ou em condições de baixa visibilidade, é obrigatório o uso de luzes dianteira (branca) e traseira (vermelha), além de elementos refletivos."
      },
      {
        question: "Posso levar passageiro no meu patinete?",
        answer: "Não. Equipamentos autopropelidos são projetados para transporte individual. Levar passageiros compromete a segurança e pode resultar em multa."
      }
    ]
  },
  {
    id: 'safety',
    title: 'Segurança',
    icon: <Shield className="h-5 w-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    questions: [
      {
        question: "Quais equipamentos de segurança são recomendados?",
        answer: "Além do capacete, recomenda-se: joelheiras, cotoveleiras, luvas, roupas com alta visibilidade, espelhos retrovisores (quando possível) e buzina ou campainha para alertar pedestres."
      },
      {
        question: "Como devo me comportar no trânsito?",
        answer: "Siga as mesmas regras dos ciclistas: respeite a sinalização, mantenha-se à direita da via, sinalize suas intenções, não use fones de ouvido, não use celular enquanto conduz e dê preferência aos pedestres."
      },
      {
        question: "O que fazer em caso de acidente?",
        answer: "Pare imediatamente, verifique se há feridos, acione o socorro se necessário (SAMU 192), preserve o local, registre fotos, troque informações com os envolvidos e, se houver vítimas ou grande prejuízo material, registre boletim de ocorrência."
      },
      {
        question: "Meu equipamento precisa de manutenção?",
        answer: "Sim. Verifique regularmente: pressão dos pneus, funcionamento dos freios, aperto de parafusos, estado da bateria, funcionamento das luzes e integridade geral da estrutura. Manutenção preventiva evita acidentes."
      }
    ]
  },
  {
    id: 'legal',
    title: 'Aspectos Legais',
    icon: <AlertTriangle className="h-5 w-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    questions: [
      {
        question: "Quais são as multas por descumprir a regulamentação?",
        answer: "As multas variam conforme a infração: conduzir sem registro (quando obrigatório): R$ 880,12; circular em local proibido: R$ 195,23; não usar equipamentos obrigatórios: R$ 130,16. Valores sujeitos a alteração."
      },
      {
        question: "Preciso de seguro para meu equipamento?",
        answer: "Não é obrigatório para equipamentos autopropelidos, mas é altamente recomendado ter um seguro contra roubo, furto e responsabilidade civil para cobrir eventuais danos a terceiros."
      },
      {
        question: "E se meu equipamento for apreendido?",
        answer: "Se for apreendido por estar irregular (excedendo limites, por exemplo), você precisará regularizar a situação, pagar as multas e taxas de remoção/estadia para liberar o equipamento."
      },
      {
        question: "Menor de idade pode usar patinete elétrico?",
        answer: "A Resolução 996 não estabelece idade mínima para equipamentos autopropelidos. No entanto, recomenda-se supervisão de adultos para menores e alguns municípios podem ter regulamentação específica sobre idade mínima."
      }
    ]
  },
  {
    id: 'purchase',
    title: 'Compra e Economia',
    icon: <Zap className="h-5 w-5" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    questions: [
      {
        question: "Como escolher um equipamento em conformidade?",
        answer: "Verifique as especificações técnicas: velocidade máxima, potência do motor e largura. Prefira marcas conhecidas que forneçam documentação técnica. Use nossa ferramenta de verificação de conformidade para confirmar."
      },
      {
        question: "Vale a pena comparado ao transporte público?",
        answer: "Para trajetos diários curtos e médios, geralmente sim. O investimento inicial se paga em 6-12 meses comparado ao transporte público. Use nossa calculadora de custos para uma análise personalizada."
      },
      {
        question: "Qual a vida útil de um patinete elétrico?",
        answer: "Com manutenção adequada, um patinete de qualidade dura 3-5 anos. A bateria geralmente precisa ser substituída após 500-1000 ciclos de carga (1-3 anos dependendo do uso)."
      },
      {
        question: "Posso financiar a compra?",
        answer: "Sim, muitas lojas oferecem parcelamento. Alguns bancos têm linhas de crédito específicas para mobilidade sustentável com juros reduzidos. Verifique também programas municipais de incentivo."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Perguntas Frequentes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Encontre respostas para as principais dúvidas sobre equipamentos autopropelidos 
              e a Resolução 996 do CONTRAN
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar perguntas..."
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {faqCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`${category.bgColor} ${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {category.questions.length} perguntas
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`${category.bgColor} ${category.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`} className="bg-white dark:bg-gray-800 rounded-lg border">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <span className="text-left font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <Card className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ainda tem dúvidas?
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Se você não encontrou a resposta que procurava, entre em contato conosco ou 
                use nossas ferramentas interativas para obter informações específicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contato"
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Falar Conosco
                </Link>
                <Link
                  href="/ferramentas/verificador-conformidade"
                  className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  Verificar Conformidade
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold mb-4">Veja também:</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/glossario">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Glossário de Termos
                </Badge>
              </Link>
              <Link href="/resolucao-996">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Guia da Resolução 996
                </Badge>
              </Link>
              <Link href="/ferramentas">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Ferramentas Úteis
                </Badge>
              </Link>
              <Link href="/biblioteca">
                <Badge variant="secondary" className="px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer">
                  Biblioteca de Documentos
                </Badge>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
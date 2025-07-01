import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqData = [
  {
    id: "item-1",
    question: "O que são equipamentos autopropelidos?",
    answer: "Equipamentos autopropelidos são veículos de mobilidade individual com motor elétrico, como patinetes elétricos, hoverboards e similares. O termo foi criado pela Resolução 996/2023 do CONTRAN para classificar esses equipamentos que antes não tinham regulamentação específica."
  },
  {
    id: "item-2", 
    question: "Qual a diferença entre bicicleta elétrica e autopropelido?",
    answer: "A principal diferença é que bicicletas elétricas funcionam apenas com assistência ao pedalar (pedelec), enquanto autopropelidos podem funcionar sem pedalar. Bicicletas elétricas têm motor até 1000W e velocidade máxima de 32km/h, apenas com assistência ao pedal. Já autopropelidos têm as mesmas limitações de potência e velocidade, mas podem ter acelerador manual."
  },
  {
    id: "item-3",
    question: "Preciso de CNH para usar um patinete elétrico?",
    answer: "Não, para equipamentos autopropelidos (patinetes elétricos com até 1000W e 32km/h), não é necessária CNH. Apenas ciclomotores (acima de 1000W ou 32km/h, até 4000W e 50km/h) exigem CNH categoria A ou ACC."
  },
  {
    id: "item-4",
    question: "Onde posso circular com meu patinete elétrico?",
    answer: "Equipamentos autopropelidos podem circular em: calçadas (velocidade máxima 6km/h), ciclovias, ciclofaixas e vias com velocidade regulamentada até 40km/h. É proibido circular em vias de trânsito rápido, rodovias e locais onde a velocidade seja superior a 40km/h."
  },
  {
    id: "item-5",
    question: "Quais equipamentos são obrigatórios?",
    answer: "Para autopropelidos: velocímetro e/ou limitador eletrônico, sinalização noturna incorporada. Para bicicletas elétricas: velocímetro ou limitador, campainha, sinalização noturna (dianteira, traseira e lateral), espelho retrovisor esquerdo. Para ciclomotores: todos os equipamentos do CTB, plus registro e emplacamento."
  },
  {
    id: "item-6",
    question: "Até quando tenho para regularizar meu ciclomotor?",
    answer: "O prazo para regularização de ciclomotores vai até 31 de dezembro de 2025. Após essa data, circular com ciclomotor sem registro resultará em multa de R$ 574,62 (infração gravíssima) e apreensão do veículo."
  },
  {
    id: "item-7",
    question: "Como saber se meu veículo é um ciclomotor?",
    answer: "Seu veículo é considerado ciclomotor se tiver motor com potência superior a 1000W ou velocidade máxima superior a 32km/h, desde que não ultrapasse 4000W e 50km/h. Exemplos: scooters elétricas, algumas motos elétricas de baixa potência."
  },
  {
    id: "item-8",
    question: "Posso modificar meu equipamento?",
    answer: "Modificações que alterem as características originais (potência, velocidade) podem descaracterizar o equipamento e torná-lo não conforme com a Resolução 996. Isso pode resultar em enquadramento em categoria superior (ex: de autopropelido para ciclomotor) com exigências adicionais."
  },
  {
    id: "item-9",
    question: "É obrigatório usar capacete?",
    answer: "Para autopropelidos e bicicletas elétricas, o capacete não é obrigatório por lei federal, mas é altamente recomendado. Para ciclomotores, o capacete é obrigatório conforme CTB. Algumas cidades podem ter leis municipais específicas exigindo capacete para todos os equipamentos."
  },
  {
    id: "item-10",
    question: "O que acontece se eu for multado?",
    answer: "As multas variam conforme a infração: circular em local proibido, excesso de velocidade, falta de equipamentos obrigatórios. Para ciclomotores sem registro após 31/12/2025: multa de R$ 574,62 + apreensão. Consulte sempre as regras locais, pois cidades podem ter regulamentações específicas."
  }
]

export default function FAQ() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Esclareça suas dúvidas sobre a Resolução 996 e equipamentos autopropelidos
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Dúvidas Mais Comuns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Não encontrou sua dúvida?</strong> Entre em contato conosco ou consulte 
                  o DETRAN de seu estado para informações específicas sobre regulamentações locais.
                  Lembre-se que municípios podem ter regras adicionais à Resolução 996.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "Qual é o limite de velocidade para equipamentos autopropelidos?",
    answer:
      "A velocidade máxima permitida é de 32 km/h. Equipamentos que excedem esta velocidade são considerados ciclomotores e necessitam de emplacamento e habilitação.",
  },
  {
    question: "Preciso de habilitação para usar uma bicicleta elétrica?",
    answer:
      "Não é necessária habilitação para bicicletas elétricas e equipamentos autopropelidos que se enquadrem nas especificações da Resolução 996, desde que não ultrapassem 32 km/h.",
  },
  {
    question: "Quais equipamentos de segurança são obrigatórios?",
    answer:
      "É obrigatório o uso de capacete, equipamentos refletivos durante a noite, e sistema de iluminação (farol dianteiro branco e lanterna traseira vermelha).",
  },
  {
    question: "Onde posso circular com meu equipamento autopropelido?",
    answer:
      "Você pode circular em ciclovias, ciclofaixas, e vias urbanas com velocidade regulamentada até 60 km/h, sempre respeitando as regras de trânsito locais.",
  },
  {
    question: "É necessário fazer seguro para equipamentos autopropelidos?",
    answer:
      "Atualmente não é obrigatório, mas é altamente recomendado. Existem seguros específicos disponíveis no mercado que cobrem danos ao equipamento e responsabilidade civil.",
  },
  {
    question: "Como devo proceder em caso de acidente?",
    answer:
      "Siga os mesmos procedimentos de qualquer acidente de trânsito: preserve o local, chame a polícia se necessário, documente a situação e entre em contato com seu seguro se possuir.",
  },
  {
    question: "Posso modificar meu equipamento autopropelido?",
    answer:
      "Modificações que alterem as características originais do equipamento, especialmente velocidade e potência, podem descaracterizá-lo e exigir nova classificação.",
  },
  {
    question: "Qual a diferença entre bicicleta elétrica e ciclomotor?",
    answer:
      "A principal diferença é a velocidade: até 32 km/h é considerado equipamento autopropelido, acima disso é ciclomotor e precisa de documentação e habilitação.",
  },
]

export function FAQ() {
  return (
    <section className="container mx-auto px-4 py-16">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <HelpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl mb-4">Perguntas Frequentes</CardTitle>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tire suas principais dúvidas sobre a legislação e uso de equipamentos autopropelidos
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}

export default FAQ

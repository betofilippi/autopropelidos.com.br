import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, FileText, HelpCircle, Shield } from "lucide-react"
import Link from "next/link"

export default function Resolucao996() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter">Resolução 996 do CONTRAN</h1>
          <p className="text-xl text-muted-foreground">
            Guia completo sobre a nova regulamentação para ciclomotores, bicicletas elétricas e equipamentos
            autopropelidos
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none">
          <h2>Introdução</h2>
          <p>
            A Resolução 996 do CONTRAN, que entrou em vigor em 2023, trouxe importantes atualizações para a
            regulamentação de equipamentos de mobilidade urbana. Esta página reúne todas as informações essenciais para
            você entender as mudanças e seus impactos.
          </p>

          <h2>Principais Mudanças</h2>
          <div className="grid sm:grid-cols-2 gap-4 not-prose mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Definições Atualizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Nova classificação de equipamentos</li>
                  <li>• Categorização clara de veículos</li>
                  <li>• Especificações técnicas</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Requisitos de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Equipamentos obrigatórios</li>
                  <li>• Limites de velocidade</li>
                  <li>• Áreas de circulação</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h2>Documentação e Registro</h2>
          <p>
            Um dos pontos mais importantes da nova resolução é a clarificação sobre a necessidade de documentação e
            registro. Bicicletas elétricas e equipamentos autopropelidos NÃO precisam de:
          </p>
          <ul>
            <li>Registro</li>
            <li>Emplacamento</li>
            <li>Habilitação</li>
          </ul>

          <h2>Perguntas Frequentes</h2>
          <div className="not-prose space-y-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Dúvidas Comuns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Preciso de habilitação?</h3>
                    <p className="text-muted-foreground">
                      Não é necessária habilitação para equipamentos autopropelidos que se enquadrem nas especificações
                      da resolução.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Qual o limite de velocidade?</h3>
                    <p className="text-muted-foreground">
                      A velocidade máxima permitida para equipamentos autopropelidos é de 32 km/h. Equipamentos que
                      excedem esta velocidade são considerados ciclomotores e necessitam de emplacamento e habilitação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2>Fontes Oficiais</h2>
          <div className="not-prose">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Documentos Oficiais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <Link href="https://www.gov.br/transportes/pt-br/assuntos/noticias/2023/06/resolucao-do-contran-atualiza-definicao-de-ciclomotores-bicicletas-eletricas-e-autopropelidos">
                        Ministério dos Transportes - Resolução do CONTRAN
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                  <li>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <Link href="https://www.gov.br/secom/pt-br/fatos/brasil-contra-fake/noticias/2023/06/bicicletas-eletricas-e-equipamentos-autopropelidos-nao-precisam-de-registro-emplacamento-ou-habilitacao">
                        Secretaria de Comunicação Social - Brasil contra Fake
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

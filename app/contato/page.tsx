import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone, MapPin, Clock, Send } from "lucide-react"

export const metadata: Metadata = {
  title: 'Contato - Portal Autopropelidos',
  description: 'Entre em contato conosco. Tire suas dúvidas sobre a Resolução 996 do CONTRAN e equipamentos autopropelidos.',
  keywords: ['contato', 'suporte', 'dúvidas', 'portal autopropelidos'],
}

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Estamos aqui para ajudar com suas dúvidas sobre equipamentos autopropelidos 
              e a Resolução 996 do CONTRAN
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">contato@autopropelidos.com.br</p>
                <p className="text-sm text-gray-500">Resposta em até 24h</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">WhatsApp</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">(11) 99999-9999</p>
                <p className="text-sm text-gray-500">Seg a Sex, 9h às 18h</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Telefone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">(11) 3000-0000</p>
                <p className="text-sm text-gray-500">Seg a Sex, 9h às 18h</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Segunda a Sexta</p>
                <p className="text-sm text-gray-500">9h às 18h (UTC-3)</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Envie sua Mensagem
                </h2>
                <p className="text-gray-600 mb-8">
                  Preencha o formulário ao lado e nossa equipe entrará em contato com você 
                  em até 24 horas. Para dúvidas urgentes, utilize nossos canais diretos.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Localização</h4>
                      <p className="text-gray-600">São Paulo, SP - Brasil</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Email Principal</h4>
                      <p className="text-gray-600">contato@autopropelidos.com.br</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Suporte Técnico</h4>
                      <p className="text-gray-600">suporte@autopropelidos.com.br</p>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Formulário de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto *
                      </label>
                      <select
                        id="assunto"
                        name="assunto"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="duvida-tecnica">Dúvida Técnica</option>
                        <option value="resolucao-996">Resolução 996</option>
                        <option value="equipamentos">Equipamentos Autopropelidos</option>
                        <option value="regulamentacao">Regulamentação</option>
                        <option value="parcerias">Parcerias</option>
                        <option value="imprensa">Imprensa</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem *
                      </label>
                      <textarea
                        id="mensagem"
                        name="mensagem"
                        rows={5}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descreva sua dúvida ou mensagem..."
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Dúvidas Frequentes
            </h2>
            <p className="text-gray-600 mb-8">
              Antes de entrar em contato, confira se sua dúvida já foi respondida
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Equipamentos Compatíveis</h4>
                  <p className="text-gray-600 text-sm">
                    Quais equipamentos são regulamentados pela Resolução 996?
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Documentação Necessária</h4>
                  <p className="text-gray-600 text-sm">
                    Que documentos preciso para circular legalmente?
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">Multas e Penalidades</h4>
                  <p className="text-gray-600 text-sm">
                    Quais são as penalidades por não cumprir a regulamentação?
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Button variant="outline" className="mr-4">
                Ver Todas as Perguntas
              </Button>
              <Button>
                Fazer uma Pergunta
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
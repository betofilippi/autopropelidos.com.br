import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Termos de Uso - Portal Autopropelidos',
  description: 'Termos de Uso do Portal Autopropelidos. Conheça as regras e condições para utilizar nossos serviços.',
  keywords: ['termos de uso', 'condições', 'regras', 'portal autopropelidos'],
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Termos de Uso
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Condições gerais para utilização do Portal Autopropelidos
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Última atualização: Janeiro de 2024
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Aceitação dos Termos</h3>
              <p className="text-amber-800">
                Ao acessar e utilizar o Portal Autopropelidos, você concorda com estes Termos de Uso. 
                Se não concordar com alguma condição, não utilize nossos serviços.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Definições</h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>"Portal":</strong> O site autopropelidos.com.br e seus subdomínios</li>
              <li><strong>"Usuário":</strong> Qualquer pessoa que acesse o Portal</li>
              <li><strong>"Serviços":</strong> Todas as funcionalidades oferecidas pelo Portal</li>
              <li><strong>"Conteúdo":</strong> Textos, imagens, vídeos e demais materiais do site</li>
              <li><strong>"Nós" ou "Portal Autopropelidos":</strong> A entidade responsável pelo site</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Descrição dos Serviços</h2>
            
            <p>O Portal Autopropelidos oferece:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informações sobre a Resolução 996 do CONTRAN</li>
              <li>Notícias sobre equipamentos autopropelidos</li>
              <li>Ferramentas e calculadoras especializadas</li>
              <li>Biblioteca de documentos técnicos</li>
              <li>Conteúdo educativo em vídeo</li>
              <li>FAQ e glossário técnico</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Uso Permitido</h2>
            
            <p>Você pode utilizar nossos serviços para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acessar informações sobre regulamentações</li>
              <li>Utilizar ferramentas para fins educativos ou profissionais</li>
              <li>Compartilhar conteúdo de forma adequada</li>
              <li>Entrar em contato conosco para esclarecimentos</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Uso Proibido</h2>
            
            <p>É expressamente proibido:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar o Portal para atividades ilegais</li>
              <li>Tentar hackear, prejudicar ou sobrecarregar o sistema</li>
              <li>Reproduzir conteúdo sem autorização</li>
              <li>Enviar spam ou conteúdo malicioso</li>
              <li>Violar direitos de propriedade intelectual</li>
              <li>Utilizar dados de outros usuários indevidamente</li>
              <li>Fazer engenharia reversa do site</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Responsabilidades do Usuário</h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações verdadeiras quando solicitado</li>
              <li>Manter a confidencialidade de credenciais de acesso</li>
              <li>Utilizar os serviços de forma responsável</li>
              <li>Respeitar outros usuários e a equipe do Portal</li>
              <li>Reportar problemas de segurança ou uso inadequado</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Propriedade Intelectual</h2>
            
            <p>
              Todo conteúdo do Portal (textos, imagens, vídeos, logos, design) é protegido por direitos autorais 
              e outras leis de propriedade intelectual.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">6.1. Nossos Direitos</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Somos proprietários ou licenciados de todo conteúdo original</li>
              <li>Marcas, logos e design são de nossa propriedade</li>
              <li>Código fonte e funcionalidades são protegidos</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2. Uso Permitido de Conteúdo</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visualização para uso pessoal e não comercial</li>
              <li>Compartilhamento com atribuição adequada</li>
              <li>Citação para fins educativos ou jornalísticos</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitação de Responsabilidade</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Importante</h3>
              <p className="text-red-800">
                As informações fornecidas são para fins educativos e informativos. 
                Não constituem assessoria jurídica ou técnica oficial.
              </p>
            </div>

            <p>O Portal Autopropelidos não se responsabiliza por:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Decisões tomadas com base em informações do site</li>
              <li>Danos diretos ou indiretos decorrentes do uso</li>
              <li>Interrupções temporárias do serviço</li>
              <li>Conteúdo de sites externos linkados</li>
              <li>Ações de terceiros baseadas em nosso conteúdo</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Modificações do Serviço</h2>
            
            <p>Reservamo-nos o direito de:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modificar ou descontinuar serviços a qualquer momento</li>
              <li>Atualizar conteúdo conforme necessário</li>
              <li>Alterar funcionalidades e layout</li>
              <li>Implementar novas políticas de uso</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Suspensão e Encerramento</h2>
            
            <p>Podemos suspender ou encerrar o acesso de usuários que:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violarem estes Termos de Uso</li>
              <li>Utilizarem o Portal de forma inadequada</li>
              <li>Causarem prejuízos técnicos ou de imagem</li>
              <li>Não respeitarem direitos de terceiros</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Links Externos</h2>
            
            <p>
              Nosso site pode conter links para sites terceiros. Não nos responsabilizamos pelo conteúdo, 
              políticas de privacidade ou práticas desses sites.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Força Maior</h2>
            
            <p>
              Não seremos responsabilizados por falhas decorrentes de casos fortuitos, força maior, 
              problemas de infraestrutura de internet, ataques cibernéticos ou outras situações 
              fora de nosso controle.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">12. Lei Aplicável e Foro</h2>
            
            <p>
              Estes Termos são regidos pela legislação brasileira. O foro da comarca de São Paulo, SP, 
              é eleito para dirimir quaisquer controvérsias.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">13. Alterações dos Termos</h2>
            
            <p>
              Podemos atualizar estes Termos periodicamente. Alterações significativas serão comunicadas 
              através do site. O uso continuado após as alterações implica aceitação dos novos termos.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">14. Contato</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Dúvidas sobre os Termos</h3>
              <p><strong>Email:</strong> juridico@autopropelidos.com.br</p>
              <p><strong>Telefone:</strong> (11) 3000-0000</p>
              <p><strong>Endereço:</strong> Portal Autopropelidos - São Paulo, SP</p>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Para esclarecimentos sobre estes Termos de Uso, entre em contato conosco 
                  através dos canais acima.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Vigência:</strong> Estes Termos de Uso entram em vigor na data de sua 
                última atualização e permanecem válidos até serem substituídos por uma nova versão.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
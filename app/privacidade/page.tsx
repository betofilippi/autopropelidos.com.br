import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Política de Privacidade - Portal Autopropelidos',
  description: 'Política de Privacidade do Portal Autopropelidos. Saiba como coletamos, usamos e protegemos seus dados pessoais.',
  keywords: ['privacidade', 'dados pessoais', 'LGPD', 'política'],
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Política de Privacidade
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Transparência total sobre como tratamos seus dados pessoais
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Compromisso com sua Privacidade</h3>
              <p className="text-blue-800">
                O Portal Autopropelidos está comprometido com a proteção da sua privacidade e de seus dados pessoais, 
                em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Informações que Coletamos</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">1.1. Dados fornecidos voluntariamente</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome, email e telefone (formulários de contato)</li>
              <li>Dados de navegação e preferências</li>
              <li>Comentários e feedback enviados</li>
              <li>Dados de inscrição na newsletter</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2. Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Endereço IP e informações do dispositivo</li>
              <li>Dados de navegação (páginas visitadas, tempo de permanência)</li>
              <li>Cookies e tecnologias similares</li>
              <li>Localização geográfica aproximada</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Como Utilizamos seus Dados</h2>
            
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Prestação de Serviços:</strong> Fornecer informações sobre regulamentações e equipamentos autopropelidos</li>
              <li><strong>Comunicação:</strong> Responder suas dúvidas e enviar newsletters (com seu consentimento)</li>
              <li><strong>Melhoria do Site:</strong> Analisar uso do site para melhorar funcionalidades</li>
              <li><strong>Segurança:</strong> Detectar e prevenir fraudes ou uso inadequado</li>
              <li><strong>Cumprimento Legal:</strong> Cumprir obrigações legais e regulamentares</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Base Legal para Tratamento</h2>
            
            <p>Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consentimento:</strong> Para newsletters e comunicações de marketing</li>
              <li><strong>Execução de Contrato:</strong> Para prestação de serviços solicitados</li>
              <li><strong>Interesse Legítimo:</strong> Para melhoria dos serviços e segurança</li>
              <li><strong>Cumprimento de Obrigação Legal:</strong> Para atender exigências legais</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Compartilhamento de Dados</h2>
            
            <p>Não vendemos, alugamos ou comercializamos seus dados pessoais. Compartilhamos informações apenas:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Com prestadores de serviços que auxiliam na operação do site</li>
              <li>Quando exigido por lei ou autoridades competentes</li>
              <li>Para proteger nossos direitos legais ou segurança</li>
              <li>Com seu consentimento explícito</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Seus Direitos</h2>
            
            <p>Conforme a LGPD, você tem os seguintes direitos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acesso:</strong> Saber quais dados pessoais tratamos</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Revogação:</strong> Retirar o consentimento a qualquer momento</li>
              <li><strong>Oposição:</strong> Opor-se ao tratamento de dados</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies e Tecnologias Similares</h2>
            
            <p>Utilizamos cookies para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Melhorar a experiência de navegação</li>
              <li>Analisar o tráfego do site</li>
              <li>Personalizar conteúdo</li>
              <li>Funcionalidades técnicas essenciais</li>
            </ul>
            
            <p className="mt-4">Você pode gerenciar cookies através das configurações do seu navegador.</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Segurança dos Dados</h2>
            
            <p>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controles de acesso restrito</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Treinamento regular da equipe</li>
              <li>Backups seguros e regulares</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Retenção de Dados</h2>
            
            <p>Mantemos seus dados pelo tempo necessário para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cumprir a finalidade para qual foram coletados</li>
              <li>Atender obrigações legais</li>
              <li>Resolver disputas</li>
              <li>Exercer direitos em processos judiciais</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Transferência Internacional</h2>
            
            <p>
              Alguns dados podem ser transferidos para servidores localizados fora do Brasil, 
              sempre com garantias adequadas de proteção conforme exigido pela LGPD.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Alterações nesta Política</h2>
            
            <p>
              Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças 
              significativas através do site ou por email.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Contato</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Encarregado de Dados (DPO)</h3>
              <p><strong>Email:</strong> privacidade@autopropelidos.com.br</p>
              <p><strong>Telefone:</strong> (11) 3000-0000</p>
              <p><strong>Endereço:</strong> Portal Autopropelidos - São Paulo, SP</p>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                  entre em contato conosco através dos canais acima.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Esta política está em conformidade com a Lei Geral de Proteção 
                de Dados (LGPD) e outras legislações aplicáveis. Em caso de dúvidas específicas sobre 
                seus direitos, consulte um advogado especializado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
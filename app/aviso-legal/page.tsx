import type { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Aviso Legal - Portal Autopropelidos',
  description: 'Aviso Legal do Portal Autopropelidos. Informações legais importantes sobre nossos serviços e conteúdo.',
  keywords: ['aviso legal', 'informações legais', 'responsabilidades', 'portal autopropelidos'],
}

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Aviso Legal
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Informações legais importantes sobre o Portal Autopropelidos
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
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8">
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Natureza Informativa</h3>
              <p className="text-yellow-800">
                O Portal Autopropelidos é um site de caráter exclusivamente informativo e educacional. 
                As informações aqui contidas não substituem a consulta a fontes oficiais ou assessoria especializada.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Identificação do Portal</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Portal Autopropelidos</h3>
              <p><strong>Site:</strong> autopropelidos.com.br</p>
              <p><strong>Email:</strong> contato@autopropelidos.com.br</p>
              <p><strong>Responsável:</strong> Portal Autopropelidos</p>
              <p><strong>Localização:</strong> São Paulo, SP - Brasil</p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Objetivo do Portal</h2>
            
            <p>O Portal Autopropelidos tem como finalidades:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer informações sobre a Resolução 996 do CONTRAN</li>
              <li>Divulgar notícias relacionadas a equipamentos autopropelidos</li>
              <li>Oferecer ferramentas educativas e calculadoras</li>
              <li>Disponibilizar documentos técnicos e regulamentações</li>
              <li>Promover a conscientização sobre mobilidade urbana segura</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Natureza das Informações</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-6 my-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Importante</h3>
              <p className="text-red-800">
                As informações disponibilizadas são para fins educativos e informativos. 
                NÃO constituem assessoria jurídica, técnica ou profissional especializada.
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Fontes de Informação</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Documentos oficiais do CONTRAN e órgãos competentes</li>
              <li>Legislação brasileira vigente</li>
              <li>Fontes jornalísticas e técnicas confiáveis</li>
              <li>Análises e interpretações da equipe editorial</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Limitações</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informações podem estar desatualizadas</li>
              <li>Interpretações podem variar entre especialistas</li>
              <li>Legislação pode sofrer alterações</li>
              <li>Aplicação prática pode diferir da teoria</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Isenção de Responsabilidade</h2>
            
            <p>O Portal Autopropelidos não se responsabiliza por:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4.1. Decisões Baseadas no Conteúdo</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Compra de equipamentos com base em nossas informações</li>
              <li>Decisões legais ou técnicas tomadas pelo usuário</li>
              <li>Interpretações incorretas do conteúdo</li>
              <li>Aplicação inadequada das informações</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.2. Danos ou Prejuízos</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Danos materiais ou financeiros</li>
              <li>Prejuízos profissionais ou comerciais</li>
              <li>Multas ou penalidades decorrentes do uso</li>
              <li>Problemas técnicos ou de segurança</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.3. Conteúdo de Terceiros</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Links para sites externos</li>
              <li>Informações de fontes terceiras</li>
              <li>Comentários de usuários</li>
              <li>Conteúdo de parceiros</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Precisão e Atualização</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">5.1. Esforços de Precisão</h3>
            <p>Fazemos nossos melhores esforços para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Verificar informações antes da publicação</li>
              <li>Manter conteúdo atualizado</li>
              <li>Corrigir erros quando identificados</li>
              <li>Indicar fontes quando possível</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2. Limitações Técnicas</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Não podemos garantir 100% de precisão</li>
              <li>Atualizações podem demorar a ser implementadas</li>
              <li>Erros humanos podem ocorrer</li>
              <li>Interpretações podem ser subjetivas</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Uso Recomendado</h2>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6">
              <h3 className="text-lg font-bold text-green-900 mb-2">Recomendações</h3>
              <p className="text-green-800">
                Sempre consulte fontes oficiais e profissionais qualificados para decisões importantes 
                relacionadas a regulamentações e equipamentos autopropelidos.
              </p>
            </div>

            <p>Para uso adequado do portal:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use as informações como ponto de partida para pesquisas</li>
              <li>Consulte sempre fontes oficiais para confirmação</li>
              <li>Procure assessoria especializada quando necessário</li>
              <li>Mantenha-se atualizado sobre mudanças na legislação</li>
              <li>Verifique a data de publicação dos conteúdos</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Propriedade Intelectual</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">7.1. Conteúdo Original</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Textos autorais são protegidos por direitos autorais</li>
              <li>Layout e design são de nossa propriedade</li>
              <li>Compilações e organizações são protegidas</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.2. Conteúdo de Terceiros</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Documentos oficiais são de domínio público</li>
              <li>Imagens podem ter direitos de terceiros</li>
              <li>Citações respeitam o uso justo</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Política de Correções</h2>
            
            <p>Quando identificamos erros ou imprecisões:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fazemos correções o mais rapidamente possível</li>
              <li>Indicamos a data da última atualização</li>
              <li>Mantemos histórico de versões quando relevante</li>
              <li>Informamos sobre correções importantes</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">9. Disponibilidade do Serviço</h2>
            
            <p>O portal pode estar temporariamente indisponível devido a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manutenções programadas</li>
              <li>Problemas técnicos</li>
              <li>Atualizações de sistema</li>
              <li>Problemas de infraestrutura</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">10. Contato e Notificações</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Para questões legais:</h3>
              <p><strong>Email:</strong> juridico@autopropelidos.com.br</p>
              <p><strong>Telefone:</strong> (11) 3000-0000</p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">Para reportar erros:</h3>
              <p><strong>Email:</strong> correcoes@autopropelidos.com.br</p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">Contato geral:</h3>
              <p><strong>Email:</strong> contato@autopropelidos.com.br</p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">11. Lei Aplicável</h2>
            
            <p>
              Este aviso legal é regido pela legislação brasileira, especialmente:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Lei Geral de Proteção de Dados (LGPD)</li>
              <li>Marco Civil da Internet</li>
              <li>Código de Defesa do Consumidor</li>
              <li>Código Civil Brasileiro</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Última atualização:</strong> Janeiro de 2024. Este aviso legal pode ser 
                atualizado periodicamente para refletir mudanças em nossos serviços ou na legislação aplicável.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
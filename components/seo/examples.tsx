// Exemplos de uso do componente SEOHead
import { SEOHead, generateArticleStructuredData, generateFAQStructuredData } from './SEOHead'

// Exemplo 1: Página inicial
export function HomePageSEO() {
  return (
    <SEOHead
      title="Portal Autopropelidos - Resolução 996 CONTRAN"
      description="Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN. Notícias, vídeos, ferramentas e informações sobre patinetes elétricos."
      keywords={['autopropelidos', 'CONTRAN 996', 'patinete elétrico', 'mobilidade urbana']}
      url="https://autopropelidos.com.br"
      type="website"
      image="/og-image.jpg"
      breadcrumbs={[
        { name: 'Home', url: '/' }
      ]}
    />
  )
}

// Exemplo 2: Página de artigo
export function ArticlePageSEO() {
  const articleData = generateArticleStructuredData({
    title: 'Nova Regulamentação para Patinetes Elétricos em 2024',
    description: 'Conheça as principais mudanças na regulamentação de equipamentos autopropelidos',
    content: 'Conteúdo completo do artigo...',
    publishDate: '2024-01-15T10:00:00Z',
    modifiedDate: '2024-01-16T14:30:00Z',
    author: 'Portal Autopropelidos',
    category: 'Regulamentação',
    tags: ['patinetes', 'regulamentação', 'CONTRAN'],
    image: '/articles/nova-regulamentacao-2024.jpg',
    url: 'https://autopropelidos.com.br/noticias/nova-regulamentacao-patinetes-eletricos-2024'
  })

  return (
    <SEOHead
      title="Nova Regulamentação para Patinetes Elétricos em 2024"
      description="Conheça as principais mudanças na regulamentação de equipamentos autopropelidos"
      keywords={['patinetes elétricos', 'regulamentação 2024', 'CONTRAN', 'mobilidade urbana']}
      url="https://autopropelidos.com.br/noticias/nova-regulamentacao-patinetes-eletricos-2024"
      type="article"
      image="/articles/nova-regulamentacao-2024.jpg"
      publishDate="2024-01-15T10:00:00Z"
      modifiedDate="2024-01-16T14:30:00Z"
      author="Portal Autopropelidos"
      category="Regulamentação"
      tags={['patinetes', 'regulamentação', 'CONTRAN']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Notícias', url: '/noticias' },
        { name: 'Nova Regulamentação 2024', url: '/noticias/nova-regulamentacao-patinetes-eletricos-2024' }
      ]}
      structuredData={articleData}
    />
  )
}

// Exemplo 3: Página de FAQ
export function FAQPageSEO() {
  const faqData = generateFAQStructuredData([
    {
      question: 'Qual a velocidade máxima permitida para patinetes elétricos?',
      answer: 'A velocidade máxima permitida para patinetes elétricos é de 32 km/h, conforme estabelecido pela Resolução 996 do CONTRAN.'
    },
    {
      question: 'Preciso usar capacete para andar de patinete elétrico?',
      answer: 'Sim, o uso de capacete é obrigatório para condutores de patinetes elétricos, conforme a regulamentação vigente.'
    },
    {
      question: 'Onde posso circular com meu patinete elétrico?',
      answer: 'Patinetes elétricos podem circular em ciclovias, ciclofaixas e vias locais com velocidade máxima de até 50 km/h.'
    }
  ])

  return (
    <SEOHead
      title="Perguntas Frequentes sobre Equipamentos Autopropelidos"
      description="Tire suas dúvidas sobre a regulamentação, uso e segurança de equipamentos autopropelidos como patinetes e bicicletas elétricas"
      keywords={['FAQ', 'perguntas frequentes', 'patinetes elétricos', 'regulamentação', 'dúvidas']}
      url="https://autopropelidos.com.br/faq"
      type="website"
      tags={['faq']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'FAQ', url: '/faq' }
      ]}
      structuredData={faqData}
    />
  )
}

// Exemplo 4: Página de produto/ferramenta
export function ToolPageSEO() {
  return (
    <SEOHead
      title="Verificador de Conformidade - Equipamentos Autopropelidos"
      description="Ferramenta gratuita para verificar se seu equipamento autopropelido está em conformidade com a Resolução 996 do CONTRAN"
      keywords={['verificador', 'conformidade', 'CONTRAN 996', 'ferramenta', 'checklist']}
      url="https://autopropelidos.com.br/ferramentas/verificador-conformidade"
      type="website"
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Ferramentas', url: '/ferramentas' },
        { name: 'Verificador de Conformidade', url: '/ferramentas/verificador-conformidade' }
      ]}
      structuredData={{
        "@type": "WebApplication",
        "name": "Verificador de Conformidade",
        "description": "Ferramenta para verificar conformidade com a Resolução 996 do CONTRAN",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "BRL"
        }
      }}
    />
  )
}

// Exemplo 5: Página com noindex (página de busca)
export function SearchPageSEO() {
  return (
    <SEOHead
      title="Resultados da Busca"
      description="Resultados da busca no Portal Autopropelidos"
      noIndex={true}
      noFollow={true}
      canonical="https://autopropelidos.com.br/busca"
    />
  )
}

// Exemplo 6: Página multilíngue
export function MultiLanguagePageSEO() {
  return (
    <SEOHead
      title="Portal Autopropelidos - CONTRAN Resolution 996"
      description="Complete portal about self-propelled equipment and CONTRAN Resolution 996"
      keywords={['self-propelled', 'CONTRAN 996', 'electric scooter', 'urban mobility']}
      url="https://autopropelidos.com.br/en"
      type="website"
      alternateLanguages={[
        { hreflang: 'pt-BR', href: 'https://autopropelidos.com.br' },
        { hreflang: 'en', href: 'https://autopropelidos.com.br/en' },
        { hreflang: 'es', href: 'https://autopropelidos.com.br/es' }
      ]}
    />
  )
}
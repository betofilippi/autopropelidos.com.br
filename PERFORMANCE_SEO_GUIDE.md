# Guia de Performance e SEO - Portal Autopropelidos

Este guia documenta todas as otimizações de performance e SEO implementadas no Portal Autopropelidos.

## 📋 Índice

- [Otimizações de Performance](#otimizações-de-performance)
- [Otimizações de SEO](#otimizações-de-seo)
- [Componentes Criados](#componentes-criados)
- [Configurações](#configurações)
- [Como Usar](#como-usar)
- [Métricas e Monitoramento](#métricas-e-monitoramento)

## 🚀 Otimizações de Performance

### Core Web Vitals

#### Largest Contentful Paint (LCP)
- **Preload de recursos críticos**: Fontes, imagens hero, CSS crítico
- **Otimização de imagens**: WebP, AVIF, lazy loading inteligente
- **Componente HeroImage**: Prioridade alta para imagens above-the-fold

#### First Input Delay (FID)
- **Code splitting**: Separação automática de chunks
- **Lazy loading**: Componentes carregados sob demanda
- **Otimização de bundle**: Remoção de código não utilizado

#### Cumulative Layout Shift (CLS)
- **Dimensões de imagem**: Sempre especificadas
- **Placeholders**: Skeletons para evitar layout shifts
- **Aspect ratio**: Mantém proporções durante carregamento

### Otimizações de Imagem

```typescript
// Componente otimizado para hero
<HeroImage
  src="/hero-image.webp"
  alt="Descrição detalhada da imagem"
  priority={true}
  quality={90}
  sizes="100vw"
/>

// Componente para galerias
<GalleryImage
  src="/gallery-image.webp"
  alt="Descrição da imagem"
  quality={80}
  aspectRatio="video"
/>

// Componente para thumbnails
<ThumbnailImage
  src="/thumb.webp"
  alt="Thumbnail"
  quality={70}
  sizes="(max-width: 640px) 150px, 200px"
/>
```

### Otimizações de Carregamento

- **DNS Prefetch**: Recursos externos pré-carregados
- **Preconnect**: Conexões críticas estabelecidas antecipadamente
- **Resource Hints**: Modulepreload para chunks importantes
- **Critical CSS**: Estilos críticos inline

## 🔍 Otimizações de SEO

### Meta Tags Avançadas

```typescript
// Layout principal com meta tags completas
export const metadata: Metadata = {
  metadataBase: new URL('https://autopropelidos.com.br'),
  title: {
    default: 'Portal Autopropelidos',
    template: '%s | Portal Autopropelidos'
  },
  // ... mais configurações
}
```

### Structured Data (Schema.org)

#### Website Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Portal Autopropelidos",
  "url": "https://autopropelidos.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://autopropelidos.com.br/search?q={search_term_string}"
  }
}
```

#### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Título do Artigo",
  "datePublished": "2024-01-15T10:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Portal Autopropelidos"
  }
}
```

### Open Graph e Twitter Cards

- **Open Graph**: Imagens otimizadas (1200x630)
- **Twitter Cards**: Summary large image
- **Múltiplas imagens**: Quadrada e retangular para diferentes contextos

## 🛠️ Componentes Criados

### SEOHead Component

Componente reutilizável para gerenciar SEO de páginas:

```typescript
import { SEOHead } from '@/components/seo/SEOHead'

function MyPage() {
  return (
    <>
      <SEOHead
        title="Título da Página"
        description="Descrição da página"
        keywords={['palavra1', 'palavra2']}
        type="article"
        image="/og-image.jpg"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Categoria', url: '/categoria' }
        ]}
      />
      {/* Conteúdo da página */}
    </>
  )
}
```

### Componentes de Imagem Otimizados

- **OptimizedImage**: Componente base com lazy loading
- **HeroImage**: Para imagens above-the-fold
- **GalleryImage**: Para galerias com zoom
- **ThumbnailImage**: Para listas e thumbnails
- **VideoThumbnail**: Para vídeos com overlay

### Funcionalidades dos Componentes

#### OptimizedImage
- Lazy loading inteligente
- Fallback automático
- Blur placeholder
- Detecção de URL externa
- Otimização automática de qualidade

#### SEOHead
- Structured data automático
- Breadcrumbs
- Múltiplos idiomas
- Meta tags personalizáveis
- Robots configurável

## ⚙️ Configurações

### next.config.mjs

```javascript
// Otimizações de imagem
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  minimumCacheTTL: 31536000, // 1 ano
}

// Headers de segurança
headers: [
  {
    source: '/:path*',
    headers: [
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'X-Frame-Options', value: 'DENY' },
      // ... mais headers
    ]
  }
]
```

### Manifest.json (PWA)

```json
{
  "name": "Portal Autopropelidos",
  "short_name": "Autopropelidos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#2563eb"
}
```

## 📊 APIs Criadas

### Sitemap Automático
- **Endpoint**: `/api/sitemap`
- **Formato**: XML
- **Frequência**: Atualização automática

### Robots.txt
- **Endpoint**: `/api/robots`
- **Configuração**: Bots permitidos/bloqueados
- **Sitemap**: Referência automática

### RSS Feed
- **Endpoint**: `/api/rss`
- **Formato**: RSS 2.0
- **Conteúdo**: Artigos e notícias

## 🎯 Como Usar

### 1. Em Páginas Estáticas

```typescript
// app/page.tsx
import { SEOHead } from '@/components/seo/SEOHead'

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Portal Autopropelidos"
        description="Portal sobre equipamentos autopropelidos"
        type="website"
      />
      <main>
        {/* Conteúdo */}
      </main>
    </>
  )
}
```

### 2. Em Páginas Dinâmicas

```typescript
// app/noticias/[slug]/page.tsx
import { SEOHead, generateArticleStructuredData } from '@/components/seo/SEOHead'

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  
  const structuredData = generateArticleStructuredData({
    title: article.title,
    description: article.description,
    content: article.content,
    publishDate: article.publishDate,
    author: article.author,
    category: article.category,
    tags: article.tags,
    url: `https://autopropelidos.com.br/noticias/${params.slug}`
  })

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.description}
        type="article"
        structuredData={structuredData}
      />
      <article>
        {/* Conteúdo do artigo */}
      </article>
    </>
  )
}
```

### 3. Com Imagens Otimizadas

```typescript
// Componente com imagem hero
<HeroImage
  src="/hero-image.webp"
  alt="Descrição completa da imagem para acessibilidade"
  priority={true}
  quality={90}
  sizes="100vw"
/>

// Componente com galeria
<GalleryImage
  src="/gallery-image.webp"
  alt="Descrição da imagem da galeria"
  quality={80}
  aspectRatio="video"
/>
```

## 📈 Métricas e Monitoramento

### Ferramentas de Análise

1. **Google PageSpeed Insights**
   - Core Web Vitals
   - Performance score
   - Oportunidades de melhoria

2. **Lighthouse**
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 100
   - SEO: 100

3. **Google Search Console**
   - Indexação
   - Core Web Vitals
   - Structured data

### Comandos Úteis

```bash
# Analisar bundle
npm run build && ANALYZE=true npm run build

# Verificar performance
npm run lighthouse

# Testar PWA
npm run pwa-test

# Validar structured data
npm run validate-schema
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Imagens não carregam**
   - Verificar domínios em `next.config.mjs`
   - Conferir URLs das imagens
   - Validar propriedades alt

2. **SEO não funciona**
   - Verificar `metadataBase` no layout
   - Validar structured data
   - Conferir canonical URLs

3. **Performance baixa**
   - Verificar preload de recursos
   - Otimizar imagens
   - Revisar bundle size

### Verificação de SEO

```bash
# Testar structured data
curl -s https://autopropelidos.com.br | grep -o '<script type="application/ld+json">.*</script>'

# Verificar meta tags
curl -s https://autopropelidos.com.br | grep -i '<meta'

# Testar sitemap
curl -s https://autopropelidos.com.br/sitemap.xml
```

## 📚 Referências

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Core Web Vitals](https://web.dev/vitals/)
- [Schema.org](https://schema.org/)
- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

## 🆘 Suporte

Para dúvidas ou problemas relacionados às otimizações:

1. Verificar este guia
2. Consultar logs de build
3. Testar em ambiente de desenvolvimento
4. Validar com ferramentas do Google

---

**Última atualização**: Janeiro 2024
**Versão**: 1.0.0
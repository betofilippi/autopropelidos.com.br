import Head from 'next/head'
import Script from 'next/script'
import { NewsItem } from '@/lib/types/services'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  author?: string
  category?: string
  publishedTime?: string
  modifiedTime?: string
  images?: Array<{
    url: string
    width?: number
    height?: number
    alt?: string
  }>
  videos?: Array<{
    url: string
    title: string
    description: string
    thumbnail?: string
    duration?: number
  }>
  breadcrumbs?: Array<{
    name: string
    url: string
  }>
  faq?: Array<{
    question: string
    answer: string
  }>
  organization?: {
    name: string
    url: string
    logo: string
    description: string
    contactPoint?: {
      telephone: string
      contactType: string
      areaServed: string
      availableLanguage: string
    }
  }
  website?: {
    url: string
    name: string
    description: string
    inLanguage: string
    potentialAction?: Array<{
      type: string
      target: string
      queryInput?: string
    }>
  }
}

const defaultOrganization = {
  name: 'Portal Autopropelidos',
  url: 'https://autopropelidos.com.br',
  logo: 'https://autopropelidos.com.br/logo.png',
  description: 'Portal especializado em equipamentos autopropelidos, regulamentação e mobilidade urbana no Brasil',
  contactPoint: {
    telephone: '+55-11-99999-9999',
    contactType: 'customer support',
    areaServed: 'BR',
    availableLanguage: 'pt-BR'
  }
}

const defaultWebsite = {
  url: 'https://autopropelidos.com.br',
  name: 'Portal Autopropelidos',
  description: 'Portal especializado em equipamentos autopropelidos, regulamentação CONTRAN 996 e mobilidade urbana',
  inLanguage: 'pt-BR',
  potentialAction: [
    {
      type: 'SearchAction',
      target: 'https://autopropelidos.com.br/busca?q={search_term_string}',
      queryInput: 'required name=search_term_string'
    }
  ]
}

interface AdvancedSEOHeadProps {
  config: SEOConfig
  type?: 'website' | 'article' | 'newsarticle' | 'faq' | 'video'
  news?: NewsItem
  canonical?: string
  alternates?: Array<{
    hreflang: string
    href: string
  }>
  noIndex?: boolean
  structuredData?: Record<string, any>[]
}

export function AdvancedSEOHead({
  config,
  type = 'website',
  news,
  canonical,
  alternates = [],
  noIndex = false,
  structuredData = []
}: AdvancedSEOHeadProps) {
  const {
    title,
    description,
    keywords = [],
    author,
    category,
    publishedTime,
    modifiedTime,
    images = [],
    videos = [],
    breadcrumbs = [],
    faq = [],
    organization = defaultOrganization,
    website = defaultWebsite
  } = config

  // Gerar Schema.org baseado no tipo
  const generateSchema = () => {
    const schemas = []

    // Organization Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organization.name,
      url: organization.url,
      logo: {
        '@type': 'ImageObject',
        url: organization.logo,
        width: 200,
        height: 60
      },
      description: organization.description,
      contactPoint: organization.contactPoint ? {
        '@type': 'ContactPoint',
        telephone: organization.contactPoint.telephone,
        contactType: organization.contactPoint.contactType,
        areaServed: organization.contactPoint.areaServed,
        availableLanguage: organization.contactPoint.availableLanguage
      } : undefined,
      sameAs: [
        'https://twitter.com/autopropelidos',
        'https://facebook.com/autopropelidos',
        'https://linkedin.com/company/autopropelidos'
      ]
    })

    // Website Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: website.name,
      url: website.url,
      description: website.description,
      inLanguage: website.inLanguage,
      publisher: {
        '@type': 'Organization',
        name: organization.name,
        url: organization.url,
        logo: organization.logo
      },
      potentialAction: website.potentialAction?.map(action => ({
        '@type': action.type,
        target: action.target,
        'query-input': action.queryInput
      }))
    })

    // Breadcrumb Schema
    if (breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url
        }))
      })
    }

    // News Article Schema
    if (type === 'newsarticle' && news) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: description,
        image: images.map(img => img.url),
        datePublished: publishedTime || news.published_at,
        dateModified: modifiedTime || new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: author || news.source,
          url: organization.url
        },
        publisher: {
          '@type': 'Organization',
          name: organization.name,
          logo: {
            '@type': 'ImageObject',
            url: organization.logo,
            width: 200,
            height: 60
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical || website.url
        },
        articleSection: category,
        keywords: keywords.join(', '),
        wordCount: news.content ? news.content.split(/\s+/).length : 0,
        inLanguage: 'pt-BR',
        isAccessibleForFree: true,
        about: [
          {
            '@type': 'Thing',
            name: 'Equipamentos Autopropelidos',
            description: 'Regulamentação e informações sobre patinetes elétricos, bicicletas elétricas e ciclomotores'
          },
          {
            '@type': 'Thing',
            name: 'CONTRAN 996',
            description: 'Resolução 996 do CONTRAN sobre equipamentos de mobilidade pessoal'
          }
        ],
        mentions: news.tags.map(tag => ({
          '@type': 'Thing',
          name: tag
        }))
      })
    }

    // Video Schema
    if (videos.length > 0) {
      videos.forEach(video => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnail,
          contentUrl: video.url,
          duration: video.duration ? `PT${video.duration}S` : undefined,
          uploadDate: publishedTime,
          publisher: {
            '@type': 'Organization',
            name: organization.name,
            logo: organization.logo
          }
        })
      })
    }

    // FAQ Schema
    if (faq.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      })
    }

    // Adicionar schemas customizados
    schemas.push(...structuredData)

    return schemas
  }

  const schemas = generateSchema()

  return (
    <>
      {/* Meta Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}
      {category && <meta name="category" content={category} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Alternate Languages */}
      {alternates.map(alt => (
        <link
          key={alt.hreflang}
          rel="alternate"
          hrefLang={alt.hreflang}
          href={alt.href}
        />
      ))}
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === 'newsarticle' ? 'article' : 'website'} />
      <meta property="og:site_name" content={organization.name} />
      <meta property="og:locale" content="pt_BR" />
      {canonical && <meta property="og:url" content={canonical} />}
      
      {/* Open Graph - Article */}
      {type === 'newsarticle' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {keywords.map(keyword => (
            <meta key={keyword} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Open Graph - Images */}
      {images.map((image, index) => (
        <div key={index}>
          <meta property="og:image" content={image.url} />
          {image.width && <meta property="og:image:width" content={image.width.toString()} />}
          {image.height && <meta property="og:image:height" content={image.height.toString()} />}
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </div>
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={images.length > 0 ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {images.length > 0 && <meta name="twitter:image" content={images[0].url} />}
      <meta name="twitter:site" content="@autopropelidos" />
      <meta name="twitter:creator" content="@autopropelidos" />
      
      {/* Google News Tags */}
      {type === 'newsarticle' && (
        <>
          <meta name="news_keywords" content={keywords.join(', ')} />
          {category && <meta name="article:section" content={category} />}
          {publishedTime && <meta name="article:published_time" content={publishedTime} />}
          <meta name="syndication-source" content={canonical || website.url} />
          <meta name="original-source" content={canonical || website.url} />
        </>
      )}
      
      {/* Apple Touch Icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preconnect */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* RSS Feeds */}
      <link rel="alternate" type="application/rss+xml" title="Portal Autopropelidos - Todas as Notícias" href="/api/rss" />
      <link rel="alternate" type="application/rss+xml" title="Portal Autopropelidos - Regulamentação" href="/api/rss?category=regulation" />
      <link rel="alternate" type="application/rss+xml" title="Portal Autopropelidos - Segurança" href="/api/rss?category=safety" />
      <link rel="alternate" type="application/rss+xml" title="Portal Autopropelidos - Tecnologia" href="/api/rss?category=technology" />
      <link rel="alternate" type="application/rss+xml" title="Portal Autopropelidos - Mobilidade Urbana" href="/api/rss?category=urban_mobility" />
      
      {/* Schema.org JSON-LD */}
      {schemas.map((schema, index) => (
        <Script
          key={index}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}

// Hook para gerar configuração SEO para notícias
export function useNewsSEO(news: NewsItem, slug: string): SEOConfig {
  const categoryLabels = {
    regulation: 'Regulamentação',
    safety: 'Segurança',
    technology: 'Tecnologia',
    urban_mobility: 'Mobilidade Urbana',
    general: 'Geral'
  }

  return {
    title: `${news.title} | Portal Autopropelidos`,
    description: news.description,
    keywords: [
      ...news.tags,
      'patinete elétrico',
      'bicicleta elétrica',
      'CONTRAN 996',
      'regulamentação',
      'mobilidade urbana',
      'equipamentos autopropelidos'
    ],
    author: news.source,
    category: categoryLabels[news.category as keyof typeof categoryLabels],
    publishedTime: news.published_at,
    modifiedTime: new Date().toISOString(),
    images: news.image_url ? [
      {
        url: news.image_url,
        width: 800,
        height: 600,
        alt: news.title
      }
    ] : [],
    breadcrumbs: [
      { name: 'Home', url: 'https://autopropelidos.com.br' },
      { name: 'Notícias', url: 'https://autopropelidos.com.br/noticias' },
      { name: news.title, url: `https://autopropelidos.com.br/noticias/${slug}` }
    ]
  }
}

// Hook para gerar configuração SEO genérica
export function usePageSEO(
  title: string,
  description: string,
  path: string,
  options: Partial<SEOConfig> = {}
): SEOConfig {
  return {
    title: `${title} | Portal Autopropelidos`,
    description,
    keywords: [
      'patinete elétrico',
      'bicicleta elétrica',
      'CONTRAN 996',
      'regulamentação',
      'mobilidade urbana',
      'equipamentos autopropelidos',
      ...(options.keywords || [])
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://autopropelidos.com.br' },
      { name: title, url: `https://autopropelidos.com.br${path}` }
    ],
    ...options
  }
}
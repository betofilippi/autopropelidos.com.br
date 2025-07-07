import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ArrowLeft, Calendar, ExternalLink, Share2, Clock, User, Tag } from "lucide-react"
import { getLatestNews, getRelatedNews } from '@/lib/services/news'
import { NewsItem } from '@/lib/types/services'
import Link from 'next/link'

// Função para gerar slugs SEO-friendly
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
}

// Função para encontrar notícia pelo slug
async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const allNews = await getLatestNews('all', 100) // Reduzido para melhor performance
    const found = allNews.find(news => generateSlug(news.title) === slug)
    
    // Garantir que as propriedades essenciais existam
    if (found) {
      return {
        ...found,
        tags: found.tags || [],
        content: found.content || found.description || '',
        description: found.description || '',
      }
    }
    
    return null
  } catch (error) {
    console.error('Error getting news by slug:', error)
    return null
  }
}

// Função para gerar parâmetros estáticos - limitado para evitar problemas de build
export async function generateStaticParams() {
  try {
    const news = await getLatestNews('all', 20) // Reduzido de 100 para 20
    
    return news.slice(0, 10).map((article) => ({
      slug: generateSlug(article.title),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return [] // Retorna array vazio se houver erro
  }
}

// Função para gerar metadata dinâmica
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const news = await getNewsBySlug(params.slug)
  
  if (!news) {
    return {
      title: 'Notícia não encontrada | Portal Autopropelidos',
      description: 'A notícia solicitada não foi encontrada.',
    }
  }

  const categoryLabels = {
    regulation: 'Regulamentação',
    safety: 'Segurança',
    technology: 'Tecnologia',
    urban_mobility: 'Mobilidade Urbana',
    general: 'Geral'
  }

  const publishedTime = new Date(news.published_at).toISOString()
  const modifiedTime = new Date().toISOString()

  return {
    title: `${news.title} | Portal Autopropelidos`,
    description: news.description,
    keywords: [
      ...(news.tags || []),
      'patinete elétrico',
      'bicicleta elétrica',
      'CONTRAN 996',
      'regulamentação',
      'mobilidade urbana'
    ].join(', '),
    authors: [{ name: news.source }],
    category: categoryLabels[news.category as keyof typeof categoryLabels] || 'Notícias',
    openGraph: {
      title: news.title,
      description: news.description,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [news.source],
      section: categoryLabels[news.category as keyof typeof categoryLabels],
      tags: news.tags,
      images: news.image_url ? [
        {
          url: news.image_url,
          width: 800,
          height: 600,
          alt: news.title,
        }
      ] : [],
      siteName: 'Portal Autopropelidos',
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.description,
      images: news.image_url ? [news.image_url] : [],
    },
    alternates: {
      canonical: `https://autopropelidos.com.br/noticias/${params.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'news:keywords': (news.tags || []).join(','),
      'news:section': categoryLabels[news.category as keyof typeof categoryLabels],
      'news:publish_date': publishedTime,
    },
  }
}

const categoryColors = {
  regulation: 'bg-blue-100 text-blue-800 border-blue-200',
  safety: 'bg-red-100 text-red-800 border-red-200',
  technology: 'bg-purple-100 text-purple-800 border-purple-200',
  urban_mobility: 'bg-green-100 text-green-800 border-green-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200'
}

const categoryLabels = {
  regulation: 'Regulamentação',
  safety: 'Segurança',
  technology: 'Tecnologia',
  urban_mobility: 'Mobilidade Urbana',
  general: 'Geral'
}

function formatPublishedDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = (content || '').split(/\s+/).filter(word => word.length > 0).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

// Componente para Schema.org JSON-LD
function NewsSchema({ news }: { news: NewsItem }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": news.title,
    "description": news.description,
    "image": news.image_url ? [news.image_url] : [],
    "datePublished": news.published_at,
    "dateModified": new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": news.source,
      "url": `https://autopropelidos.com.br`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Portal Autopropelidos",
      "logo": {
        "@type": "ImageObject",
        "url": "https://autopropelidos.com.br/logo.png",
        "width": 200,
        "height": 60
      },
      "url": "https://autopropelidos.com.br"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://autopropelidos.com.br/noticias/${generateSlug(news.title)}`
    },
    "articleSection": categoryLabels[news.category as keyof typeof categoryLabels],
    "keywords": (news.tags || []).join(', '),
    "wordCount": (news.content || '').split(/\s+/).filter(word => word.length > 0).length,
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "url": `https://autopropelidos.com.br/noticias/${generateSlug(news.title)}`,
    "about": [
      {
        "@type": "Thing",
        "name": "Equipamentos Autopropelidos",
        "description": "Regulamentação e informações sobre patinetes elétricos, bicicletas elétricas e ciclomotores"
      }
    ]
  }

  // Adiciona BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://autopropelidos.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Notícias",
        "item": "https://autopropelidos.com.br/noticias"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": news.title,
        "item": `https://autopropelidos.com.br/noticias/${generateSlug(news.title)}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

// Componente de Loading para Related News
function RelatedNewsLoading() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Notícias Relacionadas
      </h3>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para Related News
async function RelatedNews({ newsId }: { newsId: string }) {
  try {
    const relatedNews = await getRelatedNews(newsId, 5)

    if (!relatedNews || relatedNews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Notícias Relacionadas
      </h3>
      <div className="space-y-3">
        {relatedNews.map((related) => (
          <Link
            key={related.id}
            href={`/noticias/${generateSlug(related.title)}`}
            className="block p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
              {related.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{related.source}</span>
              <span>{formatPublishedDate(related.published_at).split(',')[0] || formatPublishedDate(related.published_at)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
  } catch (error) {
    console.error('Error loading related news:', error)
    return null
  }
}

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const news = await getNewsBySlug(params.slug)

  if (!news) {
    notFound()
  }

  const readingTime = getReadingTime(news.content || news.description || '')

  return (
    <>
      <NewsSchema news={news} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header with breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/noticias">Notícias</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-600 dark:text-gray-400 line-clamp-1">
                    {news.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-6">
              <Link
                href="/noticias"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Notícias
              </Link>
            </div>

            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Featured Image */}
              {news.image_url && (
                <div className="relative aspect-video overflow-hidden">
                  <OptimizedImage
                    src={news.image_url}
                    alt={news.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="p-6 lg:p-8">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Badge 
                    variant="outline" 
                    className={categoryColors[news.category as keyof typeof categoryColors]}
                  >
                    {categoryLabels[news.category as keyof typeof categoryLabels]}
                  </Badge>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <User className="h-4 w-4 mr-1" />
                    {news.source}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatPublishedDate(news.published_at)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {readingTime} min de leitura
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {news.title}
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {news.description}
                </p>

                {/* Tags */}
                {(news.tags && news.tags.length > 0) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    {news.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator className="mb-6" />

                {/* Content */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {news.content ? (
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {news.description}
                    </p>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                    
                    <Link href={news.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Fonte Original
                      </Button>
                    </Link>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Relevância: {news.relevance_score}%
                  </div>
                </div>
              </div>
            </article>

            {/* Related News Sidebar */}
            <div className="mt-8 lg:mt-12">
              <Card>
                <CardContent className="p-6">
                  <Suspense fallback={<RelatedNewsLoading />}>
                    <RelatedNews newsId={news.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Configuração do ISR (Incremental Static Regeneration)
export const revalidate = 3600 // Revalida a cada 1 hora
export const dynamic = 'force-static'
export const dynamicParams = true
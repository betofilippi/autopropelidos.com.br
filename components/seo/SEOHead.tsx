import Head from 'next/head'

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'video'
  publishDate?: string
  modifiedDate?: string
  author?: string
  category?: string
  tags?: string[]
  noIndex?: boolean
  noFollow?: boolean
  canonical?: string
  alternateLanguages?: { hreflang: string; href: string }[]
  structuredData?: Record<string, any>
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishDate,
  modifiedDate,
  author,
  category,
  tags = [],
  noIndex = false,
  noFollow = false,
  canonical,
  alternateLanguages = [],
  structuredData,
  breadcrumbs = []
}: SEOProps) {
  const siteUrl = 'https://autopropelidos.com.br'
  const defaultTitle = 'Portal Autopropelidos - Resolução 996 CONTRAN'
  const defaultDescription = 'Portal definitivo sobre equipamentos autopropelidos e a Resolução 996 do CONTRAN'
  const defaultImage = '/og-image.jpg'
  
  const pageTitle = title ? `${title} | Portal Autopropelidos` : defaultTitle
  const pageDescription = description || defaultDescription
  const pageImage = image || defaultImage
  const pageUrl = url || siteUrl
  
  // Combine default keywords with page-specific keywords
  const allKeywords = [
    'autopropelidos',
    'CONTRAN 996',
    'patinete elétrico',
    'bicicleta elétrica',
    'regulamentação',
    'mobilidade urbana',
    ...keywords
  ]
  
  // Generate robots content
  const robotsContent = []
  if (noIndex) robotsContent.push('noindex')
  if (noFollow) robotsContent.push('nofollow')
  if (robotsContent.length === 0) robotsContent.push('index', 'follow')
  
  // Build structured data
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    headline: title,
    description: pageDescription,
    url: pageUrl,
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}${pageImage}`,
      width: 1200,
      height: 630
    },
    publisher: {
      "@type": "Organization",
      name: "Portal Autopropelidos",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl
    }
  }
  
  // Add article-specific data
  if (type === 'article') {
    Object.assign(baseStructuredData, {
      "@type": "Article",
      datePublished: publishDate,
      dateModified: modifiedDate || publishDate,
      author: {
        "@type": "Person",
        name: author || "Portal Autopropelidos"
      },
      articleSection: category,
      keywords: allKeywords.join(', ')
    })
  }
  
  // Add product-specific data
  if (type === 'product') {
    Object.assign(baseStructuredData, {
      "@type": "Product",
      name: title,
      description: pageDescription,
      category: category || "Equipamentos de Mobilidade",
      brand: {
        "@type": "Brand",
        name: "Portal Autopropelidos"
      }
    })
  }
  
  // Merge with custom structured data
  const finalStructuredData = structuredData 
    ? { ...baseStructuredData, ...structuredData }
    : baseStructuredData
  
  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.url}`
    }))
  } : null
  
  // Generate FAQ structured data if tags suggest FAQ content
  const faqStructuredData = tags.includes('faq') ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [] // This would be populated with actual FAQ data
  } : null
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      
      {/* Robots */}
      <meta name="robots" content={robotsContent.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || pageUrl} />
      
      {/* Alternate Languages */}
      {alternateLanguages.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${siteUrl}${pageImage}`} />
      <meta property="og:image:alt" content={title || "Portal Autopropelidos"} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:site_name" content="Portal Autopropelidos" />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Article-specific Open Graph */}
      {type === 'article' && (
        <>
          {publishDate && <meta property="article:published_time" content={publishDate} />}
          {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@autopropelidos" />
      <meta name="twitter:creator" content="@autopropelidos" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteUrl}${pageImage}`} />
      <meta name="twitter:image:alt" content={title || "Portal Autopropelidos"} />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData)
        }}
      />
      
      {/* Breadcrumb Structured Data */}
      {breadcrumbStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData)
          }}
        />
      )}
      
      {/* FAQ Structured Data */}
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
      )}
    </Head>
  )
}

// Helper function to generate article structured data
export function generateArticleStructuredData(article: {
  title: string
  description: string
  content: string
  publishDate: string
  modifiedDate?: string
  author: string
  category: string
  tags: string[]
  image?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    articleBody: article.content,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      "@type": "Person",
      name: article.author,
      url: "https://autopropelidos.com.br/sobre"
    },
    publisher: {
      "@type": "Organization",
      name: "Portal Autopropelidos",
      url: "https://autopropelidos.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://autopropelidos.com.br/logo.png",
        width: 200,
        height: 60
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url
    },
    image: article.image ? {
      "@type": "ImageObject",
      url: article.image,
      width: 1200,
      height: 630
    } : undefined,
    articleSection: article.category,
    keywords: article.tags.join(', ')
  }
}

// Helper function to generate product structured data
export function generateProductStructuredData(product: {
  name: string
  description: string
  image?: string
  price?: number
  currency?: string
  availability?: string
  brand?: string
  category?: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: product.brand || "Portal Autopropelidos"
    },
    category: product.category || "Equipamentos de Mobilidade",
    url: product.url,
    ...(product.price && {
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: product.currency || "BRL",
        availability: `https://schema.org/${product.availability || 'InStock'}`
      }
    })
  }
}

// Helper function to generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
}
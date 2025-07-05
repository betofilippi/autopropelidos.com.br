export interface SearchResult {
  id: string
  title: string
  description?: string
  url: string
  type: "page" | "tool" | "glossary" | "faq" | "regulation" | "news" | "video"
  category?: string
}

// Mock data for search - in a real app, this would come from a database or API
const searchData: SearchResult[] = [
  // Pages
  {
    id: "page-1",
    title: "Sobre Nós",
    description: "Conheça a Autopropelidos e nossa missão educacional",
    url: "/sobre",
    type: "page",
  },
  {
    id: "page-2",
    title: "Contato",
    description: "Entre em contato conosco",
    url: "/contato",
    type: "page",
  },
  
  // Tools
  {
    id: "tool-1",
    title: "Calculadora de Combustível",
    description: "Calcule o consumo de combustível e custos de viagem",
    url: "/ferramentas/calculadora-combustivel",
    type: "tool",
    category: "Cálculos",
  },
  {
    id: "tool-2",
    title: "Conversor de Unidades",
    description: "Converta unidades de medida automotivas",
    url: "/ferramentas/conversor-unidades",
    type: "tool",
    category: "Conversões",
  },
  {
    id: "tool-3",
    title: "Calculadora de Multas",
    description: "Calcule o valor de multas de trânsito",
    url: "/ferramentas/calculadora-multas",
    type: "tool",
    category: "Cálculos",
  },
  
  // Glossary
  {
    id: "glossary-1",
    title: "ABS",
    description: "Sistema de freios antitravamento que evita o travamento das rodas",
    url: "/glossario#abs",
    type: "glossary",
    category: "Sistemas de Segurança",
  },
  {
    id: "glossary-2",
    title: "Airbag",
    description: "Bolsa inflável de segurança que protege os ocupantes em colisões",
    url: "/glossario#airbag",
    type: "glossary",
    category: "Sistemas de Segurança",
  },
  {
    id: "glossary-3",
    title: "Cambio Automático",
    description: "Sistema de transmissão que troca as marchas automaticamente",
    url: "/glossario#cambio-automatico",
    type: "glossary",
    category: "Transmissão",
  },
  
  // FAQ
  {
    id: "faq-1",
    title: "Como calcular o consumo de combustível?",
    description: "Aprenda a calcular quantos quilômetros seu veículo faz por litro",
    url: "/perguntas-frequentes#consumo-combustivel",
    type: "faq",
    category: "Economia",
  },
  {
    id: "faq-2",
    title: "Qual a diferença entre torque e potência?",
    description: "Entenda as diferenças entre essas duas medidas de desempenho",
    url: "/perguntas-frequentes#torque-potencia",
    type: "faq",
    category: "Mecânica",
  },
  {
    id: "faq-3",
    title: "Como funciona o motor de um carro?",
    description: "Explicação sobre o funcionamento básico de motores a combustão",
    url: "/perguntas-frequentes#motor",
    type: "faq",
    category: "Mecânica",
  },
  
  // Regulations
  {
    id: "reg-1",
    title: "Lei Seca",
    description: "Tolerância zero para álcool ao dirigir",
    url: "/regulamentacoes#lei-seca",
    type: "regulation",
    category: "Leis de Trânsito",
  },
  {
    id: "reg-2",
    title: "Uso de Cadeirinha",
    description: "Obrigatoriedade do uso de dispositivos de retenção para crianças",
    url: "/regulamentacoes#cadeirinha",
    type: "regulation",
    category: "Segurança",
  },
  {
    id: "reg-3",
    title: "Inspeção Veicular",
    description: "Vistoria obrigatória para verificar condições de segurança",
    url: "/regulamentacoes#inspecao",
    type: "regulation",
    category: "Manutenção",
  },
  
  // News
  {
    id: "news-1",
    title: "Novas Tecnologias de Segurança Veicular",
    description: "Conheça as últimas inovações em segurança automotiva",
    url: "/noticias/tecnologias-seguranca",
    type: "news",
    category: "Tecnologia",
  },
  {
    id: "news-2",
    title: "Mudanças no Código de Trânsito 2024",
    description: "Principais alterações na legislação de trânsito",
    url: "/noticias/mudancas-codigo-transito",
    type: "news",
    category: "Legislação",
  },
  
  // Videos
  {
    id: "video-1",
    title: "Como Trocar um Pneu",
    description: "Tutorial passo a passo para trocar pneu com segurança",
    url: "/videos/trocar-pneu",
    type: "video",
    category: "Tutoriais",
  },
  {
    id: "video-2",
    title: "Manutenção Preventiva",
    description: "Dicas essenciais para manter seu veículo em bom estado",
    url: "/videos/manutencao-preventiva",
    type: "video",
    category: "Manutenção",
  },
  {
    id: "video-3",
    title: "Direção Defensiva",
    description: "Técnicas para dirigir com mais segurança",
    url: "/videos/direcao-defensiva",
    type: "video",
    category: "Segurança",
  },
]

// Search function
export async function searchContent(query: string): Promise<SearchResult[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) {
    return []
  }
  
  // Search in title, description, and category
  const results = searchData.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(normalizedQuery)
    const descriptionMatch = item.description?.toLowerCase().includes(normalizedQuery) || false
    const categoryMatch = item.category?.toLowerCase().includes(normalizedQuery) || false
    
    return titleMatch || descriptionMatch || categoryMatch
  })
  
  // Sort by relevance (title matches first)
  results.sort((a, b) => {
    const aInTitle = a.title.toLowerCase().includes(normalizedQuery)
    const bInTitle = b.title.toLowerCase().includes(normalizedQuery)
    
    if (aInTitle && !bInTitle) return -1
    if (!aInTitle && bInTitle) return 1
    
    return 0
  })
  
  return results
}

// Recent searches management
const RECENT_SEARCHES_KEY = "autopropelidos-recent-searches"
const MAX_RECENT_SEARCHES = 5

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addRecentSearch(term: string): void {
  if (typeof window === "undefined") return
  
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(item => item !== term)
    const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // Ignore errors
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  } catch {
    // Ignore errors
  }
}
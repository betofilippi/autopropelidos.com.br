import { cacheManager } from '@/lib/utils/cache'
import { regulationsLogger } from '@/lib/utils/logger'
import { quickSearch } from '@/lib/utils/search'
import type { SearchFilters, PaginationOptions, SearchResult, RegulationItem } from '@/lib/types/services'

// Mock data de regulamentações
const mockRegulations: RegulationItem[] = [
  {
    id: '1',
    title: 'Resolução CONTRAN nº 996/2023',
    description: 'Regulamenta equipamentos autopropelidos de mobilidade individual com propulsão humana auxiliada por motor elétrico',
    type: 'resolução',
    number: '996',
    date: '2023-06-15',
    scope: 'federal',
    status: 'vigente',
    content: `A Resolução CONTRAN nº 996 de 15 de junho de 2023 estabelece os requisitos de segurança para circulação de equipamentos de mobilidade individual autopropelidos (patinetes elétricos, bicicletas elétricas e ciclomotores) nas vias públicas brasileiras.

PRINCIPAIS DISPOSIÇÕES:

1. CLASSIFICAÇÃO DOS EQUIPAMENTOS:
- Equipamentos de mobilidade individual com propulsão humana auxiliada por motor elétrico
- Potência máxima de 350W para patinetes elétricos
- Velocidade máxima de 25 km/h para patinetes elétricos
- Potência máxima de 250W para bicicletas elétricas

2. REQUISITOS DE SEGURANÇA:
- Uso obrigatório de capacete para menores de 18 anos
- Equipamentos de iluminação noturna obrigatórios
- Sistema de frenagem eficiente
- Espelhamento retrovisores (quando aplicável)

3. REGRAS DE CIRCULAÇÃO:
- Circulação preferencial em ciclofaixas e ciclovias
- Proibição de circulação em calçadas
- Velocidade máxima de 6 km/h em áreas de pedestres
- Idade mínima de 16 anos para condução

4. FISCALIZAÇÃO:
- Multas por descumprimento das normas
- Apreensão do equipamento em casos graves
- Educação para o trânsito obrigatória`,
    url: 'https://www.gov.br/infraestrutura/contran/resolucao-996-2023',
    tags: ['CONTRAN', 'patinete elétrico', 'bicicleta elétrica', 'mobilidade urbana', 'segurança'],
    summary: 'Regulamenta o uso de equipamentos autopropelidos de mobilidade individual no Brasil, estabelecendo regras de segurança, circulação e fiscalização.',
    importance: 'alta',
    created_at: '2023-06-15T10:00:00Z',
    updated_at: '2024-01-10T14:30:00Z'
  },
  {
    id: '2',
    title: 'Lei Municipal de São Paulo nº 17.962/2023',
    description: 'Dispõe sobre a regulamentação do uso de patinetes elétricos compartilhados no município de São Paulo',
    type: 'lei',
    number: '17.962',
    date: '2023-08-22',
    scope: 'municipal',
    region: 'São Paulo - SP',
    status: 'vigente',
    content: `A Lei Municipal de São Paulo nº 17.962, de 22 de agosto de 2023, estabelece normas específicas para o uso de patinetes elétricos compartilhados no município.

PRINCIPAIS DISPOSIÇÕES:

1. AUTORIZAÇÃO PARA OPERAÇÃO:
- Empresas devem obter autorização municipal
- Limite de 1.000 equipamentos por operadora
- Taxa anual de licenciamento obrigatória
- Seguro de responsabilidade civil

2. ÁREAS DE OPERAÇÃO:
- Proibição no centro histórico
- Restrições em parques municipais
- Áreas exclusivas para estacionamento
- Distância mínima entre equipamentos

3. RESPONSABILIDADES DAS OPERADORAS:
- Manutenção preventiva obrigatória
- Recolhimento de equipamentos danificados
- Relatórios mensais de operação
- Educação dos usuários

4. PENALIDADES:
- Multas por descumprimento
- Suspensão da autorização
- Apreensão de equipamentos irregulares`,
    url: 'https://www.prefeitura.sp.gov.br/cidade/secretarias/transportes/lei-17962-2023',
    tags: ['São Paulo', 'patinete compartilhado', 'lei municipal', 'operadoras'],
    summary: 'Estabelece regras para operação de patinetes elétricos compartilhados em São Paulo, incluindo licenciamento e responsabilidades.',
    importance: 'alta',
    created_at: '2023-08-22T15:20:00Z',
    updated_at: '2024-02-15T11:45:00Z'
  },
  {
    id: '3',
    title: 'Decreto Estadual do Rio de Janeiro nº 47.896/2023',
    description: 'Regulamenta o uso de equipamentos de micromobilidade nas vias estaduais do Rio de Janeiro',
    type: 'decreto',
    number: '47.896',
    date: '2023-09-10',
    scope: 'estadual',
    region: 'Rio de Janeiro - RJ',
    status: 'vigente',
    content: `O Decreto Estadual nº 47.896, de 10 de setembro de 2023, complementa a legislação federal sobre equipamentos de micromobilidade no estado do Rio de Janeiro.

PRINCIPAIS DISPOSIÇÕES:

1. DEFINIÇÕES COMPLEMENTARES:
- Equipamentos de micromobilidade individual
- Áreas de circulação prioritária
- Requisitos técnicos específicos
- Certificação de conformidade

2. CIRCULAÇÃO EM VIAS ESTADUAIS:
- Uso de ciclovias e ciclofaixas obrigatório
- Velocidade máxima reduzida em túnels
- Proibição em rodovias expressas
- Sinalização específica para equipamentos

3. PROGRAMAS DE INCENTIVO:
- Subsídios para aquisição de equipamentos certificados
- Parcerias com empresas de sharing
- Educação para mobilidade sustentável
- Integração com transporte público

4. FISCALIZAÇÃO ESTADUAL:
- Cooperação com municípios
- Agentes de trânsito especializados
- Multas específicas para infrações estaduais`,
    url: 'https://www.rj.gov.br/secretaria/transportes/decreto-47896-2023',
    tags: ['Rio de Janeiro', 'decreto estadual', 'vias estaduais', 'micromobilidade'],
    summary: 'Complementa a regulamentação federal para uso de equipamentos de micromobilidade em vias estaduais do Rio de Janeiro.',
    importance: 'media',
    created_at: '2023-09-10T09:30:00Z',
    updated_at: '2024-03-20T16:15:00Z'
  },
  {
    id: '4',
    title: 'Portaria DENATRAN nº 152/2024',
    description: 'Estabelece procedimentos para registro e licenciamento de ciclomotores elétricos',
    type: 'portaria',
    number: '152',
    date: '2024-03-15',
    scope: 'federal',
    status: 'vigente',
    content: `A Portaria DENATRAN nº 152, de 15 de março de 2024, estabelece os procedimentos administrativos para registro e licenciamento de ciclomotores elétricos.

PRINCIPAIS DISPOSIÇÕES:

1. DOCUMENTAÇÃO NECESSÁRIA:
- Certificado de conformidade do fabricante
- Nota fiscal de aquisição
- Comprovante de residência
- Documento de identidade do proprietário
- Certificado de registro de categoria A ou ACC

2. PROCESSO DE REGISTRO:
- Inspeção técnica obrigatória
- Verificação de conformidade técnica
- Emissão de placa de identificação
- Registro no sistema RENAVAM

3. LICENCIAMENTO ANUAL:
- Taxa de licenciamento anual
- Inspeção de segurança veicular
- Seguro obrigatório DPVAT
- Quitação de débitos

4. TRANSFERÊNCIA DE PROPRIEDADE:
- Comunicação de venda obrigatória
- Transferência no DETRAN
- Atualização de dados cadastrais
- Pagamento de taxas específicas`,
    url: 'https://www.gov.br/infraestrutura/denatran/portaria-152-2024',
    tags: ['DENATRAN', 'ciclomotor', 'registro', 'licenciamento', 'documentação'],
    summary: 'Define procedimentos para registro e licenciamento de ciclomotores elétricos no sistema nacional de trânsito.',
    importance: 'alta',
    created_at: '2024-03-15T11:00:00Z',
    updated_at: '2024-06-10T13:25:00Z'
  },
  {
    id: '5',
    title: 'Lei Municipal de Brasília nº 7.244/2024',
    description: 'Institui o programa de incentivo à mobilidade elétrica no Distrito Federal',
    type: 'lei',
    number: '7.244',
    date: '2024-01-20',
    scope: 'municipal',
    region: 'Brasília - DF',
    status: 'vigente',
    content: `A Lei nº 7.244, de 20 de janeiro de 2024, institui o Programa de Incentivo à Mobilidade Elétrica Sustentável no Distrito Federal.

PRINCIPAIS DISPOSIÇÕES:

1. OBJETIVOS DO PROGRAMA:
- Redução da poluição atmosférica
- Incentivo ao uso de veículos elétricos
- Modernização do sistema de transportes
- Melhoria da qualidade de vida urbana

2. BENEFÍCIOS OFERECIDOS:
- Desconto no IPVA para veículos elétricos
- Isenção de taxa de licenciamento
- Estacionamento gratuito em áreas públicas
- Acesso preferencial a ciclovias

3. INFRAESTRUTURA:
- Instalação de pontos de recarga públicos
- Ampliação da rede cicloviária
- Integração com o transporte público
- Sinalização específica para equipamentos elétricos

4. PARCERIAS PÚBLICO-PRIVADAS:
- Cooperação com empresas do setor
- Programas de financiamento subsidiado
- Campanhas de conscientização
- Pesquisa e desenvolvimento tecnológico`,
    url: 'https://www.agenciabrasilia.df.gov.br/lei-7244-2024',
    tags: ['Brasília', 'incentivos', 'mobilidade elétrica', 'sustentabilidade'],
    summary: 'Cria programa de incentivos para promover o uso de equipamentos de mobilidade elétrica no Distrito Federal.',
    importance: 'media',
    created_at: '2024-01-20T14:40:00Z',
    updated_at: '2024-05-15T10:20:00Z'
  },
  {
    id: '6',
    title: 'Resolução ANTT nº 5.987/2024',
    description: 'Regulamenta o transporte de equipamentos de mobilidade individual em transporte público',
    type: 'resolução',
    number: '5.987',
    date: '2024-04-10',
    scope: 'federal',
    status: 'vigente',
    content: `A Resolução ANTT nº 5.987, de 10 de abril de 2024, estabelece normas para transporte de equipamentos de mobilidade individual em veículos de transporte público coletivo.

PRINCIPAIS DISPOSIÇÕES:

1. EQUIPAMENTOS PERMITIDOS:
- Patinetes elétricos dobráveis
- Bicicletas elétricas desmontáveis
- Equipamentos com peso máximo de 20kg
- Dimensões máximas especificadas

2. CONDIÇÕES DE TRANSPORTE:
- Horários permitidos para embarque
- Áreas específicas para acomodação
- Responsabilidade do usuário pela segurança
- Limitação de quantidade por veículo

3. RESPONSABILIDADES DAS OPERADORAS:
- Adaptação dos veículos quando necessário
- Treinamento de condutores
- Informação aos usuários
- Manutenção de estatísticas de uso

4. FISCALIZAÇÃO:
- Inspeções regulares nos veículos
- Verificação do cumprimento das normas
- Penalidades por descumprimento
- Relatórios de conformidade`,
    url: 'https://www.gov.br/antt/resolucao-5987-2024',
    tags: ['ANTT', 'transporte público', 'intermodalidade', 'equipamentos dobráveis'],
    summary: 'Estabelece regras para transporte de equipamentos de mobilidade individual em veículos de transporte público.',
    importance: 'media',
    created_at: '2024-04-10T08:15:00Z',
    updated_at: '2024-06-25T15:40:00Z'
  },
  {
    id: '7',
    title: 'Instrução Normativa INMETRO nº 78/2024',
    description: 'Estabelece requisitos de conformidade para equipamentos de mobilidade elétrica',
    type: 'resolução',
    number: '78',
    date: '2024-02-28',
    scope: 'federal',
    status: 'vigente',
    content: `A Instrução Normativa INMETRO nº 78, de 28 de fevereiro de 2024, define os requisitos técnicos de conformidade para equipamentos de mobilidade elétrica comercializados no Brasil.

PRINCIPAIS DISPOSIÇÕES:

1. CERTIFICAÇÃO OBRIGATÓRIA:
- Todos os equipamentos devem ser certificados
- Testes de segurança elétrica obrigatórios
- Verificação de compatibilidade eletromagnética
- Avaliação de durabilidade e resistência

2. REQUISITOS TÉCNICOS:
- Potência máxima do motor
- Autonomia mínima da bateria
- Sistemas de frenagem eficientes
- Iluminação e sinalização adequadas

3. ETIQUETAGEM:
- Informações obrigatórias na etiqueta
- Selo do INMETRO visível
- Dados técnicos do equipamento
- Instruções de segurança

4. FISCALIZAÇÃO:
- Inspeções em pontos de venda
- Análise de produtos no mercado
- Penalidades para produtos não conformes
- Recall de produtos com defeitos`,
    url: 'https://www.gov.br/inmetro/instrucao-normativa-78-2024',
    tags: ['INMETRO', 'certificação', 'conformidade', 'segurança técnica'],
    summary: 'Define requisitos técnicos e de certificação para equipamentos de mobilidade elétrica no mercado brasileiro.',
    importance: 'alta',
    created_at: '2024-02-28T13:50:00Z',
    updated_at: '2024-06-05T09:30:00Z'
  },
  {
    id: '8',
    title: 'Lei Municipal de Belo Horizonte nº 11.337/2024',
    description: 'Dispõe sobre a criação de zonas de baixa emissão para veículos no município',
    type: 'lei',
    number: '11.337',
    date: '2024-05-18',
    scope: 'municipal',
    region: 'Belo Horizonte - MG',
    status: 'vigente',
    content: `A Lei Municipal de Belo Horizonte nº 11.337, de 18 de maio de 2024, cria zonas de baixa emissão e incentiva o uso de equipamentos de mobilidade elétrica.

PRINCIPAIS DISPOSIÇÕES:

1. ZONAS DE BAIXA EMISSÃO:
- Áreas centrais com restrição a veículos poluentes
- Acesso preferencial para veículos elétricos
- Horários específicos de circulação
- Monitoramento da qualidade do ar

2. INCENTIVOS PARA MOBILIDADE ELÉTRICA:
- Desconto no IPTU para proprietários de veículos elétricos
- Tarifa diferenciada em estacionamentos públicos
- Acesso prioritário a serviços municipais
- Subsídios para aquisição de equipamentos

3. INFRAESTRUTURA DE APOIO:
- Pontos de recarga em edifícios públicos
- Estações de compartilhamento de equipamentos
- Ciclovias conectadas às zonas de baixa emissão
- Sinalização específica para veículos elétricos

4. MONITORAMENTO E AVALIAÇÃO:
- Indicadores de qualidade do ar
- Estatísticas de uso de equipamentos elétricos
- Pesquisas de satisfação dos usuários
- Relatórios anuais de impacto ambiental`,
    url: 'https://www.pbh.gov.br/noticias/lei-11337-zonas-baixa-emissao',
    tags: ['Belo Horizonte', 'zonas de baixa emissão', 'qualidade do ar', 'incentivos municipais'],
    summary: 'Cria zonas de baixa emissão em Belo Horizonte e estabelece incentivos para uso de equipamentos de mobilidade elétrica.',
    importance: 'media',
    created_at: '2024-05-18T16:25:00Z',
    updated_at: '2024-06-30T12:10:00Z'
  }
]

export async function getAllRegulations(
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<RegulationItem>> {
  const cacheKey = `all:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  const cached = cacheManager.regulations.get<SearchResult<RegulationItem>>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const result = quickSearch(
      mockRegulations,
      '',
      ['title', 'description', 'content', 'tags', 'summary'],
      { filters, pagination }
    )
    
    cacheManager.regulations.set(cacheKey, result, 7200) // 2 horas
    
    const duration = Date.now() - startTime
    regulationsLogger.info('GET_ALL_REGULATIONS', `Retrieved ${result.total} regulations`, {
      filters,
      pagination,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    regulationsLogger.error('GET_ALL_REGULATIONS', 'Error retrieving regulations', {
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function searchRegulations(
  searchTerm: string,
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<RegulationItem>> {
  const cacheKey = `search:${searchTerm}:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  const cached = cacheManager.regulations.get<SearchResult<RegulationItem>>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const result = quickSearch(
      mockRegulations,
      searchTerm,
      ['title', 'description', 'content', 'tags', 'summary'],
      { filters, pagination }
    )
    
    cacheManager.regulations.set(cacheKey, result, 3600)
    
    const duration = Date.now() - startTime
    regulationsLogger.searchQuery(searchTerm, filters || {}, result.total)
    regulationsLogger.info('SEARCH_REGULATIONS', `Search completed`, {
      search_term: searchTerm,
      results_count: result.total,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    regulationsLogger.error('SEARCH_REGULATIONS', 'Error searching regulations', {
      search_term: searchTerm,
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getRegulationById(id: string): Promise<RegulationItem | null> {
  const cacheKey = `regulation:${id}`
  
  const cached = cacheManager.regulations.get<RegulationItem>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    regulationsLogger.contentAccess('regulation', id)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const regulation = mockRegulations.find(r => r.id === id) || null
    
    if (regulation) {
      cacheManager.regulations.set(cacheKey, regulation, 7200)
    }
    
    const duration = Date.now() - startTime
    regulationsLogger.contentAccess('regulation', id)
    regulationsLogger.info('GET_REGULATION_BY_ID', `Retrieved regulation ${id}`, {
      regulation_id: id,
      found: !!regulation,
      duration_ms: duration,
      cached: false
    })
    
    return regulation
  } catch (error) {
    regulationsLogger.error('GET_REGULATION_BY_ID', 'Error retrieving regulation', {
      regulation_id: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getRegulationsByScope(scope: RegulationItem['scope']): Promise<RegulationItem[]> {
  const cacheKey = `scope:${scope}`
  
  const cached = cacheManager.regulations.get<RegulationItem[]>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const regulations = mockRegulations.filter(r => r.scope === scope)
    
    cacheManager.regulations.set(cacheKey, regulations, 7200)
    
    const duration = Date.now() - startTime
    regulationsLogger.info('GET_REGULATIONS_BY_SCOPE', `Retrieved ${regulations.length} regulations for scope ${scope}`, {
      scope,
      count: regulations.length,
      duration_ms: duration,
      cached: false
    })
    
    return regulations
  } catch (error) {
    regulationsLogger.error('GET_REGULATIONS_BY_SCOPE', 'Error retrieving regulations by scope', {
      scope,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getRegulationsByRegion(region: string): Promise<RegulationItem[]> {
  const cacheKey = `region:${region}`
  
  const cached = cacheManager.regulations.get<RegulationItem[]>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const regulations = mockRegulations.filter(r => 
      r.region === region || (r.scope === 'federal' && !r.region)
    )
    
    cacheManager.regulations.set(cacheKey, regulations, 7200)
    
    const duration = Date.now() - startTime
    regulationsLogger.info('GET_REGULATIONS_BY_REGION', `Retrieved ${regulations.length} regulations for region ${region}`, {
      region,
      count: regulations.length,
      duration_ms: duration,
      cached: false
    })
    
    return regulations
  } catch (error) {
    regulationsLogger.error('GET_REGULATIONS_BY_REGION', 'Error retrieving regulations by region', {
      region,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getRegulationStats(): Promise<{
  total: number
  by_type: Record<string, number>
  by_scope: Record<string, number>
  by_status: Record<string, number>
  by_importance: Record<string, number>
  recent_count: number
  top_tags: Array<{ tag: string; count: number }>
}> {
  const cacheKey = 'stats:regulations'
  
  const cached = cacheManager.regulations.get<any>(cacheKey)
  if (cached) {
    regulationsLogger.cacheHit(cacheKey)
    return cached
  }
  
  regulationsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const stats = {
      total: mockRegulations.length,
      by_type: {} as Record<string, number>,
      by_scope: {} as Record<string, number>,
      by_status: {} as Record<string, number>,
      by_importance: {} as Record<string, number>,
      recent_count: 0,
      top_tags: [] as Array<{ tag: string; count: number }>
    }
    
    const tagCounts: Record<string, number> = {}
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    
    for (const regulation of mockRegulations) {
      // Contagem por tipo
      stats.by_type[regulation.type] = (stats.by_type[regulation.type] || 0) + 1
      
      // Contagem por escopo
      stats.by_scope[regulation.scope] = (stats.by_scope[regulation.scope] || 0) + 1
      
      // Contagem por status
      stats.by_status[regulation.status] = (stats.by_status[regulation.status] || 0) + 1
      
      // Contagem por importância
      stats.by_importance[regulation.importance] = (stats.by_importance[regulation.importance] || 0) + 1
      
      // Contagem de regulamentações recentes
      if (new Date(regulation.date) > sixMonthsAgo) {
        stats.recent_count++
      }
      
      // Contagem de tags
      for (const tag of regulation.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    
    // Top 10 tags mais utilizadas
    stats.top_tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }))
    
    cacheManager.regulations.set(cacheKey, stats, 7200)
    
    const duration = Date.now() - startTime
    regulationsLogger.info('GET_REGULATION_STATS', `Generated regulation statistics`, {
      total: stats.total,
      types: Object.keys(stats.by_type).length,
      scopes: Object.keys(stats.by_scope).length,
      duration_ms: duration,
      cached: false
    })
    
    return stats
  } catch (error) {
    regulationsLogger.error('GET_REGULATION_STATS', 'Error generating regulation statistics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export function invalidateRegulationsCache(pattern?: string): number {
  const invalidated = cacheManager.regulations.invalidate(pattern || '.*')
  regulationsLogger.info('INVALIDATE_CACHE', `Invalidated ${invalidated} cache entries`, {
    pattern: pattern || 'all'
  })
  return invalidated
}
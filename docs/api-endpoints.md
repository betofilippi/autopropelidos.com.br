# Documentação das APIs - Autopropelidos.com.br

## Visão Geral

O sistema de APIs do autopropelidos.com.br foi completamente aprimorado com recursos avançados de cache, busca full-text, filtros inteligentes e logging estruturado.

## Endpoints Principais

### 🔍 Busca Unificada - `/api/search`

Busca em todos os tipos de conteúdo de forma unificada.

#### GET `/api/search`

**Parâmetros:**
- `q` (string, obrigatório): Termo de busca
- `types` (string): Tipos separados por vírgula (`news,videos,vehicles,regulations`)
- `page` (number): Página (padrão: 1)
- `limit` (number): Itens por página (padrão: 10)
- `category` (string): Filtro por categoria
- `sortBy` (string): Ordenação (`relevance`, `date`, `views`, `alphabetical`)
- `sortOrder` (string): Direção (`asc`, `desc`)
- `includeSuggestions` (boolean): Incluir sugestões (padrão: false)

**Ações especiais:**
- `action=suggestions`: Gerar sugestões de busca
- `action=popular`: Buscas populares
- `action=stats`: Estatísticas de busca

**Exemplo:**
```
GET /api/search?q=patinete+elétrico&types=news,videos&limit=5&includeSuggestions=true
```

### 📰 Notícias - `/api/news`

Gerenciamento completo de notícias com cache inteligente.

#### GET `/api/news`

**Parâmetros:**
- `id` (string): ID de notícia específica
- `search` (string): Busca textual
- `page` (number): Página
- `limit` (number): Itens por página
- `category` (string): Categoria (`regulation`, `safety`, `urban_mobility`, `technology`, `general`)
- `sortBy` (string): Ordenação
- `sortOrder` (string): Direção

**Ações especiais:**
- `action=stats`: Estatísticas de notícias

**Exemplo:**
```
GET /api/news?category=regulation&limit=10&sortBy=date&sortOrder=desc
```

### 🎥 Vídeos - `/api/videos`

Acesso aos vídeos do YouTube com dados enriquecidos.

#### GET `/api/videos`

**Parâmetros similares ao `/api/news`**

**Categorias disponíveis:**
- `educational`: Educacional
- `tutorial`: Tutorial
- `review`: Análise/Review
- `news_report`: Reportagem
- `analysis`: Análise

### 🚗 Veículos - `/api/vehicles`

Catálogo completo de equipamentos autopropelidos.

#### GET `/api/vehicles`

**Parâmetros:**
- `id` (string): ID do veículo
- `search` (string): Busca textual
- `type` (string): Tipo (`patinete`, `bicicleta`, `ciclomotor`)
- `category` (string): Categoria (`básica`, `urbana`, `premium`, `performance`)
- `brand` (string): Marca
- `minPrice`, `maxPrice` (number): Faixa de preço
- `availability` (string): Disponibilidade

**Ações especiais:**
- `action=stats`: Estatísticas do catálogo

**Exemplo:**
```
GET /api/vehicles?type=patinete&category=premium&sortBy=rating&sortOrder=desc
```

### ⚖️ Regulamentações - `/api/regulations`

Base de conhecimento jurídico atualizada.

#### GET `/api/regulations`

**Parâmetros:**
- `id` (string): ID da regulamentação
- `search` (string): Busca textual
- `scope` (string): Escopo (`federal`, `estadual`, `municipal`)
- `region` (string): Região/estado
- `type` (string): Tipo (`lei`, `resolução`, `portaria`, `decreto`)
- `status` (string): Status (`vigente`, `revogado`, `em_tramitacao`)
- `importance` (string): Importância (`alta`, `media`, `baixa`)

**Exemplo:**
```
GET /api/regulations?scope=federal&status=vigente&importance=alta
```

### 📊 Analytics - `/api/analytics`

Estatísticas e métricas do site.

#### GET `/api/analytics`

**Ações:**
- `action=overview` (padrão): Visão geral
- `action=traffic`: Estatísticas de tráfego
- `action=content`: Performance de conteúdo
- `action=dashboard`: Resumo do dashboard

**Parâmetros:**
- `period` (string): Período (`current`, `2024-01`, etc.)

#### POST `/api/analytics`

**Ações:**
- `track_event`: Rastrear evento personalizado
- `invalidate_cache`: Invalidar cache (admin)
- `export_data`: Exportar dados

## Recursos Avançados

### 🚀 Sistema de Cache

- **Cache em memória** com TTL configurável
- **Invalidação inteligente** por padrões
- **Hit/miss tracking** para otimização
- **Cache warming** para dados críticos

**Configurações de TTL:**
- Notícias: 30 minutos
- Vídeos: 1 hora
- Veículos: 2 horas
- Regulamentações: 12 horas
- Analytics: 15 minutos
- Busca: 10 minutos

### 🔍 Busca Full-Text

- **Algoritmo de relevância** customizado
- **Normalização de texto** (acentos, pontuação)
- **Stop words** em português
- **Similaridade de strings** para sugestões
- **Busca em múltiplos campos**

### 📈 Rate Limiting

**Limites por endpoint (por hora):**
- `/api/search`: 100 requests
- `/api/news`: 200 requests
- `/api/videos`: 150 requests
- `/api/vehicles`: 300 requests
- `/api/regulations`: 100 requests
- `/api/analytics`: 50 requests

### 📝 Logging Estruturado

Todos os endpoints incluem logging detalhado:
- Tempo de resposta
- Cache hit/miss
- Parâmetros de busca
- Erros e exceções
- Métricas de performance

## Formatos de Resposta

### Resposta de Sucesso
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 42,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrevious": false,
    "totalPages": 5
  },
  "meta": {
    "search_term": "patinete",
    "filters_applied": 2,
    "response_time_ms": 45
  },
  "timestamp": "2024-07-06T12:00:00.000Z"
}
```

### Resposta de Erro
```json
{
  "success": false,
  "error": "Resource not found",
  "details": "The requested item does not exist",
  "timestamp": "2024-07-06T12:00:00.000Z"
}
```

## Headers de Resposta

Todos os endpoints incluem headers informativos:
- `X-RateLimit-Limit`: Limite de requests
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp do reset
- `X-Cache-Status`: Hit/Miss do cache
- `X-Response-Time`: Tempo de resposta em ms

## Configuração para Produção

### Variáveis de Ambiente

```env
# APIs Externas
YOUTUBE_API_KEY=your_youtube_api_key
NEWS_API_KEY=your_news_api_key
GOOGLE_MAPS_API_KEY=your_maps_api_key

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
GA_API_SECRET=your_ga_secret

# Configurações
NODE_ENV=production
API_CACHE_TTL=3600
RATE_LIMIT_ENABLED=true
```

### ISR (Incremental Static Regeneration)

Configurado para otimizar performance:
- **Notícias**: Revalidação a cada 30 minutos
- **Vídeos**: Revalidação a cada 1 hora
- **Veículos**: Revalidação a cada 2 horas
- **Regulamentações**: Revalidação a cada 12 horas

### Integração com APIs Reais

O sistema está preparado para transição das APIs mock para APIs reais:

1. **YouTube Data API v3**: Configuração completa com quota management
2. **News API**: Rate limiting e fallback para mock
3. **Google Analytics**: Tracking de eventos e métricas

## Monitoramento

### Métricas Disponíveis

- **Performance**: Tempo de resposta, cache hit rate
- **Uso**: Requests por endpoint, usuários únicos
- **Erros**: Taxa de erro, tipos de falha
- **Cache**: Eficiência, invalidações

### Alertas Configurados

- Rate limit próximo do limite
- Cache hit rate baixo (< 60%)
- Tempo de resposta alto (> 2s)
- Quota das APIs próxima do limite

## Exemplos de Uso

### Busca Avançada
```javascript
// Busca unificada com filtros
const response = await fetch('/api/search?q=contran 996&types=news,regulations&category=regulation&sortBy=relevance&limit=10')
const data = await response.json()
```

### Listagem Paginada
```javascript
// Notícias por categoria com paginação
const response = await fetch('/api/news?category=safety&page=2&limit=5&sortBy=date&sortOrder=desc')
const data = await response.json()
```

### Detalhes de Item
```javascript
// Detalhes de um veículo específico
const response = await fetch('/api/vehicles?id=1')
const data = await response.json()
```

### Analytics Dashboard
```javascript
// Dados para dashboard
const response = await fetch('/api/analytics?action=dashboard')
const data = await response.json()
```

## Roadmap

### Próximas Funcionalidades

1. **Autenticação**: Sistema de usuários e favoritos
2. **Webhooks**: Notificações em tempo real
3. **GraphQL**: Endpoint alternativo para queries complexas
4. **Elasticsearch**: Busca ainda mais avançada
5. **CDN**: Distribuição global de conteúdo
6. **A/B Testing**: Otimização baseada em dados

### Integrações Planejadas

- **Supabase**: Banco de dados em tempo real
- **Redis**: Cache distribuído
- **Sentry**: Monitoramento de erros
- **DataDog**: Métricas avançadas
- **Stripe**: Sistema de pagamentos (premium features)
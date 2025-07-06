# 🤖 Configuração do Sistema de APIs Reais & Automação

Este documento descreve como configurar e ativar o sistema completo de APIs reais com automação para autopropelidos.com.br.

## 📋 Visão Geral

O sistema implementa:

- ✅ **News API Real** com fallback inteligente
- ✅ **YouTube API Real** com busca por canais confiáveis  
- ✅ **Cron Jobs Vercel** para automação
- ✅ **Sistema de Deduplicação** avançado
- ✅ **Monitoramento & Alertas** em tempo real
- ✅ **Cache Otimizado** com TTL

## 🚀 Configuração Inicial

### 1. Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env.local`:

```bash
# APIs Essenciais
NEWS_API_KEY=sua_news_api_key_aqui
YOUTUBE_API_KEY=sua_youtube_api_key_aqui

# Banco de Dados
NEXT_PUBLIC_SUPABASE_URL=sua_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_supabase_service_role_key

# Opcional: Segurança para Cron Jobs
CRON_SECRET=sua_chave_secreta_cron

# Opcional: Webhooks para Alertas
WEBHOOK_URL=sua_webhook_url_slack_discord
```

### 2. Obtendo as API Keys

#### News API
1. Acesse [newsapi.org](https://newsapi.org)
2. Crie uma conta gratuita
3. Obtenha sua API key
4. Configure `NEWS_API_KEY` no `.env.local`

#### YouTube API
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto ou use existente
3. Ative a YouTube Data API v3
4. Crie uma API key
5. Configure `YOUTUBE_API_KEY` no `.env.local`

## 🔄 Sistema de Automação

### Cron Jobs Configurados

O sistema roda automaticamente via Vercel Cron:

```json
{
  "crons": [
    {
      "path": "/api/sync/news",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/sync/videos", 
      "schedule": "0 */12 * * *"
    },
    {
      "path": "/api/sync/trending",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/sync/cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Cronograma:**
- 📰 **Notícias**: A cada 6 horas
- 🎥 **Vídeos**: A cada 12 horas  
- 📊 **Trending**: A cada 30 minutos
- 🧹 **Limpeza**: Diariamente às 2h

### Endpoints de Sync

#### Manual Trigger
```bash
# Sync de notícias
POST /api/sync/news
Content-Type: application/json
{ "force": true }

# Sync de vídeos
POST /api/sync/videos
Content-Type: application/json
{ "force": true }

# Calcular trending
POST /api/sync/trending

# Limpeza manual
POST /api/sync/cleanup
```

#### Verificar Status
```bash
# Dashboard completo
GET /api/monitoring?type=dashboard

# Status de saúde
GET /api/monitoring?type=health

# Alertas ativos
GET /api/monitoring?type=alerts

# Status das APIs
GET /api/monitoring?type=apis
```

## 🎯 Sistema de Deduplicação

### Como Funciona

1. **Deduplicação por URL**: Remove URLs idênticas
2. **Similaridade de Título**: Remove títulos >85% similares
3. **Similaridade de Descrição**: Remove descrições >90% similares
4. **Palavras-chave Comuns**: Remove conteúdo com >75% keywords iguais

### Scoring Automático

- **Relevância**: Keywords, fonte, data
- **Qualidade**: Título, descrição, fonte confiável
- **Final Score**: (relevância + qualidade) / 2

## 📊 Monitoramento

### Dashboard de Saúde

```typescript
interface HealthDashboard {
  overall_health: 'healthy' | 'warning' | 'critical'
  active_alerts: number
  metrics_summary: {
    news_api_errors: MetricStats
    youtube_api_errors: MetricStats
    sync_response_time: MetricStats
    sync_success_rate: number
  }
  last_sync_times: Record<string, string>
}
```

### Alertas Automáticos

O sistema monitora:

- ❌ **Taxa de Erro APIs**: >5 erros em 60min
- ⏰ **Tempo de Resposta**: >30s para sync
- 🔄 **Falhas de Sync**: >2 falhas em 24h
- 📊 **Quota das APIs**: Próximo do limite

### Webhooks de Alerta

Configure `WEBHOOK_URL` para receber alertas em:
- Slack
- Discord
- Microsoft Teams

## 🛠️ Manutenção

### Limpeza Automática

O sistema remove automaticamente:

- 📰 **Notícias antigas**: >6 meses com relevância <50
- 🎥 **Vídeos antigos**: >1 ano com relevância <40
- 🔄 **Duplicatas**: URLs/YouTube IDs duplicados
- 🗑️ **Órfãos**: Registros sem título/URL

### Cache Inteligente

- **Notícias**: 30 minutos TTL
- **Vídeos**: 1 hora TTL
- **Trending**: 15 minutos TTL
- **Stats**: 1 hora TTL

## 🚦 Verificação de Status

### Health Check Rápido

```bash
curl https://autopropelidos.com.br/api/monitoring?type=health
```

Resposta esperada:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "healthy": true,
    "alerts": 0,
    "last_update": "2024-07-06T10:00:00.000Z"
  }
}
```

### Verificar APIs

```bash
curl https://autopropelidos.com.br/api/monitoring?type=apis
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. API Key Inválida
```
Error: "API key missing or invalid"
```
**Solução**: Verificar `.env.local` e regenerar keys se necessário

#### 2. Quota Excedida
```
Error: "Quota exceeded"
```
**Solução**: Aguardar reset da quota ou upgradar plano

#### 3. Sync Falhando
```
Error: "Database connection failed"
```
**Solução**: Verificar configuração Supabase

### Logs Úteis

```bash
# Ver logs do Vercel
vercel logs --follow

# Verificar último sync
curl /api/monitoring?type=dashboard | jq '.data.last_sync_times'

# Alertas ativos
curl /api/monitoring?type=alerts | jq '.data.active_alerts'
```

## 📈 Performance

### Otimizações Implementadas

- ⚡ **Cache em Múltiplas Camadas**
- 🔄 **Deduplicação Inteligente**
- 📊 **Scoring Otimizado**
- ⏰ **Rate Limiting Automático**
- 📈 **Monitoramento Contínuo**

### Métricas Esperadas

- **Sync de Notícias**: ~2-5 segundos
- **Sync de Vídeos**: ~3-8 segundos
- **Cálculo Trending**: ~1-2 segundos
- **Taxa de Sucesso**: >95%

---

## 🎉 Sistema Pronto!

Com esta configuração, o autopropelidos.com.br terá:

✅ **Conteúdo sempre atualizado**  
✅ **Deduplicação automática**  
✅ **Monitoramento em tempo real**  
✅ **Performance otimizada**  
✅ **Alertas proativos**  

Para suporte, verifique os logs de monitoramento ou entre em contato com a equipe de desenvolvimento.
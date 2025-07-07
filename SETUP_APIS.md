# Configuração de APIs Reais - Portal Autopropelidos

Este guia explica como configurar as APIs reais para buscar notícias e vídeos automaticamente.

## 🔧 Pré-requisitos

### 1. Supabase Database
1. Criar conta no [Supabase](https://supabase.com)
2. Criar novo projeto
3. Executar o SQL do arquivo `supabase/schema.sql` no SQL Editor
4. Copiar as credenciais do projeto

### 2. News API
1. Criar conta no [NewsAPI.org](https://newsapi.org)
2. Obter API key gratuita (até 1000 requests/dia)
3. Plano pago para uso comercial

### 3. YouTube Data API
1. Acessar [Google Cloud Console](https://console.cloud.google.com)
2. Criar novo projeto ou usar existente
3. Ativar YouTube Data API v3
4. Criar credenciais (API Key)
5. Configurar quotas (padrão: 10.000 units/dia)

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e configure:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://sua-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# NewsAPI
NEWS_API_KEY=sua_news_api_key

# YouTube Data API
YOUTUBE_API_KEY=sua_youtube_api_key

# Token para sincronização (opcional)
SYNC_TOKEN=seu_token_secreto_para_sync
```

### 2. Configuração do Supabase

Execute no SQL Editor do Supabase:

```sql
-- Schema já está em supabase/schema.sql
-- Execute todo o conteúdo do arquivo

-- Opcional: Configurar RLS (Row Level Security)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública
CREATE POLICY "Permitir leitura pública de notícias" ON news FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública de vídeos" ON videos FOR SELECT USING (true);
```

## 🚀 Como Funciona

### Busca Automática de Notícias

**NewsAPI** busca notícias com as palavras-chave:
- "patinete elétrico"
- "bicicleta elétrica" 
- "ciclomotor"
- "autopropelidos"
- "mobilidade urbana"
- "CONTRAN 996"
- "regulamentação patinete"
- "segurança trânsito"
- "veículos elétricos"
- "micromobilidade"

**Fontes priorizadas:**
- globo.com, uol.com.br, folha.com.br
- estadao.com.br, g1.globo.com, r7.com
- terra.com.br, cnnbrasil.com.br
- metropoles.com, gazetadopovo.com.br

### Busca Automática de Vídeos

**YouTube API** busca vídeos nos canais confiáveis:
- Band Jornalismo (UCX8pU3lBmmGiEchT8kq_LrQ)
- Jornal da Record (UCoa-D_VfMkFrCYodrOC9-mA)
- CNN Brasil (UCG1QNnL7s6MYqHSoBl7LRbQ)
- Jovem Pan News (UC08cNmV6kNFGKcFM0sWTqTg)
- SBT News (UCFFasG7aLweCJcktLoveydA)

**Termos de busca:**
- "patinete elétrico brasil"
- "bicicleta elétrica regulamentação"
- "CONTRAN 996"
- "autopropelidos brasil"
- "mobilidade urbana elétrica"

## 🔄 Sincronização

### Manual (uma vez)
```bash
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer seu_token_secreto_para_sync"
```

### Automática (Recomendado)

Configure um cron job ou webhook para executar a sincronização regularmente:

**Vercel Cron (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**GitHub Actions (.github/workflows/sync.yml):**
```yaml
name: Sync Data
on:
  schedule:
    - cron: '0 */6 * * *'  # A cada 6 horas
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger sync
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/sync \
            -H "Authorization: Bearer ${{ secrets.SYNC_TOKEN }}"
```

## 🔍 Testando

### 1. Verificar APIs
```bash
# Notícias
curl http://localhost:3000/api/news?limit=5

# Vídeos  
curl http://localhost:3000/api/videos?limit=5

# Status da sincronização
curl http://localhost:3000/api/sync
```

### 2. Logs
Verifique os logs do console para:
- Erros de conexão com APIs
- Dados sendo processados
- Cache hits/misses
- Deduplicação funcionando

## 🎯 Categorização Automática

### Notícias
- **regulation**: contém "regulamenta", "lei", "norma", "contran"
- **safety**: contém "acidente", "segurança", "capacete", "proteção"  
- **technology**: contém "tecnologia", "inovação", "startup", "aplicativo"
- **urban_mobility**: contém "cidade", "urbano", "trânsito", "mobilidade"
- **general**: outros casos

### Vídeos
- **news_report**: contém "jornal", "notícia", "reportagem"
- **tutorial**: contém "como", "tutorial", "passo a passo"
- **review**: contém "review", "análise", "teste"
- **educational**: contém "lei", "regulamenta", "norma"
- **analysis**: outros casos

## 📊 Métricas e Qualidade

### Sistema de Pontuação
**Notícias (0-100 pontos):**
- +10 por palavra-chave relevante
- +20 por fonte confiável brasileira
- +5 por ter imagem
- +10 por conteúdo extenso (>500 chars)

**Vídeos (0-100 pontos):**
- +15 por palavra-chave relevante
- +30 por canal confiável
- +20 por data recente (últimos 6 meses)

### Deduplicação
- Remove notícias duplicadas por URL
- Remove vídeos duplicados por youtube_id
- Mantém apenas a versão com maior pontuação

## 🛠️ Troubleshooting

### Erro: "NEWS_API_KEY not configured"
- Verificar se a variável está no `.env.local`
- Reiniciar servidor de desenvolvimento

### Erro: "YOUTUBE_API_KEY not configured"  
- Verificar API key no Google Cloud Console
- Confirmar se YouTube Data API v3 está ativa

### Erro: Supabase connection
- Verificar URLs e keys do Supabase
- Confirmar se tabelas foram criadas
- Verificar políticas RLS

### Dados mock sendo exibidos
- APIs reais têm fallback para mock em caso de erro
- Verificar logs do console para erros específicos
- Confirmar se variáveis de ambiente estão corretas

## 🔄 Fallback Seguro

O sistema **sempre funciona**, mesmo sem APIs configuradas:
1. **APIs reais** (se configuradas e funcionando)
2. **Fallback para mock data** (se APIs falharem)
3. **Cache inteligente** (reduz chamadas às APIs)

Isso garante que o site nunca fica sem conteúdo, mesmo durante problemas técnicos.
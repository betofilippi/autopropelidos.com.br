# Development Continuation Guide - Autopropelidos Portal

## Project Context
This is an educational platform about CONTRAN Resolution 996 that regulates "autopropelidos" (self-propelled equipment like electric scooters, e-bikes, etc.) in Brazil. The main goal is to educate consumers who don't understand this technical term created by the resolution.

## How to Continue Development

### 1. Environment Setup
```bash
# Install dependencies
npm install

# Create .env.local file with these keys:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
YOUTUBE_API_KEY=AIzaSyBSXSileKonb-NXQ5op1xR4W7suvdjm-94
NEWS_API_KEY=b7654d19ed7f4464a50d09a4ef6b56cb

# Run development server
npm run dev
```

### 2. Current State Summary
- **Framework:** Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI:** Radix UI + shadcn/ui components
- **Database:** Supabase (PostgreSQL) - schema created but not connected
- **APIs:** NewsAPI and YouTube API keys provided, mock data in place

### 3. Completed Features
✅ 10 main pages fully implemented
✅ Responsive navigation and footer
✅ 2 interactive tools (compliance checker, cost calculator)
✅ 130+ term glossary
✅ 30+ FAQ entries
✅ Document library structure
✅ Mock data for all dynamic content

### 4. Priority Tasks to Complete

#### High Priority - Core Functionality
1. **Configure Supabase Database**
   - Use MCP Supabase to create tables from `/supabase/schema.sql`
   - Update environment variables
   - Replace mock data with real queries

2. **Implement Search Functionality**
   - Add search to news, videos, FAQ, glossary pages
   - Create unified search API endpoint
   - Add search suggestions/autocomplete

3. **Create Remaining Tools**
   - `/ferramentas/buscador-regulamentacoes` - Find city-specific regulations
   - `/ferramentas/guia-documentacao` - Step-by-step documentation guide
   - `/ferramentas/planejador-rotas` - Safe route planner
   - `/ferramentas/checklist-seguranca` - Safety checklist

4. **Add Real Content**
   - Full Resolution 996 text with proper formatting
   - Real vehicle/equipment data with specifications
   - Actual city regulations for major Brazilian cities

#### Medium Priority - Enhanced Features
5. **Dynamic Content Integration**
   - Connect NewsAPI for real Brazilian news
   - Integrate YouTube API for video content
   - Set up cron jobs for content updates

6. **SEO Optimization**
   - Add structured data (JSON-LD)
   - Optimize meta tags per page
   - Create XML sitemap
   - Add robots.txt

7. **User Features**
   - Newsletter subscription with email service
   - User accounts for saving calculations/preferences
   - Notification system for regulation updates

#### Low Priority - Nice to Have
8. **Additional Features**
   - Multi-language support (Portuguese/English)
   - PWA capabilities
   - Advanced analytics
   - Community forum
   - Mobile app

### 5. Code Patterns to Follow

#### Component Structure
```typescript
// Use this pattern for new pages
import { Metadata } from 'next'
import { Card } from "@/components/ui/card"
// ... other imports

export const metadata: Metadata = {
  title: 'Page Title | Portal Autopropelidos',
  description: 'Page description',
  keywords: 'relevant, keywords'
}

export default function PageName() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header section */}
      {/* Main content */}
      {/* CTA section */}
    </div>
  )
}
```

#### API Routes Pattern
```typescript
// app/api/endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

### 6. Testing Checklist
- [ ] All pages load without errors
- [ ] Forms validate correctly
- [ ] Navigation works on mobile
- [ ] Dark mode displays properly
- [ ] API endpoints return expected data
- [ ] Search functionality works
- [ ] Tools calculate correctly
- [ ] External API integrations work

### 7. Deployment Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] API rate limits configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] CDN for static assets
- [ ] SSL certificate active
- [ ] Backup strategy in place

### 8. Important Files to Review
- `/PROJECT_SNAPSHOT.md` - Current state documentation
- `/supabase/schema.sql` - Database schema
- `/lib/services/` - API integration services
- `/app/api/` - API routes
- All pages in `/app/` directory

### 9. Design Decisions Made
- Mobile-first responsive design
- Brazilian Portuguese as primary language
- Focus on education over technical jargon
- Clear visual hierarchy
- Accessibility compliance
- Government portal aesthetic

### 10. Resources
- CONTRAN Resolution 996: [Official Link]
- Figma Designs: [If available]
- API Documentation:
  - NewsAPI: https://newsapi.org/docs
  - YouTube API: https://developers.google.com/youtube/v3
  - Supabase: https://supabase.com/docs

## Next Steps
1. Run `npm install` and `npm run dev`
2. Configure Supabase using MCP
3. Start with high-priority tasks
4. Test thoroughly before deploying
5. Monitor user feedback and iterate

Good luck with the continuation of the project!
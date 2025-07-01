# Project Snapshot - Autopropelidos Portal
**Date:** 2025-01-07
**Status:** In Development

## Project Overview
Educational platform about CONTRAN Resolution 996 that regulates "autopropelidos" (self-propelled equipment) in Brazil. The goal is to educate consumers who don't understand this technical term created by the resolution.

## Current Implementation Status

### ✅ Completed Pages
1. **Homepage** (`/app/page.tsx`)
   - Hero section with compliance checker CTA
   - Interactive tools showcase
   - News integration (NewsAPI ready)
   - Video library (YouTube API ready)
   - Equipment comparison
   - FAQ preview
   - Newsletter signup

2. **Resolution 996 Guide** (`/app/resolucao-996/page.tsx`)
   - Complete resolution text with 7 chapters
   - Interactive navigation
   - Visual highlights for key limits
   - Practical examples
   - Related tools integration

3. **News Section** (`/app/noticias/page.tsx`)
   - Category filters
   - Featured articles
   - Search functionality
   - Newsletter signup
   - Mock data ready for NewsAPI integration

4. **Video Library** (`/app/videos/page.tsx`)
   - YouTube-style layout
   - Category filters (tutorials, reviews, news, safety)
   - Search and sort options
   - Mock data ready for YouTube API integration

5. **Tools Hub** (`/app/ferramentas/page.tsx`)
   - Grid layout of all available tools
   - Tool descriptions and usage stats
   - Direct links to each tool

6. **Compliance Checker** (`/app/ferramentas/verificador-conformidade/page.tsx`)
   - Form for equipment specifications
   - Real-time compliance validation
   - Classification results
   - Next steps guidance

7. **Cost Calculator** (`/app/ferramentas/calculadora-custos/page.tsx`)
   - Multi-tab interface (Equipment, Usage, Comparison)
   - ROI calculations
   - Comparison with public transport and cars
   - Detailed cost breakdown

8. **FAQ Page** (`/app/faq/page.tsx`)
   - 6 categories with 30+ Q&A pairs
   - Accordion interface
   - Search functionality placeholder
   - Related links section

9. **Glossary** (`/app/glossario/page.tsx`)
   - 130+ technical terms A-Z
   - Alphabet navigation
   - Related terms connections
   - Quick reference card

10. **Document Library** (`/app/biblioteca/page.tsx`)
    - 5 document categories
    - Featured documents
    - Search and filter
    - Download tracking
    - Newsletter signup

### 🎨 Components Created
1. **Navigation** (`/components/navigation/navbar.tsx`)
   - Responsive design
   - Dropdown menus
   - Mobile hamburger menu
   - CTA button

2. **Footer** (`/components/navigation/footer.tsx`)
   - Newsletter signup
   - Organized link sections
   - Contact information
   - Social media links

3. **Layout** (`/app/layout.tsx`)
   - SEO metadata
   - Theme provider
   - Navbar and Footer integration
   - Analytics setup

### 📋 Pending Tasks
1. **High Priority**
   - Configure Supabase via MCP and create tables
   - Implement search and filter functionality
   - Create remaining tools (regulation finder, documentation guide, route planner, safety checklist)
   - Add real Resolution 996 content and vehicle data
   
2. **Medium Priority**
   - Implement dynamic news system with real NewsAPI data
   - SEO optimization and metadata enhancement
   - Add tests and final validation
   
3. **Low Priority**
   - Implement newsletter system
   - Add notification features

### 🔧 Technical Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Database:** Supabase (PostgreSQL) - pending configuration
- **APIs:** 
  - NewsAPI (key: b7654d19ed7f4464a50d09a4ef6b56cb)
  - YouTube Data API v3 (key: AIzaSyBSXSileKonb-NXQ5op1xR4W7suvdjm-94)

### 📁 Project Structure
```
autopropelidos.com.br/
├── app/
│   ├── api/
│   │   ├── aggregate/
│   │   └── webhook/
│   ├── biblioteca/
│   ├── faq/
│   ├── ferramentas/
│   │   ├── calculadora-custos/
│   │   └── verificador-conformidade/
│   ├── glossario/
│   ├── noticias/
│   ├── resolucao-996/
│   ├── videos/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── navigation/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── providers.tsx
│   └── ui/
├── lib/
│   ├── supabase/
│   └── utils.ts
├── public/
├── .env.local (API keys stored here)
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 🔑 Key Features Implemented
- Responsive design for all devices
- Dark mode support
- Accessibility with ARIA labels
- Loading states and error handling
- SEO-optimized metadata
- Mock data for demonstration
- Form validation hints
- Interactive UI elements
- Comprehensive navigation

### 📝 Notes
- All mock data is ready to be replaced with real API calls
- Supabase MCP is available but not yet configured
- Design follows Brazilian accessibility standards
- Content focuses on educating users about Resolution 996
- Tools are functional with example calculations
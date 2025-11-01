# Project Context

## Purpose

**AiReading** is a global multilingual AI-powered book reading and discussion platform. The project aims to make knowledge accessible to everyone, regardless of their location or language, by enabling users to understand, question, and internalize books.

### Vision
"Let everyone have a conversation with knowledge."

### Mission
Use AI technology to automatically generate book summaries and audio content, combined with multilingual support and intelligent Q&A, allowing users to understand the essence of a book in 15 minutes.

### Core Value Proposition
- **Listen & Understand**: AI-generated book summaries in multiple languages
- **Ask & Learn**: Interactive AI chat to discuss books (NotebookLM-style)
- **Remember & Grow**: Knowledge cards and personalized notes

## Tech Stack

### Frontend
- **Web**: Next.js (React framework)
- **Mobile**: React Native with Expo
- **UI Framework**: React components with responsive design
- **State Management**: React Context/Redux (TBD)

### Backend
- **API Server**: FastAPI (Python) or Node.js (REST + WebSocket)
- **Database**: PostgreSQL with pgvector extension for embeddings
- **Storage**: MinIO or AWS S3 for audio and text files
- **Cache/Queue**: Redis for caching, Celery for async tasks

### AI & ML
- **LLM**: GPT-5 / Claude / Gemini (configurable)
- **TTS (Text-to-Speech)**: OpenAI TTS / ElevenLabs / Azure TTS
- **Translation**: NLLB / DeepL for multilingual support
- **Embeddings**: pgvector for RAG (Retrieval-Augmented Generation)

### Infrastructure
- **Containerization**: Docker Compose for local dev
- **Orchestration**: Kubernetes for production
- **Deployment**: Vercel (frontend) + Fly.io (backend)
- **Authentication**: OAuth + JWT

### Languages Supported
- Chinese (Simplified)
- English
- Thai
- Indonesian (Bahasa Indonesia)

## Project Conventions

### Code Style
- **Python**: Follow PEP 8, use Black for formatting, type hints required
- **JavaScript/TypeScript**: ESLint + Prettier, prefer TypeScript for type safety
- **Naming Conventions**:
  - Components: PascalCase (e.g., `BookDetailPage.tsx`)
  - Functions/Variables: camelCase (e.g., `generateSummary`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_SUMMARY_LENGTH`)
  - Files: kebab-case for utilities (e.g., `api-client.ts`)

### Architecture Patterns
- **Monorepo Structure**: Separate packages for web, mobile, backend, and shared utilities
- **Microservices**: Modular backend services for content generation, user management, and AI processing
- **RAG Pipeline**: Text → Segmentation → Embedding → Summarization → TTS → Publish
- **API Design**: RESTful APIs with WebSocket support for real-time chat
- **Database**: Normalized schema with separate tables for books, chapters, summaries, audio tracks, embeddings, users, and notes

### Testing Strategy
- **Unit Tests**: Jest (frontend), pytest (backend)
- **Integration Tests**: API endpoint testing with mock LLM responses
- **E2E Tests**: Playwright for critical user flows
- **AI Quality**: Manual review + automated scoring (target: 8.0/10)
- **Performance**: Load testing for audio streaming and concurrent AI queries

### Git Workflow
- **Branching Strategy**: GitFlow (main, develop, feature/*, hotfix/*)
- **Commit Conventions**: Conventional Commits (feat, fix, docs, refactor, test, chore)
- **PR Process**: Require code review + passing CI before merge
- **Release Cycle**: Biweekly releases with semantic versioning

## Domain Context

### Content Production Pipeline
1. Book upload (manual or user-generated)
2. Text extraction and chapter segmentation
3. AI-generated summaries:
   - 3-minute short summary
   - 10-minute deep summary
   - Chapter outline
   - Key quotes
4. Multilingual translation
5. TTS audio generation (multiple voices and languages)
6. Publishing to platform

### Content Governance
- **80/20 Model**: 80% curated content (editorial team), 20% UGC (user uploads)
- **UGC Flow**: Upload → Private by default → Apply for public → Review → Publish
- **Rights Management**: Copyright verification, public domain checks, licensing

### User Interaction Model
- **Listening**: Audio playback with speed control, chapter navigation, background play
- **Chatting**: AI-powered Q&A with book context (RAG-based)
- **Learning**: Auto-generated knowledge cards and notes
- **Progress Sync**: Seamless cross-device playback position

## Important Constraints

### Technical Constraints
- **Cost**: Average generation cost target ≤ $0.10 USD per book
- **Latency**: AI chat responses should be < 3 seconds
- **Storage**: Optimize audio compression without quality loss
- **Scalability**: Support 10,000+ books in the library

### Business Constraints
- **Copyright Compliance**: Must verify rights for all content
- **Content Moderation**: AI + human review for quality control
- **Privacy**: User data and private uploads must be secure

### Regulatory Constraints
- **GDPR/CCPA**: User data privacy for global audience
- **Content Licensing**: Agreements with publishers and authors
- **Accessibility**: WCAG 2.1 AA compliance for web interface

## External Dependencies

### AI & ML Services
- **OpenAI API**: GPT models for summarization and chat
- **Anthropic Claude API**: Alternative LLM provider
- **Google Gemini API**: Multilingual capabilities
- **ElevenLabs**: High-quality TTS voices
- **DeepL API**: Professional translation service

### Infrastructure Services
- **AWS S3** or **MinIO**: Object storage for audio files
- **PostgreSQL with pgvector**: Vector database for embeddings
- **Redis**: Caching and session management
- **Vercel**: Frontend hosting and CDN
- **Fly.io**: Backend deployment

### Third-Party Integrations
- **OAuth Providers**: Google, Apple, Facebook login
- **Payment Gateway**: Stripe for subscription management (future)
- **Analytics**: Mixpanel or Amplitude for user behavior tracking
- **Monitoring**: Sentry for error tracking, DataDog for performance

## Web Application Architecture

### Frontend Framework
- **Next.js** with App Router (React 18+)
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **TypeScript** for type safety

### Page Structure & Routes

#### Core Pages
- **/** - Homepage with content discovery
- **/browse** - Category browsing page
- **/category/[slug]** - Category detail page
- **/book/[id]** - Book detail page (with tabs: Overview, Listen, Chat, Notes)
- **/library** - User's bookshelf
- **/notes** - User's notes and knowledge cards
- **/search** - Search page
- **/settings** - User settings

#### Auth Pages
- **/auth/login** - User login
- **/auth/register** - User registration
- **/auth/reset** - Password reset

#### Utility Pages
- **/help** - Help center and FAQ
- **/about** - About AiReading
- **/error/404** - Not found page
- **/error/500** - Server error page

#### Future Pages (Reserved)
- **/collections/[id]** - Curated playlist detail
- **/author/[id]** - Author profile
- **/community** - Community showcase
- **/premium** - Subscription and membership

### Global Layout Components

#### AppShell
Main application wrapper containing:
- **Header**: Logo, search, language switcher, user menu
- **Main**: Page content area
- **Footer**: Links, policies, language selector
- **MiniPlayer**: Persistent bottom audio player

#### Core Reusable Components
- **BookCard**: Book cover, title, language badge, play button
- **ShelfCarousel**: Horizontal scrollable book shelf
- **PlaylistStrip**: Collection/playlist display
- **SectionHeader**: Module title with "View All" action
- **MiniPlayer**: Global audio player with playback controls
- **UploadModal**: Book upload dialog
- **ChatWindow**: AI conversation interface
- **NoteCard**: Knowledge card display
- **LanguageSwitcher**: Multi-language selector
- **ConfirmDialog**: Action confirmation modal
- **ToastArea**: Notification system

### Page-Specific Layouts

#### Homepage (/)
Sections in order:
1. Hero Banner (optional theme promotion)
2. Continue Listening (recent playback, max 3 books)
3. Editor's Picks (curated weekly highlights)
4. Popular Now (trending books, 72-hour window)
5. AI Playlists (themed collections)
6. Quick 3-min (short summary content)
7. New Arrivals (last 7 days)
8. Community Picks (top-rated UGC)

#### Book Detail Page (/book/[id])
**Top Section**: Cover, title, author, language, tags, source badge, action buttons (favorite, add to library, share, report)

**Tabs**:
- **Overview**: Short summary (3-min), deep summary (10-min), key quotes, copyright info
- **Listen**: Audio player with chapter selection, playback speed, download
- **Chat**: AI Q&A interface with suggested questions and citation popups
- **Notes**: AI-generated notes + user notes, export to Markdown/PDF

#### Library Page (/library)
**Tabs**: Currently Reading / Finished / Want to Listen / Uploads
- Book grid with progress indicators
- Upload button (subtle, top-right corner)
- Upload status tracking (processing, generated, under review)

#### Upload Flow (Modal)
Steps:
1. File upload (txt/pdf/epub)
2. Metadata form (title, author, language, copyright confirmation)
3. Generation options (Short/Deep/Outline/TTS)
4. Progress indicator
5. Privacy setting (private by default, option to request public)
6. Review submission

#### Notes Page (/notes)
- Search bar (by book, tag, keyword)
- Filter (AI-generated vs. manual, date range)
- Notes list view
- Knowledge card mode (themed organization)
- Export functionality (Markdown/CSV)

#### Settings Page (/settings)
Sections:
- Personal profile (name, avatar, email, membership status)
- Playback preferences (default speed, auto-play next chapter)
- Language settings (UI language + content preferences)
- Privacy settings (upload visibility, copyright acknowledgment)
- Account actions (logout, delete account)

### API Endpoints Reference

| Feature | Endpoints |
|---------|-----------|
| Homepage | GET /home-feed |
| Categories | GET /categories, GET /categories/:slug/books |
| Book Details | GET /book/:id, GET /book/:id/summaries, GET /book/:id/audio |
| AI Chat | POST /chat/book/:id |
| Notes | GET /book/:id/notes, POST /book/:id/notes |
| Upload | POST /upload, GET /upload/status/:id |
| User Settings | GET/PUT /user/settings |
| Search | GET /search?q= |
| Authentication | POST /auth/login, POST /auth/register |

### Design Principles

#### Visual Style
- **Minimalist & Clean**: White background with gradient accents
- **Reading-focused**: Typography optimized for readability
- **Mobile-first**: Responsive design with PWA support
- **Accessible**: WCAG 2.1 AA compliance

#### User Experience
- **Immediate Playback**: One-click listening from any page
- **Seamless Navigation**: MiniPlayer persists across pages
- **Intelligent Interaction**: NotebookLM-style AI chat with citations
- **Cross-device Sync**: Playback position synced across devices
- **Auto Language Detection**: Browser-based language preference
- **Subtle UGC Entry**: Upload feature accessible but not prominent

#### Content Strategy
- **80/20 Curation Model**: 80% editorial content, 20% user-generated
- **Quality First**: AI + human review for all public content
- **Multilingual by Default**: All UI supports zh/en/th/id languages

## SEO & Performance Strategy

### SEO Configuration
- **Keyword Strategy**: Target "AI book summaries", "audiobook summaries", "[Book Title] summary" across 4 languages
- **Technical SEO**: Automatic sitemap.xml, robots.txt, canonical URLs, hreflang tags
- **Structured Data**: JSON-LD schema for Book, AudioObject, CollectionPage, FAQPage, Organization
- **Meta Tags**: Unique title/description per page, Open Graph, Twitter Cards
- **Internal Linking**: Topic cluster strategy linking hub pages (categories) to spoke pages (books)
- **URL Structure**: Clean, descriptive URLs with language prefix: `/[locale]/[type]/[slug]`

### Performance Targets
- **Lighthouse Score**: ≥ 90 for Performance, SEO, Best Practices, Accessibility
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
- **Mobile**: Mobile-first design, PWA support, touch targets ≥ 44px
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader optimized

### Personalization & Memory
- **Anonymous Tracking**: LocalStorage for preferences (language, theme, playback speed)
- **User Events**: Track page views, scroll depth, CTA clicks, book plays, chat messages, notes
- **Personalization Slots**:
  - Continue Listening (recent playback)
  - Home Recommendations (category affinity)
  - Suggested Books (browsing history)
- **Privacy First**: Users can disable/clear data, GDPR/CCPA compliant

### AI Optimization
- **A/B Testing**: Test hero titles, CTA text, section order, tab layouts
- **Analytics**: Plausible (privacy-friendly) or GA4 for event tracking
- **Goals**: Primary (book plays, chat engagement), Secondary (scroll depth, time on page)
- **Weekly Reports**: Automated optimization suggestions based on conversion data
- **Variant Management**: `/ai/ab-variants.json` defines test variants per page

### Content SEO Best Practices
- **Book Detail Pages**: 1000-2000 words (summary + outline + quotes), unique per book
- **Category Pages**: 200-300 word descriptions with keyword integration
- **Blog Content** (Future): Topic-focused articles targeting long-tail keywords
- **Freshness Signals**: Homepage updated daily, categories weekly, books monthly
- **Multilingual SEO**: Proper hreflang implementation, no duplicate content across languages

### Monitoring & Analytics
- **Google Search Console**: Track keyword rankings, click-through rates, indexing issues
- **Core Web Vitals**: Monitor via Google Search Console and Lighthouse CI
- **Error Tracking**: Sentry for JavaScript errors
- **Performance**: DataDog for backend API monitoring
- **User Analytics**: Mixpanel or Plausible for user behavior analysis

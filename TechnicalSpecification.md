# AiReading Technical Specification

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-01
- **Status**: Draft
- **Target Audience**: Development Team

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────────┬──────────────────┬──────────────────────┤
│   Web (Next.js)  │  iOS (RN Expo)   │  Android (RN Expo)   │
└────────┬─────────┴────────┬─────────┴──────────┬───────────┘
         │                  │                     │
         └──────────────────┼─────────────────────┘
                            │
                   ┌────────▼────────┐
                   │   API Gateway   │
                   │  (Load Balancer)│
                   └────────┬────────┘
                            │
         ┏━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┓
         ▼                                     ▼
┌─────────────────┐                  ┌─────────────────┐
│  Backend API    │                  │   AI Services   │
│  (FastAPI/Node) │◄─────────────────┤   (LLM/TTS)     │
└────────┬────────┘                  └─────────────────┘
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Postgres│ │Redis │ │MinIO │ │Celery│ │Queue │
│+pgvector│ │Cache │ │S3    │ │Worker│ │      │
└────────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### 1.2 Technology Stack Details

#### Frontend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 14+ | React framework with App Router |
| UI Library | React | 18+ | Component library |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| Component Library | shadcn/ui | Latest | Pre-built accessible components |
| Type System | TypeScript | 5.0+ | Static typing |
| State Management | Zustand/Redux Toolkit | TBD | Global state |
| API Client | TanStack Query | 5.0+ | Server state management |
| Forms | React Hook Form | 7.0+ | Form handling |
| Validation | Zod | 3.0+ | Schema validation |
| i18n | next-intl | 3.0+ | Internationalization |
| Audio Player | Howler.js / React Player | Latest | Audio playback |

#### Backend Stack
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| API Framework | FastAPI | 0.104+ | REST API (Option 1) |
| Alternative | Node.js + Express | 18+ | REST API (Option 2) |
| ORM | SQLAlchemy / Prisma | Latest | Database ORM |
| Validation | Pydantic / Zod | Latest | Request/response validation |
| WebSocket | Socket.io / FastAPI WS | Latest | Real-time communication |
| Task Queue | Celery / Bull | Latest | Async job processing |
| Caching | Redis | 7.0+ | Cache & sessions |

#### Database & Storage
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Primary DB | PostgreSQL | 15+ | Relational data |
| Vector Extension | pgvector | 0.5+ | Embeddings storage |
| Object Storage | MinIO / AWS S3 | Latest | Audio & files |
| Cache | Redis | 7.0+ | Performance optimization |

#### AI & ML Services
| Service | Provider | Purpose |
|---------|----------|---------|
| LLM | OpenAI GPT-4 / Claude 3 / Gemini | Summarization & chat |
| TTS | OpenAI TTS / ElevenLabs / Azure | Audio generation |
| Translation | DeepL / NLLB | Multilingual support |
| Embeddings | OpenAI text-embedding-3 | Vector search |

---

## 2. Database Schema

### 2.1 Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en',
  playback_speed DECIMAL(3,2) DEFAULT 1.0,
  auto_play_next BOOLEAN DEFAULT true,
  membership_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### books
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  original_title VARCHAR(500),
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20),
  language VARCHAR(10) NOT NULL,
  cover_image_url TEXT,
  source_type VARCHAR(20) NOT NULL, -- 'curated' or 'ugc'
  uploaded_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, processing, published, rejected
  copyright_status VARCHAR(50), -- public_domain, licensed, user_owned
  avg_rating DECIMAL(3,2),
  total_plays INTEGER DEFAULT 0,
  total_favorites INTEGER DEFAULT 0,
  estimated_reading_time INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_source_type ON books(source_type);
CREATE INDEX idx_books_language ON books(language);
CREATE INDEX idx_books_published_at ON books(published_at);
```

#### chapters
```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title VARCHAR(500),
  content TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

CREATE INDEX idx_chapters_book_id ON chapters(book_id);
```

#### summaries
```sql
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL, -- 'short', 'deep', 'outline', 'quotes'
  language VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  content_format VARCHAR(20) DEFAULT 'markdown', -- markdown, json
  estimated_duration INTEGER, -- in seconds
  ai_model VARCHAR(100), -- e.g., 'gpt-4', 'claude-3'
  generation_cost DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, type, language)
);

CREATE INDEX idx_summaries_book_id ON summaries(book_id);
CREATE INDEX idx_summaries_type ON summaries(type);
```

#### audio_tracks
```sql
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  summary_id UUID REFERENCES summaries(id),
  chapter_id UUID REFERENCES chapters(id),
  language VARCHAR(10) NOT NULL,
  voice_id VARCHAR(100), -- TTS voice identifier
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  duration_seconds INTEGER,
  format VARCHAR(20) DEFAULT 'mp3', -- mp3, aac, opus
  bitrate INTEGER, -- in kbps
  tts_provider VARCHAR(50), -- openai, elevenlabs, azure
  generation_cost DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audio_tracks_book_id ON audio_tracks(book_id);
CREATE INDEX idx_audio_tracks_summary_id ON audio_tracks(summary_id);
```

#### embeddings
```sql
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER,
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_embeddings_book_id ON embeddings(book_id);
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

#### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_i18n JSONB NOT NULL, -- {"en": "Business", "zh": "商业"}
  description_i18n JSONB,
  cover_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
```

#### book_categories
```sql
CREATE TABLE book_categories (
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, category_id)
);

CREATE INDEX idx_book_categories_book_id ON book_categories(book_id);
CREATE INDEX idx_book_categories_category_id ON book_categories(category_id);
```

#### collections
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_i18n JSONB NOT NULL,
  description_i18n JSONB,
  cover_image_url TEXT,
  created_by VARCHAR(50) DEFAULT 'editorial', -- editorial, ai, user
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### collection_books
```sql
CREATE TABLE collection_books (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  PRIMARY KEY (collection_id, book_id)
);
```

#### user_library
```sql
CREATE TABLE user_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'want_to_listen', -- currently_reading, finished, want_to_listen
  is_favorite BOOLEAN DEFAULT false,
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX idx_user_library_user_id ON user_library(user_id);
CREATE INDEX idx_user_library_status ON user_library(status);
```

#### notes
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  type VARCHAR(20) DEFAULT 'manual', -- manual, ai_generated
  title VARCHAR(500),
  content TEXT NOT NULL,
  content_format VARCHAR(20) DEFAULT 'markdown',
  tags TEXT[], -- array of tags
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_book_id ON notes(book_id);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);
```

#### chat_sessions
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_book_id ON chat_sessions(book_id);
```

#### chat_messages
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL, -- user, assistant
  content TEXT NOT NULL,
  citations JSONB, -- array of {chunk_id, text, position}
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
```

#### placements
```sql
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(50) NOT NULL, -- homepage, category_detail
  section VARCHAR(100) NOT NULL, -- hero_banner, editors_picks
  position INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- book, collection, banner
  content_id UUID,
  metadata JSONB, -- additional data like custom title, CTA
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_placements_page_section ON placements(page, section);
```

---

## 3. API Specification

### 3.1 Authentication & Authorization

#### JWT Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "membership_tier": "free",
  "iat": 1234567890,
  "exp": 1234567890
}
```

#### Authentication Endpoints

**POST /api/v1/auth/register**
```typescript
// Request
{
  email: string;
  password: string;
  full_name?: string;
  preferred_language?: 'en' | 'zh' | 'th' | 'id';
}

// Response
{
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  access_token: string;
  refresh_token: string;
}
```

**POST /api/v1/auth/login**
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  user: UserProfile;
  access_token: string;
  refresh_token: string;
}
```

**POST /api/v1/auth/oauth/{provider}**
- Providers: google, apple, facebook
- Returns: Same as login response

### 3.2 Books API

**GET /api/v1/books**
```typescript
// Query params
{
  page?: number;
  limit?: number;
  category?: string;
  language?: string;
  source_type?: 'curated' | 'ugc';
  sort_by?: 'newest' | 'popular' | 'trending';
}

// Response
{
  data: Book[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
```

**GET /api/v1/books/:id**
```typescript
// Response
{
  id: string;
  title: string;
  author: string;
  language: string;
  cover_image_url: string;
  source_type: 'curated' | 'ugc';
  status: string;
  avg_rating: number;
  total_plays: number;
  total_favorites: number;
  categories: Category[];
  in_user_library?: boolean;
  user_library_status?: string;
}
```

**GET /api/v1/books/:id/summaries**
```typescript
// Response
{
  short?: {
    language: string;
    content: string;
    estimated_duration: number;
  };
  deep?: {
    language: string;
    content: string;
    estimated_duration: number;
  };
  outline?: {
    language: string;
    content: string;
  };
  quotes?: {
    language: string;
    content: Quote[];
  };
}
```

**GET /api/v1/books/:id/audio**
```typescript
// Query params
{
  type: 'short' | 'deep' | 'chapter';
  chapter_id?: string;
  language?: string;
}

// Response
{
  id: string;
  file_url: string;
  duration_seconds: number;
  format: string;
  voice_id: string;
}
```

### 3.3 Upload API

**POST /api/v1/upload**
```typescript
// Request (multipart/form-data)
{
  file: File; // txt, pdf, epub
  title: string;
  author: string;
  language: string;
  copyright_confirmed: boolean;
  generation_options: {
    short_summary: boolean;
    deep_summary: boolean;
    outline: boolean;
    tts: boolean;
  };
}

// Response
{
  upload_id: string;
  status: 'processing';
  estimated_time: number; // seconds
}
```

**GET /api/v1/upload/status/:id**
```typescript
// Response
{
  upload_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  current_step: string;
  book_id?: string;
  error?: string;
}
```

### 3.4 Chat API

**POST /api/v1/chat/book/:bookId**
```typescript
// Request
{
  message: string;
  session_id?: string;
  language?: string;
}

// Response
{
  session_id: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    citations: Array<{
      chunk_text: string;
      chapter_title?: string;
      position: number;
    }>;
    created_at: string;
  };
}
```

**GET /api/v1/chat/sessions/:bookId**
```typescript
// Response
{
  sessions: Array<{
    id: string;
    created_at: string;
    message_count: number;
    last_message_preview: string;
  }>;
}
```

### 3.5 Homepage Feed API

**GET /api/v1/home-feed**
```typescript
// Response
{
  continue_listening?: Book[];
  editors_picks: Book[];
  popular_now: Book[];
  ai_playlists: Collection[];
  quick_3min: Book[];
  new_arrivals: Book[];
  community_picks: Book[];
  hero_banner?: {
    title: string;
    description: string;
    image_url: string;
    cta_text: string;
    cta_link: string;
  };
}
```

---

## 4. Content Generation Pipeline

### 4.1 Book Processing Workflow

```
Upload → Text Extraction → Segmentation → Embedding → Summarization → Translation → TTS → Publish
```

#### Step-by-Step Process

1. **File Upload**
   - Accept: txt, pdf, epub
   - Validate: file size, format, copyright confirmation
   - Store: MinIO/S3 with unique key

2. **Text Extraction**
   - PDF: Use PyPDF2 or pdfplumber
   - EPUB: Use ebooklib
   - TXT: Direct read
   - Output: Plain text + chapter structure

3. **Segmentation**
   - Split into chapters (if not structured)
   - Create 500-1000 token chunks for embeddings
   - Store in chapters table

4. **Embedding Generation**
   - Use OpenAI text-embedding-3-small
   - Generate embeddings for each chunk
   - Store in embeddings table with pgvector

5. **Summarization** (Parallel)
   - **Short Summary** (3-min)
     - Prompt: "Create a 3-minute summary highlighting key insights"
     - Target: 300-400 words
   - **Deep Summary** (10-min)
     - Prompt: "Create a comprehensive 10-minute summary"
     - Target: 1000-1200 words
   - **Outline**
     - Prompt: "Extract chapter outline with key points"
   - **Quotes**
     - Prompt: "Extract 10-15 most impactful quotes"

6. **Translation** (if needed)
   - Translate summaries to target languages (en, zh, th, id)
   - Use DeepL or specialized LLM prompts
   - Maintain formatting and structure

7. **TTS Generation**
   - Convert summaries to audio
   - Providers: OpenAI TTS, ElevenLabs
   - Format: MP3, 128kbps
   - Store in MinIO/S3

8. **Quality Check**
   - AI scoring (coherence, accuracy)
   - Manual review for curated content
   - Auto-approval for private UGC

9. **Publish**
   - Update book status to 'published'
   - Index for search
   - Notify user (if UGC)

### 4.2 Cost Estimation

| Operation | Provider | Cost per Book |
|-----------|----------|---------------|
| Text Embeddings | OpenAI | $0.01 - 0.02 |
| Summarization (4 types) | GPT-4 | $0.03 - 0.05 |
| Translation (3 languages) | DeepL | $0.01 - 0.02 |
| TTS (2 audio tracks) | OpenAI/ElevenLabs | $0.02 - 0.03 |
| **Total** | | **$0.07 - 0.12** |

Target: ≤ $0.10 per book

---

## 5. Frontend Architecture

### 5.1 Project Structure

```
aireading-web/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── reset/
│   │   ├── (main)/
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── browse/
│   │   │   │   └── page.tsx
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── book/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── library/
│   │   │   │   └── page.tsx
│   │   │   ├── notes/
│   │   │   │   └── page.tsx
│   │   │   ├── search/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── api/                          # API routes (if needed)
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MiniPlayer.tsx
│   ├── book/
│   │   ├── BookCard.tsx
│   │   ├── BookDetail.tsx
│   │   └── BookPlayer.tsx
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   └── MessageItem.tsx
│   ├── notes/
│   │   └── NoteCard.tsx
│   └── upload/
│       └── UploadModal.tsx
├── lib/
│   ├── api/                          # API client
│   ├── hooks/                        # Custom hooks
│   ├── utils/                        # Utilities
│   └── constants/
├── public/
│   ├── locales/                      # i18n files
│   └── assets/
├── types/
│   └── index.ts
├── middleware.ts                     # i18n middleware
├── next.config.js
├── tailwind.config.js
└── package.json
```

### 5.2 Key Components Specification

#### AppShell
```typescript
// components/layout/AppShell.tsx
interface AppShellProps {
  children: React.ReactNode;
  showMiniPlayer?: boolean;
}

export function AppShell({ children, showMiniPlayer = true }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-24">{children}</main>
      {showMiniPlayer && <MiniPlayer />}
      <Footer />
    </div>
  );
}
```

#### BookCard
```typescript
// components/book/BookCard.tsx
interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverImageUrl: string;
    language: string;
    sourceType: 'curated' | 'ugc';
  };
  variant?: 'default' | 'compact';
  onPlay?: () => void;
}

export function BookCard({ book, variant = 'default', onPlay }: BookCardProps) {
  // Implementation
}
```

#### MiniPlayer
```typescript
// components/layout/MiniPlayer.tsx
interface MiniPlayerProps {
  currentBook?: Book;
  currentAudio?: AudioTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function MiniPlayer(props: MiniPlayerProps) {
  // Persist across page navigation
  // Show progress bar
  // Volume control
  // Speed control
}
```

### 5.3 State Management

#### Global State (Zustand)

```typescript
// lib/store/player-store.ts
interface PlayerState {
  currentBook: Book | null;
  currentAudio: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;

  setCurrentBook: (book: Book) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  // Implementation
}));
```

```typescript
// lib/store/user-store.ts
interface UserState {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Implementation
}));
```

### 5.4 API Integration

```typescript
// lib/api/client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// lib/api/books.ts
export const booksApi = {
  getAll: (params: GetBooksParams) =>
    apiClient.get<BooksResponse>('/books', { params }),

  getById: (id: string) =>
    apiClient.get<Book>(`/books/${id}`),

  getSummaries: (id: string) =>
    apiClient.get<Summaries>(`/books/${id}/summaries`),

  getAudio: (id: string, params: AudioParams) =>
    apiClient.get<AudioTrack>(`/books/${id}/audio`, { params }),
};

// Usage in components
function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => booksApi.getById(id),
  });
}
```

---

## 6. Security & Compliance

### 6.1 Authentication
- JWT tokens with 15-min access, 7-day refresh
- OAuth 2.0 for third-party login
- Password: bcrypt with 12 rounds
- Rate limiting: 100 req/min per IP

### 6.2 Data Protection
- HTTPS only (TLS 1.3)
- Encrypted database fields for sensitive data
- Regular backups (daily)
- GDPR compliance: data export, right to deletion

### 6.3 Copyright Protection
- User confirmation required for uploads
- DMCA takedown process
- Content moderation queue
- Watermarking for premium content (future)

---

## 7. Performance Optimization

### 7.1 Frontend
- Next.js SSR/SSG for SEO pages
- Image optimization with next/image
- Code splitting by route
- Lazy load non-critical components
- PWA with service worker

### 7.2 Backend
- Redis caching for hot data (homepage feed)
- Database query optimization (indexes)
- CDN for static assets (CloudFlare/Vercel)
- Audio streaming with range requests
- Batch API requests where possible

### 7.3 AI Services
- Cache LLM responses for common questions
- Batch embedding generation
- Use cheaper models for simple tasks
- Implement request queuing to avoid rate limits

---

## 8. Monitoring & Observability

### 8.1 Metrics to Track
- API response times (p50, p95, p99)
- Error rates by endpoint
- User engagement (DAU, MAU, retention)
- Audio playback completion rate
- AI generation costs
- Database query performance

### 8.2 Tools
- **Application Monitoring**: Sentry, DataDog
- **Infrastructure**: Prometheus + Grafana
- **User Analytics**: Mixpanel, PostHog
- **Logs**: Loki, CloudWatch

---

## 9. Deployment Strategy

### 9.1 Environments
- **Development**: Local Docker Compose
- **Staging**: Fly.io or Railway
- **Production**: Kubernetes on AWS/GCP or Fly.io

### 9.2 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run tests
      - Run linting

  build:
    needs: test
    steps:
      - Build Docker images
      - Push to registry

  deploy:
    needs: build
    steps:
      - Deploy to production
      - Run database migrations
      - Health check
```

### 9.3 Rollback Strategy
- Blue-green deployment
- Automatic rollback on health check failure
- Database migrations with down scripts

---

## 10. Development Phases

### Phase 1: MVP (0-3 months)
- [ ] User authentication
- [ ] Book catalog and detail pages
- [ ] Audio player (basic)
- [ ] AI summarization (short + deep)
- [ ] Basic chat (RAG)
- [ ] English + Chinese support

### Phase 2: Enhancement (3-6 months)
- [ ] Mobile apps (React Native)
- [ ] User notes and knowledge cards
- [ ] UGC upload and review system
- [ ] CMS for editorial team
- [ ] Thai + Indonesian languages

### Phase 3: Scale (6-12 months)
- [ ] Enterprise API
- [ ] AI instructor personalities
- [ ] Knowledge graph recommendations
- [ ] Premium subscription
- [ ] Advanced analytics

---

## 11. Testing Strategy

### 11.1 Frontend Testing
- **Unit**: Jest + React Testing Library
- **Integration**: Playwright for critical flows
- **Visual**: Chromatic or Percy
- **Accessibility**: axe-core

### 11.2 Backend Testing
- **Unit**: pytest (Python) or Jest (Node)
- **Integration**: API endpoint tests
- **Load**: k6 or Artillery
- **Database**: Test with fixtures

### 11.3 AI Quality Testing
- Human evaluation for 10% of generated content
- Automated scoring (coherence, relevance)
- A/B testing for different prompts
- Citation accuracy checks

---

## Appendix

### A. Glossary
- **UGC**: User-Generated Content
- **RAG**: Retrieval-Augmented Generation
- **TTS**: Text-to-Speech
- **LLM**: Large Language Model
- **CMS**: Content Management System

### B. References
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [pgvector](https://github.com/pgvector/pgvector)
- [OpenAI API](https://platform.openai.com/docs)

---

**Document Status**: Draft - Pending team review
**Next Review Date**: 2025-11-15

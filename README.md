# Roomet - Intern Roommate Finder

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
roomet/
├── app/
│   ├── auth/
│   │   └── callback/     # Auth callback route
│   ├── globals.css       # Global styles with glassmorphism utilities
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── AuthModal.tsx     # Authentication modal with onboarding
│   ├── ConversationFlow.tsx  # Multi-step conversation flow
│   ├── RoommateCard.tsx  # Preview roommate card component
│   └── TypingAnimation.tsx   # Typing animation component
└── lib/
    └── supabase.ts       # Supabase client configuration
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint


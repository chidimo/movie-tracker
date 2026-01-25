# Movie Tracker Codebase Merge Plan

## Goal: Merge Web and Mobile Codebases into a Monorepo

## Current Structure
```
movie-tracker/          # Web (React)
MovieTracker/          # Mobile (React Native)
```

## Target Structure
```
movie-tracker/
├── packages/
│   ├── core/                 # Shared business logic
│   │   ├── src/
│   │   │   ├── hooks/        # useProgress, etc.
│   │   │   ├── types/        # Show, Season, etc.
│   │   │   ├── context/      # SeriesTrackerContext
│   │   │   └── utils/        # Shared utilities
│   │   └── package.json
│   ├── web/                  # React web app
│   │   ├── src/
│   │   │   ├── components/   # Web-specific UI
│   │   │   ├── pages/        # Web pages
│   │   │   └── styles/       # Web styles
│   │   └── package.json
│   └── mobile/               # React Native app
│       ├── src/
│       │   ├── components/   # Mobile-specific UI
│       │   ├── screens/      # Mobile screens
│       │   └── styles/       # Mobile styles
│       └── package.json
├── pnpm-workspace.yaml
└── package.json (root)
```

## Migration Steps

### Phase 1: Setup Monorepo Structure ✅
- [x] Create pnpm-workspace.yaml
- [x] Create packages/core structure
- [x] Move shared files to core package

### Phase 2: Core Package Setup
- [ ] Fix import paths in core package
- [ ] Add TypeScript configuration
- [ ] Set up build system
- [ ] Export all shared types and hooks

### Phase 3: Web Package Migration
- [ ] Create packages/web structure
- [ ] Move web-specific files from src/ to packages/web/
- [ ] Update imports to use @movie-tracker/core
- [ ] Update web package.json dependencies

### Phase 4: Mobile Package Migration
- [ ] Create packages/mobile structure
- [ ] Move mobile files from MovieTracker/ to packages/mobile/
- [ ] Update imports to use @movie-tracker/core
- [ ] Update mobile package.json dependencies

### Phase 5: Cleanup & Testing
- [ ] Remove old directories
- [ ] Set up development scripts
- [ ] Test both platforms work
- [ ] Update documentation

## Benefits

### 1. Single Source of Truth
- All business logic in core package
- Types, hooks, context shared across platforms
- No more duplicate code

### 2. Better Developer Experience
- Single repository for both platforms
- Shared testing utilities
- Consistent behavior across platforms

### 3. Easier Maintenance
- Changes to business logic benefit both platforms
- Single place to update types and interfaces
- Reduced cognitive load

### 4. Scalability
- Easy to add new platforms (e.g., desktop app)
- Shared packages can be published to npm
- Clear separation of concerns

## Implementation Notes

### Import Changes
```typescript
// Before
import { useProgress } from '@/hooks/use-progress'
import { Show } from '@/lib/series-tracker/types'

// After
import { useProgress, Show } from '@movie-tracker/core'
```

### Platform-Specific Components
```typescript
// Web: packages/web/src/components/Progress.tsx
import { useProgress } from '@movie-tracker/core'
// Web-specific React components

// Mobile: packages/mobile/src/components/Progress.tsx
import { useProgress } from '@movie-tracker/core'
// Mobile-specific React Native components
```

### Shared Development Scripts
```json
{
  "scripts": {
    "dev": "pnpm --filter web dev & pnpm --filter mobile start",
    "build": "pnpm --filter core build && pnpm --filter web build",
    "test": "pnpm --filter \"*\" test"
  }
}
```

## Next Steps

1. **Complete Phase 2**: Fix core package imports and setup
2. **Start Phase 3**: Begin web package migration
3. **Test incrementally**: Ensure each phase works before proceeding
4. **Gradual migration**: Move functionality piece by piece

This approach allows us to maintain functionality while gradually consolidating the codebase.

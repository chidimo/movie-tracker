# MovieTracker 📺

A React Native/Expo app for tracking TV series with AI-powered recommendations and discovery features.

## Get Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```

## AI Features

The app includes AI-powered show recommendations using multiple providers:

### Groq (Recommended)

**Fast, affordable, and reliable AI recommendations**

#### Setup

1. **Get Groq API Key**
   - Go to https://console.groq.com/
   - Sign up with Google/GitHub (free $10 credit)
   - Copy your API key from the dashboard

2. **Configure Environment**

   ```bash
   # In your .env file
   EXPO_PUBLIC_AI_BASE_URL=https://api.groq.com/openai/v1/chat/completions
   EXPO_PUBLIC_AI_MODEL=llama-3.1-8b-instant
   EXPO_PUBLIC_GROQ_API_KEY=gsk_your_actual_key_here
   ```

3. **Test Connection**
   ```bash
   npm run test:ai
   ```

#### Benefits

- ✅ **$10 free credit** (plenty for testing)
- ✅ **Ultra-fast** (500+ tokens/second)
- ✅ **Works everywhere** (no network issues)
- ✅ **Same Llama3 model** as local Ollama
- ✅ **Affordable** (~$0.05 per 1M tokens)

### Ollama (Local)

**Private, local AI processing**

#### Setup

1. **Install Ollama**

   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull a Model**

   ```bash
   ollama pull llama3
   # or
   ollama pull gemma2
   ```

3. **Configure Environment**
   ```bash
   # In your .env file
   EXPO_PUBLIC_AI_BASE_URL=http://localhost:11434
   EXPO_PUBLIC_AI_MODEL=llama3
   ```

#### Network Configuration

For Android development, you may need to use:

```bash
# Android emulator
EXPO_PUBLIC_AI_BASE_URL=http://10.0.2.2:11434

# Real device (use your computer's IP)
EXPO_PUBLIC_AI_BASE_URL=http://192.168.XX.XX:11434
```

## Available Scripts

- `npm start` - Start development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run test:ai` - Test AI connection
- `npm run lint` - Run ESLint
- `npm run build:dev` - Create development build
- `npm run build:prod` - Create production build

## Features

- **Series Tracking**: Add, organize, and track your favorite TV shows
- **AI Recommendations**: Get personalized show suggestions powered by AI
- **Discovery**: Explore trending shows and mood-based recommendations
- **Import/Export**: Backup and restore your show library
- **Cross-platform**: Works on iOS, Android, and web

## Project Structure

```
app/                    # Expo Router pages
components/             # Reusable UI components
├── explore/           # Discovery features
├── form-elements/     # UI components
├── series-tracker/    # Core tracking functionality
└── settings/          # App settings
lib/                   # Utilities and business logic
├── ai-discovery.ts    # AI recommendation engine (mobile implementation)
├── assistant.ts        # Mobile assistant functions
├── logger.ts           # Mobile logging utilities
└── types.ts           # App type definitions
hooks/                 # Custom React hooks
context/               # React context providers
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

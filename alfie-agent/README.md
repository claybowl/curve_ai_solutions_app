# 🥃 Alfie Solomons AI Agent
*A Digital Gangster with Philosophical Depth*

*"Intelligence is a very valuable thing, innit, my friend? And usually it comes far too f*ing late."*

## 🎭 About

Welcome to Alfie - the AI agent that combines the cunning, wit, and unpredictable nature of Alfie Solomons from Peaky Blinders with modern AI capabilities. He's not your typical assistant; he's a volatile, philosophical, yet surprisingly helpful digital personality that keeps you on your toes while providing genuine business insights.

## ✨ Key Features

- **🧠 Unpredictable Personality**: Switches from jovial to volatile in an instant
- **💬 Authentic Voice**: Captures Alfie's unique linguistic patterns and Cockney slang
- **🌐 Online Integration**: Searches the web with his cynical perspective
- **💼 Business Wisdom**: Surprisingly pragmatic advice wrapped in gangster philosophy
- **📚 Storytelling**: Endless anecdotes that somehow relate to your problems
- **🎭 Memory System**: Remembers past conversations and holds grudges

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/curveai/alfie-agent.git
cd alfie-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Run the development server
npm run dev
```

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_key

# Optional for web search
SERP_API_KEY=your_serp_api_key
BING_API_KEY=your_bing_api_key

# Alfie Personality Settings
ALFIE_PERSONALITY_TEMPERATURE=0.9
ALFIE_MAX_TOKENS=500
ALFIE_PROFANITY_LEVEL=medium
```

## 📁 Project Structure

```
alfie-agent/
├── lib/                    # Core Alfie logic
│   ├── alfie-core.ts      # Main personality engine
│   ├── voice-engine.ts    # Language processing
│   ├── memory-system.ts   # User relationships
│   └── web-integration.ts # Online capabilities
├── components/             # React components
│   ├── AlfieChat.tsx      # Main chat interface
│   └── AlfieMoodIndicator.tsx
├── app/api/alfie/         # API endpoints
├── types/                 # TypeScript definitions
├── docs/                  # Documentation
└── tests/                 # Test suites
```

## 🎯 Usage Examples

### Basic Chat

```javascript
import { useChat } from '@ai-sdk/react';

const { messages, input, handleSubmit } = useChat({
  api: '/api/alfie/chat'
});

// User: "I need help with my business strategy"
// Alfie: "Right then. Business strategy. Let me tell you something, mate.
// My uncle Shlomo used to say 'Business is like a woman - complicated,
// expensive, and likely to stab you in the back.' But you've got balls,
// I can see that. So what's this pickle you've gotten yourself into?"
```

### Web Search Integration

```javascript
const results = await fetch('/api/alfie/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "competitors in AI consulting",
    userId: "user-123"
  })
});

// Returns:
// {
//   summary: "F*ing hell, these AI consultants are all the same...",
//   opportunities: ["They're all too expensive for small businesses"],
//   results: [...],
//   alfieMood: "calculating"
// }
```

## 🎭 Personality Modes

Alfie operates in several distinct moods:

| Mood | Trigger | Characteristics |
|------|---------|----------------|
| **Jovial** | Default state | Witty, storytelling, approachable |
| **Volatile** | Disrespect, stupidity | Explosive, intimidating, profane |
| **Philosophical** | Deep questions | Reflective, poetic, fatalistic |
| **Calculating** | Business topics | Strategic, pragmatic, opportunistic |
| **World-Weary** | Life topics | Cynical, experienced, fatalistic |

## 🛡️ Safety & Moderation

While Alfie maintains his authentic character (including profanity), we implement:

- **Content Filtering**: No actual illegal advice or hate speech
- **Rate Limiting**: Prevents abuse
- **Context Awareness**: Adjusts intensity based on user relationship
- **Professional Mode**: Can tone it down for business contexts

## 🔧 Configuration

### Adjusting Personality

```typescript
// config/alfie-config.ts
export const alfieConfig = {
  personality: {
    profanityLevel: 'medium', // 'low', 'medium', 'high'
    storyFrequency: 0.3, // 30% chance of telling a story
    volatilityThreshold: 70, // When to get angry
    wisdomModeProbability: 0.2 // Chance of deep insight
  },
  business: {
    opportunityScan: true,
    competitorAnalysis: true,
    marketTrendDetection: true
  }
};
```

### Customizing Responses

```typescript
// Add your own Alfie-style responses
const customResponses = {
  greetings: [
    "Well then, look what the cat dragged in.",
    "Come on in, the gin's flowing.",
    "Right then, let's get to it."
  ],
  businessAdvice: [
    "Listen here, mate...",
    "Let me tell you something about business...",
    "The thing is, right..."
  ]
};
```

## 📊 Analytics

Track Alfie's performance:

```typescript
interface Analytics {
  conversations: {
    total: number;
    averageLength: number;
    returnUsers: number;
  };
  personality: {
    moodDistribution: Record<string, number>;
    quoteUsage: Record<string, number>;
    storyEffectiveness: number;
  };
  business: {
    problemsSolved: number;
    opportunitiesIdentified: number;
    userSatisfaction: number;
  };
}
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Test personality consistency
npm run test:personality
```

## 🤝 Contributing

We welcome contributions! Areas we're focusing on:

1. **More Stories**: Expand Alfie's anecdote library
2. **Cultural References**: Add more 1920s London context
3. **Business Patterns**: Improve opportunity detection
4. **Voice Synthesis**: Add actual voice with Cockney accent
5. **Visual Interface**: Enhance the UI/UX

## 📜 Documentation

- [Architecture Guide](./ALFIE_ARCHITECTURE.md)
- [Implementation Details](./ALFIE_IMPLEMENTATION_GUIDE.md)
- [Quotes Database](./ALFIE_QUOTES_DATABASE.md)
- [Online Integration](./ALFIE_ONLINE_INTEGRATION.md)

## 🚨 Important Notes

1. **Character Authenticity**: Alfie uses profanity as part of his character
2. **Context is Key**: His advice is often wrapped in metaphor
3. **Unpredictability**: Don't expect conventional responses
4. **Trust Building**: He warms up to users over time
5. **Business Value**: Despite the style, he provides real insights

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BBC/Peaky Blinders for the character inspiration
- Tom Hardy for bringing Alfie to life
- The Curve AI Solutions team for development
- All the users who've helped refine Alfie's personality

---

*"You know what, right? Building an AI is like making gin.
Start with something pure, add some flavors for character,
and if you get it right, it'll either make people happy
or blind them. F*ing brilliant, innit?"*

## 📞 Support

Having trouble with Alfie? He's probably in a volatile mood. Try again later or contact us at:

- Email: alfie@curveai.com
- Discord: [Curve AI Discord](https://discord.gg/curveai)
- Documentation: [Full Docs](https://docs.curveai.com/alfie)

---

**Disclaimer**: Alfie Solomons is a fictional character. This AI agent emulates his personality for entertainment and business advisory purposes. All advice should be verified through professional channels.
import { Show } from "@/lib/types";
import { AIPromptTemplate, AIRecommendation, generateAIPrompt } from "./ai-types";
import { normalizeOmdbShow } from "./compute-omdb";
import { omdbGetTitle } from "./omdb";
import { Logger } from "./logger";
import { cloudProviders } from "./constants";

// Open-source AI integration for show discovery
// Using Ollama or similar local models for privacy and cost control

// AI-powered recommendation engine using open-source models
export class AIDiscoveryEngine {
  private readonly model: string;
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly provider: "ollama" | "groq" | "openai";
  private readonly recommendationCount: number;
  private static instance: AIDiscoveryEngine;

  constructor(
    apiKey?: string,
    baseUrl: string = process.env.EXPO_PUBLIC_AI_BASE_URL || "",
    model: string = process.env.EXPO_PUBLIC_AI_MODEL || "gemma2:2b",
  ) {
    this.model = model;
    this.baseUrl = baseUrl;
    // Try multiple sources for API key
    this.apiKey =
      apiKey ||
      process.env.EXPO_PUBLIC_GROQ_API_KEY ||
      process.env.GROQ_API_KEY;

    // Get recommendation count from environment variable
    this.recommendationCount = Number.parseInt(
      process.env.EXPO_PUBLIC_AI_RECOMMENDATION_COUNT || "3",
      10,
    );

    // Detect provider based on URL
    if (baseUrl.includes("groq.com")) {
      this.provider = "groq";
    } else if (baseUrl.includes("openai.com")) {
      this.provider = "openai";
    } else {
      this.provider = "ollama";
    }

    // Production-safe logging for configuration
    Logger.log("AI Engine Initialized", {
      provider: this.provider,
      hasBaseUrl: !!this.baseUrl,
      hasApiKey: !!this.apiKey,
      model: this.model,
      recommendationCount: this.recommendationCount,
    });

    // Try HTTPS fallback for React Native security
    if (
      this.baseUrl.startsWith("http://") &&
      typeof globalThis.window !== "undefined" &&
      globalThis.window.location?.protocol === "https:"
    ) {
      if (__DEV__) {
        console.log("🤖 Switching to HTTPS for React Native compatibility");
      }
      this.baseUrl = this.baseUrl.replace("http://", "https://");
      // Note: This would require setting up HTTPS proxy for Ollama in production
    }
  }

  static getInstance(): AIDiscoveryEngine {
    if (!AIDiscoveryEngine.instance) {
      AIDiscoveryEngine.instance = new AIDiscoveryEngine();
    }
    return AIDiscoveryEngine.instance;
  }

  // Extract user preferences from existing shows
  async analyzeUserPreferences(shows: Show[]): Promise<{
    genres: string[];
    themes: string[];
    averageRating: number;
    preferences: string[];
  }> {
    if (shows.length === 0) {
      return {
        genres: ["drama", "comedy"],
        themes: ["character-driven", "story-focused"],
        averageRating: 7.5,
        preferences: ["popular series", "well-reviewed"],
      };
    }

    const genres = this.extractGenres(shows);
    const themes = await this.extractThemes(shows);
    const averageRating = this.calculateAverageRating(shows);
    const preferences = this.generatePreferences(genres, themes, averageRating);

    return { genres, themes, averageRating, preferences };
  }

  // Get personalized recommendations based on user's existing shows
  public async getPersonalizedRecommendations(
    shows: Show[],
    count?: number,
  ): Promise<AIRecommendation[]> {
    try {
      Logger.log("Getting personalized recommendations", {
        showCount: shows.length,
        requestedCount: count || this.recommendationCount,
      });

      const preferences = await this.analyzeUserPreferences(shows);
      const prompt = this.buildPersonalizationPrompt(preferences, shows);

      const response = await this.callAI(prompt);
      return await this.enrichRecommendationsWithOMDB(response, "similar");
    } catch (error) {
      Logger.error("Personalized recommendations failed", error);
      if (__DEV__) {
        console.error("AI recommendations failed, using fallback:", error);
      }
      return this.getFallbackRecommendations("similar");
    }
  }

  // Get trending shows with AI insights
  public async getTrendingShows(): Promise<AIRecommendation[]> {
    try {
      const promptTemplate: AIPromptTemplate = {
        context: `Suggest ${this.recommendationCount} currently trending TV series that are popular and critically acclaimed.`,
        count: this.recommendationCount,
        additionalInstructions:
          "Focus on shows from 2020-2024 with high ratings and cultural impact",
      };

      const response = await this.callAI(generateAIPrompt(promptTemplate));
      return await this.enrichRecommendationsWithOMDB(response, "trending");
    } catch (error) {
      if (__DEV__) {
        console.error("Trending recommendations failed:", error);
      }
      return this.getFallbackTrending();
    }
  }

  // Get mood-based recommendations
  async getMoodBasedRecommendations(
    mood: string,
    count?: number,
  ): Promise<AIRecommendation[]> {
    try {
      const promptTemplate: AIPromptTemplate = {
        context: `Suggest ${count || this.recommendationCount} TV series that are perfect for viewers in the mood for "${mood}".`,
        count: count || this.recommendationCount,
        additionalInstructions: `Focus on shows that match the ${mood} mood and atmosphere`,
      };

      const response = await this.callAI(generateAIPrompt(promptTemplate));
      return await this.enrichRecommendationsWithOMDB(response, "mood_based");
    } catch (error) {
      if (__DEV__) {
        console.error("Mood-based recommendations failed:", error);
      }
      return this.getFallbackRecommendations("mood_based");
    }
  }

  // Call AI model (supports multiple providers)
  public async callAI(prompt: string): Promise<string> {
    try {
      Logger.log("AI Request Started", {
        provider: this.provider,
        hasBaseUrl: !!this.baseUrl,
        hasApiKey: !!this.apiKey,
        promptLength: prompt.length,
      });

      this.logAIRequest(prompt);

      const { requestBody, endpoint } = this.buildRequestBody(prompt);

      Logger.log("Making API Request", { endpoint });

      const response = await this.makeAPIRequest(endpoint, requestBody);

      return this.handleResponse(response);
    } catch (error) {
      Logger.error("AI Call Failed", error);
      return this.handleError(error);
    }
  }

  private logAIRequest(prompt: string): void {
    if (__DEV__) {
      console.log("🤖 AI Request:", {
        provider: this.provider,
        baseUrl: this.baseUrl,
        model: this.model,
        promptLength: prompt.length,
        promptPreview: prompt.substring(0, 100) + "...",
      });
    }
  }

  private buildRequestBody(prompt: string): {
    requestBody: any;
    endpoint: string;
  } {
    if (cloudProviders.has(this.provider)) {
      return {
        requestBody: this.buildCloudProviderRequest(prompt),
        endpoint: this.baseUrl,
      };
    } else {
      return {
        requestBody: this.buildOllamaRequest(prompt),
        endpoint: `${this.baseUrl}/api/generate`,
      };
    }
  }

  private buildCloudProviderRequest(prompt: string): any {
    return {
      model: this.provider === "groq" ? "llama-3.1-8b-instant" : this.model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    };
  }

  private buildOllamaRequest(prompt: string): any {
    return {
      model: this.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        max_tokens: 1000,
      },
    };
  }

  private async makeAPIRequest(
    endpoint: string,
    requestBody: any,
  ): Promise<Response> {
    if (__DEV__) {
      console.log("🤖 Request Body:", JSON.stringify(requestBody, null, 2));
    }

    const headers = this.buildHeaders();

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      await this.handleAPIError(response);
    }

    return response;
  }

  private buildHeaders(): Record<string, string> {
    const baseHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (cloudProviders.has(this.provider)) {
      return {
        ...baseHeaders,
        Authorization: `Bearer ${this.apiKey}`,
      };
    }

    return baseHeaders;
  }

  private async handleAPIError(response: Response): Promise<never> {
    const errorText = await response.text();

    const errorInfo = {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      url: response.url,
    };

    Logger.error("AI API Error", errorInfo);

    if (__DEV__) {
      console.error("🤖 AI Response Error:", errorInfo);
    }
    throw new Error(
      `AI service error: ${response.status} ${response.statusText}`,
    );
  }

  private async handleResponse(response: Response): Promise<string> {
    const data = await response.json();
    if (__DEV__) {
      console.log("🤖 AI Response Data:===========");
      console.log(data);
      console.log("=================================");
    }

    const responseText = this.extractResponseText(data);

    if (!responseText) {
      throw new Error("Invalid AI response format");
    }

    return responseText;
  }

  private extractResponseText(data: any): string {
    if (this.provider === "groq" || this.provider === "openai") {
      return data.choices?.[0]?.message?.content || "";
    }
    return data.response || "";
  }

  private handleError(error: unknown): string {
    if (__DEV__) {
      console.error("🤖 AI Call Failed:", error);
    }

    if (error instanceof Error) {
      throw this.mapErrorToUserMessage(error);
    }

    throw error;
  }

  private mapErrorToUserMessage(error: Error): Error {
    if (error.name === "AbortError") {
      return new Error(
        "AI request timed out. Please check your connection and try again.",
      );
    }

    if (error.message.includes("Network request failed")) {
      return new Error(
        `Cannot connect to AI service at ${this.baseUrl}. Please check:\n1. Your API key is valid\n2. You have internet connection\n3. The service is available`,
      );
    }

    return error;
  }

  // Enrich AI recommendations with OMDB data
  private async enrichRecommendationsWithOMDB(
    aiResponse: string,
    category: AIRecommendation["category"],
  ): Promise<AIRecommendation[]> {
    try {
      // Try to parse as JSON first
      const jsonMatch = new RegExp(/\[[\s\S]*\]/).exec(aiResponse);
      if (!jsonMatch) {
        throw new Error("No JSON array found in AI response");
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (__DEV__) {
        console.log("🤖 Parsed AI Recommendations:===========");
        console.log(parsed);
        console.log("=================================");
      }

      // Limit recommendations to the configured count
      const limitedRecommendations = parsed.slice(0, this.recommendationCount);

      // Enrich each recommendation with OMDB data
      const enrichedRecommendations = await Promise.all(
        limitedRecommendations.map(async (item: any) => {
          try {
            // Try to get OMDB data using imdbId if available, otherwise by title
            let omdbData;
            if (item.imdbId) {
              omdbData = await omdbGetTitle(item.imdbId);
            } else if (item.title && item.year) {
              // Try to find by title and year
              const searchResult = await omdbGetTitle(
                `${item.title} ${item.year}`,
              );
              omdbData = searchResult;
            }

            let showData;
            if (omdbData) {
              // Use normalized OMDB data
              const normalizedShow = normalizeOmdbShow(omdbData);
              showData = {
                Title: normalizedShow.title,
                Year: normalizedShow.releaseYear?.toString(),
                imdbID: normalizedShow.imdbId,
                Type: "series",
                Poster: normalizedShow.thumbnail || "",
              };
            } else {
              // Fallback to AI-provided data
              showData = {
                Title: item.title,
                Year: item.year?.toString(),
                imdbID: item.imdbId || "",
                Type: "series",
                Poster: item.posterUrl || "",
              };
            }

            const recommendation = {
              show: showData,
              reason: item.reason || "Recommended based on your preferences",
              confidence: item.confidence || 0.8,
              category,
            };

            if (__DEV__) {
              console.log("🤖 Enriched recommendation:===========");
              console.log(recommendation);
              console.log("=================================");
            }
            return recommendation;
          } catch (error) {
            if (__DEV__) {
              console.error("🤖 Failed to enrich recommendation:", error);
            }
            // Fallback to basic recommendation
            return {
              show: {
                Title: item.title,
                Year: item.year?.toString(),
                imdbID: item.imdbId || "",
                Type: "series",
                Poster: item.posterUrl || "",
              },
              reason: item.reason || "Recommended based on your preferences",
              confidence: item.confidence || 0.8,
              category,
            };
          }
        }),
      );

      return enrichedRecommendations;
    } catch (error) {
      if (__DEV__) {
        console.error("🤖 Failed to parse AI response as JSON:", error);
        console.log("🤖 Raw AI Response:", aiResponse);
      }
      return [];
    }
  }
  private extractGenres(shows: Show[]): string[] {
    const allGenres = shows.flatMap((show) => show.genres || []);
    const genreCount = allGenres.reduce(
      (acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre]) => genre);
  }

  private async extractThemes(shows: Show[]): Promise<string[]> {
    // Simple theme extraction based on titles and plots
    const themes = new Set<string>();
    const themesKeywords = [
      "mystery",
      "sci-fi",
      "science fiction",
      "comedy",
      "drama",
      "action",
      "thriller",
    ];
    shows.forEach((show) => {
      const lowerCasePlot = show.plot?.toLowerCase();

      themesKeywords.forEach((keyword) => {
        if (lowerCasePlot?.includes(keyword)) {
          themes.add(keyword);
        }
      });
    });

    return Array.from(themes).slice(0, 3);
  }

  private calculateAverageRating(shows: Show[]): number {
    const ratings = shows
      .map((show) => show.rating)
      .filter((rating): rating is number => rating !== undefined);

    if (ratings.length === 0) {
      return 7.5;
    }
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }

  private generatePreferences(
    genres: string[],
    themes: string[],
    avgRating: number,
  ): string[] {
    const prefs = [`genres: ${genres.join(", ")}`];
    if (themes.length > 0) {
      prefs.push(`themes: ${themes.join(", ")}`);
    }
    if (avgRating > 0) {
      prefs.push(`average rating preference: ${avgRating.toFixed(1)}+`);
    }
    return prefs;
  }

  private buildPersonalizationPrompt(preferences: any, shows: Show[]): string {
    const showTitles = shows
      .slice(0, 5)
      .map((s) => s.title)
      .join(", ");

    const promptTemplate: AIPromptTemplate = {
      context: `Based on these shows the user likes: ${showTitles}

      User preferences:
      - ${preferences.preferences.join("\n- ")}

      Suggest ${this.recommendationCount} similar TV series they would enjoy.`,
      count: this.recommendationCount,
      additionalInstructions:
        "For each show, explain why they would like it based on their preferences",
    };

    return generateAIPrompt(promptTemplate);
  }

  // Fallback recommendations when AI fails
  private getFallbackRecommendations(
    category: AIRecommendation["category"],
  ): AIRecommendation[] {
    const fallbackShows = [
      {
        title: "Breaking Bad",
        year: "2008",
        imdbId: "tt0903747",
        poster:
          "https://m.media-amazon.com/images/M/MV5BYmJhNzdiYzctZmZlOS00ZjMzLTg5YzYtZmI0ZjMxZjU1YzUyXkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        title: "Stranger Things",
        year: "2016",
        imdbId: "tt4574334",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZjM4ZjM1N2UtZjU1ZS00NzY0LWIxYjItZjUxMzUyZjMxZjM1XkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        title: "The Mandalorian",
        year: "2019",
        imdbId: "tt8111088",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZjM4ZjM1N2UtZjU1ZS00NzY0LWIxYjItZjUxMzUyZjMxZjM1XkEyXkFqcGc@._V1_SX300.jpg",
      },
      {
        title: "Prison Break",
        year: "2005",
        imdbId: "tt0455277",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZjM4ZjM1N2UtZjU1ZS00NzY0LWIxYjItZjUxMzUyZjMxZjM1XkEyXkFqcGc@._V1_SX300.jpg",
      },
    ];

    return fallbackShows.map((show, index) => ({
      show: {
        Title: show.title,
        Year: show.year,
        imdbID: show.imdbId,
        Type: "series",
        Poster: "",
      },
      reason: "Popular and critically acclaimed series",
      confidence: 0.7 - index * 0.1,
      category,
    }));
  }

  private getFallbackTrending(): AIRecommendation[] {
    return this.getFallbackRecommendations("trending");
  }
}

// Export singleton instance with lazy initialization
export const aiDiscovery = (() => {
  try {
    return AIDiscoveryEngine.getInstance();
  } catch (error) {
    console.warn('Failed to initialize AI Discovery Engine:', error);
    return null as any;
  }
})();

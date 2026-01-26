// Simple production-safe logging utility
export class Logger {
  private static get DEBUG_MODE(): boolean {
    try {
      return process?.env?.EXPO_PUBLIC_DEBUG_AI === "true"
    } catch {
      return false
    }
  }

  static log(message: string, data?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.log(`[AI] ${message}`, data || "")
    }
  }

  static error(message: string, error?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.error(`[AI] ${message}`, error || "")
    }
  }

  static warn(message: string, data?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.warn(`[AI] ${message}`, data || "")
    }
  }
}

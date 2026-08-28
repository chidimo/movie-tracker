// Simple production-safe logging utility
export class Logger {
  private static readonly DEBUG_MODE =
    process.env.EXPO_PUBLIC_DEBUG_AI === 'true'

  static log(message: string, data?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.log(`[AI] ${message}`, data || '')
    }
  }

  static error(message: string, error?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.error(`[AI] ${message}`, error || '')
    }
  }

  static warn(message: string, data?: any) {
    if ((typeof __DEV__ !== 'undefined' && __DEV__) || Logger.DEBUG_MODE) {
      console.warn(`[AI] ${message}`, data || '')
    }
  }
}

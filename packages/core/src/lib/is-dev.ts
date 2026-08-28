/**
 * True in development builds.
 *
 * React Native / Expo define a global `__DEV__`; Node and the web bundlers do
 * not. Reading it through `globalThis` (rather than a global `declare`) keeps
 * core's source type-checkable from any consuming project without clashing with
 * the `declare const __DEV__` that RN/Expo already ship.
 */
export function isDev(): boolean {
  const g = globalThis as { __DEV__?: boolean }
  if (typeof g.__DEV__ === 'boolean') return g.__DEV__
  try {
    return process.env.NODE_ENV !== 'production'
  } catch {
    return true
  }
}

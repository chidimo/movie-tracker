/* eslint-disable */
import * as Router from 'expo-router'

export * from 'expo-router'

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams:
        | {
            pathname: Router.RelativePathString
            params?: Router.UnknownInputParams
          }
        | {
            pathname: Router.ExternalPathString
            params?: Router.UnknownInputParams
          }
        | { pathname: `/export`; params?: Router.UnknownInputParams }
        | { pathname: `/import`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | { pathname: `/search`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(tabs)'}/explore` | `/explore`
            params?: Router.UnknownInputParams
          }
        | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(tabs)'}/settings` | `/settings`
            params?: Router.UnknownInputParams
          }
        | {
            pathname: `/preview/[imdbId]`
            params: Router.UnknownInputParams & { imdbId: string | number }
          }
        | {
            pathname: `/show/[imdbId]`
            params: Router.UnknownInputParams & { imdbId: string | number }
          }
      hrefOutputParams:
        | {
            pathname: Router.RelativePathString
            params?: Router.UnknownOutputParams
          }
        | {
            pathname: Router.ExternalPathString
            params?: Router.UnknownOutputParams
          }
        | { pathname: `/export`; params?: Router.UnknownOutputParams }
        | { pathname: `/import`; params?: Router.UnknownOutputParams }
        | { pathname: `/modal`; params?: Router.UnknownOutputParams }
        | { pathname: `/search`; params?: Router.UnknownOutputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
        | {
            pathname: `${'/(tabs)'}/explore` | `/explore`
            params?: Router.UnknownOutputParams
          }
        | {
            pathname: `${'/(tabs)'}` | `/`
            params?: Router.UnknownOutputParams
          }
        | {
            pathname: `${'/(tabs)'}/settings` | `/settings`
            params?: Router.UnknownOutputParams
          }
        | {
            pathname: `/preview/[imdbId]`
            params: Router.UnknownOutputParams & { imdbId: string }
          }
        | {
            pathname: `/show/[imdbId]`
            params: Router.UnknownOutputParams & { imdbId: string }
          }
      href:
        | Router.RelativePathString
        | Router.ExternalPathString
        | `/export${`?${string}` | `#${string}` | ''}`
        | `/import${`?${string}` | `#${string}` | ''}`
        | `/modal${`?${string}` | `#${string}` | ''}`
        | `/search${`?${string}` | `#${string}` | ''}`
        | `/_sitemap${`?${string}` | `#${string}` | ''}`
        | `${'/(tabs)'}/explore${`?${string}` | `#${string}` | ''}`
        | `/explore${`?${string}` | `#${string}` | ''}`
        | `${'/(tabs)'}${`?${string}` | `#${string}` | ''}`
        | `/${`?${string}` | `#${string}` | ''}`
        | `${'/(tabs)'}/settings${`?${string}` | `#${string}` | ''}`
        | `/settings${`?${string}` | `#${string}` | ''}`
        | {
            pathname: Router.RelativePathString
            params?: Router.UnknownInputParams
          }
        | {
            pathname: Router.ExternalPathString
            params?: Router.UnknownInputParams
          }
        | { pathname: `/export`; params?: Router.UnknownInputParams }
        | { pathname: `/import`; params?: Router.UnknownInputParams }
        | { pathname: `/modal`; params?: Router.UnknownInputParams }
        | { pathname: `/search`; params?: Router.UnknownInputParams }
        | { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(tabs)'}/explore` | `/explore`
            params?: Router.UnknownInputParams
          }
        | { pathname: `${'/(tabs)'}` | `/`; params?: Router.UnknownInputParams }
        | {
            pathname: `${'/(tabs)'}/settings` | `/settings`
            params?: Router.UnknownInputParams
          }
        | `/preview/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ''}`
        | `/show/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ''}`
        | {
            pathname: `/preview/[imdbId]`
            params: Router.UnknownInputParams & { imdbId: string | number }
          }
        | {
            pathname: `/show/[imdbId]`
            params: Router.UnknownInputParams & { imdbId: string | number }
          }
    }
  }
}

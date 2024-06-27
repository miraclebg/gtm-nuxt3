
import type { ModuleOptions } from './module.js'


declare module '@nuxt/schema' {
  interface NuxtConfig { ['gtag']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['gtag']?: ModuleOptions }
}

declare module 'nuxt/schema' {
  interface NuxtConfig { ['gtag']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['gtag']?: ModuleOptions }
}


export type { ModuleOptions, default } from './module.js'

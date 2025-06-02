declare module 'vue-seo' {
  interface SeoConfig {
    title?: string
    description?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    ogUrl?: string
    twitterCard?: string
    twitterTitle?: string
    twitterDescription?: string
    twitterImage?: string
    twitterSite?: string
    twitterCreator?: string
    canonical?: string
  }

  export function createSeoMeta(config: SeoConfig): any
} 
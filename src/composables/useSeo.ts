import { ref, watch, computed } from 'vue'
import { useHead } from '@vueuse/head'

export interface SeoConfig {
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

export const defaultSeoConfig: SeoConfig = {
  title: 'Free PPTX & Audio Compressor - Reduce File Size Online | ByteSlim',
  description: 'Free online PPTX and audio compressor tools. Reduce PowerPoint and audio file sizes while maintaining quality. Fast, secure, and easy to use. No registration required.',
  keywords: 'PPTX compressor, audio compressor, PowerPoint compression, audio compression, file compression, online compressor, reduce PPTX size, compress PowerPoint, compress audio, MP3 compression, WAV compression, M4A compression, free compression tools, ByteSlim',
  ogTitle: 'Free PPTX & Audio Compressor - Reduce File Size Online',
  ogDescription: 'Free online PPTX and audio compressor tools. Reduce PowerPoint and audio file sizes while maintaining quality. Fast, secure, and easy to use. No registration required.',
  ogImage: 'https://byteslim.com/og-image.jpg',
  ogUrl: 'https://byteslim.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Free PPTX & Audio Compressor - Reduce File Size Online',
  twitterDescription: 'Free online PPTX and audio compressor tools. Reduce PowerPoint and audio file sizes while maintaining quality. Fast, secure, and easy to use. No registration required.',
  twitterImage: 'https://byteslim.com/twitter-image.jpg',
  twitterSite: '@byteslim',
  twitterCreator: '@byteslim',
  canonical: 'https://byteslim.com'
}

export function useSeo(config: SeoConfig = {}) {
  const seoConfig = ref({
    ...defaultSeoConfig,
    ...config
  })

  const updateSeo = (newConfig: SeoConfig) => {
    seoConfig.value = {
      ...defaultSeoConfig,
      ...newConfig
    }
  }

  // Use computed properties to make SEO values reactive
  const headConfig = computed(() => ({
    title: seoConfig.value.title,
    meta: [
      {
        name: 'description',
        content: seoConfig.value.description
      },
      {
        name: 'keywords',
        content: seoConfig.value.keywords
      },
      // Open Graph
      {
        property: 'og:title',
        content: seoConfig.value.ogTitle
      },
      {
        property: 'og:description',
        content: seoConfig.value.ogDescription
      },
      {
        property: 'og:image',
        content: seoConfig.value.ogImage
      },
      {
        property: 'og:url',
        content: seoConfig.value.ogUrl
      },
      // Twitter
      {
        name: 'twitter:card',
        content: seoConfig.value.twitterCard
      },
      {
        name: 'twitter:title',
        content: seoConfig.value.twitterTitle
      },
      {
        name: 'twitter:description',
        content: seoConfig.value.twitterDescription
      },
      {
        name: 'twitter:image',
        content: seoConfig.value.twitterImage
      },
      {
        name: 'twitter:site',
        content: seoConfig.value.twitterSite
      },
      {
        name: 'twitter:creator',
        content: seoConfig.value.twitterCreator
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: seoConfig.value.canonical
      }
    ]
  }))

  // Use the reactive computed value for useHead
  useHead(headConfig)

  return {
    seoConfig,
    updateSeo
  }
} 
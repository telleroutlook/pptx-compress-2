import { createSeoMeta } from 'vue-seo'

export const defaultSeoConfig = {
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

export const createSeoMetaTags = (config = {}) => {
  return createSeoMeta({
    ...defaultSeoConfig,
    ...config
  })
} 
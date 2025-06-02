import { defaultSeoConfig } from '../composables/useSeo'

export const routeSeoConfig = {
  home: {
    ...defaultSeoConfig,
    title: 'Free PPTX Compressor - Reduce PowerPoint File Size Online | ByteSlim',
    description: 'Free online PPTX compressor tool. Reduce PowerPoint file sizes while maintaining quality. Fast, secure, and easy to use. No registration required.',
    ogTitle: 'Free PPTX Compressor - Reduce PowerPoint File Size Online',
    ogDescription: 'Free online PPTX compressor tool. Reduce PowerPoint file sizes while maintaining quality. Fast, secure, and easy to use.',
    canonical: 'https://byteslim.com'
  },
  audio: {
    ...defaultSeoConfig,
    title: 'Free Audio Compressor - Reduce MP3, WAV, M4A File Size Online | ByteSlim',
    description: 'Free online audio compressor tool. Reduce MP3, WAV, and M4A file sizes while maintaining quality. Fast, secure, and easy to use. No registration required.',
    ogTitle: 'Free Audio Compressor - Reduce MP3, WAV, M4A File Size Online',
    ogDescription: 'Free online audio compressor tool. Reduce MP3, WAV, and M4A file sizes while maintaining quality. Fast, secure, and easy to use.',
    canonical: 'https://byteslim.com/audio'
  },
  faq: {
    ...defaultSeoConfig,
    title: 'FAQ - ByteSlim File Compression Tools',
    description: 'Frequently asked questions about ByteSlim file compression tools. Learn about PPTX compression, audio compression, and more.',
    ogTitle: 'FAQ - ByteSlim File Compression Tools',
    ogDescription: 'Frequently asked questions about ByteSlim file compression tools. Learn about PPTX compression, audio compression, and more.',
    canonical: 'https://byteslim.com/faq'
  },
  about: {
    ...defaultSeoConfig,
    title: 'About ByteSlim - Free Online File Compression Tools',
    description: 'Learn about ByteSlim, providing free online file compression tools for PPTX and audio files. Our mission is to make file compression easy and accessible.',
    ogTitle: 'About ByteSlim - Free Online File Compression Tools',
    ogDescription: 'Learn about ByteSlim, providing free online file compression tools for PPTX and audio files. Our mission is to make file compression easy and accessible.',
    canonical: 'https://byteslim.com/about'
  },
  projects: {
    ...defaultSeoConfig,
    title: 'ByteSlim Projects - Free Online Tools',
    description: 'Explore ByteSlim projects and free online tools. Discover our range of file compression and optimization tools.',
    ogTitle: 'ByteSlim Projects - Free Online Tools',
    ogDescription: 'Explore ByteSlim projects and free online tools. Discover our range of file compression and optimization tools.',
    canonical: 'https://byteslim.com/projects'
  }
} 
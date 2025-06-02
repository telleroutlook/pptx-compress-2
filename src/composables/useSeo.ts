import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const defaultSeoConfig = {
  title: 'ByteSlim - PPTX Compress',
  description: 'Free online tool to compress PowerPoint files while maintaining quality.',
  keywords: 'PPTX compress, PowerPoint compression, reduce PPTX size',
  ogType: 'website',
  ogImage: 'https://byteslim.com/og-image.jpg'
}

export function useSeo() {
  const route = useRoute()
  
  const updateSeo = (options: {
    title?: string
    description?: string
    keywords?: string
    ogImage?: string
  }) => {
    const baseTitle = 'ByteSlim - PPTX Compress'
    const baseDescription = 'Free online tool to compress PowerPoint files while maintaining quality.'
    
    const title = computed(() => 
      options.title ? `${options.title} - ${baseTitle}` : baseTitle
    )
    
    const description = computed(() => 
      options.description || baseDescription
    )
    
    useHead({
      title: title.value,
      meta: [
        {
          name: 'description',
          content: description.value
        },
        {
          name: 'keywords',
          content: options.keywords || 'PPTX compress, PowerPoint compression, reduce PPTX size'
        },
        {
          property: 'og:title',
          content: title.value
        },
        {
          property: 'og:description',
          content: description.value
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:url',
          content: `https://byteslim.com${route.path}`
        },
        ...(options.ogImage ? [{
          property: 'og:image',
          content: options.ogImage
        }] : [])
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://byteslim.com${route.path}`
        }
      ]
    })
  }
  
  return {
    updateSeo
  }
} 
import { useHead } from '@vueuse/head'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useStructuredData() {
  const route = useRoute()

  const generateWebApplicationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ByteSlim',
    description: 'Free online tool to compress PowerPoint files while maintaining quality.',
    url: 'https://byteslim.com',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250'
    }
  })

  const generateBreadcrumbSchema = () => {
    const pathSegments = route.path.split('/').filter(Boolean)
    const breadcrumbItems = pathSegments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `https://byteslim.com/${pathSegments.slice(0, index + 1).join('/')}`,
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      }
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 0,
          item: {
            '@id': 'https://byteslim.com',
            name: 'Home'
          }
        },
        ...breadcrumbItems
      ]
    }
  }

  const generatePageSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'ByteSlim - PPTX Compress',
      description: 'Free online tool to compress PowerPoint files while maintaining quality.',
      url: `https://byteslim.com${route.path}`,
      publisher: {
        '@type': 'Organization',
        name: 'ByteSlim',
        logo: {
          '@type': 'ImageObject',
          url: 'https://byteslim.com/byteslim_512.png'
        }
      }
    }

    // Add specific schema based on route
    if (route.path === '/') {
      return {
        ...baseSchema,
        '@type': 'WebSite',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://byteslim.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    }

    if (route.path === '/pptx-compressor') {
      return {
        ...baseSchema,
        '@type': 'SoftwareApplication',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        }
      }
    }

    return baseSchema
  }

  const updateStructuredData = () => {
    const schemas = [
      generateWebApplicationSchema(),
      generateBreadcrumbSchema(),
      generatePageSchema()
    ]

    useHead({
      script: schemas.map(schema => ({
        type: 'application/ld+json',
        children: JSON.stringify(schema)
      }))
    })
  }

  return {
    updateStructuredData
  }
} 
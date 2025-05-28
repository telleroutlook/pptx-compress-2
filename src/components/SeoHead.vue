<template>
  <div>
    <component :is="'script'" type="application/ld+json">
      {{ JSON.stringify(structuredData) }}
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  title: string;
  description: string;
  image?: string;
  type?: string;
}>();

const route = useRoute();
const baseUrl = 'https://byteslim.com';

const structuredData = computed(() => {
  const currentUrl = `${baseUrl}${route.path}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': props.type || 'WebPage',
    name: props.title,
    description: props.description,
    url: currentUrl,
    image: props.image || `${baseUrl}/og-image.jpg`,
    publisher: {
      '@type': 'Organization',
      name: 'ByteSlim',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/byteslim_512.png`
      }
    }
  };
});

// Update document head
const updateMetaTags = () => {
  // Update title
  document.title = `${props.title} | ByteSlim`;

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', props.description);

  // Update Open Graph tags
  const ogTags = {
    'og:title': props.title,
    'og:description': props.description,
    'og:url': `${baseUrl}${route.path}`,
    'og:image': props.image || `${baseUrl}/og-image.jpg`,
    'og:type': props.type || 'website'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // Update Twitter Card tags
  const twitterTags = {
    'twitter:title': props.title,
    'twitter:description': props.description,
    'twitter:image': props.image || `${baseUrl}/og-image.jpg`,
    'twitter:card': 'summary_large_image'
  };

  Object.entries(twitterTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
};

// Update meta tags when component is mounted
updateMetaTags();
</script> 
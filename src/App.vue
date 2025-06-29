<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <img src="/byteslim_512.png" alt="ByteSlim Logo" class="h-8 w-8 mr-2">
              <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ByteSlim.com</span>
            </router-link>
          </div>
          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-1">
            <router-link 
              v-for="item in menuItems" 
              :key="item.path"
              :to="item.path" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === item.path }"
            >
              <span class="flex items-center">
                <span class="w-5 h-5 mr-2 text-lg">{{ item.icon }}</span>
                {{ item.name }}
              </span>
              <div v-if="$route.path === item.path" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            </router-link>
          </div>
          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button 
              @click="toggleMenu" 
              class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-2"
              aria-label="Toggle menu"
            >
              <svg 
                class="h-6 w-6 transition-transform duration-200" 
                :class="{ 'rotate-90': isMenuOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  v-if="!isMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile Menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div 
            v-show="isMenuOpen" 
            class="md:hidden fixed inset-x-0 top-16 bg-white shadow-lg z-50"
            @click="closeMenu"
          >
            <div class="px-4 py-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <router-link 
                v-for="item in menuItems" 
                :key="item.path"
                :to="item.path" 
                class="mobile-nav-link"
                @click="closeMenu"
              >
                <span class="flex items-center">
                  <span class="w-5 h-5 mr-2 text-lg">{{ item.icon }}</span>
                  {{ item.name }}
                </span>
              </router-link>
            </div>
          </div>
        </transition>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from './composables/useSeo'
import { useStructuredData } from './composables/useStructuredData'
import { useHead } from '@vueuse/head'

const route = useRoute()
const { updateSeo } = useSeo()
const { updateStructuredData } = useStructuredData()
const isMenuOpen = ref(false)

const menuItems = [
  {
    name: 'PPT Compression',
    path: '/',
    icon: '📄'
  },
  {
    name: 'Audio Compression',
    path: '/audio',
    icon: '🎵'
  },
  {
    name: 'Our Projects',
    path: '/projects',
    icon: '📁'
  },
  {
    name: 'FAQ',
    path: '/faq',
    icon: '❓'
  },
  {
    name: 'About',
    path: '/about',
    icon: 'ℹ️'
  }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Update SEO and structured data when route changes
watch(
  () => route.path,
  () => {
    closeMenu()
    updateStructuredData()
  },
  { immediate: true }
)

// 监听路由变化，更新 SEO 信息
watch(
  () => route.meta.seo,
  (seo) => {
    if (seo) {
      updateSeo(seo)
    }
  },
  { immediate: true }
)

useHead({
  title: 'ByteSlim - PPTX Compress - Compress PowerPoint Files Online',
  meta: [
    {
      name: 'description',
      content: 'Free online tool to compress PowerPoint files while maintaining quality. Reduce PPTX file size easily and quickly.'
    },
    {
      name: 'keywords',
      content: 'PPTX compress, PowerPoint compression, reduce PPTX size, online PPTX compressor'
    },
    {
      property: 'og:title',
      content: 'ByteSlim - PPTX Compress - Compress PowerPoint Files Online'
    },
    {
      property: 'og:description',
      content: 'Free online tool to compress PowerPoint files while maintaining quality. Reduce PPTX file size easily and quickly.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://byteslim.com'
    }
  ]
})
</script>

<style scoped>
.router-link-active {
  color: var(--color-primary);
  font-weight: 600;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200;
}

.router-link-active {
  @apply text-primary bg-gray-50;
}
</style>
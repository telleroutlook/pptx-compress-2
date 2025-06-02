<template>
  <nav class="bg-white shadow-sm relative">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="/byteslim_512.png" alt="ByteSlim Logo" class="h-8 w-8 mr-2">
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ByteSlim</span>
          </router-link>
        </div>
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">PPTX Compress</router-link>
          <router-link to="/audio" class="nav-link">Audio Compress</router-link>
          <router-link to="/projects" class="nav-link">Our Projects</router-link>
          <router-link to="/faq" class="nav-link">FAQ</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>
        <!-- Mobile Menu Button -->
        <div class="md:hidden">
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
                <component :is="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </span>
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMenuOpen = ref(false);

const menuItems = [
  {
    name: 'PPTX Compress',
    path: '/',
    icon: 'DocumentIcon'
  },
  {
    name: 'Audio Compress',
    path: '/audio',
    icon: 'MusicIcon'
  },
  {
    name: 'Our Projects',
    path: '/projects',
    icon: 'FolderIcon'
  },
  {
    name: 'FAQ',
    path: '/faq',
    icon: 'QuestionMarkCircleIcon'
  },
  {
    name: 'About',
    path: '/about',
    icon: 'InformationCircleIcon'
  }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Close menu when route changes
watch(() => route.path, () => {
  closeMenu();
});
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary transition-colors duration-200 relative;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200;
}

.nav-link:hover::after,
.router-link-active::after {
  @apply w-full;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200;
}

.router-link-active {
  @apply text-primary bg-gray-50;
}
</style> 
<template>
  <nav class="bg-white shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="/byteslim_512.png" alt="ByteSlim Logo" class="h-8 w-8 mr-2">
            <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ByteSlim</span>
          </router-link>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">PPTX Compress</router-link>
          <router-link to="/audio" class="nav-link">Audio Compress</router-link>
          <router-link to="/projects" class="nav-link">Our Projects</router-link>
          <router-link to="/faq" class="nav-link">FAQ</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
        </div>
        <div class="md:hidden">
          <button @click="isMenuOpen = !isMenuOpen" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-show="isMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link to="/" class="mobile-nav-link">PPTX Compress</router-link>
          <router-link to="/audio" class="mobile-nav-link">Audio Compress</router-link>
          <router-link to="/projects" class="mobile-nav-link">Our Projects</router-link>
          <router-link to="/faq" class="mobile-nav-link">FAQ</router-link>
          <router-link to="/about" class="mobile-nav-link">About</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);
</script>

<style scoped>
.nav-link {
  @apply text-gray-600 hover:text-primary transition-colors duration-200;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50;
}

.router-link-active {
  @apply text-primary;
}
</style> 
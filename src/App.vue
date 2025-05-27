<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex space-x-1">
            <router-link 
              to="/" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === '/' }"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PPT Compression
              </span>
              <div v-if="$route.path === '/'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            </router-link>
            <router-link 
              to="/audio" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === '/audio' }"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
                Audio Compression
              </span>
              <div v-if="$route.path === '/audio'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.router-link-active {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
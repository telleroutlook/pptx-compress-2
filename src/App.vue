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
            <router-link 
              to="/projects" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === '/projects' }"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Our Projects
              </span>
              <div v-if="$route.path === '/projects'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            </router-link>
            <router-link 
              to="/faq" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === '/faq' }"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </span>
              <div v-if="$route.path === '/faq'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            </router-link>
            <router-link 
              to="/about" 
              class="flex items-center px-6 py-2 text-gray-700 hover:text-primary transition-colors duration-200 relative"
              :class="{ 'text-primary font-semibold': $route.path === '/about' }"
            >
              <span class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </span>
              <div v-if="$route.path === '/about'" class="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
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

<style scoped>
.router-link-active {
  color: var(--color-primary);
  font-weight: 600;
}
</style>
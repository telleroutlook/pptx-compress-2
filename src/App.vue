<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
              PPT Compression
            </router-link>
            <router-link to="/audio" class="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
              Audio Compression
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
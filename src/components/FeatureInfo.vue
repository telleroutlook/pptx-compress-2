<template>
  <section class="feature-info">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="feature-card">
        <div class="icon-wrapper">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-primary-dark mb-3">Smart Compression</h3>
        <p class="text-gray-700">Automatically finds and compresses all images in your PPTX files</p>
      </div>
      <div class="feature-card">
        <div class="icon-wrapper">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-primary-dark mb-3">Quality Control</h3>
        <p class="text-gray-700">Maintain visual quality while achieving maximum compression</p>
      </div>
      <div class="feature-card">
        <div class="icon-wrapper">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-primary-dark mb-3">Fast Processing</h3>
        <p class="text-gray-700">Efficient compression using Web Workers</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-info {
  @apply bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 mb-8 border-2;
  background-color: rgba(102, 126, 234, 0.05);
  border-color: rgba(102, 126, 234, 0.2);
}

.feature-card {
  @apply bg-white rounded-xl p-6 text-center transform transition-all duration-300
         hover:scale-105 hover:shadow-lg;
  background-color: rgba(255, 255, 255, 0.8);
}

.icon-wrapper {
  @apply w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary
         flex items-center justify-center text-white;
}

h3 {
  @apply text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent;
}

p {
  @apply text-gray-700 leading-relaxed;
}
</style>
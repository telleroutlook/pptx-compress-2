<template>
  <div class="container">
    <SeoHead
      title="Our Projects - Innovative Web Tools and Solutions"
      description="Explore our collection of innovative web tools and solutions, including our advanced Markdown editor with math formula and chart support."
      type="CollectionPage"
    />
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Our Projects</h1>
      <p class="subtitle">Discover our innovative web tools and solutions</p>
    </header>

    <div class="max-w-4xl mx-auto">
      <div class="grid gap-8">
        <!-- Markdown Editor Project -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-800">Markdown Editor</h2>
              <a 
                href="https://mdeditor.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
              >
                <span>Visit Project</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
            <p class="text-gray-600 mb-4">
              A powerful online Markdown editor that supports various Markdown formats, mathematical formulas, and interactive charts. Perfect for technical documentation, academic writing, and content creation.
            </p>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Key Features</h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Rich Markdown Support
                  </li>
                  <li class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Math Formula Rendering
                  </li>
                  <li class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Interactive Charts
                  </li>
                  <li class="flex items-center text-gray-600">
                    <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Real-time Preview
                  </li>
                </ul>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Technologies</h3>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Next.js</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">React</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">TypeScript</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Tailwind CSS</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">ByteMD</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">CodeMirror</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">KaTeX</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Mermaid</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Radix UI</span>
                  <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Zustand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Placeholder for Future Projects -->
        <div class="bg-gray-50 rounded-xl p-6 text-center">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">More Projects Coming Soon</h3>
          <p class="text-gray-600">
            We're constantly working on new tools and solutions. Stay tuned for more innovative projects!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SeoHead from '../components/SeoHead.vue';
</script>

<style scoped>
.subtitle {
  @apply text-gray-600 text-lg;
}
</style> 
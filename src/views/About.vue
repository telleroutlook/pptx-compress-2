<template>
  <div class="container">
    <SeoHead
      title="About Us - Your Trusted File Compression Solution"
      description="Learn about our mission to provide fast, secure, and efficient file compression services. We're committed to helping you optimize your PPTX and audio files."
      type="AboutPage"
    />
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">About Us</h1>
      <p class="subtitle">Your trusted partner in file optimization</p>
    </header>

    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
        <p class="text-gray-600 mb-4">
          We are dedicated to providing fast, secure, and efficient file compression solutions. Our goal is to help users optimize their files while maintaining quality, making it easier to share and store important documents and media.
        </p>
        <p class="text-gray-600">
          With our advanced compression algorithms and user-friendly interface, we make file optimization accessible to everyone, from students to professionals.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Privacy Policy</h2>
        <p class="text-gray-600 mb-4">
          Your privacy is our top priority. We process all files locally in your browser, ensuring that your data never leaves your device. We do not store or collect any personal information or file content.
        </p>
        <p class="text-gray-600">
          Our service is completely free to use, with no hidden fees or subscriptions required. We believe in providing transparent and reliable file compression services to all our users.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">Contact Us</h2>
        <p class="text-gray-600 mb-4">
          Have questions or feedback? We'd love to hear from you. Our team is always ready to help and improve our services based on your needs.
        </p>
        <div class="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors duration-200">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a href="mailto:support@byteslim.com" class="text-lg">support@byteslim.com</a>
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
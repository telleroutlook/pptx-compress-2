<template>
  <section v-show="results" ref="resultsSectionRef" class="compression-results-section">
    <div class="mb-10">
      <h3 class="text-2xl font-bold text-white mb-8 text-center">Compression Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="result-card">
          <div class="result-icon">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="result-value">
            {{ formatFileSize(results.originalSize) }}
          </span>
          <span class="result-label">Original Size</span>
        </div>
        <div class="result-card">
          <div class="result-icon">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="result-value">
            {{ formatFileSize(results.compressedSize) }}
          </span>
          <span class="result-label">Final Size</span>
        </div>
        <div class="result-card">
          <div class="result-icon success">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <span class="result-value success">
            {{ ((results.originalSize - results.compressedSize) / results.originalSize * 100).toFixed(1) }}%
          </span>
          <span class="result-label">Space Saved</span>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a
        :href="results.downloadUrl"
        :download="results.fileName"
        class="download-button"
      >
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Download Compressed PPTX
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed, watch, nextTick, ref, onMounted } from 'vue';
import { useCompressorStore } from '../stores/compressor';

const store = useCompressorStore();
const results = computed(() => store.results);
const resultsSectionRef = ref(null);

// Function to handle scrolling
const scrollToResults = async () => {
  if (!results.value) return;
  
  await nextTick();
  
  let attempts = 0;
  const maxAttempts = 10;
  const tryScroll = () => {
    if (resultsSectionRef.value) {
      resultsSectionRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      return;
    }
    
    const sectionElement = document.querySelector('.compression-results-section');
    
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryScroll, 100);
    }
  };
  
  // Start scrolling after a short delay
  setTimeout(tryScroll, 50);
};

// Watch for results changes
watch(results, async (newResults) => {
  if (newResults) {
    await scrollToResults();
  }
});

// Also try to scroll when component is mounted
onMounted(() => {
  if (results.value) {
    scrollToResults();
  }
});

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
</script>

<style scoped>
.compression-results-section {
  @apply bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-xl backdrop-blur-sm border-2;
  background-color: rgba(102, 126, 234, 0.05);
  border-color: rgba(102, 126, 234, 0.2);
}

.result-card {
  @apply bg-white rounded-xl p-6 text-center transform transition-all duration-300
         hover:scale-105 hover:shadow-lg;
  background-color: rgba(255, 255, 255, 0.8);
}

.result-icon {
  @apply w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary
         flex items-center justify-center text-white;
}

.result-icon.success {
  @apply from-green-500 to-green-600;
}

.result-value {
  @apply block text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2;
}

.result-value.success {
  @apply from-green-500 to-green-600;
}

.result-label {
  @apply text-gray-700 text-lg font-medium;
}

.download-button {
  @apply inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary 
         text-white rounded-full font-semibold text-xl transition-all duration-300 
         hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 
         focus:ring-primary focus:ring-offset-2;
  background-color: rgba(102, 126, 234, 0.9);
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.2),
              0 0 0 2px rgba(255, 255, 255, 0.2);
}
</style>
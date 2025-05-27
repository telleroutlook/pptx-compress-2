<template>
  <section v-show="results" ref="resultsSectionRef" class="compression-results-section bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300">
    <div class="mb-10">
      <h3 class="text-2xl font-bold text-gray-800 mb-8 text-center">Compression Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gradient-to-br from-primary-light/10 to-secondary/10 rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <span class="block text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            {{ formatFileSize(results.stats.originalSize) }}
          </span>
          <span class="text-gray-600 text-lg">Original Size</span>
        </div>
        <div class="bg-gradient-to-br from-primary-light/10 to-secondary/10 rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <span class="block text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            {{ formatFileSize(results.stats.compressedSize) }}
          </span>
          <span class="text-gray-600 text-lg">Final Size</span>
        </div>
        <div class="bg-gradient-to-br from-primary-light/10 to-secondary/10 rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <span class="block text-4xl font-bold text-green-600 mb-3">
            {{ results.stats.compressionRatio }}%
          </span>
          <span class="text-gray-600 text-lg">Space Saved</span>
        </div>
      </div>
    </div>

    <div class="text-center">
      <a
        :href="downloadUrl"
        :download="downloadFilename"
        class="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold text-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

const downloadUrl = computed(() => {
  if (!results.value?.compressedFile) return '';
  return URL.createObjectURL(results.value.compressedFile);
});

const downloadFilename = computed(() => {
  if (!results.value?.compressedFile) return '';
  return results.value.compressedFile.name;
});

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
</script>
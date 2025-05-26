<template>
  <section
    ref="uploadSectionRef"
    class="relative border-4 border-dashed border-primary/70 rounded-xl p-12 text-center mb-8 transition-all duration-300 ease-in-out cursor-pointer group hover:border-secondary hover:bg-primary-light/5 hover:shadow-lg"
    :class="{ 'border-secondary bg-primary-light/10 scale-[1.02]': isDragging }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      type="file"
      ref="fileInput"
      accept=".pptx"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      @change="handleFileSelect"
      aria-label="Upload PPTX file"
    >
    <div class="pointer-events-none transform transition-transform duration-300 group-hover:-translate-y-1">
      <div class="text-7xl mb-6 transition-transform duration-300 group-hover:scale-110">📊</div>
      <h2 class="text-3xl font-bold text-gray-800 mb-3">Drop your PPTX file here</h2>
      <p class="text-gray-600 text-lg">or click to select file</p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';
import JSZip from 'jszip';
import { useCompressorStore } from '../stores/compressor';
import { nextTick } from 'vue';

const store = useCompressorStore();
const isDragging = ref(false);
const uploadSectionRef = ref(null);

// Watch for processing state changes
watch(() => store.isProcessing, async (isProcessing) => {
  if (isProcessing) {
    await nextTick();
    
    let attempts = 0;
    const maxAttempts = 10;
    const checkProgressBar = () => {
      const progressBar = document.querySelector('.progress-bar-section');
      
      if (progressBar) {
        progressBar.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkProgressBar, 100);
      }
    };
    
    // Start checking after a short delay
    setTimeout(checkProgressBar, 50);
  }
});

function handleDragOver(e) {
  isDragging.value = true;
}

function handleDragLeave(e) {
  isDragging.value = false;
}

function handleDrop(e) {
  isDragging.value = false;
  const files = Array.from(e.dataTransfer.files).filter(file => 
    file.name.toLowerCase().endsWith('.pptx')
  );
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files).filter(file => 
    file.name.toLowerCase().endsWith('.pptx')
  );
  if (files.length > 0) {
    processFile(files[0]);
  }
}

async function processFile(file) {
  try {
    await store.processFile(file);
  } catch (error) {
    console.error('FileUpload: Failed to process file:', error);
  }
}
</script>
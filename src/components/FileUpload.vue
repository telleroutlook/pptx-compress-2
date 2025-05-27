<template>
  <section
    ref="uploadSectionRef"
    class="upload-area mb-8"
    :class="{ dragover: isDragging }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <input
      type="file"
      ref="fileInput"
      accept=".pptx"
      class="hidden"
      @change="handleFileSelect"
      aria-label="Upload PPTX file"
    >
    <div class="upload-content cursor-pointer" @click="fileInput?.click()">
      <div class="upload-icon text-5xl mb-2">📊</div>
      <h2 class="text-xl font-semibold mb-1">Drop your PPTX file here</h2>
      <p class="text-gray-500 text-sm">or click to select file</p>
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
    alert('Failed to process file. Please try again.');
  }
}
</script>
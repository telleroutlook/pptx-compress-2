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

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCompressorStore } from '../stores/compressor';
import { nextTick } from 'vue';

const store = useCompressorStore();
const isDragging = ref(false);
const uploadSectionRef = ref(null);
const fileInput = ref<HTMLInputElement | null>(null);

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

function handleDragOver(_e: DragEvent) {
  isDragging.value = true;
}

function handleDragLeave(_e: DragEvent) {
  isDragging.value = false;
}

function handleDrop(e: DragEvent) {
  isDragging.value = false;
  if (!e.dataTransfer?.files) return;
  
  const files = Array.from(e.dataTransfer.files).filter(file => 
    file.name.toLowerCase().endsWith('.pptx')
  );
  if (files.length > 0) {
    processFile(files[0]);
  }
}

function handleFileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files?.length) return;
  
  const files = Array.from(input.files).filter(file => 
    file.name.toLowerCase().endsWith('.pptx')
  );
  if (files.length > 0) {
    processFile(files[0]);
  }
}

async function processFile(file: File) {
  try {
    await store.processFile(file);
  } catch (error) {
    console.error('Error processing file:', error);
    alert('Failed to process file. Please try again.');
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  background: rgba(102, 126, 234, 0.05);
  transition: all 0.3s ease;
}

.upload-area.dragover {
  background: rgba(102, 126, 234, 0.1);
  border-color: #764ba2;
  transform: scale(1.02);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-icon {
  color: #667eea;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.upload-area:hover .upload-icon {
  transform: scale(1.1);
}
</style>
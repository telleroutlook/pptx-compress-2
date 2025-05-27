<template>
  <div class="container">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Audio Compressor</h1>
      <p class="subtitle">Compress your audio files while maintaining quality</p>
    </header>
    <section class="upload-area mb-8" :class="{ dragover: isDragOver }" @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false" @drop.prevent="onDrop">
      <input ref="fileInput" type="file" accept="audio/*" multiple class="hidden" @change="handleFileUpload" />
      <div class="upload-content cursor-pointer" @click="fileInput?.click()">
        <div class="upload-icon text-5xl mb-2">🎵</div>
        <h2 class="text-xl font-semibold mb-1">Drop your audio files here</h2>
        <p class="text-gray-500 text-sm">or click to select files</p>
      </div>
    </section>
    <div v-if="files.length > 0" class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <h3 class="text-lg font-semibold mb-3">Selected Files</h3>
      <div class="space-y-2">
        <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded">
          <span class="text-sm text-gray-600">{{ file.name }}</span>
          <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">Remove</button>
        </div>
      </div>
    </div>
    <ControlsPanel
      v-if="showControlsPanel"
      :model-value="settings"
      @update:model-value="settings = $event"
      @compress="compressFiles"
    />
    <div v-if="isProcessing" class="progress-bar-section bg-white rounded-xl p-8 mb-8 shadow-lg transform transition-all duration-300">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-3">
          <div class="text-xl font-semibold text-gray-800">Processing Progress</div>
          <div class="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {{ Math.round(progress) }}%
          </div>
        </div>
        <div class="h-4 bg-primary-light/20 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ease-out"
            :style="{ width: progress + '%' }"
          >
            <div class="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-base text-gray-600 truncate max-w-[60%]">{{ currentFileName }}</div>
        <div class="text-base font-medium text-primary">{{ isProcessing ? 'Processing' : '' }}</div>
      </div>
    </div>
    <div v-if="compressedResults.length > 0" class="mt-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Compression Results</h3>
        <button 
          @click="handleDownloadAll"
          :disabled="isDownloading"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {{ isDownloading ? 'Downloading...' : 'Download All' }}
        </button>
      </div>
      <div class="space-y-4">
        <div v-for="(result, index) in compressedResults" :key="index" class="result-item bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-900 truncate">{{ result.name }}</span>
                <span class="px-2 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full">
                  {{ result.compressionRatio }}% smaller
                </span>
              </div>
              <div class="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                <span>Original: {{ formatSize(result.originalSize) }}</span>
                <span>•</span>
                <span>Compressed: {{ formatSize(result.size) }}</span>
              </div>
            </div>
            <button 
              @click="downloadSingleFile(result)"
              class="ml-4 px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center text-sm"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { useAudioCompressor } from '../composables/useAudioCompressor'
import type { Settings, CompressedResult } from '../types'
import ControlsPanel from '../components/ControlsPanel.vue'

const files = ref<File[]>([])
const isProcessing = ref(false)
const progress = ref(0)
const compressedResults = ref<CompressedResult[]>([])
const isDownloading = ref(false)
const currentFileName = ref('')

const settings = ref<Settings>({
  format: 'mp3',
  quality: 0.8,
  bitRate: 128,
  sampleRate: 44100,
  bitDepth: 16,
  mode: 'maximum'
})

const { compressAudio, downloadAll, eventTarget, CLEAR_EVENT } = useAudioCompressor()

const handleFileUpload = async (event: Event) => {
  console.log('handleFileUpload triggered')
  const input = event.target as HTMLInputElement
  if (input.files) {
    console.log('Selected files:', input.files)
    compressedResults.value = [];
    files.value = [...files.value, ...Array.from(input.files)]
    console.log('Current files array:', files.value)
    console.log('Files length:', files.value.length)
    console.log('Should show controls panel:', files.value.length > 0)
    await nextTick()
    console.log('After nextTick, checking DOM elements...')
    const controlsPanel = document.querySelector('.controls-panel')
    console.log('Controls panel element:', controlsPanel)
    if (controlsPanel) {
      controlsPanel.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  } else {
    console.log('No files selected')
  }
}

const removeFile = (index: number) => {
  console.log('Removing file at index:', index);
  console.log('Before removal, files:', files.value);
  files.value.splice(index, 1)
  console.log('After removal, files:', files.value);
  console.log('Files length after removal:', files.value.length);
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const compressFiles = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  progress.value = 5 // 初始进度5%
  compressedResults.value = [] // 只在开始新的压缩任务时清空结果
  
  // 滚动到进度条
  await nextTick()
  document.querySelector('.progress-bar-section')?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  })
  
  try {
    // 计算总文件大小
    const totalSize = files.value.reduce((sum, file) => sum + file.size, 0);
    let processedSize = 0;
    const results = []; // 临时存储所有压缩结果
    
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i];
      currentFileName.value = file.name;
      const fileProgress = (processedSize / totalSize) * 90;
      
      const result = await compressAudio(file, settings.value, (p) => {
        const currentFileProgress = (file.size / totalSize) * 90 * (p / 100);
        progress.value = 5 + fileProgress + currentFileProgress;
      })
      
      processedSize += file.size;
      results.push(result); // 将结果添加到临时数组
    }
    
    // 所有文件压缩完成后，一次性更新结果
    compressedResults.value = results;
    
    // 设置最终进度为100%
    progress.value = 100;
    currentFileName.value = 'Processing complete';
    
    // 压缩完成后滚动到结果部分
    await nextTick()
    document.querySelector('.result-item')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  } catch (error) {
    console.error('Compression failed:', error)
    alert('Failed to compress files. Please try again.')
  } finally {
    isProcessing.value = false
    currentFileName.value = '';
  }
}

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const onDrop = (e: DragEvent) => {
  console.log('onDrop triggered');
  isDragOver.value = false
  if (e.dataTransfer?.files) {
    console.log('Dropped files:', e.dataTransfer.files);
    handleFileUpload({ target: { files: e.dataTransfer.files } } as unknown as Event)
  } else {
    console.log('No files in drop event');
  }
}

const downloadSingleFile = (result: CompressedResult) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(result.blob);
  link.download = `${result.name.split('.')[0]}_compressed.${result.outputFormat}`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 100);
};

const handleDownloadAll = async () => {
  if (isDownloading.value) return;
  
  try {
    isDownloading.value = true;
    await downloadAll(compressedResults.value);
  } catch (error) {
    console.error('Failed to download files:', error);
    alert('Failed to download files. Please try again.');
  } finally {
    isDownloading.value = false;
  }
};

watch(settings, (newValue) => {
  console.log('Settings changed in AudioCompress:', JSON.stringify(newValue, null, 2));
}, { deep: true });

onMounted(() => {
  console.log('AudioCompress mounted');
  console.log('Initial settings:', JSON.stringify(settings.value, null, 2));
  
  // 监听清空事件
  eventTarget.addEventListener(CLEAR_EVENT, () => {
    console.log('Clear event received, clearing results');
    compressedResults.value = [];
  });
});

watch(files, (newFiles) => {
  console.log('Files array changed:', newFiles);
  console.log('New files length:', newFiles.length);
}, { deep: true });

// 添加一个计算属性来跟踪控制面板的显示状态
const showControlsPanel = computed(() => {
  console.log('Computing showControlsPanel, files length:', files.value.length)
  return files.value.length > 0
})
</script>

<style>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

/* 确保控制面板可见的样式 */
.controls-panel {
  position: relative;
  z-index: 1000;
  opacity: 1;
  visibility: visible;
  display: block;
  background: white;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  background: rgba(102, 126, 234, 0.05);
  transition: all 0.2s ease;
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
}

.upload-icon {
  color: #667eea;
  margin-bottom: 16px;
}

.progress-bar-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.result-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
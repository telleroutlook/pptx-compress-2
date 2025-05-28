<template>
  <div class="container">
    <SeoHead
      title="Audio Compressor - Free Online Audio File Compression"
      description="Free online audio compressor tool. Reduce audio file size while maintaining quality. Supports MP3, WAV, and M4A formats. Fast, secure, and easy to use."
      type="WebApplication"
    />
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Audio Compressor</h1>
      <p class="subtitle">Compress your audio files while maintaining quality</p>
    </header>
    <section 
      class="upload-area mb-8" 
      :class="{ 
        'dragover': isDragOver,
        'processing': isProcessing,
        'has-files': files.length > 0 
      }" 
      @dragover.prevent="isDragOver = true" 
      @dragleave.prevent="isDragOver = false" 
      @drop.prevent="onDrop"
    >
      <input 
        ref="fileInput" 
        type="file" 
        accept="audio/*" 
        multiple 
        class="hidden" 
        @change="handleFileUpload"
        :disabled="isProcessing"
      />
      <div class="upload-content cursor-pointer" @click="!isProcessing && fileInput?.click()">
        <div class="upload-icon text-5xl mb-2">
          <span v-if="isProcessing">⏳</span>
          <span v-else-if="files.length > 0">📁</span>
          <span v-else>🎵</span>
        </div>
        <h2 class="text-xl font-semibold mb-1">
          <span v-if="isProcessing">Processing files...</span>
          <span v-else-if="files.length > 0">{{ files.length }} file(s) selected</span>
          <span v-else>Drop your audio files here</span>
        </h2>
        <p class="text-gray-500 text-sm">
          <span v-if="isProcessing">Please wait while we process your files</span>
          <span v-else-if="files.length > 0">Click to add more files</span>
          <span v-else>or click to select files</span>
        </p>
      </div>
    </section>
    <div v-if="files.length > 0" class="bg-white rounded-lg p-4 shadow-sm mb-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold">Selected Files</h3>
        <button 
          v-if="!isProcessing"
          @click="() => { files = []; compressedResults = []; }" 
          class="text-sm text-red-500 hover:text-red-700 flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div 
          v-for="(file, index) in files" 
          :key="index" 
          class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          <div class="flex items-center space-x-3">
            <span class="text-sm text-gray-600 truncate max-w-[300px]">{{ file.name }}</span>
            <span class="text-xs text-gray-500">{{ formatSize(file.size) }}</span>
          </div>
          <button 
            v-if="!isProcessing"
            @click="removeFile(index)" 
            class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <ControlsPanel
      v-if="showControlsPanel"
      :model-value="settings"
      @update:model-value="settings = $event"
      @compress="compressFiles"
      :disabled="isProcessing"
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
        <div 
          v-for="(result, index) in compressedResults" 
          :key="index" 
          class="result-item bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <span class="text-sm font-medium text-gray-900 truncate">{{ result.name }}</span>
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'text-green-600 bg-green-50': Number(result.compressionRatio) > 0,
                    'text-yellow-600 bg-yellow-50': Number(result.compressionRatio) === 0
                  }"
                >
                  {{ Number(result.compressionRatio) > 0 ? `${result.compressionRatio}% smaller` : 'No compression' }}
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
import SeoHead from '../components/SeoHead.vue'

// 状态管理
const files = ref<File[]>([])
const isProcessing = ref(false)
const progress = ref(0)
const compressedResults = ref<CompressedResult[]>([])
const isDownloading = ref(false)
const currentFileName = ref('')
const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// 计算属性
const showControlsPanel = computed(() => files.value.length > 0)
const totalFilesSize = computed(() => files.value.reduce((sum, file) => sum + file.size, 0))

// 默认设置
const settings = ref<Settings>({
  format: 'mp3',
  quality: 0.8,
  bitRate: 128,
  sampleRate: 44100,
  bitDepth: 16,
  mode: 'maximum'
})

const { compressAudio, downloadAll, eventTarget, CLEAR_EVENT } = useAudioCompressor()

// 工具函数
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const scrollToElement = async (selector: string) => {
  await nextTick()
  const element = document.querySelector(selector)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
  }
}

// 文件处理函数
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  try {
    compressedResults.value = []
    files.value = [...files.value, ...Array.from(input.files)]
    await scrollToElement('.controls-panel')
  } catch (error) {
    console.error('Error handling file upload:', error)
    alert('Failed to process files. Please try again.')
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

// 压缩处理函数
const compressFiles = async () => {
  if (files.value.length === 0) return
  
  isProcessing.value = true
  progress.value = 0
  compressedResults.value = []
  
  await scrollToElement('.progress-bar-section')
  
  try {
    const totalSize = totalFilesSize.value
    let processedSize = 0
    const results: CompressedResult[] = []
    
    for (const file of files.value) {
      currentFileName.value = file.name
      const fileWeight = file.size / totalSize
      const fileStartProgress = (processedSize / totalSize) * 100
      
      const result = await compressAudio(file, settings.value, (p) => {
        const currentFileProgress = fileWeight * 100 * (p / 100)
        progress.value = fileStartProgress + currentFileProgress
      })
      
      processedSize += file.size
      results.push(result)
    }
    
    compressedResults.value = results
    progress.value = 100
    currentFileName.value = 'Processing complete'
    
    await scrollToElement('.result-item')
  } catch (error) {
    console.error('Error compressing files:', error)
    alert('Failed to compress files. Please try again.')
  } finally {
    isProcessing.value = false
    currentFileName.value = ''
  }
}

// 拖放处理
const onDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files) {
    handleFileUpload({ target: { files: e.dataTransfer.files } } as unknown as Event)
  }
}

// 下载处理
const downloadSingleFile = (result: CompressedResult) => {
  try {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(result.blob)
    link.download = `${result.name.split('.')[0]}_compressed.${result.outputFormat}`
    link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 100)
  } catch (error) {
    console.error('Error downloading file:', error)
    alert('Failed to download file. Please try again.')
  }
}

const handleDownloadAll = async () => {
  if (isDownloading.value) return
  
  try {
    isDownloading.value = true
    await downloadAll(compressedResults.value)
  } catch (error) {
    console.error('Error downloading all files:', error)
    alert('Failed to download files. Please try again.')
  } finally {
    isDownloading.value = false
  }
}

// 生命周期钩子
onMounted(() => {
  eventTarget.addEventListener(CLEAR_EVENT, () => {
    compressedResults.value = []
  })
})

// 监听器
watch(settings, () => {
  // 可以在这里添加设置变更时的处理逻辑
}, { deep: true })

watch(files, () => {
  // 可以在这里添加文件列表变更时的处理逻辑
}, { deep: true })
</script>

<style>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

.controls-panel {
  position: relative;
  z-index: 1000;
  opacity: 1;
  visibility: visible;
  display: block;
  background: white;
  animation: fadeIn 0.3s ease-out;
}

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
  animation: pulse 1s infinite;
}

.upload-area.processing {
  border-color: #764ba2;
  background: rgba(102, 126, 234, 0.1);
  cursor: not-allowed;
}

.upload-area.has-files {
  border-color: #764ba2;
  background: rgba(102, 126, 234, 0.1);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-icon {
  color: #667eea;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.upload-area:hover .upload-icon {
  transform: scale(1.1);
}

.progress-bar-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-out;
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
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease-out;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 滚动条样式 */
.space-y-2.max-h-60 {
  scrollbar-width: thin;
  scrollbar-color: #667eea #f3f4f6;
}

.space-y-2.max-h-60::-webkit-scrollbar {
  width: 6px;
}

.space-y-2.max-h-60::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.space-y-2.max-h-60::-webkit-scrollbar-thumb {
  background-color: #667eea;
  border-radius: 3px;
}

/* 按钮悬停效果 */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* 禁用状态样式 */
button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* 加载动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
</style>
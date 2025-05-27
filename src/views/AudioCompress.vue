<template>
  <div class="container mx-auto px-4 py-8">
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Audio Compressor
      </h1>
      <p class="text-gray-600">Compress your audio files while maintaining quality</p>
    </header>

    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Upload Audio Files
          </label>
          <input
            type="file"
            accept="audio/*"
            multiple
            @change="handleFileUpload"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div v-if="files.length > 0" class="space-y-4">
          <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span class="text-sm text-gray-600">{{ file.name }}</span>
            <button
              @click="removeFile(index)"
              class="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Compression Mode:</label>
              <select v-model="settings.mode" class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>

            <div class="flex items-center space-x-4">
              <label class="text-sm font-medium text-gray-700">Output Format:</label>
              <select v-model="settings.format" class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                <option value="mp3">MP3</option>
                <option value="aac">AAC</option>
                <option value="wav">WAV</option>
              </select>
            </div>
          </div>

          <div v-if="progress > 0" class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-primary h-2.5 rounded-full" :style="{ width: progress + '%' }"></div>
          </div>

          <div class="flex space-x-4">
            <button
              @click="compressFiles"
              :disabled="isProcessing"
              class="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {{ isProcessing ? 'Processing...' : 'Compress Files' }}
            </button>
            <button
              v-if="compressedResults.length > 0"
              @click="() => downloadAll(compressedResults)"
              class="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Download All
            </button>
          </div>
        </div>

        <div v-if="compressedResults.length > 0" class="mt-6">
          <h3 class="text-lg font-semibold mb-4">Compression Results</h3>
          <div class="space-y-4">
            <div v-for="(result, index) in compressedResults" :key="index" class="p-4 bg-gray-50 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium">{{ result.name }}</span>
                <span class="text-sm text-green-600">{{ result.compressionRatio }}% smaller</span>
              </div>
              <div class="mt-2 text-sm text-gray-600">
                <p>Original: {{ formatSize(result.originalSize) }}</p>
                <p>Compressed: {{ formatSize(result.size) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAudioCompressor } from '../composables/useAudioCompressor'
import type { Settings, CompressedResult } from '../types'

const files = ref<File[]>([])
const isProcessing = ref(false)
const progress = ref(0)
const compressedResults = ref<CompressedResult[]>([])

const settings = ref<Settings>({
  format: 'mp3',
  quality: 0.8,
  bitRate: 128,
  sampleRate: 44100,
  bitDepth: 16,
  mode: 'balanced'
})

const { compressAudio, downloadAll } = useAudioCompressor()

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    files.value = [...files.value, ...Array.from(input.files)]
  }
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
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
  progress.value = 0
  compressedResults.value = []
  
  try {
    for (const file of files.value) {
      const result = await compressAudio(file, settings.value, (p) => {
        progress.value = p
      })
      compressedResults.value.push(result)
    }
  } catch (error) {
    console.error('Compression failed:', error)
    alert('Failed to compress files. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script> 